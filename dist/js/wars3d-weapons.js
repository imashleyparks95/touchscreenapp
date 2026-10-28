// Canonical geometry: handles/blades +Y, bow upright +Y/shoots +Z, gun barrel +Z.
// Positions are metres at unit scale. Mesh origins are authored at the grip pivot.
const grip=(rotation=[Math.PI/2,0,0])=>({position:[0,0,0],rotation,pivot:[0,0,0],scale:1});
const weapon=(shape,animation,length,extra={})=>({shape,animation,length,socket:'right',grip:grip(),hitBase:[0,.12,0],tip:[0,length,0],muzzle:[0,length,0],...extra});
export const WAR_WEAPONS=Object.freeze({
 club:weapon('club','heavy',1.2,{twoHanded:true,support:[0,-.16,0]}),
 guard:weapon('sword','swing',1.18,{shield:{socket:'left',position:[0,0,.09],rotation:[.8,0,0],pivot:[0,0,0]}}),
 spear:weapon('spear','thrust',2.05,{twoHanded:true,support:[0,.21,0]}),
 archer:weapon('bow','bow',.6,{socket:'left',drawLength:.48,grip:grip([.6,0,0]),muzzle:[0,0,.35],tip:[0,.6,0]}),
 slinger:weapon('sling','sling',.55),
 knight:weapon('sword','heavy',1.28,{twoHanded:true,support:[0,-.16,0]}),
 giant:weapon('hammer','heavy',1.5,{twoHanded:true,support:[0,-.16,0]}),
 scout:weapon('dagger','swing',.86),
 lancer:weapon('lance','thrust',2.15),
 cannon:weapon('ramrod','crew',1.05,{emitter:'cannon'}),
 healer:weapon('staff','cast',1.3),
 banner:weapon('banner','heavy',1.45,{twoHanded:true,support:[0,-.16,0]}),
 wizard:weapon('staff','cast',1.4),
 ice:weapon('staff','cast',1.3),
 fire:weapon('staff','cast',1.35),
 golem:weapon('stone-hammer','heavy',1.4,{twoHanded:true,support:[0,-.16,0]}),
 dragon:weapon('reins','reins',.3,{emitter:'dragon',twoHanded:true,support:[-.3,0,0]}),
 trickster:weapon('wand','cast',.92),
 slime:weapon('club','swing',1.0),
 robot:weapon('gun','gun',.55,{twoHanded:true,support:[-.15,-.03,.04],grip:grip([.5,0,0]),muzzle:[0,.12,.56],tip:[0,.12,.56]}),
 axe:weapon('axe','heavy',1.22,{twoHanded:true,support:[0,-.16,0]})
});
export const warWeaponKind=u=>({archer:'arrow',slinger:'stone',cannon:'shell',wizard:'magic',ice:'ice',fire:'fire',dragon:'flame',trickster:'magic',robot:'pulse',healer:'heal'}[u.type]||'melee');
export const SOLDIER_SOCKETS=Object.freeze({right:{bone:'handR',position:[0,-.05,.015]},left:{bone:'handL',position:[0,-.05,.015]}});
export const DEFEAT_TIMING=Object.freeze({kneel:1.1,fadeStart:1.4,remove:4.8});
export function defeatOpacity(age){return Math.max(0,Math.min(1,1-(age-DEFEAT_TIMING.fadeStart)/(DEFEAT_TIMING.remove-DEFEAT_TIMING.fadeStart)));}
