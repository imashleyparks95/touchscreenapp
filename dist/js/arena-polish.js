import {ACTIONS} from './gladiator-data.js';
import {fighterStats} from './gladiator-core.js';
export const ACTION_NOTES={forward:'Close the gap on foot.',back:'Retreat from your opponent; watch the edge.',jumpForward:'Cover more ground at a higher energy cost.',jumpBack:'Leap away; keep clear of the arena edge.',quick:'A lighter, more accurate weapon attack.',normal:'A balanced weapon attack.',power:'Higher damage with a lower hit chance.',charge:'Leap into weapon range and attack.',shove:'Push at close range; can cause a ring out.',taunt:'Charisma can drain energy and rattle accuracy.',defend:'Raise guard and recover 4 energy after its cost.',rest:'Recover energy, giving your opponent the next turn.'};
export function actionStatus(battle,id,{paused=false,aiTurn=false}={}){
 if(paused)return 'Paused';
 if(battle.phase==='handoff')return 'Next player: press Ready';
 if(battle.phase==='finished')return 'Battle complete';
 if(battle.phase!=='ready')return 'Action resolving';
 if(aiTurn)return 'Opponent’s turn';
 const f=battle.fighters[battle.turn],a=ACTIONS[id],d=battle.distance();
 if(f.energy<a.cost)return `Needs ${a.cost} energy · have ${Math.floor(f.energy)}`;
 if(battle.available(id))return 'Ready';
 if(['quick','normal','power'].includes(id))return `Move within ${f.stats.reach+35} · now ${Math.round(d)}`;
 if(id==='shove')return 'Move closer than 105';
 if(id==='charge')return d<=85?'Too close to charge':`Move within ${f.stats.reach+f.stats.jump+60}`;
 if(id==='taunt')return 'Move closer than 420';
 if(['forward','jumpForward'].includes(id))return 'Already at minimum distance';
 return 'Unavailable';
}
export function battleGuide(battle,{paused=false,aiTurn=false}={}){
 if(paused)return 'Battle paused. Actions and energy wait for you.';
 if(battle.phase==='handoff')return 'Pass the screen. The next player presses Ready before choosing an action.';
 if(battle.phase==='finished')return 'Battle complete. Review the report to see how each action resolved.';
 if(battle.phase==='animating')return ACTION_NOTES[battle.animation.action];
 if(aiTurn)return 'Your opponent is choosing an action. Your controls return next turn.';
 const f=battle.fighters[battle.turn],edge=f.x<160||f.x>840;
 return (edge?'Near the arena edge. Retreating may leave you open to a ring out. ':'')+(battle.distance()>f.stats.reach+35?'Close the gap to use your weapon. ': 'Your weapon is in range. ')+(f.energy<18?'Rest restores energy; Defend raises guard.':'Compare hit chance, energy cost and positioning before acting.');
}
export function equipmentComparison(g,item){
 const before=fighterStats(g),after=fighterStats({...g,equipped:{...g.equipped,[item.slot]:item.id}});
 return [['damage','Damage'],['reach','Reach'],['armor','Armor'],['accuracy','Accuracy'],['block','Block']].map(([key,label])=>({key,label,before:before[key],after:after[key],delta:Math.round((after[key]-before[key])*10)/10}));
}
// Original tactical floor marker. Only present, public positions/ranges are read.
export function drawArenaTactics(c,battle){
 const f=battle.fighters[battle.turn],other=battle.fighters[1-battle.turn],ready=battle.distance()<=f.stats.reach+35;
 c.save();c.lineCap='round';c.strokeStyle='#574d3b';c.lineWidth=2;c.setLineDash([5,6]);c.beginPath();c.moveTo(f.x,507);c.lineTo(other.x,507);c.stroke();c.setLineDash([]);
 for(let i=0;i<2;i++){const p=battle.fighters[i];c.fillStyle=i===0?'#245366':'#793b29';c.beginPath();c.ellipse(p.x,482,21,6,0,0,Math.PI*2);c.fill();c.fillStyle='#fff3d8';c.font='bold 13px Outfit,sans-serif';c.textAlign='center';c.fillText(String(i+1),p.x,486);}
 const text=`DISTANCE ${Math.round(battle.distance())} · ${ready?'WEAPON IN RANGE':'CLOSE THE GAP'}`;c.font='bold 13px Outfit,sans-serif';c.textAlign='center';c.fillStyle='#293a35';c.beginPath();c.roundRect(315,525,370,25,8);c.fill();c.fillStyle='#f4e7c5';c.fillText(text,500,542);c.restore();
}
// Compact vector commands avoid missing-font boxes on touch PCs.
export function actionGlyph(id){
 const paths={forward:'M4 12h16m-6-6 6 6-6 6',back:'M20 12H4m6-6-6 6 6 6',jumpForward:'M4 18Q4 5 18 5m-6-3 7 3-2 7',jumpBack:'M20 18Q20 5 6 5m6-3L5 5l2 7',quick:'m5 19 14-14m-5 0h5v5M3 12l4-4',normal:'m6 18 11-11 2-4-4 2L4 16m-1-4 9 9m-7-3-3 3',power:'m6 18 10-10m-5-3 8 8 3-3-8-8ZM2 5l3 3M8 2l1 3',charge:'M2 12h9m-3-4 4 4-4 4m7 3 5-14m-5 0 5 0 2 5',shove:'M4 18h5l3-2h7l2-4-1-3h-7l-2-5-3 1 1 7H4Z',taunt:'M4 10h5l9-5v14l-9-5H4Zm3 4 2 6m12-12 2-2m-2 10 2 2',defend:'M12 3 3 7l2 9 7 5 7-5 2-9ZM8 12l3 3 5-6',rest:'M18 4a9 9 0 1 0 2 14A9 9 0 0 1 18 4Z'};
 return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${paths[id]||paths.normal}"/></svg>`;
}
