// Game-owned guidance reads visible state only; it never grants rewards or starts devices.
export function zooGuide({paused=false,building=false,tool='select',food='',animals=[]}={}){
 if(paused)return 'Zoo paused. Resume to care for animals or move decorations.';
 if(food)return 'Drag the '+food+' token onto your animal. Lift to give it; canceling does not feed or play.';
 if(tool==='pan')return 'Drag to explore. Pinch with two fingers to zoom; FIT returns to the whole zoo.';
 if(building)return tool==='select'?'Drag a habitat or decoration, then lift to place it. Undo restores your previous layout.':'Tap to place the selected decoration. Switch to Move / Select to rearrange it.';
 const unvoiced=animals.filter(a=>!a.voiceId&&!a.defaultSound).length;
 return unvoiced?unvoiced+' animal'+(unvoiced===1?' needs':'s need')+' a voice. Tap a friend to name, record, feed or play. Microphone opens only with Record.':'Tap an animal to hear or change its voice. Try your saved voices in Animal Choir or Sound Guessing.';
}
export function airGuide({phase='play',input='touch',players=1,competition='solo',mode='classic',bombs=true}={}){
 if(phase==='paused'||phase==='tracking-paused')return 'Round paused. Fruit and scores wait for you.';
 if(phase==='results')return 'Round complete. Your records keep camera and touch results separate.';
 if(phase==='calibration'||phase==='ready')return input==='camera'?'Enable the webcam, lower then raise both arms. Only tracked moving hands slice.':'Camera stays off. Start when you have room to swipe.';
 if(phase==='countdown')return 'Get ready. Slicing begins after the countdown.';
 const controls=input==='camera'?'Swipe with your tracked hands; your body never scores.':input==='mouse-turns'?competition==='coop'?'Pass the mouse and select the next teammate.':'Take matching seeded turns with one mouse.':players===2?'Start a finger on your colored side; keep your color across the screen.':'Hold and drag through fruit to slice.';
 return controls+' '+(mode==='zen'?'Zen has no bombs or missed-fruit penalties.':'Slice several fruit in one swipe for combos.'+(bombs?' Avoid cartoon bombs.':' Bombs are off.'));
}
export function activityBadge(kind){return `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="3" y="3" width="58" height="58" rx="18" fill="#243d39" stroke="#9cbaa0" stroke-width="2"/>${kind==='zoo'?'<path d="M17 39Q10 25 18 18L28 25Q34 23 39 26L47 18Q54 29 47 40Q32 54 17 39Z" fill="#dfbe89"/><path d="M23 34h2m15 0h2M28 42q5 4 10-1" fill="none" stroke="#243d39" stroke-width="3" stroke-linecap="round"/>':'<path d="M32 22Q16 20 16 36Q16 51 32 49Q48 51 48 36Q48 20 32 22Z" fill="#d5a574"/><path d="M32 23q-2-13 10-10M12 49l39-34" fill="none" stroke="#d7eee2" stroke-width="4" stroke-linecap="round"/>'}</svg>`;}
