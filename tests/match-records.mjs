import assert from 'node:assert/strict';
const store=new Map();globalThis.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};globalThis.matchMedia=()=>({matches:false});
const {DB,commitRound,backupJSON,parseBackup}=await import('../dist/js/data.js');
const [a,b]=DB.profiles,entry=(p,score)=>({id:p.id,score,hits:2,duration:30}),opts={game:'battle',difficulty:3,mode:'versus',ruleset:'refinement-v1',levelId:'target-3',competition:'target',challengeKey:'skill'};
for(const rows of [[],[entry(a,100),entry(a,200)],[entry(a,100),{id:'missing',score:20}],[entry(a,100),entry(b,NaN)],[entry(a,100),entry(b,Infinity)]]){const before=JSON.stringify(DB),saved=JSON.stringify([...store]);assert.throws(()=>commitRound(rows,opts),/distinct existing players/);assert.equal(JSON.stringify(DB),before);assert.equal(JSON.stringify([...store]),saved,'rejected roster does not persist partial results');}
const before=JSON.stringify(DB);assert.throws(()=>commitRound([entry(a,1),entry(b,2)],{...opts,winnerId:'missing'}),/winner/);assert.equal(JSON.stringify(DB),before);
const practice=commitRound([entry(a,100),entry(b,200)],{...opts,ranked:false});assert.deepEqual(practice,[{id:a.id,rank:null,pb:false},{id:b.id,rank:null,pb:false}]);assert.equal(JSON.stringify(DB),before);
commitRound([entry(a,100),entry(b,200)],{...opts,winnerId:a.id});assert.equal(a.won,1);assert.equal(b.lost,1);assert.equal(DB.rivalries[0].wins[a.id],1,'explicit round winner overrides raw points');
commitRound([entry(b,200),entry(a,100)],{...opts,winnerId:null});assert.equal(DB.rivalries.length,1,'reversed roster reuses pair');assert.equal(DB.rivalries[0].matches,2);assert.equal(DB.rivalries[0].draws,1);assert.equal(a.draws,1);assert.equal(b.draws,1);
const matches=DB.rivalries[0].matches;for(const p of [a,b])commitRound([{...entry(p,50),soloWin:true}],{...opts,mode:'solo',competition:'coop',winnerId:undefined});assert.equal(DB.rivalries[0].matches,matches,'existing co-op separate-result contract does not become rivalry');
assert.ok(a.results.some(r=>r.competition==='coop'));assert.ok(a.results.some(r=>r.competition==='target'));
const backup=backupJSON(DB,[]);assert.ok(parseBackup(backup));
console.log('PASS: atomic invalid roster/score/winner rejection, identity-preserving practice without writes, explicit winner/tie, reversed pair rivalry, co-op separation and backup compatibility.');
