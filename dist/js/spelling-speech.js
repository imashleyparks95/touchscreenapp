// Speech voices are supplied free by the browser/OS; no service keys or accounts.
export const spokenSpellingText=text=>String(text).replace(/\bniko\b/gi,'Niko');
export const isAmericanEnglishVoice=v=>/^en[-_]US(?:[-_]|$)/i.test(v.lang)||/^en(?:[-_]|$)/i.test(v.lang)&&/US English|American English|English.*United States/i.test(v.name);
export const spellingVoiceId=v=>(v.voiceURI||v.name)+'|'+v.lang;
export const isFemaleSpellingVoice=v=>isAmericanEnglishVoice(v)&&/female|aria|jenny|samantha|susan|zira|allison|victoria|joanna|salli|catherine|emma|olivia|michelle|elizabeth|ashley|nancy|amber|monica|cora|ruth|jane|sara|danielle|joelle|kimberly|kendra|ivy|\bana\b|\bava\b|\bamy\b|google.*US English/i.test(v.name)&&! /\b(male|david|mark|guy|ryan|andrew|christopher|brian)\b/i.test(v.name);
export function rankEnglishVoices(voices=[]){
 const female=/female|aria|jenny|sonia|libby|samantha|susan|zira|hazel|allison|victoria|karen|moira|tessa|serena|fiona|joanna|salli|catherine|emma|olivia|michelle|elizabeth|ashley|nancy|amber|monica|cora|ruth|jane|sara|danielle|joelle|kimberly|kendra|ivy|\bana\b|\bava\b|\bamy\b/i;
 const male=/\b(male|david|mark|george|guy|ryan|daniel|james|alex|fred|thomas)\b/i;
 const quality=v=>(isAmericanEnglishVoice(v)?1000:0)+(/natural|neural|premium|enhanced/i.test(v.name)?90:0)+(female.test(v.name)?120:0)+(/google.*(US English|UK English Female)/i.test(v.name)?145:0)-(male.test(v.name)?70:0)+(/^en-US$/i.test(v.lang)?12:/^en-GB$/i.test(v.lang)?10:0)+(v.localService?5:0);
 return voices.filter(v=>/^en(?:[-_]|$)/i.test(v.lang)).map((v,i)=>({v,i,score:quality(v)})).sort((a,b)=>b.score-a.score||a.i-b.i).map(x=>x.v);
}
export class SpellingSpeech{
 constructor({volume=.9,rate=.85,voiceId='',onVoicesChanged=()=>{},onStatus=()=>{}}={}){Object.assign(this,{volume,rate,voiceId,onVoicesChanged,onStatus});this.engine=globalThis.speechSynthesis;this.available=!!this.engine&&!!globalThis.SpeechSynthesisUtterance;this.disposed=false;this.serial=0;this.queue=[];this.busy=false;this.timer=null;this.utterance=null;this.waiting=null;this.current=null;this.failedVoices=new Set();this.voiceListener=()=>{if(!this.disposed)this.onVoicesChanged();};this.engine?.addEventListener?.('voiceschanged',this.voiceListener);}
 voiceChoices(){const seen=new Set(),all=rankEnglishVoices(this.engine?.getVoices?.()||[]).filter(v=>isFemaleSpellingVoice(v)&&!seen.has(spellingVoiceId(v))&&seen.add(spellingVoiceId(v))),top=all.slice(0,3),preferred=all.find(v=>spellingVoiceId(v)===this.voiceId);if(preferred&&!top.includes(preferred))top[2]=preferred;return top.map(v=>({id:spellingVoiceId(v),name:v.name,local:!!v.localService}));}
 setVoice(id=''){this.cancel();this.voiceId=id;const v=this.engine?.getVoices?.().find(v=>spellingVoiceId(v)===id);if(v)this.failedVoices.delete(v.voiceURI||v.name);}
 speak(text,{rate=this.rate,replace=false}={}){
  if(this.disposed)return Promise.resolve(false);if(replace)this.cancel();
  if(!this.available){this.onStatus('Speech is unavailable in this browser. The definition, pattern and writing board are still ready to use.');return Promise.resolve(false);}
  return new Promise(resolve=>{this.queue.push({text:spokenSpellingText(text),rate:Math.max(.5,Math.min(1.2,rate)),resolve});this.pump();});
 }
 waitForVoices(done){
  if(this.engine.getVoices().length){done();return;}
  let finished=false;const finish=()=>{if(finished)return;finished=true;clearTimeout(timer);this.engine.removeEventListener?.('voiceschanged',changed);this.waiting=null;done();};
  const changed=()=>{if(this.engine.getVoices().length)finish();};const timer=setTimeout(finish,1200);
  this.waiting=()=>{if(finished)return;finished=true;clearTimeout(timer);this.engine.removeEventListener?.('voiceschanged',changed);};this.engine.addEventListener?.('voiceschanged',changed);
 }
 pump(){
  if(this.busy||!this.queue.length||this.disposed)return;const job=this.queue.shift(),serial=this.serial;this.busy=true;let finished=false;
  const finish=ok=>{if(finished)return;finished=true;clearTimeout(this.timer);this.timer=null;this.busy=false;this.utterance=null;this.current=null;job.resolve(ok);if(!ok&&!this.cancelling&&!this.disposed)this.onStatus('Your browser could not read this prompt. Try Repeat Word; the definition and pattern are still available.');this.pump();};this.current=finish;
  this.waitForVoices(()=>{if(finished||serial!==this.serial||this.disposed)return;const voices=rankEnglishVoices(this.engine.getVoices()).filter(v=>isAmericanEnglishVoice(v)&&!this.failedVoices.has(v.voiceURI||v.name)),preferred=voices.find(v=>spellingVoiceId(v)===this.voiceId&&isFemaleSpellingVoice(v)),ordered=preferred?[preferred,...voices.filter(v=>v!==preferred)]:voices,selected=ordered.slice(0,3),local=voices.find(v=>v.localService);if(local&&!selected.includes(local))selected.push(local);const attempts=[...selected,null];let index=0;
   const attempt=()=>{if(finished||serial!==this.serial||this.disposed)return;const voice=attempts[index++],u=this.utterance=new SpeechSynthesisUtterance(job.text);u.lang='en-US';u.rate=job.rate;u.volume=this.volume;if(voice)u.voice=voice;let ended=false,started=false;
    const done=ok=>{if(ended||finished||serial!==this.serial)return;ended=true;clearTimeout(this.timer);this.timer=null;u.onend=u.onerror=u.onstart=null;if(ok){this.onStatus(voice?'Reading with '+voice.name+' · American English voice.':'Using your browser’s default voice, requested in American English.');finish(true);}else{if(voice)this.failedVoices.add(voice.voiceURI||voice.name);this.engine.cancel();if(index<attempts.length)attempt();else finish(false);}};
    u.onstart=()=>{started=true;clearTimeout(this.timer);this.timer=setTimeout(()=>done(false),20000);};u.onend=()=>done(true);u.onerror=()=>done(false);
    this.timer=setTimeout(()=>{if(!started)done(false);},3000);try{this.engine.speak(u);}catch{done(false);}
   };attempt();
  });
 }
 cancel(){this.cancelling=true;this.serial++;this.waiting?.();this.waiting=null;this.queue.splice(0).forEach(j=>j.resolve(false));const current=this.current;this.current=null;if(this.utterance)this.utterance.onstart=this.utterance.onend=this.utterance.onerror=null;this.engine?.cancel();current?.(false);clearTimeout(this.timer);this.timer=null;this.busy=false;this.utterance=null;this.cancelling=false;}
 dispose(){this.disposed=true;this.engine?.removeEventListener?.('voiceschanged',this.voiceListener);this.cancel();}
}
