export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export const rectHit=(p,r,pad=0)=>p.x>=r.x-pad&&p.x<=r.x+r.w+pad&&p.y>=r.y-pad&&p.y<=r.y+r.h+pad;
export function seeded(seed){let n=seed>>>0;return()=>((n=(Math.imul(n,1664525)+1013904223)>>>0)/4294967296);}
export function segmentCircle(a,b,c,r){const dx=b.x-a.x,dy=b.y-a.y,t=clamp(((c.x-a.x)*dx+(c.y-a.y)*dy)/(dx*dx+dy*dy||1),0,1);return Math.hypot(a.x+dx*t-c.x,a.y+dy*t-c.y)<=r;}
export const angleDelta=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));
export function compareRace(a,b){if(a.complete!==b.complete)return a.complete?1:-1;if(a.complete&&a.finishedAt!==b.finishedAt)return b.finishedAt-a.finishedAt;return(a.collected?.size||0)-(b.collected?.size||0)||(b.detected??b.attempts)-(a.detected??a.attempts);}
