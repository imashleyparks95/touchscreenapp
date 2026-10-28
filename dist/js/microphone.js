import {sliceAudio} from './beat-core.js';
export function microphoneError(error){
  if(error?.name==='NotAllowedError'||error?.name==='SecurityError')return 'Microphone access was blocked. Allow the microphone in the browser’s site settings, then try Start again.';
  if(error?.name==='NotFoundError'||error?.name==='DevicesNotFoundError')return 'No microphone was found. Connect a USB microphone or enable the PC’s microphone, then try again.';
  if(error?.name==='NotReadableError'||error?.name==='TrackStartError')return 'The microphone is busy or unavailable. Close other recording apps and check the Windows input settings.';
  return error?.message||'Could not record audio. Check your microphone and try again.';
}
export class MicrophoneRecorder {
  constructor(context,{devices=globalThis.navigator?.mediaDevices,Recorder=globalThis.MediaRecorder,onState=()=>{},onLevel=()=>{},onError=()=>{},maxSeconds=60}={}){
    Object.assign(this,{context,devices,Recorder,onState,onLevel,onError,maxSeconds});this.state='idle';this.stream=null;this.recorder=null;this.token=0;this.disposed=false;
  }
  update(state){this.state=state;this.onState(state);}
  async start(){
    if(this.disposed||['requesting','recording','processing'].includes(this.state))return false;
    const token=++this.token;this.update('requesting');
    try{
      if(!this.devices?.getUserMedia||!this.Recorder)throw Error('Microphone recording needs Edge or Chrome at the secure HTTPS arcade address. You can still import an audio file.');
      const stream=await this.devices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:false,autoGainControl:false},video:false});
      if(this.disposed||token!==this.token){stream.getTracks().forEach(t=>t.stop());return false;}
      this.stream=stream;await this.context.resume();if(this.disposed||token!==this.token){this.release();return false;}
      const type=['audio/webm;codecs=opus','audio/webm','audio/ogg;codecs=opus'].find(t=>this.Recorder.isTypeSupported?.(t));
      const rec=this.recorder=new this.Recorder(stream,type?{mimeType:type}:{}),chunks=[];
      this.source=this.context.createMediaStreamSource(stream);this.analyser=this.context.createAnalyser();this.analyser.fftSize=512;this.source.connect(this.analyser); // No monitor: prevents speaker feedback.
      rec.ondataavailable=e=>{if(e.data?.size)chunks.push(e.data);};
      this.completed=new Promise((resolve,reject)=>{
        rec.onstop=async()=>{clearInterval(this.timer);this.release();if(this.disposed||token!==this.token){resolve(null);return;}this.update('processing');try{const blob=new Blob(chunks,{type:rec.mimeType||type||'audio/webm'});if(!blob.size)throw Error('Nothing was recorded. Try again and speak near the microphone.');const buffer=await this.context.decodeAudioData(await blob.arrayBuffer());if(this.disposed||token!==this.token){resolve(null);return;}this.buffer=buffer;this.update('ready');resolve(buffer);}catch(e){this.update('idle');this.onError(microphoneError(e));reject(e);}};
        rec.onerror=e=>{this.token++;clearInterval(this.timer);this.release();if(!this.disposed){this.update('idle');this.onError(microphoneError(e.error));}reject(e.error||Error('Microphone recording failed.'));};
      });
      // Attach immediately so unexpected device errors never create an unhandled rejection.
      this.completed.catch(()=>{});
      stream.getAudioTracks().forEach(track=>track.onended=()=>{if(this.state==='recording'){this.onError('Microphone disconnected. Keeping the audio captured so far.');this.stop().catch(()=>{});}});
      this.started=performance.now();rec.start(100);this.update('recording');
      this.timer=setInterval(()=>{if(this.state!=='recording')return;const data=new Float32Array(this.analyser.fftSize);this.analyser.getFloatTimeDomainData(data);const level=Math.sqrt(data.reduce((s,x)=>s+x*x,0)/data.length);const seconds=(performance.now()-this.started)/1000;this.onLevel(Math.min(1,level*4),seconds);if(seconds>=this.maxSeconds)this.stop().catch(()=>{});},50);
      return true;
    }catch(e){this.release();if(!this.disposed){this.update('idle');this.onError(microphoneError(e));}return false;}
  }
  async stop(){
    if(this.state==='requesting'){this.token++;this.update('idle');return null;}
    if(this.state==='processing')return this.completed;
    if(this.state!=='recording')return this.buffer||null;
    clearInterval(this.timer);this.update('processing');if(this.recorder?.state!=='inactive')this.recorder.stop();return this.completed;
  }
  release(){clearInterval(this.timer);if(this.stream){this.stream.getTracks().forEach(t=>{t.onended=null;t.stop();});this.stream=null;}this.source?.disconnect();this.analyser?.disconnect();this.source=null;this.analyser=null;}
  dispose(){this.disposed=true;this.token++;if(this.recorder?.state==='recording')this.recorder.stop();this.release();}
}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function microphonePanel(host,{context,output,tracks,canStart,assign,notify,nameSample}){
  host.innerHTML=`<div class="mic-intro"><span class="eyebrow">YOUR VOICE IS AN INSTRUMENT</span><h2>Record something brilliant.</h2><p>Clap, sing, beatbox, or make a silly sound. Record up to 60 seconds, then turn it into a sequencer instrument.</p></div><div class="mic-capture panel"><div class="mic-live"><span class="mic-symbol">🎙</span><strong id="micTimer">00:00.0</strong><span id="micState" role="status">Ready when you are.</span><meter id="micLevel" min="0" max="1" value="0" aria-label="Microphone audio level"></meter></div><div class="mic-actions"><button class="btn primary" id="micStart">● START RECORDING</button><button class="btn danger" id="micStop" disabled>■ STOP</button><button class="btn secondary" id="micPreview" disabled>▶ PREVIEW</button><button class="btn secondary" id="micAgain" disabled>↻ RE-RECORD</button></div><p id="micError" role="alert"></p><canvas id="micWave" width="1000" height="180" aria-label="Recorded microphone waveform"></canvas><div class="mic-trim"><label>START <output id="micInValue">0.000 s</output><input id="micIn" type="range" min="0" max="1" step="0.001" value="0" disabled></label><label>END <output id="micOutValue">0.000 s</output><input id="micOut" type="range" min="0" max="1" step="0.001" value="1" disabled></label></div><p>Drag the waveform edges or use the sliders to trim. Only the selected audio is saved.</p><div class="mic-destination"><label>Put my sound on<select id="micTrack">${tracks().map((t,i)=>`<option value="${i}">${String(i+1).padStart(2,'0')} · ${esc(t)}</option>`).join('')}</select></label><button class="btn accent" id="micSave" disabled>SAVE SAMPLE TO TRACK →</button></div><p class="tiny muted">Audio stays in your browser’s local projects and backups. For best results, turn down the speakers while recording.</p></div>`;
  const $=s=>host.querySelector(s);let buffer=null,start=0,end=0,preview=null,closed=false,unsaved=false;
  function stopPreview(){if(preview){try{preview.stop();}catch{}preview=null;}$('#micPreview').textContent='▶ PREVIEW';}
  function draw(){const c=$('#micWave'),x=c.getContext('2d');x.fillStyle='#0d142b';x.fillRect(0,0,c.width,c.height);if(!buffer)return;const a=buffer.getChannelData(0);x.fillStyle='#58dfce22';x.fillRect(start/buffer.duration*c.width,0,(end-start)/buffer.duration*c.width,c.height);x.strokeStyle='#5ce3ce';for(let i=0;i<c.width;i++){let peak=0;for(let n=Math.floor(i*a.length/c.width);n<Math.floor((i+1)*a.length/c.width);n++)peak=Math.max(peak,Math.abs(a[n]));x.beginPath();x.moveTo(i,90-peak*82);x.lineTo(i,90+peak*82);x.stroke();}x.fillStyle='#ffb967';for(const t of[start,end])x.fillRect(Math.min(c.width-5,t/buffer.duration*c.width),0,5,c.height);$('#micInValue').textContent=start.toFixed(3)+' s';$('#micOutValue').textContent=end.toFixed(3)+' s';$('#micIn').value=start;$('#micOut').value=end;}
  const recorder=new MicrophoneRecorder(context,{onState:state=>{if(closed)return;const busy=['requesting','recording','processing'].includes(state);$('#micStart').disabled=busy;$('#micAgain').disabled=busy||!buffer;$('#micStop').disabled=!['requesting','recording'].includes(state);for(let id of['micPreview','micSave','micIn','micOut'])$('#'+id).disabled=busy||!buffer;$('#micState').textContent=({idle:'Ready when you are.',requesting:'Allow microphone access in your browser…',recording:'● Recording your sound',processing:'Preparing your waveform…',ready:'Sound captured. Trim, preview, and save it.'})[state];if(state==='ready'){unsaved=true;buffer=recorder.buffer;start=0;end=buffer.duration;$('#micIn').max=end;$('#micOut').max=end;for(let id of['micPreview','micSave','micIn','micOut','micAgain'])$('#'+id).disabled=false;$('#micLevel').value=0;draw();}},onLevel:(level,seconds)=>{if(closed)return;$('#micLevel').value=level;$('#micTimer').textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+(seconds%60).toFixed(1).padStart(4,'0');},onError:message=>{if(!closed)$('#micError').textContent=message;}});
  async function startRecord(){if(!canStart())return;stopPreview();$('#micError').textContent='';await recorder.start();}
  $('#micStart').onclick=startRecord;$('#micAgain').onclick=startRecord;$('#micStop').onclick=()=>recorder.stop().catch(()=>{});
  $('#micPreview').onclick=()=>{if(preview){stopPreview();return;}if(!buffer)return;context.resume();const s=context.createBufferSource();preview=s;s.buffer=buffer;s.connect(output);s.onended=()=>{s.disconnect();if(preview===s){preview=null;if(!closed)$('#micPreview').textContent='▶ PREVIEW';}};s.start(0,start,end-start);$('#micPreview').textContent='■ STOP PREVIEW';};
  for(const [id,key]of[['micIn','start'],['micOut','end']])$('#'+id).oninput=e=>{stopPreview();if(key==='start')start=Math.min(+e.target.value,end-.005);else end=Math.max(+e.target.value,start+.005);draw();};
  let handle=null;$('#micWave').onpointerdown=e=>{if(!buffer||['recording','processing','requesting'].includes(recorder.state))return;e.preventDefault();const r=e.target.getBoundingClientRect(),t=(e.clientX-r.left)/r.width*buffer.duration;handle={id:e.pointerId,key:Math.abs(t-start)<Math.abs(t-end)?'start':'end'};e.target.setPointerCapture(e.pointerId);drag(e);};function drag(e){if(!handle||e.pointerId!==handle.id)return;stopPreview();const r=$('#micWave').getBoundingClientRect(),t=Math.max(0,Math.min(buffer.duration,(e.clientX-r.left)/r.width*buffer.duration));if(handle.key==='start')start=Math.min(t,end-.005);else end=Math.max(t,start+.005);draw();}$('#micWave').onpointermove=drag;for(const ev of['pointerup','pointercancel','lostpointercapture'])$('#micWave').addEventListener(ev,()=>handle=null);
  $('#micSave').onclick=()=>{if(!buffer)return;stopPreview();const track=+$('#micTrack').value,trimmed=sliceAudio(buffer,start,end,context);nameSample(async name=>{await assign(track,trimmed,name);unsaved=false;notify('Your sound is saved to track '+(track+1)+'. Tap its steps to make it part of your song.');});};
  const visibility=()=>{if(document.hidden){stopPreview();recorder.stop().catch(()=>{});}};document.addEventListener('visibilitychange',visibility);draw();
  return{get unsaved(){return unsaved;},get busy(){return ['requesting','recording','processing'].includes(recorder.state);},async stop(){stopPreview();await recorder.stop();},refresh(){const choice=$('#micTrack').value;$('#micTrack').innerHTML=tracks().map((t,i)=>`<option value="${i}">${i+1} · ${esc(t)}</option>`).join('');$('#micTrack').value=choice;},dispose(){closed=true;stopPreview();recorder.dispose();document.removeEventListener('visibilitychange',visibility);}};
}
