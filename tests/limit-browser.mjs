import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {existsSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';

const port=Number(process.env.ARCADE_LIMIT_TEST_PORT||8092),origin=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,['scripts/serve.mjs'],{env:{...process.env,PORT:String(port)},stdio:'pipe'});
let browser;
try{
 for(let i=0;i<100;i++){if(server.exitCode!==null)throw Error('Test server exited');try{if((await fetch(origin)).ok)break;}catch{}await new Promise(r=>setTimeout(r,50));if(i===99)throw Error('Test server did not start');}
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1280,height:900},serviceWorkers:'block'}),page=await context.newPage(),errors=[],failedAssets=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(origin)&&r.status()>=400)failedAssets.push({url:r.url(),status:r.status()});});
 await page.goto(origin);await page.locator('[data-ack]').click();await page.locator('#boot').waitFor({state:'detached'});
 async function open(players=1,mode='adventure'){
  await page.evaluate(async()=>(await import('/js/shell.js')).setupGame('limit'));
  if(await page.locator('.update-dialog [data-ack]').count()){await page.locator('.update-dialog [data-ack]').click();await page.locator('#lbPlay').waitFor();}
  if(mode==='baseline')await page.locator('[data-mode="baseline"]').click();else if(players===2)await page.locator('[data-players="2"]').click();
  await page.locator('#lbPreset').selectOption('low');await page.locator('#lbPlay').click();
  assert.equal(await page.locator('#lbCanvas').count(),0,'3D scene is not created before instruction acknowledgement');
  await page.locator('[data-instructions-start]').click();await page.locator('#lbCanvas').waitFor({timeout:90000});await page.locator('#lbLoading').waitFor({state:'hidden',timeout:90000});
 }
 const snapshot=()=>page.evaluate(()=>{const scene=BABYLON.EngineStore.LastCreatedScene;return{players:scene.transformNodes.filter(n=>/^actor\d+:controller$/.test(n.name)).map(n=>({name:n.name,x:n.position.x,y:n.position.y,z:n.position.z})),bodies:scene.getPhysicsEngine().getBodies().length,meshes:scene.meshes.length,alpha:scene.activeCamera.alpha};});
 async function leave(){await page.locator('#lbExit').click();if(await page.locator('.confirm-dialog[open]').count())await page.locator('[data-yes]').click();await page.locator('#worldSearch').waitFor();assert.equal(await page.evaluate(()=>BABYLON.EngineStore.Instances.length),0,'exit disposes the real engine');}
 await open();const initial=await snapshot();assert.ok(initial.bodies>0);assert.ok(initial.meshes>100);assert.ok(initial.players.length>=1);
 await page.locator('#lbCanvas').focus();await page.keyboard.down('KeyW');await page.waitForTimeout(1200);await page.keyboard.up('KeyW');const moved=await snapshot();assert.ok(moved.players[0].z>initial.players[0].z+.05,'forward key moves the actual imported hero forward');
 await page.locator('#lbPause').click();const paused=await snapshot();await page.keyboard.down('KeyW');await page.waitForTimeout(500);await page.keyboard.up('KeyW');assert.ok(Math.abs((await snapshot()).players[0].z-paused.players[0].z)<.001,'pause freezes real hero movement');await page.locator('#lbResume').click();
 const canvas=await page.locator('#lbCanvas').boundingBox();await page.mouse.move(canvas.x+canvas.width*.5,canvas.y+canvas.height*.5);await page.mouse.down({button:'right'});await page.mouse.move(canvas.x+canvas.width*.6,canvas.y+canvas.height*.5,{steps:8});await page.mouse.up({button:'right'});assert.ok(Math.abs((await snapshot()).alpha-moved.alpha)>.05,'right-drag adjusts the actual camera');
 await page.locator('#lbMonitorToggle').click();await page.waitForFunction(()=>document.querySelector('#lbMonitor').textContent.includes('FPS'));
 await page.screenshot({path:'/tmp/arcade-revamp-m1-forest.png'});await leave();console.log('PASS: real solo scene, forward movement, pause, camera, monitor and disposal.');
 await open(2);assert.equal(await page.locator('[data-stick]').count(),2);assert.equal(await page.locator('.lb-health').count(),2);
 const coopBefore=await snapshot();await page.locator('#lbCanvas').focus();await page.keyboard.down('ArrowUp');await page.waitForTimeout(1000);await page.keyboard.up('ArrowUp');const coopAfter=await snapshot();assert.ok(coopAfter.players[1].z>coopBefore.players[1].z+.05,'second player has independent actual movement');assert.ok(Math.abs(coopAfter.players[0].z-coopBefore.players[0].z)<.05,'second player input does not move player one');await leave();console.log('PASS: independent actual co-op movement and disposal.');
 await open(1,'baseline');console.log('MEASURING: real five-stage Forest baseline; warm-up plus 30 recorded seconds.');
 await page.locator('#lbJSON').waitFor({timeout:90000});
 const run=await page.evaluate(()=>JSON.parse(localStorage.getItem('lba-universe-v3')).settings.limitBreak.history.at(-1));
 assert.equal(run.stages.length,5);assert.equal(run.frameTimesMs.length,run.overall.frames);assert.ok(run.frameTimesMs.every(ms=>Number.isFinite(ms)&&ms>0));assert.ok(run.overall.averageFPS>0);
 const renderer=await page.locator('#lbCanvas').evaluate(c=>{const gl=c.getContext('webgl2')||c.getContext('webgl'),ext=gl?.getExtension('WEBGL_debug_renderer_info');return ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):'not exposed / Canvas compatibility';});
 await page.evaluate(async()=>(await import('/js/shell.js')).navigate('home'));assert.equal(await page.evaluate(()=>BABYLON.EngineStore.Instances.length),0);assert.deepEqual(errors,[]);assert.deepEqual(failedAssets,[]);
 writeFileSync('/tmp/arcade-revamp-m1-forest-browser.json',JSON.stringify({scope:'Real browser Living Forest baseline; software-backed cloud rendering is not physical Windows/GPU verification.',initial,soloMovement:{before:initial.players[0],after:moved.players[0]},coopMovement:{before:coopBefore.players.slice(0,2),after:coopAfter.players.slice(0,2)},renderer,run,errors,failedAssets},null,2));
 console.log(`PASS: actual Forest loading, acknowledged entry, imported hero movement, pause, camera orbit, co-op movement, engine disposal and real five-stage benchmark. Renderer: ${renderer}. Measured cloud baseline: ${run.overall.frames} frames, ${run.overall.averageFPS.toFixed(2)} average FPS, ${run.overall.onePercentLowFPS.toFixed(2)} 1% low. Not a target-device benchmark.`);
}finally{await browser?.close();server.kill('SIGTERM');}
