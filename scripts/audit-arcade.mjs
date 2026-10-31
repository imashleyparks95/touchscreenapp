/** Read-only development inventory and preservation checks. No browser/player data is read. */
import {readFileSync,existsSync} from 'node:fs';
import {resolve,relative,dirname,extname,isAbsolute,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import vm from 'node:vm';

export const ORIGINAL_WORLD_IDS=Object.freeze(['gladiator','math','bugs','paint','balloons','cafe','circuit','gravity','battle','build','beat','slime','dentist','ninja','castle','buddy','doodle','robot','wars','funny','monster','zoo','air','spelling','limit']);
export function auditArcade(root){
 const report={scope:'Static development audit; gameplay and hardware checks are separate.',checks:[],games:[],errors:[]};
 const read=name=>readFileSync(resolve(root,name),'utf8');
 function check(name,fn){try{const detail=fn();report.checks.push({name,status:'passed',detail});}catch(e){report.errors.push({name,message:e.message});report.checks.push({name,status:'failed'});}}
 const need=(value,message)=>{if(!value)throw Error(message);};
 let games=[],cached=new Set(),dependencies=new Set();
 check('registered roster and unique Limit Break',()=>{
  // Execute only this registry's declarations in a separate context. Artwork functions
  // are defined but never called; imports, browser globals and persistence are excluded.
  const code=read('dist/js/visuals.js').replace(/^import .*;\r?\n/gm,'').replace(/^export /gm,'');
  games=JSON.parse(JSON.stringify(vm.runInNewContext(code+';GAMES',{}, {timeout:1000})));
  need(Array.isArray(games),'Game registry is not an array');
  const ids=games.map(g=>g.id);need(new Set(ids).size===ids.length,'Duplicate game ID');
  for(const id of ORIGINAL_WORLD_IDS)need(ids.includes(id),'Missing protected world: '+id);
  need(ids.filter(id=>id==='limit').length===1,'Limit Break must have exactly one registration');
  report.games=games.map(({id,name,type})=>({id,name,category:type,renderer:['limit','wars','cloudwake'].includes(id)?'Babylon/Havok 3D; inspect compatibility renderer separately':'Canvas/DOM; media devices where applicable',controller:['limit','cloudwake','inkfin'].includes(id)?'Dedicated movement/camera/combat plus menus':'Shared menu navigation/controller cursor; not a dedicated action mapping',physical_verification:'not established by this audit'}));
  return `${games.length} unique registered worlds; all ${ORIGINAL_WORLD_IDS.length} original public IDs retained`;
 });
 check('hidden session and legacy record preservation hooks',()=>{
  const shell=read('dist/js/shell.js'),data=read('dist/js/data.js');
  need(/startNew\(\s*['"]face['"]\s*\)/.test(shell),'Hidden game entry is missing');
  need(!games.some(g=>g.id==='face'),'Hidden game must not become a public tile');
  need(data.includes('lba-records'),'Legacy record import is missing');
  return 'Hidden game entry retained; legacy record import present (behavior requires regression tests)';
 });
 check('version and static hosting configuration',()=>{
  const pkg=JSON.parse(read('package.json')),hosting=JSON.parse(read('.openai/hosting.json'));
  const version=vm.runInNewContext(read('dist/js/releases.js').replace(/^export /gm,'')+';APP_VERSION',{}, {timeout:1000});
  need(pkg.version===version,'Package and release-note versions disagree');
  need(hosting.project_id==='appgprj_6adab219a4788191952c4c83432002c5','Existing Sites project identity changed');
  need(hosting.static?.directory==='dist','Authoritative static directory must remain dist');
  report.version=version;return version+'; existing Sites identity and dist/ retained';
 });
 check('offline manifest files',()=>{
  const source=read('dist/sw.js'),start=source.indexOf('const FILES=['),end=source.indexOf('];',start);
  need(start>=0&&end>start,'Offline manifest declaration not found');
  const files=vm.runInNewContext(source.slice(start,end+2)+';FILES',{}, {timeout:1000});
  cached=new Set(files.map(p=>p==='./'?'index.html':p.replace(/^\.\//,'')));
  for(const path of cached)need(existsSync(resolve(root,'dist',path)),'Missing cached asset: '+path);
  return cached.size+' distinct local cache entries exist';
 });
 check('application module/style dependency closure',()=>{
  const dist=resolve(root,'dist'),queue=['index.html'];
  function add(from,url){
   if(/^(data:|https?:|#)/.test(url))return;
   const file=resolve(dirname(from),url.split(/[?#]/)[0]);
   const within=relative(dist,file);
   need(within!=='..'&&!within.startsWith('..'+sep)&&!isAbsolute(within),'Dependency escapes static directory: '+url);
   need(existsSync(file),'Missing local dependency: '+within);
   queue.push(within.split(sep).join('/'));
  }
  while(queue.length){const path=queue.shift();if(dependencies.has(path))continue;dependencies.add(path);const file=resolve(dist,path),type=extname(file);if(!['.html','.js','.mjs','.css','.webmanifest'].includes(type))continue;const source=readFileSync(file,'utf8');
   if(type==='.html')for(const match of source.matchAll(/<(?:script|link)\b[^>]*?\b(?:src|href)=["']([^"']+)["']/g))add(file,match[1]);
   if(type==='.js'||type==='.mjs')for(const match of source.matchAll(/\b(?:from\s*|import\s*(?:\(\s*)?)["'](\.{1,2}\/[^"']+)["']/g))add(file,match[1]);
   if(type==='.css')for(const match of source.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/g))add(file,match[1]);
   if(type==='.webmanifest')for(const icon of JSON.parse(source).icons||[])add(file,icon.src);
  }
  for(const file of dependencies)need(cached.has(file),'Application dependency is not precached: '+file);
  return dependencies.size+' reachable HTML/module/style/icon dependencies exist and are precached (model/texture decoding is tested separately)';
 });
 check('original vendored and art asset integrity',()=>{
  const source=JSON.parse(read('SOURCE_SHA256.json')),assets=Object.entries(source).filter(([p])=>p.startsWith('dist/assets/')||p.startsWith('dist/vendor/'));
  need(assets.length>0,'No source asset checksum records');
  for(const [path,hash]of assets)need(createHash('sha256').update(readFileSync(resolve(root,path))).digest('hex')===hash,'Original asset changed: '+path);
  return assets.length+' asset/vendor files match original migration checksums; intentional future asset replacements require a documented provenance update';
 });
 check('save schema and local media identity',()=>{
  const data=read('dist/js/data.js');
  need(data.includes("const KEY='lba-universe-v3'"),'Profile storage key changed; audit/migrate before continuing');
  need(data.includes("indexedDB.open('lba-universe-media',1)"),'Media database identity/version changed; audit/migrate before continuing');
  need(data.includes("format:'little-big-arcade',version:3"),'Backup format/version changed; audit/migrate before continuing');
  report.persistence={profiles:'lba-universe-v3',legacy:'lba-records',media:'lba-universe-media / items / version 1',backup:'little-big-arcade / version 3',user_data_accessed:false};
  return 'Storage identities unchanged; run backup/restore tests for behavior, and export real family data in its original browser';
 });
 report.ok=report.errors.length===0;return report;
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const report=auditArcade(resolve(dirname(fileURLToPath(import.meta.url)),'..'));
 if(process.argv.includes('--json'))console.log(JSON.stringify(report,null,2));
 else{for(const check of report.checks)console.log(`${check.status==='passed'?'PASS':'FAIL'}: ${check.name}${check.detail?' — '+check.detail:''}`);for(const error of report.errors)console.error(error.message);console.log(`${report.games.length} public worlds inventoried. No live data read; no deployment performed.`);}
 process.exitCode=report.ok?0:1;
}
