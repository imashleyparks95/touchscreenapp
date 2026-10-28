import {RELEASES,APP_VERSION} from './releases.js';
export const UPDATE_KEY='lba-update-notices-v1';
export const compareVersions=(a,b)=>{const x=String(a).split('.').map(Number),y=String(b).split('.').map(Number);for(let i=0;i<3;i++){const d=(x[i]||0)-(y[i]||0);if(d)return Math.sign(d);}return 0;};
const validVersion=v=>typeof v==='string'&&/^\d+\.\d+\.\d+$/.test(v);
export function createUpdateStore(storage,{existing=false,releases=RELEASES}={}){
 const current=releases[0].version;let saved;try{saved=JSON.parse(storage.getItem(UPDATE_KEY));}catch{}
 let state=saved?.schema===1&&validVersion(saved.baseline)&&saved.acknowledgedGameUpdates&&typeof saved.acknowledgedGameUpdates==='object'?{...saved,acknowledgedGameUpdates:{...saved.acknowledgedGameUpdates}}:{schema:1,baseline:existing?'5.2.0':current,welcome:!existing,lastAcknowledgedArcadeRelease:null,acknowledgedGameUpdates:{},largeText:false};
 let dirty=false;const persist=()=>{try{storage.setItem(UPDATE_KEY,JSON.stringify(state));dirty=false;return true;}catch{dirty=true;return false;}};
 const refresh=()=>{if(dirty)return;try{const v=JSON.parse(storage.getItem(UPDATE_KEY));if(v?.schema===1&&validVersion(v.baseline)&&v.acknowledgedGameUpdates&&typeof v.acknowledgedGameUpdates==='object')state={...v,acknowledgedGameUpdates:{...v.acknowledgedGameUpdates}};}catch{}};persist();
 function pending(game){refresh();const after=validVersion(state.acknowledgedGameUpdates[game])?state.acknowledgedGameUpdates[game]:state.baseline;return releases.filter(r=>compareVersions(r.version,current)<=0&&compareVersions(r.version,after)>0&&r.games?.[game]);}
 return {get state(){refresh();return structuredClone(state);},get current(){return current;},persist,pending,
 arcadePending:()=>{refresh();return !validVersion(state.lastAcknowledgedArcadeRelease)||compareVersions(current,state.lastAcknowledgedArcadeRelease)>0;},
 arcadeReleases:()=>{refresh();return releases.filter(r=>compareVersions(r.version,state.lastAcknowledgedArcadeRelease||state.baseline)>0);},
 acknowledgeArcade(){refresh();state.lastAcknowledgedArcadeRelease=current;state.welcome=false;return persist();},
 acknowledgeGame(game,versions=pending(game).map(r=>r.version)){refresh();if(versions.length){const newest=versions.reduce((a,b)=>compareVersions(a,b)>0?a:b);if(!validVersion(state.acknowledgedGameUpdates[game])||compareVersions(newest,state.acknowledgedGameUpdates[game])>0)state.acknowledgedGameUpdates[game]=newest;}return persist();},
 setLargeText(v){refresh();state.largeText=!!v;return persist();},
 reset(){refresh();state={schema:1,baseline:'0.0.0',welcome:false,lastAcknowledgedArcadeRelease:null,acknowledgedGameUpdates:{},largeText:state.largeText};return persist();}
 };
}
export function releaseSections(releases,game){const seen=new Set();return releases.map(r=>({...r,entry:game?r.games[game]:r,changes:(game?r.games[game]?.changes:r.changes||[]).filter(c=>{const key=c.text.trim().toLowerCase();if(seen.has(key))return false;seen.add(key);return true;})})).filter(r=>r.changes.length||r.entry?.introduced);}
