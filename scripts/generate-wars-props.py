#!/usr/bin/env python3
"""Original low-poly Wobbly Wars props with independently articulated mesh parts."""
import math,struct,json,pathlib
OUT=pathlib.Path(__file__).resolve().parents[1]/'dist/assets/wars3d'
COLORS={'team':(.16,.44,.76,1),'wood':(.39,.22,.12,1),'steel':(.30,.42,.48,1),'gold':(.98,.69,.20,1),'skin':(.71,.43,.24,1),'mane':(.20,.12,.12,1),'white':(.98,.94,.79,1),'eyes':(.025,.035,.055,1),'dragon':(.28,.63,.46,1),'wing':(.57,.81,.44,1),'dark':(.10,.17,.18,1)}
G={};PARTS={'body':(0,0,0)};CURRENT='body'
def start():
 global G,PARTS,CURRENT
 G={};PARTS={'body':(0,0,0)};CURRENT='body'
def part(name,pivot=(0,0,0)):
 global CURRENT
 CURRENT=name;PARTS[name]=pivot
def tri(m,a,b,c):
 u=[b[i]-a[i] for i in range(3)];v=[c[i]-a[i] for i in range(3)];n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];l=math.sqrt(sum(x*x for x in n))
 if l<1e-9:return
 g=G.setdefault((CURRENT,m),{'p':[],'n':[]})
 for p in (a,b,c):g['p'].extend(p);g['n'].extend(x/l for x in n)
def loft(m,cx,cz,rings,sides=6,axis='y'):
 layers=[]
 for r in rings:
  y,rx,rz,*off=r;ox=off[0] if off else 0;oz=off[1] if len(off)>1 else 0
  layer=[]
  for k in range(sides):
   a=math.pi/6+k*math.tau/sides;p=(cx+ox+rx*math.cos(a),y,cz+oz+rz*math.sin(a))
   if axis=='z':p=(p[0],p[2],p[1])
   if axis=='x':p=(p[1],p[0],p[2])
   layer.append(p)
  layers.append(layer)
 for a,b in zip(layers,layers[1:]):
  for k in range(sides):j=(k+1)%sides;tri(m,a[k],b[k],a[j]);tri(m,a[j],b[k],b[j])
 for layer,top in [(layers[0],False),(layers[-1],True)]:
  center=tuple(sum(p[i] for p in layer)/sides for i in range(3))
  for k in range(sides):j=(k+1)%sides;tri(m,center,layer[k] if top else layer[j],layer[j] if top else layer[k])
def plate(m,pts,depth=.025):
 c=tuple(sum(p[i] for p in pts)/len(pts) for i in range(3));back=[(x,y,z-depth) for x,y,z in pts];cb=(c[0],c[1],c[2]-depth)
 for k,p in enumerate(pts):
  j=(k+1)%len(pts);tri(m,c,pts[j],p);tri(m,cb,back[k],back[j]);tri(m,p,pts[j],back[k]);tri(m,pts[j],back[j],back[k])
def eyes(y,z,x=.12):
 for sign in [-1,1]:
  a=sign*x;plate('white',[(a-.05,y+.045,z),(a+.05,y+.045,z),(a+.047,y-.045,z+.01),(a-.047,y-.045,z+.01)],.008)
  plate('eyes',[(a-.02,y+.03,z+.016),(a+.025,y+.03,z+.016),(a+.025,y-.032,z+.024),(a-.02,y-.032,z+.024)],.004)
def save(name):
 blob=bytearray();views=[];acc=[]
 def accessor(v):
  while len(blob)%4:blob.append(0)
  off=len(blob);blob.extend(struct.pack('<'+'f'*len(v),*v));views.append({'buffer':0,'byteOffset':off,'byteLength':len(blob)-off});acc.append({'bufferView':len(views)-1,'componentType':5126,'count':len(v)//3,'type':'VEC3','min':[min(v[i::3]) for i in range(3)],'max':[max(v[i::3]) for i in range(3)]});return len(acc)-1
 mats=[];mat_ids={};meshes=[];nodes=[{'name':name,'children':[]}]
 for pname,pivot in PARTS.items():
  prims=[]
  for (which,m),g in G.items():
   if which!=pname:continue
   if m not in mat_ids:
    mat_ids[m]=len(mats);mats.append({'name':m,'doubleSided':True,'pbrMetallicRoughness':{'baseColorFactor':COLORS[m],'metallicFactor':.45 if m in ['steel','gold'] else 0,'roughnessFactor':.77}})
   local=[v-pivot[i%3] for i,v in enumerate(g['p'])]
   prims.append({'attributes':{'POSITION':accessor(local),'NORMAL':accessor(g['n'])},'material':mat_ids[m]})
  if not prims:continue
  nodes[0]['children'].append(len(nodes));nodes.append({'name':pname,'mesh':len(meshes),'translation':pivot});meshes.append({'name':pname,'primitives':prims})
 gltf={'asset':{'version':'2.0','generator':'Little Big Arcade original custom low-poly prop art','copyright':'CC0-1.0'},'scene':0,'scenes':[{'nodes':[0]}],'nodes':nodes,'meshes':meshes,'materials':mats,'bufferViews':views,'accessors':acc,'buffers':[{'byteLength':len(blob)}],'extras':{'up':'+Y','forward':'+Z','units':'metres','animation':'Rotate leg parts around local X, wings around local Z and wheel parts around local X; geometry is translated into each named pivot frame.'}}
 js=json.dumps(gltf,separators=(',',':')).encode();js+=b' '*((-len(js))%4);blob+=b'\0'*((-len(blob))%4)
 b=struct.pack('<III',0x46546c67,2,28+len(js)+len(blob))+struct.pack('<II',len(js),0x4e4f534a)+js+struct.pack('<II',len(blob),0x004e4942)+blob
 triangles=sum(len(g['p'])//9 for g in G.values());assert triangles<=1000;assert all(math.isfinite(x) for g in G.values() for x in g['p']+g['n'])
 OUT.mkdir(parents=True,exist_ok=True);(OUT/(name+'.glb')).write_bytes(b)
 positions=[g['p'] for g in G.values()];bounds=[[min(v[i::3]) for i in range(3)] for v in positions];high=[[max(v[i::3]) for i in range(3)] for v in positions]
 print(name,len(b),'bytes',triangles,'triangles','bounds',([min(v[i] for v in bounds) for i in range(3)],[max(v[i] for v in high) for i in range(3)]))

# Pony: barrel-shaped chest, four stout boots, narrow curved neck, broad friendly muzzle.
start()
loft('skin',0,-.12,[(.48,.18,.42),(.62,.33,.62),(.82,.36,.66),(.98,.27,.52),(1.02,.17,.37)],8)
for x in [-.22,.22]:
 for z in [-.50,.32]:
  part('leg'+('F' if z>0 else 'B')+('L' if x<0 else 'R'),(x,.60,z))
  loft('skin',x,z,[(.14,.07,.075),(.42,.085,.082),(.67,.105,.11)],6)
  loft('mane',x,z+.015,[(.02,.09,.12),(.07,.105,.135),(.18,.085,.105)],6)
part('body')
loft('skin',0,.37,[(.72,.17,.18),(.95,.16,.19,0,.02),(1.14,.13,.15,0,.12),(1.30,.15,.18,0,.17)],6)
loft('skin',0,.65,[(1.12,.17,.22),(1.20,.21,.29),(1.34,.17,.24),(1.38,.10,.14)],8)
loft('mane',0,.79,[(1.10,.14,.13),(1.18,.175,.18),(1.23,.17,.17)],6)
for x in [-.115,.115]:
 loft('skin',x,.54,[(1.32,.055,.06),(1.44,.048,.035),(1.50,.013,.015)],5)
 plate('mane',[(x-.022,1.38,.58),(x,1.49,.58),(x+.025,1.38,.58)],.01)
eyes(1.29,.849,.11)
plate('white',[(-.04,1.18,.969),(.04,1.18,.969),(.05,1.13,.964),(-.05,1.13,.964)],.008)
loft('mane',0,-.64,[(.52,.07,.08,0,-.21),(.70,.075,.08,0,-.16),(.88,.04,.05)],6)
plate('mane',[(-.045,.94,.36),(0,1.33,.52),(.045,1.30,.52),(.055,.95,.36)],.07)
# Folded team blanket and saddle visibly distinguish cavalry from foot soldiers.
loft('team',0,-.14,[(.81,.37,.38),(.94,.35,.40),(1.01,.25,.31)],8)
loft('wood',0,-.12,[(.99,.18,.25),(1.05,.21,.24),(1.09,.19,.22)],6)
save('pony')

# Dragon: leaf-shaped wings, pointed tail, brow horns and playful nose.
start()
loft('dragon',0,-.12,[(.44,.19,.40),(.61,.32,.62),(.84,.34,.65),(.99,.22,.48)],8)
for x in [-.23,.23]:
 for z in [-.49,.32]:
  part('leg'+('F' if z>0 else 'B')+('L' if x<0 else 'R'),(x,.60,z))
  loft('dragon',x,z,[(.08,.10,.13),(.19,.12,.13),(.53,.09,.10),(.66,.12,.12)],5)
  for dx in [-.045,.045]:
   plate('white',[(x+dx-.021,.10,z+.10),(x+dx,.06,z+.20),(x+dx+.021,.10,z+.10)],.018)
part('body')
loft('dragon',0,.37,[(.70,.16,.21),(.94,.17,.20,0,.06),(1.18,.16,.18,0,.15)],6)
loft('dragon',0,.65,[(1.00,.16,.25),(1.10,.24,.32),(1.26,.20,.27),(1.34,.12,.18)],8)
loft('wing',0,.77,[(1.005,.14,.16),(1.07,.195,.24),(1.13,.18,.20)],6)
eyes(1.23,.89,.115)
for x in [-.14,.14]:
 loft('gold',x,.49,[(1.27,.052,.05),(1.45,.013,.015)],5)
 plate('dark',[(x-.03,1.11,.993),(x+.03,1.11,.993),(x+.025,1.085,.996),(x-.025,1.085,.996)],.006)
plate('dark',[(-.11,1.055,.997),(0,1.025,1.014),(.11,1.055,.997),(.06,1.017,1.010),(-.06,1.017,1.010)],.006)
for sign in [-1,1]:
 part('wingL' if sign<0 else 'wingR',(sign*.19,.87,-.20))
 pts=[(sign*.19,.87,-.20),(sign*.37,1.14,-.28),(sign*.69,1.36,-.34),(sign*.63,.93,-.10),(sign*.69,.78,.18),(sign*.40,.83,.14),(sign*.22,.75,.10)]
 plate('wing',pts,.025)
 for a,b in [(pts[0],pts[2]),(pts[0],pts[4])]:
  tri('dragon',(a[0]-.025,a[1],a[2]+.02),(a[0]+.025,a[1],a[2]+.02),b)
part('body')
loft('dragon',0,-.65,[(.39,.025,.025,0,-.46),(.53,.06,.08,0,-.29),(.71,.10,.15,0,-.08),(.82,.11,.15)],6)
for y,z in [(.92,-.61),(.96,-.36),(1.02,-.11),(1.11,.22)]:
 plate('gold',[(-.03,y,z),(0,y+.13,z-.04),(.03,y,z)],.07)
loft('team',0,-.12,[(.82,.35,.36),(.98,.25,.33),(1.025,.18,.25)],8)
loft('wood',0,-.13,[(1.02,.16,.22),(1.08,.18,.23)],6)
save('dragon')

# Cannon: broad carriage, eight-spoke wheels, brass-rimmed sculpted barrel and dark bore.
start()
loft('wood',0,-.07,[(.18,.30,.43),(.30,.35,.47),(.51,.28,.40),(.63,.23,.34)],6)
for x in [-.43,.43]:
 part('wheelL' if x<0 else 'wheelR',(x,.325,-.18))
 loft('wood',.30,-.18,[(x-.065,.28,.28),(x-.04,.32,.32),(x+.04,.32,.32),(x+.065,.28,.28)],10,axis='x')
 loft('steel',.30,-.18,[(x-.07,.283,.283),(x-.045,.326,.326),(x+.045,.326,.326),(x+.07,.283,.283)],10,axis='x')
 loft('gold',.30,-.18,[(x-.077,.075,.075),(x+.077,.075,.075)],8,axis='x')
 # Raised wooden spokes over the outward wheel face.
 for k in range(6):
  a=k*math.tau/6;xx=x+(.079 if x>0 else -.079)
  p=(xx,.30+math.cos(a)*.26,-.18+math.sin(a)*.26)
  tri('wood',(xx,.30,-.18),(xx,.30+math.cos(a+.16)*.26,-.18+math.sin(a+.16)*.26),p)
part('body')
# Axis-z loft maps cx/x and cz/y: cannon firing line y=.76.
loft('steel',0,.76,[(-.53,.14,.14),(-.43,.22,.22),(-.12,.23,.23),(.39,.18,.18),(.61,.21,.21),(.69,.205,.205)],10,axis='z')
loft('gold',0,.76,[(-.18,.235,.235),(-.11,.235,.235)],10,axis='z')
loft('gold',0,.76,[(.59,.221,.221),(.70,.221,.221)],10,axis='z')
loft('dark',0,.76,[(.704,.155,.155),(.708,.155,.155)],10,axis='z')
loft('team',0,-.08,[(.35,.36,.32),(.44,.35,.34)],6)
plate('gold',[(-.07,.45,.30),(0,.52,.30),(.07,.45,.30),(0,.38,.30)],.018)
loft('dark',0,-.38,[(.53,.035,.035),(.69,.023,.025),(1.02,.015,.02,0,-.08)],5)
for g in G.values():
 for i in range(1,len(g['p']),3):g['p'][i]+=.025
save('cannon')
