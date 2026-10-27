#!/usr/bin/env python3
"""Original deterministic CC0 forest ruins. Python 3 + numpy + Pillow.
Run: python generate_ruins.py --textures ../limit-assets-environment/boulder_01/textures
"""
from pathlib import Path
import argparse,math,json,struct,io,hashlib
import numpy as np
from PIL import Image
P=argparse.ArgumentParser();P.add_argument('--textures',type=Path,default=Path(__file__).parent/'textures');P.add_argument('--out',type=Path,default=Path(__file__).parent);args=P.parse_args();args.out.mkdir(exist_ok=True,parents=True)
RNG=np.random.default_rng(42917)
class Mesh:
 def __init__(self,name,mat):self.name=name;self.mat=mat;self.p=[];self.n=[];self.uv=[]
 def face(self,pts,expected=None):
  pts=np.asarray(pts,dtype=float)
  n=np.cross(pts[1]-pts[0],pts[2]-pts[0]);n/=max(1e-10,np.linalg.norm(n))
  if expected is not None and np.dot(n,expected)<0:pts=pts[::-1];n=-n
  axis=int(np.argmax(abs(n)));axes=[a for a in range(3) if a!=axis]
  for k in range(1,len(pts)-1):
   for q in [pts[0],pts[k],pts[k+1]]:self.p.append(q.tolist());self.n.append(n.tolist());self.uv.append((q[axes]*.8).tolist())
 def tri(self,pts,expected=None):self.face(pts,expected)

def polygon_area(p):return .5*sum(np.cross(p[(i+1)%len(p)],p[i]) for i in range(len(p)))
def ccw(p):
 p=np.array(p,dtype=float)
 if sum(p[i,0]*p[(i+1)%len(p),1]-p[i,1]*p[(i+1)%len(p),0] for i in range(len(p)))<0:p=p[::-1]
 return p

def inset(p,dist):
 out=[]
 for i in range(len(p)):
  prev=p[i]-p[i-1];nxt=p[(i+1)%len(p)]-p[i];prev/=np.linalg.norm(prev);nxt/=np.linalg.norm(nxt)
  a=p[i]+dist*np.array([-prev[1],prev[0]]);b=p[i]+dist*np.array([-nxt[1],nxt[0]])
  mat=np.column_stack([prev,-nxt]);t=np.linalg.solve(mat,b-a)[0];out.append(a+t*prev)
 return np.array(out)
def cross(a,b):return float(a[0]*b[1]-a[1]*b[0])
def triangulate(poly):
 ids=list(range(len(poly)));out=[]
 while len(ids)>3:
  found=False
  for k,j in enumerate(ids):
   a,b,c=poly[ids[k-1]],poly[j],poly[ids[(k+1)%len(ids)]]
   if cross(b-a,c-b)<=1e-10:continue
   def inside(p):return cross(b-a,p-a)>=-1e-9 and cross(c-b,p-b)>=-1e-9 and cross(a-c,p-c)>=-1e-9
   if any(inside(poly[v]) for v in ids if v not in [ids[k-1],j,ids[(k+1)%len(ids)]]):continue
   out.append([ids[k-1],j,ids[(k+1)%len(ids)]]);ids.pop(k);found=True;break
  if not found:raise ValueError('Invalid polygon')
 out.append(ids);return out

def prism(m,poly,depth,bevel=.035,z=0,transform=None):
 p=ccw(poly);b=min(bevel,depth*.25);pin=inset(p,b) if b>1e-7 else p.copy()
 rings=[np.column_stack([pin,np.full(len(p),z+depth/2)]),np.column_stack([p,np.full(len(p),z+depth/2-b)]),np.column_stack([p,np.full(len(p),z-depth/2+b)]),np.column_stack([pin,np.full(len(p),z-depth/2)])]
 trans=lambda a:np.asarray([transform(q) for q in a]) if transform else a
 ntrans=lambda n:np.array(transform(n))-np.array(transform(np.zeros(3))) if transform else n
 for face in triangulate(pin):
  m.tri(trans(rings[0][face]),ntrans([0,0,1]));m.tri(trans(rings[3][face]),ntrans([0,0,-1]))
 for ring in ([1] if b<1e-7 else range(3)):
  for i in range(len(p)):
   j=(i+1)%len(p);e=p[j]-p[i];n=np.array([e[1],-e[0],0.]);n/=np.linalg.norm(n)
   if ring==0:n[2]=1
   if ring==2:n[2]=-1
   m.face(trans([rings[ring][i],rings[ring][j],rings[ring+1][j],rings[ring+1][i]]),ntrans(n))

def box(m,c,d,bevel=.035,tilt=0):
 c=np.array(c);x,y,z=np.array(d)/2;p=[[-x,-y],[x,-y],[x,y],[-x,y]]
 def f(q):
  q=np.array(q);q[1]+=tilt*q[0];return q+c
 prism(m,p,2*z,bevel,transform=f)

def loft(m,c,profile,n=8,phase=math.pi/8,rough=0):
 c=np.array(c);rings=[]
 for k,(y,r) in enumerate(profile):
  rings.append(np.array([[r*(1+rough*math.sin(i*9.3+k*1.7))*math.cos(i*2*math.pi/n+phase),y,r*(1+rough*math.sin(i*9.3+k*1.7))*math.sin(i*2*math.pi/n+phase)] for i in range(n)])+c)
 for k in range(len(rings)-1):
  for i in range(n):
   j=(i+1)%n;q=[rings[k][i],rings[k][j],rings[k+1][j],rings[k+1][i]];expect=np.mean(q,axis=0)-c;expect[1]=0;m.face(q,expect)
 for k,sgn in [(0,-1),(-1,1)]:
  center=np.mean(rings[k],axis=0)
  for i in range(n):m.tri([center,rings[k][i],rings[k][(i+1)%n]],[0,sgn,0])

def beam(m,a,b,width,depth=None,bevel=.025):
 a,b=np.array(a),np.array(b);axis=b-a;L=np.linalg.norm(axis);axis/=L
 right=np.cross(axis,[0,0,1])
 if np.linalg.norm(right)<.01:right=np.cross(axis,[0,1,0])
 right/=np.linalg.norm(right);side=np.cross(right,axis);center=(a+b)/2
 x=width/2;y=L/2;poly=[[-x,-y],[x,-y],[x,y],[-x,y]]
 prism(m,poly,depth or width,bevel,transform=lambda q:center+right*q[0]+axis*q[1]+side*q[2])

def moss_patch(m,c,r,seed=0):
 # Custom uneven flat cushion loft with scalloped skirt.
 loft(m,c,[(0,r*.86),(.018,r),(.045,r*.82),(.05,r*.45)],7,phase=seed,rough=.14)

def rune(m,c,s,kind=0,orient='front'):
 # Raised angular continuous sigil, not an image decal.
 x,y,z=c
 paths=[[(0,-.65),(-.35,-.1),(0,.45),(.35,-.1),(0,-.65)],[(0,.45),(0,.88)],[(-.35,-.1),(-.57,.08)],[(.35,-.1),(.57,.08)]]
 if kind%2:paths+=[[(-.28,.5),(0,.72),(.28,.5)]]
 for path in paths:
  for a,b in zip(path,path[1:]):
   if orient=='front':beam(m,[x+a[0]*s,y+a[1]*s,z],[x+b[0]*s,y+b[1]*s,z],s*.095,s*.07,0)
   else:beam(m,[x+a[0]*s,y,z+a[1]*s],[x+b[0]*s,y,z+b[1]*s],s*.095,s*.07,0)

def build_arch():
 stone=Mesh('weathered_arch_stone',0);gold=Mesh('carved_gold_inlay',1);moss=Mesh('moss_patina',2);glow=Mesh('glow_runes',3)
 for sign in [-1,1]:
  x=sign*1.82
  box(stone,[sign*1.91,.11,0],[.79,.22,.89],.065)
  box(stone,[x,.285,0],[.68,.15,.72],.035)
  for k in range(5):
   y=.36+k*.299+.144;dx=.6+RNG.uniform(-.025,.025);dz=.58+RNG.uniform(-.03,.04)
   box(stone,[x+RNG.uniform(-.012,.012),y,RNG.uniform(-.018,.018)],[dx,.285,dz],.035,tilt=RNG.uniform(-.02,.02))
  box(stone,[x,1.93,0],[.78,.18,.74],.045)
  # inset plaques, beveled diamond backing and rune.
  poly=[[-.22,0],[0,-.33],[.22,0],[0,.33]]
  prism(gold,poly,.04,.015,z=.325,transform=lambda q,x=x:np.array(q)+[x,1.20,0])
  prism(stone,np.array(poly)*.81,.055,.012,z=.35,transform=lambda q,x=x:np.array(q)+[x,1.20,0])
  rune(glow,[x,1.2,.391],.24,kind=1)
  # Vertical teal fluting at base of capital.
  for dx in [-.18,0,.18]:box(gold,[x+dx,1.78,.318],[.024,.18,.032],.005)
  for z in [-.23,.17]:moss_patch(moss,[x+.08,2.025,z],.23,seed=sign+z)
 # Original curved extruded voussoirs, each distinct rather than a torus primitive.
 for k in range(11):
  a0=k*math.pi/11+.012;a1=(k+1)*math.pi/11-.012
  angles=np.linspace(a0,a1,4);ri=1.50+RNG.uniform(-.008,.008);ro=2.045+RNG.uniform(-.018,.018)
  poly=[[ro*math.cos(a),1.96+ro*math.sin(a)] for a in angles]+[[ri*math.cos(a),1.96+ri*math.sin(a)] for a in angles[::-1]]
  prism(stone,poly,.64+RNG.uniform(-.04,.04),.033,z=RNG.uniform(-.012,.012))
  # Narrow bronze lip follows both sides of the curved arch.
  for rad in [1.57,1.99]:
   lip=[[rad*math.cos(a),1.96+rad*math.sin(a)] for a in angles]+[[(rad-.026)*math.cos(a),1.96+(rad-.026)*math.sin(a)] for a in angles[::-1]]
   prism(gold,lip,.024,0,z=.346)
  if k in [1,3,5,7,9]:
   angle=(a0+a1)/2;cx=1.78*math.cos(angle);cy=1.96+1.78*math.sin(angle)
   rune(glow,[cx,cy,.373],.13,kind=k)
  if k in [2,4,5,6,8]:
   angle=(a0+a1)/2;moss_patch(moss,[2.05*math.cos(angle),1.96+2.05*math.sin(angle),-.10],.19,seed=k)
 # Crown keystone rises slightly, carved silhouette.
 poly=[[-.19,3.72],[-.13,4.10],[0,4.18],[.13,4.10],[.19,3.72],[0,3.65]]
 prism(stone,poly,.76,.035);rune(glow,[0,3.94,.405],.19,1)
 return [stone,gold,moss,glow]

def build_beacon():
 stone=Mesh('carved_lantern_plinth',0);gold=Mesh('lantern_bronze_inlay',1);moss=Mesh('moss_patina',2);glow=Mesh('glow_lantern_heart',3)
 loft(stone,[0,0,0],[(0,.51),(.045,.57),(.17,.57),(.23,.47)],8)
 loft(stone,[0,0,0],[(.22,.43),(.28,.41),(.34,.35),(.57,.28),(.72,.30),(.79,.41),(.86,.43),(.92,.38)],8,rough=.013)
 loft(gold,[0,0,0],[(.285,.417),(.309,.417)],8)
 loft(gold,[0,0,0],[(.815,.435),(.837,.435)],8)
 loft(stone,[0,0,0],[(.9,.40),(.955,.45),(1.005,.43)],8)
 # Four slender bespoke angled cage ribs around the luminous crystal.
 for k in range(4):
  a=k*math.pi/2+math.pi/4;ux,uz=math.cos(a),math.sin(a)
  beam(gold,[ux*.32,.98,uz*.32],[ux*.25,1.16,uz*.25],.045,bevel=.009)
  beam(gold,[ux*.25,1.16,uz*.25],[ux*.09,1.28,uz*.09],.045,bevel=.009)
 loft(glow,[0,0,0],[(.99,.04),(1.055,.15),(1.20,.14),(1.30,.0)],6,phase=math.pi/6)
 rune(glow,[0,.56,.321],.16,1)
 # Engraved gold quatrefoil front panel with inset stone center.
 poly=[[-.16,-.16],[.16,-.16],[.20,0],[.16,.16],[-.16,.16],[-.2,0]]
 prism(gold,poly,.026,.009,z=.32,transform=lambda q:np.array(q)+[0,.55,0])
 prism(stone,np.array(poly)*.82,.028,.008,z=.338,transform=lambda q:np.array(q)+[0,.55,0])
 rune(glow,[0,.55,.361],.145,0)
 for k in range(4):
  a=k*1.7;moss_patch(moss,[.31*math.cos(a),.23,.31*math.sin(a)],.12,k)
 return [stone,gold,moss,glow]

def build_bridge():
 stone=Mesh('weathered_bridge_abutments',0);gold=Mesh('bridge_bronze_fastenings',1);moss=Mesh('moss_patina',2);glow=Mesh('glow_bridge_runes',3);wood=Mesh('hewn_timber_planks',4)
 # Clear span 3.3m, total handrail reach 3.5m; deck surface y=.15.
 for end in [-1,1]:
  for sign in [-1,1]:
   x=sign*1.18;z=end*1.57
   box(stone,[x,-.10,z],[.42,.35,.45],.055)
   loft(stone,[x,0,z],[(.075,.20),(.13,.24),(.27,.22),(.32,.17),(.96,.17),(1.03,.23),(1.11,.24),(1.16,.17)],4,phase=math.pi/4,rough=.025)
   loft(gold,[x,0,z],[(.33,.179),(.355,.179)],4,phase=math.pi/4)
   rune(glow,[x,.76,z+end*.18],.115,1)
   moss_patch(moss,[x+.04,1.165,z-.05],.14,sign+end)
 # Long hewn beams under deck and narrow fascia; asymmetric bevels/tilts.
 for x in [-.94,.94]:beam(wood,[x,-.055,-1.66],[x,-.055,1.66],.20,.23,.035)
 for k in range(11):
  z=-1.5+k*.30;box(wood,[RNG.uniform(-.013,.013),.087,z],[2.6+RNG.uniform(-.025,.025),.12,.286],.018,tilt=RNG.uniform(-.004,.004))
  for x in [-1.02,1.02]:loft(gold,[x,.15,z],[(0,.021),(.008,.021)],6)
 for sign in [-1,1]:
  x=sign*1.18
  # Rail is lofted as a rising sequence of hewn timber segments.
  for za,zb in [(-1.50,-.75),(-.75,0),(0,.75),(.75,1.50)]:
   ya=.92+.045*(1-abs(za)/1.5);yb=.92+.045*(1-abs(zb)/1.5)
   beam(wood,[x,ya,za],[x,yb,zb],.105,.13,.018)
  beam(wood,[x,.39,-1.49],[x,.39,1.49],.085,.11,.014)
  for z in [-.75,0,.75]:beam(wood,[x,.34,z],[x,.91,z],.075,.09,.012)
  # Diagonal half-lap braces create crafted rail silhouettes.
  for za,zb in [(-1.42,-.07),(.07,1.42)]:
   beam(wood,[x,.41,za],[x,.86,zb],.068,.08,.01)
  for z in [-1.32,1.32]:
   for j in range(2):box(gold,[x+sign*.064,.93+j*.035,z],[.015,.025,.17],.003)
 return [stone,gold,moss,glow,wood]

# Original procedural woodgrain texture, no external content.
N=512;yy,xx=np.mgrid[:N,:N];noise=RNG.normal(0,1,(N,N));grain=np.sin(xx*.16+3*np.sin(yy*.012)+.75*np.sin(xx*.04+yy*.018));fine=np.sin(xx*.63+np.sin(yy*.04))*2
v=grain*8+fine+noise*2;wood=np.stack([103+v,70+v*.7,39+v*.45],axis=-1);wood=np.clip(wood,0,255).astype(np.uint8);bio=io.BytesIO();Image.fromarray(wood).save(bio,'PNG');woodbytes=bio.getvalue();(args.out/'original_woodgrain.png').write_bytes(woodbytes)
materials=[
 {'name':'weathered_stone_PolyHaven_CC0','pbrMetallicRoughness':{'baseColorFactor':[.68,.76,.68,1],'baseColorTexture':{'index':0},'metallicRoughnessTexture':{'index':2},'metallicFactor':0,'roughnessFactor':1},'normalTexture':{'index':1,'scale':.5},'occlusionTexture':{'index':2,'strength':.55}},
 {'name':'aged_gold_bronze','pbrMetallicRoughness':{'baseColorFactor':[.46,.28,.075,1],'metallicFactor':.7,'roughnessFactor':.48}},
 {'name':'moss_olive_patina','pbrMetallicRoughness':{'baseColorFactor':[.12,.24,.075,1],'metallicFactor':0,'roughnessFactor':1}},
 {'name':'glow_teal_rune_insets','pbrMetallicRoughness':{'baseColorFactor':[.08,.62,.46,1],'metallicFactor':.15,'roughnessFactor':.3},'emissiveFactor':[.04,.72,.47]},
 {'name':'original_hewn_wood_CC0','pbrMetallicRoughness':{'baseColorTexture':{'index':3},'baseColorFactor':[.85,.83,.76,1],'roughnessFactor':.88,'metallicFactor':0}}
]
textures=[args.textures/'boulder_01_diff_1k.jpg',args.textures/'boulder_01_nor_gl_1k.jpg',args.textures/'boulder_01_arm_1k.jpg']
for p in textures:
 if not p.exists():raise FileNotFoundError(p)
sourcebytes=[p.read_bytes() for p in textures]+[woodbytes]
manifest=[]
def save(name,meshes,description):
 d={'asset':{'version':'2.0','generator':'Original Forest Ruins deterministic generator 1.0','copyright':'Original geometry and woodgrain dedicated to CC0-1.0; embedded stone textures by Rico Cilliers / Poly Haven CC0-1.0'},'scene':0,'scenes':[{'nodes':[0]}],'nodes':[{'name':name,'children':list(range(1,len(meshes)+1))}],'meshes':[],'materials':materials,'accessors':[],'bufferViews':[],'textures':[{'sampler':0,'source':i} for i in range(4)],'samplers':[{'wrapS':10497,'wrapT':10497,'magFilter':9729,'minFilter':9987}],'images':[],'buffers':[],'extras':{'license':'CC0-1.0','description':description,'meters':True,'seed':42917}}
 binary=bytearray()
 def append(data,target=None):
  while len(binary)%4:binary.append(0)
  v={'buffer':0,'byteOffset':len(binary),'byteLength':len(data)}
  if target:v['target']=target
  vi=len(d['bufferViews']);d['bufferViews'].append(v);binary.extend(data);return vi
 total=0
 for m in meshes:
  pi=[]
  for arr,typ in [(m.p,'VEC3'),(m.n,'VEC3'),(m.uv,'VEC2')]:
   a=np.asarray(arr,dtype='<f4');v=append(a.tobytes(),34962);ac={'bufferView':v,'componentType':5126,'count':len(a),'type':typ}
   if len(pi)==0:ac.update(min=a.min(axis=0).tolist(),max=a.max(axis=0).tolist())
   pi.append(len(d['accessors']));d['accessors'].append(ac)
  mi=len(d['meshes']);d['meshes'].append({'name':m.name,'primitives':[{'attributes':dict(zip(['POSITION','NORMAL','TEXCOORD_0'],pi)),'material':m.mat,'mode':4}]});d['nodes'].append({'name':'glow' if m.mat==3 else m.name,'mesh':mi});total+=len(m.p)//3
 for i,content in enumerate(sourcebytes):d['images'].append({'name':['stone_diffuse','stone_normal','stone_ARM','original_woodgrain'][i],'bufferView':append(content),'mimeType':'image/jpeg' if i<3 else 'image/png'})
 d['buffers']=[{'byteLength':len(binary)}];j=json.dumps(d,separators=(',',':')).encode()
 while len(j)%4:j+=b' '
 while len(binary)%4:binary.append(0)
 content=struct.pack('<III',0x46546c67,2,28+len(j)+len(binary))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(binary),0x004e4942)+binary
 p=args.out/(name+'.glb');p.write_bytes(content);bounds=np.array([v for m in meshes for v in m.p]);record={'file':p.name,'triangles':total,'bytes':len(content),'boundsMin':bounds.min(axis=0).round(4).tolist(),'boundsMax':bounds.max(axis=0).round(4).tolist(),'license':'CC0-1.0','sha256':hashlib.sha256(content).hexdigest(),'description':description};manifest.append(record);print(record)
 # Simple geometry export for preview, no dependency on a 3D engine.
 (args.out/(name+'.preview.json')).write_text(json.dumps([{'material':m.mat,'positions':m.p,'uv':m.uv,'normals':m.n} for m in meshes],separators=(',',':')))
save('forest_ruin_gate',build_arch(),'Original segmented weathered stone arch; clear opening approximately 3m, height 4.18m, gold lip carvings and teal rune insets.')
save('forest_beacon_plinth',build_beacon(),'Original 1.3m carved octagonal stone lantern plinth with bronze cage and emissive teal heart.')
save('forest_trail_bridge',build_bridge(),'Original hewn timber and carved stone bridge; 3.3m deck span, 2.6m width; deck top approximately y=0.15m.')
(args.out/'manifest.json').write_text(json.dumps({'generator':'generate_ruins.py','license':'CC0-1.0','models':manifest,'stoneTextureSource':'https://polyhaven.com/a/boulder_01','stoneTextureLicense':'https://polyhaven.com/license','seed':42917},indent=2))
