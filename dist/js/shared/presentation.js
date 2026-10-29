/** Decorative effects only. Never changes simulation, input, scoring or workloads. */
export const EFFECT_LEVELS=Object.freeze(['full','reduced','off']);
export function presentationSettings(value={}){return{effects:EFFECT_LEVELS.includes(value?.effects)?value.effects:'full'};}
export function validatePresentationSettings(settings){
 if(settings.presentation===undefined)return;
 const value=settings.presentation;
 if(!value||typeof value!=='object'||Array.isArray(value)||!EFFECT_LEVELS.includes(value.effects))throw Error('Presentation settings are invalid.');
}
export function decorativeCount(count,settings={}){
 const n=Number.isFinite(count)?Math.max(0,Math.floor(count)):0;
 const level=presentationSettings(settings.presentation).effects;
 if(level==='off')return 0;
 const factor=settings.reduceMotion||level==='reduced' ? .25 : 1;
 return Math.round(n*factor);
}
