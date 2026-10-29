import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {existsSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';

const port=Number(process.env.ARCADE_SHARED_TEST_PORT||8094),origin=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,['scripts/serve.mjs'],{env:{...process.env,PORT:String(port)},stdio:'pipe'});
let browser;
try{
 for(let i=0;i<100;i++){if(server.exitCode!==null)throw Error('Server exited');try{if((await fetch(origin)).ok)break;}catch{}await new Promise(r=>setTimeout(r,50));if(i===99)throw Error('Server did not start');}
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1280,height:900},hasTouch:true,serviceWorkers:'block'});
 await context.addInitScript(()=>{
  const schedule=window.setInterval,unschedule=window.clearInterval;window.musicTimers=new Set();
  window.setInterval=function(fn,ms,...args){const id=schedule.call(this,fn,ms,...args);if(ms===420)musicTimers.add(id);return id;};
  window.clearInterval=function(id){musicTimers.delete(id);return unschedule.call(this,id);};
 });
 const page=await context.newPage(),errors=[],checks=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(origin);await page.locator('[data-ack]').click();await page.locator('#boot').waitFor({state:'detached'});
 const navigate=route=>page.evaluate(async r=>(await import('/js/shell.js')).navigate(r),route);
 await navigate('settings');await page.locator('#effectLevel').selectOption('reduced');
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('lba-universe-v3')).settings.presentation.effects),'reduced');
 await page.reload();await page.locator('#effectLevel').waitFor();assert.equal(await page.locator('#effectLevel').inputValue(),'reduced');checks.push('effect preference survives real reload');

 await page.locator('#musicOn').check();assert.equal(await page.evaluate(()=>musicTimers.size),1);
 const timer=await page.evaluate(()=>[...musicTimers][0]);await page.locator('#sfxVolume').fill('40');assert.equal(await page.evaluate(()=>[...musicTimers][0]),timer);
 await page.locator('#muted').check();assert.equal(await page.evaluate(()=>musicTimers.size),0);await page.locator('#muted').uncheck();assert.equal(await page.evaluate(()=>musicTimers.size),1);
 await page.evaluate(()=>{window.fixtureHidden=true;Object.defineProperty(document,'hidden',{configurable:true,get:()=>fixtureHidden});document.dispatchEvent(new Event('visibilitychange'));});assert.equal(await page.evaluate(()=>musicTimers.size),0);
 await page.evaluate(()=>{fixtureHidden=false;document.dispatchEvent(new Event('visibilitychange'));});assert.equal(await page.evaluate(()=>musicTimers.size),1);
 await page.locator('#musicOn').uncheck();assert.equal(await page.evaluate(()=>musicTimers.size),0);checks.push('actual shared audio keeps one clock, stops on mute/injected visibility, preserves phase on unrelated volume changes');

 await page.locator('#settingsTouch').focus();await page.locator('#settingsTouch').click();const pad=await page.locator('#touchPad').boundingBox();
 await page.evaluate(()=>{window.oldPad=document.querySelector('#touchPad');window.contactIds=[];oldPad.addEventListener('pointerdown',e=>contactIds.push(e.pointerId));});
 const cdp=await context.newCDPSession(page),points=[{x:pad.x+pad.width*.3,y:pad.y+pad.height*.5,id:11},{x:pad.x+pad.width*.7,y:pad.y+pad.height*.5,id:22}];
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:points});assert.match(await page.locator('#touchCount').innerText(),/^2 pointers/);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:points.map((p,i)=>({...p,x:p.x+(i?-20:20)}))});
 const cleanup=await page.evaluate(async()=>{
  const before=contactIds.map(id=>oldPad.hasPointerCapture(id));const dialog=document.querySelector('#modal');const closed=new Promise(resolve=>dialog.addEventListener('close',resolve,{once:true}));dialog.close();await closed;
  const released=contactIds.every(id=>!oldPad.hasPointerCapture(id));oldPad.dispatchEvent(new PointerEvent('pointerdown',{pointerId:99,clientX:100,clientY:100}));
  return{before,released,dots:oldPad.querySelectorAll('i').length,focus:document.activeElement.id};
 });
 assert.deepEqual(cleanup.before,[true,true]);assert.equal(cleanup.released,true);assert.equal(cleanup.dots,0);assert.equal(cleanup.focus,'settingsTouch');
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});checks.push('CDP two-contact touch test captures independently, releases both on modal close, removes listeners and restores focus');
 // Reusing the same dialog must not let its queued old close event dispose the new owner.
 const replacement=await page.evaluate(async()=>{
  const {modal}=await import('/js/shell.js');let disposed=0;
  modal('<h2>First</h2>',()=>()=>disposed++);modal('<h2>Second</h2><button id="secondControl">Continue</button>',()=>()=>disposed++);
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));const before={open:document.querySelector('#modal').open,disposed};const dialog=document.querySelector('#modal'),closed=new Promise(resolve=>dialog.addEventListener('close',resolve,{once:true}));dialog.close();await closed;return{before,disposed};
 });assert.deepEqual(replacement,{before:{open:true,disposed:1},disposed:2});checks.push('dialog replacement disposes only its own resources, once');

 await navigate('home');
 const handoff=await page.evaluate(async()=>{
  const {createArcadeController}=await import('/js/arcade-controller.js');
  const make=index=>({index,id:'Menu fixture '+index,mapping:'standard',connected:true,axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))});
  const pads=[make(0),make(1)],ui=createArcadeController({auto:false,getPads:()=>pads});let now=0,acks=0;const tick=()=>ui.tick(now+=40);tick();
  const opener=document.createElement('button');opener.textContent='Open fixture';opener.onclick=()=>{const d=document.createElement('dialog');d.id='handoffFixture';d.innerHTML='<button>Accept fixture</button>';d.querySelector('button').onclick=()=>acks++;document.body.append(d);d.showModal();};document.body.append(opener);opener.focus();
  for(const pad of pads)pad.buttons[0]={pressed:true,value:1};tick();const immediate=acks;tick();
  for(const pad of pads)pad.buttons[0]={pressed:false,value:0};tick();pads[1].buttons[0]={pressed:true,value:1};tick();
  const result={immediate,after:acks};ui.dispose();document.querySelector('#handoffFixture').remove();opener.remove();return result;
 });assert.deepEqual(handoff,{immediate:0,after:1});checks.push('two controllers cannot acknowledge a new dialog during the same confirmation frame');
 await navigate('settings');await page.waitForFunction(()=>!document.querySelector('#notifications').childElementCount);await page.screenshot({path:'/tmp/arcade-m3-settings.png',fullPage:true});
 assert.deepEqual(errors,[]);writeFileSync('/tmp/arcade-m3-shared-browser.json',JSON.stringify({version:'6.5.0',checks,errors,limitations:'CDP touch, standard gamepad and injected visibility fixtures; physical hardware and audible quality remain unverified.'},null,2));
 console.log(`PASS: ${checks.length} shared-system browser scenarios; ${checks.join('; ')}. No browser errors.`);
}finally{await browser?.close();server.kill('SIGTERM');}
