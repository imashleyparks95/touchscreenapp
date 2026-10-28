// Original gladiators, equipment and rules. Arena coordinates are logical pixels.
export const ATTRIBUTES={strength:'Physical damage and pushing power.',agility:'Walking, jumping and dodging.',attack:'Weapon accuracy and critical chances.',defence:'Avoiding damage and shield blocks.',vitality:'Maximum health.',charisma:'Taunts, crowd rewards and merchant discounts.',stamina:'Maximum energy and recovery.'};
export const SLOTS=['head','chest','shoulder','hands','legs','feet','shield'];
export const WEAPON_KINDS=[['dagger','Dagger',5,67,14,.12],['sword','Short Sword',8,83,7,.05],['longsword','Long Sword',10,108,0,.02],['broadsword','Broadsword',13,94,-4,.04],['axe','Axe',14,86,-6,.06],['battleaxe','Battle Axe',18,98,-10,.08],['club','Club',8,77,3,.18],['mace','Mace',12,85,0,.22],['hammer','War Hammer',17,89,-8,.32],['spear','Spear',10,139,-2,0]];
const colors=['#a29a80','#b5c7ce','#dab85a','#84bdc4','#cb9678','#b5a0d0','#f6d16a'];
export const ITEMS=[];for(let tier=1;tier<=7;tier++){
 for(const [kind,label,damage,reach,accuracy,push] of WEAPON_KINDS)ITEMS.push({id:`w-${kind}-${tier}`,slot:'weapon',kind,name:`${['Worn','Iron','Bronze','Tempered','Royal','Runic','Sunforged'][tier-1]} ${label}`,tier,level:tier*2-1,price:Math.round((35+damage*3)*tier**1.6),damage:damage+tier*4,reach,accuracy,push,color:colors[tier-1]});
 for(const [i,slot] of SLOTS.entries())ITEMS.push({id:`a-${slot}-${tier}`,slot,kind:slot,name:`${['Leather','Iron','Bronze','Tempered','Royal','Runic','Sunforged'][tier-1]} ${['Helm','Cuirass','Pauldrons','Gauntlets','Greaves','Boots','Shield'][i]}`,tier,level:tier*2-1,price:Math.round((45+i*5)*tier**1.65),armor:(slot==='chest'?12:slot==='shield'?8:5)*tier,block:slot==='shield'?6+tier*3:0,color:colors[tier-1]});
}
export const ITEM_BY_ID=Object.fromEntries(ITEMS.map(i=>[i.id,i]));
export const ACTIONS={
 forward:{label:'Walk In',icon:'➜',cost:3,duration:550},back:{label:'Walk Back',icon:'↶',cost:2,duration:550},jumpForward:{label:'Jump In',icon:'↗',cost:12,duration:720},jumpBack:{label:'Jump Back',icon:'↖',cost:12,duration:720},
 quick:{label:'Quick Slash',icon:'⚔',cost:5,accuracy:17,power:.65,duration:650},normal:{label:'Strike',icon:'⚔',cost:10,accuracy:0,power:1,duration:850},power:{label:'Power Blow',icon:'✹',cost:18,accuracy:-17,power:1.65,duration:1100},charge:{label:'Charge',icon:'➠',cost:22,accuracy:-8,power:1.15,duration:1000},shove:{label:'Shove',icon:'☞',cost:8,accuracy:7,power:0,duration:750},taunt:{label:'Taunt',icon:'❢',cost:7,accuracy:0,duration:850},defend:{label:'Defend',icon:'◈',cost:3,duration:650},rest:{label:'Rest',icon:'☾',cost:0,duration:850}
};
export const CHAMPIONS=[
 ['bramble','Bramble the Bold','The Orchard Cup','aggressive','club','sand','I polished my club. With my forehead.'],
 ['vespa','Vespa Quickstep','The Wind Cup','agile','dagger','dusk','Catch me first, celebrate later!'],
 ['bront','Bront Ironbelly','The Iron Cup','defensive','mace','stone','My armor has armor.'],
 ['marlo','Marlo the Magnificent','The Laurel Cup','charisma','longsword','royal','The crowd already knows my name!'],
 ['crag','Crag Cliffwalker','The Edge Cup','pusher','hammer','stone','Mind that last little step.'],
 ['solara','Solara Sunblade','The Sun Cup','balanced','spear','dusk','Patience burns brighter than fury.'],
 ['rex','Rex Thundercrest','The Imperial Cup','champion','battleaxe','royal','One arena. One last champion.']
].map((v,i)=>({id:v[0],name:v[1],cup:v[2],style:v[3],weapon:v[4],theme:v[5],intro:v[6],level:2+i*2,wins:2+i*2,tier:i+1,index:i,winLine:'The crowd calls for a rematch!',loseLine:'A worthy champion! The laurel is yours.'}));
export const GLADIATOR_DIFFICULTIES=['Easy','Normal','Hard'];
