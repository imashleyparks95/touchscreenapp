// Local, rotating suggestions. No account, tracking, streaks or progress mutation.
export function matchingWorlds(games,filter='all',query=''){
 const terms=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
 return games.filter(g=>(filter==='all'||g.type===filter||(filter==='learn'&&g.learn)||(filter==='together'&&g.id!=='beat'))&&terms.every(term=>`${g.name} ${g.desc} ${g.tag}`.toLocaleLowerCase().includes(term)));
}
export function dailyWorlds(games,date=new Date()){
 const day=Math.floor(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/86400000);
 return ['arcade','learn','creative'].map((type,i)=>{const pool=games.filter(g=>g.type===type&&!['funny','monster'].includes(g.id));return pool[(day+i*7)%pool.length];}).filter(Boolean);
}
export function recentWorld(games,storage=localStorage){try{return games.find(g=>g.id===storage.getItem('lba-last-world'));}catch{return null;}}
export function rememberWorld(id,storage=localStorage){try{storage.setItem('lba-last-world',id);}catch{}}
