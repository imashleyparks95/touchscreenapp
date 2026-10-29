import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {existsSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';

const port=Number(process.env.ARCADE_LIBRARY_TEST_PORT||8095),origin=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,['scripts/serve.mjs'],{env:{...process.env,PORT:String(port)},stdio:'pipe'});
let browser;
try{
 for(let i=0;i<100;i++){if(server.exitCode!==null)throw Error('Server exited');try{if((await fetch(origin)).ok)break;}catch{}await new Promise(r=>setTimeout(r,50));if(i===99)throw Error('Server did not start');}
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:1000},hasTouch:true,reducedMotion:'reduce'}),page=await context.newPage(),errors=[],checks=[],audit=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(origin);await page.locator('[data-ack]').click();await page.locator('#boot').waitFor({state:'detached'});
 await context.addInitScript({path:'node_modules/axe-core/axe.min.js'});await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
 const navigate=route=>page.evaluate(async r=>(await import('/js/shell.js')).navigate(r),route);
 const baseline=await page.evaluate(async()=>{const {DB}=await import('/js/data.js');return DB.profiles.map(p=>({id:p.id,xp:p.xp,results:p.results,played:p.played}));});
 assert.equal(await page.locator('#deck [data-game]').count(),25);
 await page.locator('[data-featured="wars"]').click();assert.match(await page.locator('#libraryFeature h2').innerText(),/Wobbly/);assert.equal(await page.locator('[data-featured="wars"]').getAttribute('aria-pressed'),'true');
 await page.locator('[data-featured="paint"]').click();assert.match(await page.locator('#libraryFeature').innerText(),/Create together/);checks.push('manual spotlight selection, no automatic carousel');
 await page.locator('#deck [data-preview="paint"]').click();await page.locator('#modal [data-favorite="paint"]').tap();await page.locator('#modal .modal-close').click();assert.equal(await page.evaluate(()=>document.activeElement.dataset.preview),'paint','preview favorite mutation restores focus to the rebuilt card');await page.locator('#deck [data-favorite="paint"]').tap();checks.push('preview heart updates saved state and returns focus to the rebuilt game card');
 await page.locator('#deck [data-favorite="paint"]').tap();assert.equal(await page.locator('#deck [data-favorite="paint"]').getAttribute('aria-pressed'),'true');
 await page.locator('#filter-favorites').click();assert.equal(await page.locator('#deck [data-game]').count(),1);assert.equal(await page.locator('#deck [data-game]').getAttribute('data-game'),'paint');
 const profiles=await page.locator('#lobbyProfiles [data-player]').evaluateAll(nodes=>nodes.map(n=>n.dataset.player));await page.locator(`[data-player="${profiles[1]}"]`).click();assert.equal(await page.locator('#deck [data-game]').count(),0);assert.match(await page.locator('#deck').innerText(),/collection/);
 await page.locator(`[data-player="${profiles[0]}"]`).click();assert.equal(await page.locator('#deck [data-game]').count(),1);
 await page.reload();await page.locator('#worldSearch').waitFor();assert.equal(await page.locator('#deck [data-favorite="paint"]').getAttribute('aria-pressed'),'true');checks.push('touch favorite action, favorites isolated by profile and persisted across reload');
 await page.locator('#librarySort').selectOption('name');const names=await page.locator('#deck h3').allTextContents();assert.deepEqual(names,[...names].sort((a,b)=>a.localeCompare(b)));
 await page.locator('#filter-together').click();assert.equal(await page.locator('#deck [data-game]').count(),25);await page.locator('#worldSearch').fill('beat');assert.equal(await page.locator('#deck [data-game]').count(),1);checks.push('alphabetical sort, together filter includes real Beat Lab rhythm turns, search composes with filter');
 await page.locator('#worldSearch').fill('no such world');await page.locator('#clearWorldSearch').click();assert.equal(await page.locator('#deck [data-game]').count(),25);
 const worlds=await page.locator('#deck [data-game]').evaluateAll(nodes=>nodes.map(n=>n.dataset.game));
 for(const width of [1440,768,390]){
  await page.setViewportSize({width,height:1000});
  for(const id of worlds){
   await page.locator(`#deck [data-preview="${id}"]`).click();assert.equal(await page.locator('#modal[open]').count(),1);
   assert.equal(await page.locator('#modal [data-game]').getAttribute('data-game'),id);
   const result=await page.evaluate(async()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,violations:(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','best-practice']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))}));audit.push({id,width,...result});
   await page.locator('#modal .modal-close').click();
  }
 }
 checks.push('all 25 game previews audited at desktop, tablet and phone widths');
 await page.setViewportSize({width:1280,height:900});await page.locator('#deck [data-preview="limit"]').click();assert.match(await page.locator('#modal').innerText(),/Native controller/);await page.locator('#modal [data-game="limit"]').click();
 if(await page.locator('.update-dialog [data-ack]').count())await page.locator('.update-dialog [data-ack]').click();await page.locator('#lbPlay').waitFor();assert.equal(await page.locator('#modal[open]').count(),0,'preview closes before setup');assert.equal(await page.locator('#lbCanvas').count(),0,'opening setup never bypasses acknowledgement');
 await navigate('home');assert.match(await page.locator('#libraryShelves').innerText(),/Recently opened/);await page.locator('#filter-recent').click();assert.equal(await page.locator('#deck [data-game="limit"]').count(),1);checks.push('preview launch closes modal, preserves instruction gate and adds profile-local recent entry');
 // Real standard-controller fixture navigates favorite and preview controls.
 await page.locator('#filter-all').click();const controller=await page.evaluate(async()=>{
  const {createArcadeController}=await import('/js/arcade-controller.js');const pad={index:0,id:'Library fixture',mapping:'standard',connected:true,axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))};const ui=createArcadeController({auto:false,getPads:()=>[pad]});let t=0;const tick=()=>ui.tick(t+=40);tick();
  document.querySelector('#deck [data-favorite="beat"]').focus();pad.buttons[0]={pressed:true,value:1};tick();pad.buttons[0]={pressed:false,value:0};tick();
  const favorite=document.querySelector('#deck [data-favorite="beat"]').getAttribute('aria-pressed');document.querySelector('#deck [data-preview="beat"]').focus();pad.buttons[0]={pressed:true,value:1};tick();const preview=!!document.querySelector('#modal[open] .world-preview');ui.dispose();return{favorite,preview};
 });assert.deepEqual(controller,{favorite:'true',preview:true});await page.locator('#modal .modal-close').click();checks.push('controller confirms favorite and opens actual game preview');
 const after=await page.evaluate(async()=>{const {DB}=await import('/js/data.js');return DB.profiles.map(p=>({id:p.id,xp:p.xp,results:p.results,played:p.played}));});assert.deepEqual(after,baseline,'library operations do not award points or fabricate game results');
 await page.locator('#librarySort').selectOption('featured');await page.locator('[data-featured="limit"]').click();
 await page.waitForFunction(()=>!document.querySelector('#notifications').childElementCount);await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'/tmp/arcade-m4-desktop.png'});await page.locator('#libraryHeading').scrollIntoViewIfNeeded();await page.screenshot({path:'/tmp/arcade-m4-cards.png'});await page.locator('#deck [data-preview="paint"]').click();await page.screenshot({path:'/tmp/arcade-m4-preview.png'});await page.locator('#modal .modal-close').click();
 await page.setViewportSize({width:390,height:900});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'/tmp/arcade-m4-phone.png'});
 // Real worker reload preserves both the new module and personal shelves offline.
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await context.setOffline(true);await page.reload();await page.locator('#worldSearch').waitFor();await page.locator('#filter-favorites').click();assert.equal(await page.locator('#deck [data-game]').count(),2);await page.locator('#deck [data-preview="paint"]').click();assert.match(await page.locator('#modal').innerText(),/Freehand/);checks.push('actual offline reload retains favorites and opens previews without network');
 const failures=audit.filter(r=>r.scrollWidth>r.width+1||r.violations.length);writeFileSync('/tmp/arcade-m4-library-browser.json',JSON.stringify({version:await page.evaluate(async()=>(await import('/js/releases.js')).APP_VERSION),checks,audit,errors,limitations:'Controller fixture and browser touch-capable context are not physical Windows/controller/touchscreen verification.'},null,2));
 for(const failure of failures)console.error(JSON.stringify(failure));assert.deepEqual(errors,[]);assert.equal(failures.length,0);console.log(`PASS: ${checks.length} library scenarios and ${audit.length} preview layout/accessibility audits; profile favorites/recent, previews, sort/search, controller actions, unchanged scores and actual offline reload. No page exceptions.`);
}finally{await browser?.close();server.kill('SIGTERM');}
