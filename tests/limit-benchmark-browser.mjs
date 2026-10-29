import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {existsSync,writeFileSync,readFileSync} from 'node:fs';
import {chromium} from 'playwright';
const port=Number(process.env.ARCADE_BENCHMARK_TEST_PORT||8097),origin=`http://127.0.0.1:${port}`,server=spawn(process.execPath,['scripts/serve.mjs'],{env:{...process.env,PORT:String(port)},stdio:'pipe'});let browser;
try{
 for(let i=0;i<100;i++){try{if((await fetch(origin)).ok)break;}catch{}await new Promise(r=>setTimeout(r,50));}
 browser=await chromium.launch({executablePath:existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined,headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1100,height:800},serviceWorkers:'block'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin);await page.locator('[data-ack]').click();await page.locator('#boot').waitFor({state:'detached'});
 await page.evaluate(async()=>(await import('/js/shell.js')).setupGame('limit'));if(await page.locator('.update-dialog [data-ack]').count())await page.locator('.update-dialog [data-ack]').click();
 await page.locator('#lbPreset').selectOption('low');await page.locator('#lbSuite').click();assert.equal(await page.locator('#lbCanvas').count(),0);assert.match(await page.locator('.how-to-play').innerText(),/Castle lighting/);await page.locator('[data-instructions-start]').click();
 await page.locator('#lbMonitor header').waitFor({timeout:120000});assert.match(await page.locator('#lbObjective').innerText(),/Five-world benchmark/);assert.ok(await page.locator('.lb-stage').evaluate(node=>node.classList.contains('lb-monitor-visible')));
 await page.locator('#lbSuiteJSON').waitFor({timeout:240000});
 const result=await page.evaluate(async()=>{const {DB}=await import('/js/data.js');return DB.settings.limitBreak.history.at(-1);});
 assert.equal(result.metadata.baseline,'four-worlds-v1');assert.equal(result.stages.length,5);assert.equal(result.overall.frames,result.frameTimesMs.length);assert.ok(result.stages.every(s=>s.frames>0&&s.metadata.actual.bodies>0));assert.deepEqual(result.stages.map(s=>s.metadata.zone),['forest','castle','arena','chaos','chaos']);
 for(const [button,ext] of [['#lbSuiteJSON','json'],['#lbSuiteCSV','csv']]){const pending=page.waitForEvent('download');await page.locator(button).click();const dl=await pending;const content=readFileSync(await dl.path(),'utf8');assert.ok(content.includes(ext==='json'?'frameTimesMs':'Castle interior lighting'));}
 await page.evaluate(async()=>{const data=await import('/js/data.js');data.parseBackup(data.backupJSON(data.DB,[]));});
 await page.locator('#lbSuiteHistory').click();assert.ok((await page.locator('#lbDialog').innerText()).includes('four-worlds-v1'));await page.locator('[data-result]').click();await page.screenshot({path:'/tmp/arcade-m6-results.png'});
 for(const width of [800,390]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.querySelector('.lb-dialog-card').getBoundingClientRect().right<=innerWidth+1));assert.equal(await page.locator('#lbSuiteCSV').isVisible(),true);}await page.setViewportSize({width:1100,height:800});await page.locator('#lbSuiteClose').click();assert.equal(await page.evaluate(()=>BABYLON.EngineStore.Instances.length),0);
 await page.locator('#lbSuite').click();await page.locator('#lbLoading').waitFor({state:'hidden',timeout:120000});await page.locator('#lbPause').click();await page.waitForTimeout(1200);assert.equal(await page.evaluate(async()=>(await import('/js/data.js')).DB.settings.limitBreak.history.length),1);
 await page.locator('#lbSafe').click();await page.locator('#lbLoading').waitFor({state:'hidden',timeout:120000});assert.equal(await page.evaluate(async()=>(await import('/js/data.js')).DB.settings.limitBreak.history.length),1);
 assert.deepEqual(errors,[]);writeFileSync('/tmp/arcade-m6-browser.json',JSON.stringify({version:'6.8.0',checks:['instruction gate','five actual scenes and measured samples','JSON and CSV downloads','backup roundtrip','history edition','engine disposal','abort without save and safe recovery'],result,errors},null,2));console.log('PASS: actual five-scene benchmark, measured raw exports, history/backup, no partial result and safe recovery.',result.overall);
}finally{await browser?.close();server.kill();}
