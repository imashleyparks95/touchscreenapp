import {DB,player,commitRound,recordKey} from './data.js';
export function resultFor(world,elapsed,config){const total=world.blocks.length,blocks=world.destroyed,percentage=blocks/total,full=blocks===total,stars=full?3:percentage>=.85?2:percentage>=.6?1:0,shots=world.shots;return{blocks,total,percentage,full,stars,completed:stars>0,shots,elapsed:Math.round(elapsed),chain:world.chain,score:blocks*100+(full?300:0)+Math.max(0,config.shots-shots)*(blocks?20:0)+(full?Math.max(0,Math.round(180-elapsed/1000)):0),hits:blocks,duration:elapsed/1000,soloWin:stars>0};}
export function compareDemolition(a,b,competition='blocks'){
 let checks=competition==='speed'?(a.full||b.full?[Number(a.full)-Number(b.full),a.full&&b.full?b.elapsed-a.elapsed:0,a.blocks-b.blocks,b.shots-a.shots]:[a.blocks-b.blocks,b.shots-a.shots,b.elapsed-a.elapsed]):[a.blocks-b.blocks,b.shots-a.shots,b.elapsed-a.elapsed];
 for(const v of checks)if(Math.abs(v)>0)return v>0?0:1;return null;
}
export function campaignRecords(id=DB.active){return player(id)?.results.filter(r=>r.ruleset==='demolition-v1'&&r.challengeKey==='campaign')||[];}
export function progress(id=DB.active){const records=campaignRecords(id),levels=Array.from({length:30},(_,i)=>{const r=records.filter(r=>r.levelId===i+1);return{stars:Math.max(0,...r.map(r=>r.stars||0)),score:Math.max(0,...r.map(r=>r.score)),fullTime:Math.min(Infinity,...r.filter(r=>r.full).map(r=>r.elapsed))};});const completed=levels.filter(l=>l.stars>0).length;let unlocked=1;while(unlocked<30&&levels[unlocked-1].stars>0)unlocked++;return{levels,completed,stars:levels.reduce((n,l)=>n+l.stars,0),unlocked};}
export function demolitionBoard({levelId=1,difficulty=3,mode='solo',competition='blocks',period='all',metric='score',personal=false}={}){
 const today=new Date().toLocaleDateString(),better=(a,b)=>metric==='time'?a.elapsed-b.elapsed:metric==='shots'?a.shots-b.shots||a.elapsed-b.elapsed:metric==='blocks'?b.blocks-a.blocks||b.score-a.score:b.score-a.score||a.elapsed-b.elapsed;
 return DB.profiles.filter(p=>!personal||p.id===DB.active).map(profile=>{const rows=profile.results.filter(r=>r.ruleset==='demolition-v1'&&r.challengeKey==='campaign'&&r.levelId===levelId&&r.difficulty===difficulty&&r.mode===mode&&r.competition===competition&&(period!=='daily'||new Date(r.at).toLocaleDateString()===today)&&(!['time','shots'].includes(metric)||r.full));rows.sort(better);return rows[0]?{profile,result:rows[0]}:null;}).filter(Boolean).sort((a,b)=>better(a.result,b.result));
}
export function commitDemolition(results,{config,ids,competition='blocks',custom=false,challengeKey='campaign'}){
 const mode=ids.length===2?'versus':'solo',winner=mode==='versus'?compareDemolition(results[0],results[1],competition):undefined,winnerId=winner===undefined?undefined:winner===null?null:ids[winner];
 const entries=results.map((r,i)=>({...r,id:ids[i]}));const rows=commitRound(entries,{game:'build',difficulty:config.difficulty||3,learn:false,mode,seed:config.id,ruleset:'demolition-v1',levelId:config.id,competition,challengeKey,pointsEligible:!custom,...(mode==='versus'?{winnerId}:{})});return{winner,rows};
}
export function structureKey(blocks){let h=2166136261;for(const c of JSON.stringify(blocks))h=Math.imul(h^c.charCodeAt(0),16777619);return'custom-'+(h>>>0).toString(16);}
