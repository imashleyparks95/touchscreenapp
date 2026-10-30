import {spawn} from 'node:child_process';
import {readdirSync,mkdirSync,writeFileSync,createWriteStream} from 'node:fs';
import {APP_VERSION} from '../dist/js/releases.js';
const directory=process.env.ARCADE_VERIFY_OUTPUT||'/tmp/arcade-final-verification';mkdirSync(directory,{recursive:true});
const suites=readdirSync('tests').filter(f=>f.endsWith('-browser.mjs')).sort(),results=[];let cursor=0;
async function worker(){while(cursor<suites.length){const file=suites[cursor++],start=Date.now(),log=`${directory}/${file}.log`,out=createWriteStream(log);const code=await new Promise(resolve=>{const child=spawn(process.execPath,[`tests/${file}`],{stdio:['ignore','pipe','pipe']});child.stdout.pipe(out,{end:false});child.stderr.pipe(out,{end:false});child.on('error',e=>{out.write(String(e));resolve(-1)});child.on('close',c=>resolve(c??-1));});await new Promise(resolve=>out.end(resolve));results.push({suite:file,code,durationMs:Date.now()-start,log});console.log(`${code===0?'PASS':'FAIL'} ${file}`);writeFileSync(`${directory}/summary.json`,JSON.stringify({version:APP_VERSION,scope:'Browser/device fixtures; not physical hardware or audible audio certification',results},null,2));}}
await Promise.all([worker(),worker()]);console.log(`${results.filter(r=>r.code===0).length}/${suites.length} browser suites passed`);if(results.some(r=>r.code!==0))process.exitCode=1;
