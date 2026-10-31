import {processAudio,peaks} from './beat-audio-core.js';
self.onmessage=e=>{try{const {channels,sampleRate,settings,bpm,waveOnly}=e.data;if(waveOnly){self.postMessage({wave:peaks(channels)});return;}const pcm=processAudio(channels,sampleRate,settings,bpm),wave=peaks(pcm);self.postMessage({channels:pcm,sampleRate,wave},pcm.map(c=>c.buffer));}catch(e){self.postMessage({error:e.message});}};
