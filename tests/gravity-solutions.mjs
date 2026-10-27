import {GravityWorld,GRAVITY_STEP} from '../dist/js/gravity-core.js';
export function solveGravity(id,difficulty){const w=new GravityWorld({level:id,difficulty}),m=w.level.mirror,toX=canon=>m?1000-canon:canon,side=right=>m?(right?'left':'right'):(right?'right':'left');
 if(w.level.switches.length){const s=w.level.switches[0];w.input('down',s.x,s.y,50);w.input('up',s.x,s.y,50);}if(id>=11)w.hold(51,true);
 const wait=(condition,max=13000)=>{const start=w.clock;while(!w.done&&!condition()&&w.clock-start<max)w.update(GRAVITY_STEP);return condition()||w.complete;};
 const horizontal=(right,goal=false)=>{w.setGravity(side(right));return wait(()=>goal?w.complete:Math.abs(w.ball.position.x-toX(right?983:17))<8&&Math.abs(w.ball.velocity.x)<.1,18000);};
 const up=(height,goal=false)=>{w.setGravity('up');const success=wait(()=>goal?w.complete:w.ball.position.y<height+5&&Math.abs(w.ball.velocity.y)<.1,16000);if(!goal)for(let i=0;i<40&&!w.done;i++)w.update(GRAVITY_STEP);return success;};
 // Ground first so every player gets the same readable stopping surfaces.
 wait(()=>w.ball.position.y>622&&Math.abs(w.ball.velocity.y)<.15,5000);
 let ok=horizontal(true);if(w.level.orbs[0].required&&!w.collected.has('lower')){w.setGravity('down');ok&&=wait(()=>w.collected.has('lower'),6000);}
 if(w.level.depth<=1){ok&&=up(14,true);}else{const ys=w.level.depth===2?[w.level.walls[1].y]:[w.level.walls[1].y,w.level.walls[2].y];ok&&=up(ys[0]+23);if(w.shieldCharges)w.shield();ok&&=horizontal(false);if(w.level.depth===2){ok&&=up(14);ok&&=horizontal(true,true);}else{ok&&=up(ys[1]+23);ok&&=horizontal(true);ok&&=up(14,true);}}
 const result={id,difficulty,ok,complete:w.complete,clock:w.clock,changes:w.changes,mistakes:w.mistakes,orbs:w.orbCount,ball:{...w.ball.position}};w.dispose();return result;}
