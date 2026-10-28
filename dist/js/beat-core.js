export const PRESETS={
  'Cosmic bounce':{bpm:100,rows:{0:[0,6,8,14],1:[4,12],3:[0,2,4,6,8,10,12,14],9:[3,7,11,15]}},
  'Robot party':{bpm:124,rows:{0:[0,4,8,12],2:[4,12],3:[2,6,10,14],12:[0,3,8,11],13:[15]}},
  'Moonwalk':{bpm:86,rows:{0:[0,7,10],1:[4,12],3:[0,3,6,8,11,14],10:[2,10],15:[0,8]}},
  'Jungle jam':{bpm:112,rows:{0:[0,8],2:[4,12],5:[3,11],6:[6,14],7:[7,15],9:[0,2,4,6,8,10,12,14]}}
};
export function presetMatrix(name,steps=16){const p=PRESETS[name];if(!p)throw Error('Choose a preset beat.');return Array.from({length:16},(_,row)=>Array.from({length:32},(_,s)=>s<steps&&!!p.rows[row]?.includes(s%16)));}
export function rebaseClock(queue,lastPlayed,nextTime,now,oldBpm,newBpm){
  // Preserve already queued events. Tempo takes effect after the final scheduled step.
  const duration=60/oldBpm/4;
  return Math.max(now+.012,nextTime-duration+60/newBpm/4);
}
export function sliceAudio(buffer,start,end,context){
  const lo=Math.max(0,Math.floor(start*buffer.sampleRate)),hi=Math.min(buffer.length,Math.max(lo+1,Math.ceil(end*buffer.sampleRate)));
  const out=context.createBuffer(buffer.numberOfChannels,hi-lo,buffer.sampleRate);
  for(let i=0;i<buffer.numberOfChannels;i++)out.copyToChannel(buffer.getChannelData(i).slice(lo,hi),i);
  return out;
}
