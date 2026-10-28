import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {existsSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';

const port=Number(process.env.ARCADE_TEST_PORT||8091),origin=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,['scripts/serve.mjs'],{env:{...process.env,PORT:String(port)},stdio:'pipe'});
let browser;
try{
 for(let i=0;i<100;i++){if(server.exitCode!==null)throw Error('Browser test server exited');try{if((await fetch(origin)).ok)break;}catch{}await new Promise(r=>setTimeout(r,50));if(i===99)throw Error('Browser test server did not start');}
 const executablePath=process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined);
 browser=await chromium.launch({executablePath,headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',serviceWorkers:'block'});
 const page=await context.newPage(),errors=[],audit=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin);await page.locator('[data-ack]').click();await page.locator('#boot').waitFor({state:'detached'});
 await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
 const navigate=route=>page.evaluate(async r=>(await import('/js/shell.js')).navigate(r),route);
 async function inspect(label){
  const result=await page.evaluate(async()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,violations:(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','best-practice']}})).violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))}));
  audit.push({label,...result});
 }
 // All six shell destinations at desktop, tablet and phone widths.
 for(const width of [1440,768,390]){
  await page.setViewportSize({width,height:1000});
  for(const route of ['home','players','boards','trophies','rivals','settings']){await navigate(route);await inspect(`${route}/${width}`);}
 }
 await navigate('home');
 await page.locator('#worldSearch').fill('robot');assert.equal(await page.locator('#deck [data-game]').count(),1);assert.match(await page.locator('#deck').innerText(),/Robot Repair/);
 await page.locator('#worldSearch').fill('zz-no-world');await page.locator('#clearWorldSearch').click();assert.equal(await page.locator('#deck [data-game]').count(),25);
 await page.locator('[data-filter="creative"]').click();assert.equal(await page.locator('[data-filter="creative"]').getAttribute('aria-pressed'),'true');assert.ok(await page.locator('#deck [data-game]').count()<25);
 await page.locator('[data-filter="all"]').click();
 await page.locator('#mute').click();assert.equal(await page.locator('#mute').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('#mute').getAttribute('aria-label'),'Unmute all audio');
 await navigate('trophies');await page.locator('#trophySwitch').click();
 const next=page.locator('[data-pick]').nth(1),name=await next.locator('strong').innerText();await next.click();assert.match(await page.locator('#view h1').innerText(),new RegExp(name));
 assert.equal(await page.locator('.rail [data-nav="trophies"]').getAttribute('aria-current'),'page');
 await navigate('settings');
 const backupText=await page.evaluate(async()=>{const d=await import('/js/data.js');return d.backupJSON(d.DB,[]);});
 for(let i=0;i<2;i++){await page.locator('#restore').setInputFiles({name:'arcade-fixture.json',mimeType:'application/json',buffer:Buffer.from(backupText)});await page.locator('[data-no]').click();assert.equal(await page.locator('#restore').inputValue(),'','same backup can be selected again after cancel');}
 // Every shipped world entry, with real DOM rendering and accessibility checks.
 await navigate('home');const worlds=await page.locator('#deck [data-game]').evaluateAll(nodes=>nodes.map(n=>n.dataset.game));
 for(const width of [1280,390]){
  await page.setViewportSize({width,height:900});
  for(const id of worlds){
   await navigate('home');await page.evaluate(async id=>(await import('/js/shell.js')).setupGame(id),id);
   if(await page.locator('.update-dialog [data-ack]').count()){await page.locator('.update-dialog [data-ack]').click();await page.waitForTimeout(50);}
   await inspect(`${id}/${width}`);
  }
 }
 await navigate('home');await page.setViewportSize({width:1280,height:900});
 // Use deterministic standard-controller fixtures, independently of a physical device.
 await page.evaluate(async()=>{
  const {createArcadeController}=await import('/js/arcade-controller.js');
  const pad=index=>({index,id:'Fixture '+index,mapping:'standard',connected:true,axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))});
  window.padFixture={pads:[pad(0),pad(1)],time:0};const f=window.padFixture;
  f.ui=createArcadeController({auto:false,getPads:()=>f.pads});
  f.tick=()=>f.ui.tick(f.time+=40);
  f.press=(player,button,held)=>{f.pads[player].buttons[button]={pressed:held,value:held?1:0};f.tick();};
  f.tick();f.press(0,0,true);f.press(0,0,false);
 });
 // D-pad navigation, held-button protection and accessible menu activation.
 await page.evaluate(()=>{const f=padFixture;f.press(0,13,true);f.press(0,13,false);});
 assert.equal(await page.locator('.controller-focus').count(),1);
 await page.evaluate(()=>{const f=padFixture,n=document.querySelector('[data-filter="learn"]');n.focus();f.press(0,0,true);f.tick();f.tick();f.press(0,0,false);});
 assert.equal(await page.locator('[data-filter="learn"]').getAttribute('aria-pressed'),'true');
 // Disabled select options are skipped, rather than selected by the controller.
 const selection=await page.evaluate(()=>{const n=document.createElement('select');n.innerHTML='<option value="a">A</option><option disabled value="b">B</option><option value="c">C</option>';document.body.append(n);n.focus();const f=padFixture;f.press(0,15,true);f.press(0,15,false);const value=n.value;n.remove();return value;});assert.equal(selection,'c');
 const scrolled=await page.evaluate(()=>{const n=document.createElement('div');n.style.cssText='position:fixed;top:100px;left:100px;width:200px;height:80px;overflow:auto;z-index:1000';n.innerHTML='<button>Scroll fixture</button><div style="height:1000px"></div>';document.body.append(n);n.querySelector('button').focus();const f=padFixture;f.pads[0].axes[3]=.8;f.tick();f.pads[0].axes[3]=0;const y=n.scrollTop;n.remove();return y;});assert.ok(scrolled>0,'right stick scrolls the nearest nested game panel');
 const disconnected=await page.evaluate(()=>{
  const f=padFixture,events=[],canvas=document.createElement('canvas'),pause=document.createElement('button');
  canvas.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;z-index:1000';pause.textContent='PAUSE';pause.style.cssText='position:fixed;top:0;right:0;z-index:1001';let paused=0;pause.onclick=()=>{paused++;pause.textContent='RESUME';};document.body.append(canvas,pause);
  for(const type of ['pointerdown','pointermove','pointercancel'])canvas.addEventListener(type,e=>{events.push(type);if(type==='pointerdown')canvas.setPointerCapture(e.pointerId);});
  f.pads[0].axes[0]=.8;f.tick();f.pads[0].axes[0]=0;f.press(0,0,true);f.pads[0].axes[1]=.5;f.tick();f.pads[0]=null;f.tick();f.tick();
  const result={events,paused,pointers:f.ui.pointers.size};canvas.remove();pause.remove();return result;
 });assert.deepEqual(disconnected.events,['pointerdown','pointermove','pointercancel']);assert.equal(disconnected.paused,1,'disconnect pauses once and never auto-resumes');assert.equal(disconnected.pointers,0);
 // Two captured pointers stay independent outside their original bounds and cancel safely.
 const pointerResult=await page.evaluate(()=>{
  const logs=[],canvases=[0,1].map(i=>{const c=document.createElement('canvas');c.style.cssText=`position:fixed;left:${100+i*300}px;top:100px;width:200px;height:150px;z-index:1000`;document.body.append(c);for(const type of ['pointerdown','pointermove','pointerup','pointercancel'])c.addEventListener(type,e=>{logs.push([i,type,e.pointerId,e.pointerType]);if(type==='pointerdown')c.setPointerCapture(e.pointerId);});return c;});
  const pointers=padFixture.ui.pointers;
  pointers.down(0,150,150);pointers.down(1,450,150);pointers.move(0,900,400);pointers.up(0);pointers.move(1,900,450);pointers.cancel(1);
  const restored=canvases.every(c=>!Object.hasOwn(c,'setPointerCapture'));canvases.forEach(c=>c.remove());return{logs,restored,size:pointers.size};
 });
 assert.deepEqual(pointerResult.logs.map(r=>r.slice(0,3)),[[0,'pointerdown',10000],[1,'pointerdown',10001],[0,'pointermove',10000],[0,'pointerup',10000],[1,'pointermove',10001],[1,'pointercancel',10001]]);assert.ok(pointerResult.restored);assert.equal(pointerResult.size,0);assert.ok(pointerResult.logs.every(r=>r[3]==='gamepad'));
 // Actual Creative Studio: the shared acknowledgment must precede pointer drawing.
 await page.evaluate(()=>padFixture.ui.dispose());await navigate('home');
 await page.evaluate(async()=>(await import('/js/shell.js')).setupGame('paint'));
 await page.locator('#creativePlay').click();assert.equal(await page.locator('.how-to-play[open]').count(),1);assert.equal(await page.locator('#undo').count(),0);
 await page.locator('[data-instructions-start]').click();await page.locator('#undo').waitFor();
 const drawn=await page.evaluate(async()=>{
  const {createControllerPointers}=await import('/js/arcade-controller.js'),p=createControllerPointers();
  const c=document.querySelector('.studio-room canvas'),r=c.getBoundingClientRect();
  p.down(0,r.x+r.width*.4,r.y+r.height*.4);p.move(0,r.x+r.width*.5,r.y+r.height*.5);p.up(0);
  return !document.querySelector('#undo').disabled;
 });assert.ok(drawn,'controller pointer creates a real undoable drawing');
 await navigate('home');await page.screenshot({path:'/tmp/little-big-arcade-polish-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:900});await page.screenshot({path:'/tmp/little-big-arcade-polish-phone.png',fullPage:true});
 // A real browser service worker must cache the new dependencies, not just old assets.
 const offlineContext=await browser.newContext({viewport:{width:1280,height:900}}),offlinePage=await offlineContext.newPage();
 offlinePage.on('pageerror',e=>errors.push(e.message));await offlinePage.goto(origin);
 await offlinePage.locator('[data-ack]').click();await offlinePage.evaluate(()=>navigator.serviceWorker.ready);
 await offlinePage.waitForFunction(()=>!!navigator.serviceWorker.controller);
 await offlineContext.setOffline(true);await offlinePage.reload();await offlinePage.locator('#worldSearch').waitFor();
 assert.equal(await offlinePage.locator('#deck [data-game]').count(),25,'complete updated lobby works after real offline reload');
 await offlinePage.locator('#worldSearch').fill('robot');assert.equal(await offlinePage.locator('#deck [data-game]').count(),1,'new discovery module works offline');
 await offlineContext.close();
 writeFileSync('/tmp/little-big-arcade-browser-audit.json',JSON.stringify({audit,errors},null,2));
 const failures=audit.filter(r=>r.scrollWidth>r.width+1||r.violations.length);
 for(const r of failures)console.error(r.label,JSON.stringify({width:r.width,scrollWidth:r.scrollWidth,violations:r.violations}));
 assert.deepEqual(errors,[],'no browser exceptions');assert.equal(failures.length,0,'all inspected routes and game entries pass layout and accessibility checks');
 console.log(`PASS: ${audit.length} responsive shell/game-entry audits; search, filtering, mute state, player switching, canceled restore retry, controller menus, disabled options, independent captured pointers, disconnect pause, acknowledged Creative Studio drawing and real offline reload. Standard-controller fixtures; no physical device/GPU claim.`);
}finally{await browser?.close();server.kill('SIGTERM');}
