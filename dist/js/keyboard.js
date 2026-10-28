const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function editName(value,key,max=60){
  if(key==='clear')return '';
  if(key==='backspace')return Array.from(value).slice(0,-1).join('');
  return (value+(key==='space'?' ':key)).slice(0,max);
}
// A shared keyboard: callbacks complete before the dialog closes, so errors never lose a name.
export function nameKeyboard(modal,{title,value='',description='',saveLabel='SAVE PROJECT',onSave,onError}){
  return modal(`<div class="touch-naming"><span class="eyebrow">MAKE IT YOURS</span><h2>${esc(title)}</h2><p>${esc(description)}</p><label>Project name<input id="touchName" value="${esc(value)}" maxlength="60" inputmode="none" autocomplete="off"></label><div class="touch-keyboard">${['1234567890','QWERTYUIOP','ASDFGHJKL','ZXCVBNM'].map(row=>`<div class="key-row">${Array.from(row).map(k=>`<button type="button" class="touch-key" data-key="${k}" aria-label="Type ${k}">${k}</button>`).join('')}</div>`).join('')}<div class="key-row key-utilities"><button class="touch-key" data-key="space">SPACE</button><button class="touch-key" data-key="backspace">⌫ BACKSPACE</button><button class="touch-key" data-key="clear">CLEAR</button></div></div><p id="nameError" role="status"></p><div class="modal-actions"><button class="btn secondary" id="cancelName">CANCEL</button><button class="btn primary" id="commitName">${esc(saveLabel)}</button></div></div>`,d=>{
    d.classList.add('keyboard-dialog');d.addEventListener('close',()=>d.classList.remove('keyboard-dialog'),{once:true});
    const input=d.querySelector('#touchName'),save=d.querySelector('#commitName'),close=d.querySelector('.modal-close');let busy=false;d.addEventListener('cancel',e=>{if(busy)e.preventDefault();});
    d.querySelectorAll('[data-key]').forEach(button=>button.onclick=()=>{
      if(busy)return;const key=button.dataset.key;
      if(key==='clear')input.value='';
      else {const start=input.selectionStart??input.value.length,end=input.selectionEnd??start;
        if(key==='backspace'&&start===end){const left=editName(input.value.slice(0,start),'backspace');input.value=left+input.value.slice(end);input.setSelectionRange(left.length,left.length);}
        else {const insert=key==='backspace'?'':key==='space'?' ':key;
          input.value=(input.value.slice(0,start)+insert+input.value.slice(end)).slice(0,60);input.setSelectionRange(Math.min(60,start+insert.length),Math.min(60,start+insert.length));}}
      input.focus({preventScroll:true});
    });
    d.querySelector('#cancelName').onclick=()=>{if(!busy)d.close();};
    save.onclick=async()=>{const name=input.value.trim();if(!name||busy){if(!name)d.querySelector('#nameError').textContent='Give your creation a name first.';return;}busy=true;save.disabled=true;if(close)close.disabled=true;d.querySelector('#nameError').textContent='Saving…';try{await onSave(name);if(d.open)d.close();}catch(e){d.querySelector('#nameError').textContent=e.message||'Could not save. Please try again.';onError?.(e);}finally{busy=false;save.disabled=false;if(close)close.disabled=false;}};
    input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();save.click();}});
    input.focus({preventScroll:true});input.setSelectionRange(input.value.length,input.value.length);
  });
}
