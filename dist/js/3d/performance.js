export const QUALITY=Object.freeze({low:{scale:1.65,shadows:0,ragdolls:3,particles:40},medium:{scale:1.25,shadows:1024,ragdolls:6,particles:80},high:{scale:1,shadows:2048,ragdolls:10,particles:140}});
/** Feed real measured frame durations. Reports medians/p95; no hardware performance promises. */
export class FrameSampler{
 constructor({capacity=180,slowThreshold=45,onPressure=()=>{}}={}){Object.assign(this,{capacity,slowThreshold,onPressure});this.samples=[];this.pressure=0;}
 add(ms){if(!Number.isFinite(ms)||ms<=0)return;this.samples.push(ms);if(this.samples.length>this.capacity)this.samples.shift();this.pressure=ms>this.slowThreshold?this.pressure+1:Math.max(0,this.pressure-2);if(this.pressure===60)this.onPressure(this.report());}
 report(){const s=[...this.samples].sort((a,b)=>a-b),n=s.length;return{frames:n,medianMs:n?s[Math.floor((n-1)*.5)]:0,p95Ms:n?s[Math.floor((n-1)*.95)]:0,fps:n?1000/(s.reduce((a,b)=>a+b,0)/n):0};}
 reset(){this.samples=[];this.pressure=0;}
}
