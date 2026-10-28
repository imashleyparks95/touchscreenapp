import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {auditArcade,ORIGINAL_WORLD_IDS} from '../scripts/audit-arcade.mjs';

const root=mkdtempSync(join(tmpdir(),'arcade-audit-'));
const put=(path,text)=>{mkdirSync(join(root,path,'..'),{recursive:true});writeFileSync(join(root,path),text);};
const roster=ids=>put('dist/js/visuals.js','export const GAMES='+JSON.stringify(ids.map(id=>({id,name:id,type:'arcade'})))+';');
const cache=files=>put('dist/sw.js','const FILES='+JSON.stringify(files)+';');
const baseCache=['index.html','js/shell.js','asset.bin'];
const data="const KEY='lba-universe-v3';indexedDB.open('lba-universe-media',1);const backup={format:'little-big-arcade',version:3};const legacy='lba-records';";
try{
 put('package.json','{"version":"1.0.0"}');put('.openai/hosting.json','{"project_id":"appgprj_6adab219a4788191952c4c83432002c5","static":{"directory":"dist"}}');
 roster(ORIGINAL_WORLD_IDS);put('dist/index.html','<script type="module" src="js/shell.js"></script>');put('dist/js/shell.js',"startNew('face');");put('dist/js/releases.js',"export const APP_VERSION='1.0.0';");put('dist/js/data.js',data);put('dist/asset.bin','fixture');put('dist/assets/model.bin','fixture');cache(baseCache);
 put('SOURCE_SHA256.json',JSON.stringify({'dist/assets/model.bin':createHash('sha256').update('fixture').digest('hex')}));
 assert.ok(auditArcade(root).ok,'complete fixture passes');
 const fails=pattern=>{const report=auditArcade(root);assert.ok(!report.ok);assert.ok(report.errors.some(e=>pattern.test(e.message)),JSON.stringify(report.errors));};
 roster(ORIGINAL_WORLD_IDS.filter(id=>id!=='limit'));fails(/Missing protected world: limit/);roster([...ORIGINAL_WORLD_IDS,'limit']);fails(/Duplicate game ID/);roster(ORIGINAL_WORLD_IDS);
 put('dist/js/shell.js',"import './missing.js';startNew('face');");fails(/Missing local dependency/);
 put('dist/js/shell.js',"import '../../../escape.js';startNew('face');");fails(/escapes static directory/);
 put('dist/js/uncached.js','export const ready=true;');put('dist/js/shell.js',"import './uncached.js';startNew('face');");fails(/not precached/);put('dist/js/shell.js',"startNew('face');");
 cache([...baseCache,'missing.bin']);fails(/Missing cached asset/);cache(baseCache);
 put('dist/assets/model.bin','changed');fails(/Original asset changed/);put('dist/assets/model.bin','fixture');
 put('dist/js/data.js',data.replace('lba-universe-v3','new-key'));fails(/Profile storage key changed/);put('dist/js/data.js',data);
 put('dist/js/releases.js',"export const APP_VERSION='2.0.0';");fails(/versions disagree/);put('dist/js/releases.js',"export const APP_VERSION='1.0.0';");
 assert.ok(auditArcade(root).ok,'restoring fixture restores readiness');
 console.log('PASS: static audit detects removed/duplicate games, missing/uncached imports, missing cache entries, changed assets, save identity changes and version mismatches. Isolated fixtures; no real browser saves accessed.');
}finally{rmSync(root,{recursive:true,force:true});}
