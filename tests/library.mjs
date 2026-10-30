import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {LIBRARY_MODES,worldCapabilities,libraryState,toggleFavorite,rememberProfileWorld,validateLibrary,libraryWorlds} from '../dist/js/library.js';
import {matchingWorlds} from '../dist/js/discovery.js';

const source=readFileSync('dist/js/visuals.js','utf8').replace(/^import .*;\n/gm,'').replace(/^export /gm,'');
const games=JSON.parse(JSON.stringify(vm.runInNewContext(source+';GAMES',{})));
assert.equal(games.length,25);assert.deepEqual(Object.keys(LIBRARY_MODES).sort(),games.map(g=>g.id).sort());
for(const game of games){const c=worldCapabilities(game.id);assert.ok(c.multiplayer&&c.touch&&c.controller);assert.equal(c.controller,['limit','slime','ninja'].includes(game.id)?'Native controller':'Controller cursor');}
assert.match(worldCapabilities('air').device,/fallback/);assert.match(worldCapabilities('funny').device,/Camera/);assert.match(worldCapabilities('paint').note,/Freehand/);assert.equal(worldCapabilities('face').multiplayer,'');
const a={name:'One'},b={name:'Two'};assert.deepEqual(libraryState(a),{favorites:[],recent:[]});validateLibrary(a);
assert.equal(toggleFavorite(a,'paint'),true);assert.equal(toggleFavorite(a,'beat'),true);assert.deepEqual(libraryState(a).favorites,['paint','beat']);assert.deepEqual(libraryState(b).favorites,[]);
assert.equal(toggleFavorite(a,'paint'),false);assert.deepEqual(a.library.favorites,['beat']);
for(const id of ['face','keeper','dig','__proto__','unknown']){assert.equal(toggleFavorite(a,id),false);rememberProfileWorld(a,id);}
for(let i=0;i<25;i++)rememberProfileWorld(a,games[i].id,100+i);
assert.equal(a.library.recent.length,12);assert.equal(a.library.recent[0].id,games.at(-1).id);
rememberProfileWorld(a,'beat',200);assert.equal(a.library.recent[0].id,'beat');assert.equal(a.library.recent.filter(item=>item.id==='beat').length,1);
assert.deepEqual(libraryWorlds(games,{profile:a,filter:'favorites'}).map(g=>g.id),['beat']);
assert.equal(libraryWorlds(games,{profile:a,filter:'favorites',query:'no match'}).length,0);
assert.equal(libraryWorlds(games,{profile:a,filter:'recent'})[0].id,'beat');assert.equal(libraryWorlds(games,{profile:a,sort:'recent'})[0].id,'beat');
const alphabetical=libraryWorlds(games,{sort:'name'}).map(g=>g.name);assert.deepEqual(alphabetical,[...alphabetical].sort((a,b)=>a.localeCompare(b)));
assert.equal(matchingWorlds(games,'together').length,25,'Beat Lab has real alternating rhythm challenges');assert.equal(libraryWorlds(games,{filter:'creative',query:'beat'})[0].id,'beat');
validateLibrary(a);for(const library of [null,[],{}, {favorites:['face'],recent:[]},{favorites:['beat','beat'],recent:[]},{favorites:[],recent:[{id:'beat',at:-1}]},{favorites:[],recent:[{id:'beat',at:NaN}]},{favorites:[],recent:[{id:'beat',at:1},{id:'beat',at:2}]}])assert.throws(()=>validateLibrary({library}),/library preferences/i);
const polluted=libraryState({library:{favorites:['face','paint','paint'],recent:[{id:'face',at:1},{id:'beat',at:2},{id:'beat',at:3}]}});assert.deepEqual(polluted,{favorites:['paint'],recent:[{id:'beat',at:2}]});

const storage=new Map();globalThis.localStorage={getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)};globalThis.matchMedia=()=>({matches:false});
const {DB,save,backupJSON,parseBackup}=await import('../dist/js/data.js');const original=DB.profiles.map(p=>({id:p.id,results:structuredClone(p.results),xp:p.xp,played:p.played}));
toggleFavorite(DB.profiles[0],'limit');rememberProfileWorld(DB.profiles[0],'limit',123);save();
const restored=parseBackup(backupJSON(DB,[]));assert.deepEqual(restored.data.profiles[0].library,{favorites:['limit'],recent:[{id:'limit',at:123}]});
assert.deepEqual(DB.profiles.map(p=>({id:p.id,results:p.results,xp:p.xp,played:p.played})),original,'browsing/favoriting never changes scores or progression');
delete restored.data.profiles[0].library;parseBackup(JSON.stringify(restored));const invalid=JSON.parse(backupJSON(DB,[]));invalid.data.profiles[0].library.favorites=['face'];assert.throws(()=>parseBackup(JSON.stringify(invalid)),/library preferences/i);
console.log('PASS: all 25 public capability entries, native/cursor/device distinctions, profile-isolated favorites, bounded/deduplicated recents, search/filter/sort, Beat Lab together inclusion, old/new backup compatibility and rejected malformed library data without changing scores.');
