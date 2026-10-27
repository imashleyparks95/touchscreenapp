"""Bundle verified CC0 imports, retain used clips and expose texture sources for CPU fallback.
Input directories are explicit; no network or runtime downloads. GLBs remain self-contained.
"""
import json,struct,hashlib,io,shutil,argparse
from pathlib import Path
from PIL import Image
parser=argparse.ArgumentParser(description=__doc__)
for flag in ['hero-root','environment','tree-lod','ruins']:parser.add_argument('--'+flag,type=Path,required=True)
parser.add_argument('--out',type=Path,default=Path('dist/assets/limit'))
args=parser.parse_args()
ROOT=args.out; MODELS=ROOT/'models'; TEX=ROOT/'textures'
MODELS.mkdir(parents=True,exist_ok=True); TEX.mkdir(parents=True,exist_ok=True)
hero=args.hero_root
env=args.environment
CLIPS={'Idle','Walking_A','Running_A','Jump_Start','Jump_Idle','Jump_Land','Interact','PickUp','Cheer','Dodge_Forward','1H_Melee_Attack_Slice_Horizontal','Spellcast_Shoot','Hit_A','Death_A'}
manifest={'version':1,'models':{},'surfaces':{},'licenses':['KAYKIT-LICENSE.txt','SOURCES_AND_LICENSES.md','ORIGINAL-ASSETS-LICENSE.txt']}
def texture(data,mime):
 im=Image.open(io.BytesIO(data)); alpha=im.mode in ('RGBA','LA') and im.getextrema()[-1][0]<255
 out=io.BytesIO()
 if alpha: im.convert('RGBA').save(out,format='PNG',optimize=True);ext='png'
 else:im.convert('RGB').save(out,format='JPEG',quality=92,optimize=True);ext='jpg'
 content=out.getvalue();name=hashlib.sha256(content).hexdigest()[:16]+'.'+ext
 (TEX/name).write_bytes(content)
 return name,content,'image/png' if alpha else 'image/jpeg',im.size

def bundle(path,key,character=False):
 f=path.read_bytes();n=struct.unpack_from('<I',f,12)[0];g=json.loads(f[20:20+n]);binary=f[28+n:]
 if character:g['animations']=[a for a in g.get('animations',[]) if a.get('name') in CLIPS]
 # Strip unused accessors/buffer views after animation trimming, retaining stable node indices.
 used=set()
 for mesh in g.get('meshes',[]):
  for p in mesh['primitives']:
   used.update(p['attributes'].values())
   if 'indices'in p:used.add(p['indices'])
   for t in p.get('targets',[]):used.update(t.values())
 for s in g.get('skins',[]):
  if 'inverseBindMatrices'in s:used.add(s['inverseBindMatrices'])
 for a in g.get('animations',[]):
  for s in a['samplers']:used.update([s['input'],s['output']])
 remap={old:i for i,old in enumerate(sorted(used))};g['accessors']=[g['accessors'][i] for i in sorted(used)]
 for m in g.get('meshes',[]):
  for p in m['primitives']:
   p['attributes']={k:remap[v] for k,v in p['attributes'].items()}
   if 'indices'in p:p['indices']=remap[p['indices']]
   for t in p.get('targets',[]):
    for k,v in t.items():t[k]=remap[v]
 for s in g.get('skins',[]):
  if'inverseBindMatrices'in s:s['inverseBindMatrices']=remap[s['inverseBindMatrices']]
 for a in g.get('animations',[]):
  for s in a['samplers']:s['input']=remap[s['input']];s['output']=remap[s['output']]
 views=g['bufferViews'];needed=set(a['bufferView'] for a in g['accessors'] if 'bufferView'in a)
 images={};replacements={};image_urls={}
 for i,img in enumerate(g.get('images',[])):
  if 'bufferView' not in img:raise ValueError('Expected self-contained verified source')
  v=views[img['bufferView']];data=binary[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']]
  name,data,mime,size=texture(data,img.get('mimeType'))
  image_urls[i]={'url':'assets/limit/textures/'+name,'width':size[0],'height':size[1],'flipY':False}
  replacements[img['bufferView']]=data;img['mimeType']=mime;needed.add(img['bufferView'])
 chunks=[];newviews=[];vmap={};offset=0
 for old in sorted(needed):
  v=dict(views[old]);data=replacements.get(old,binary[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']]);pad=(-offset)%4
  if pad:chunks.append(b'\0'*pad);offset+=pad
  v.update(buffer=0,byteOffset=offset,byteLength=len(data));vmap[old]=len(newviews);newviews.append(v);chunks.append(data);offset+=len(data)
 for a in g['accessors']:
  if'bufferView'in a:a['bufferView']=vmap[a['bufferView']]
 for img in g.get('images',[]):img['bufferView']=vmap[img['bufferView']]
 g['bufferViews']=newviews;newbin=b''.join(chunks);newbin+=b'\0'*((-len(newbin))%4);g['buffers']=[{'byteLength':len(newbin)}]
 maps={}
 for material in g.get('materials',[]):
  info=material.get('pbrMetallicRoughness',{}).get('baseColorTexture')
  if info:
   source=g['textures'][info['index']]['source'];maps[material.get('name','')]=image_urls[source]
 g.setdefault('asset',{}).setdefault('extras',{})['lbaDerivative']='Clip-trimmed, texture-optimized CC0 import; source and license in asset manifest.'
 js=json.dumps(g,separators=(',',':')).encode();js+=b' '*((-len(js))%4);out=struct.pack('<III',0x46546c67,2,28+len(js)+len(newbin))+struct.pack('<II',len(js),0x4e4f534a)+js+struct.pack('<II',len(newbin),0x004e4942)+newbin
 target=MODELS/(key+'.glb');target.write_bytes(out)
 triangles=sum(g['accessors'][p.get('indices',p['attributes']['POSITION'])]['count']//3 for m in g['meshes']for p in m['primitives'])
 manifest['models'][key]={'url':'assets/limit/models/'+target.name,'bytes':len(out),'sha256':hashlib.sha256(out).hexdigest(),'sourceSha256':hashlib.sha256(f).hexdigest(),'triangles':triangles,'textures':maps,'clips':[a['name']for a in g.get('animations',[])],'license':'CC0-1.0','source': 'https://github.com/KayKit-Game-Assets/KayKit-Character-Pack-Adventures-1.0' if character else ('https://polyhaven.com' if key.startswith(('boulder','fern')) else 'Original CC0 geometry; scripts/limit/generate_ruins.py with Poly Haven stone maps' if key in ['gate','beacon','bridge'] else 'https://quaternius.com/packs/ultimatestylizednature.html')}
for name,key in [('Knight','hero'),('Rogue_Hooded','companion')]:bundle(hero/'Characters/gltf'/f'{name}.glb',key,True)
for path in sorted(env.glob('*.glb')):bundle(path,path.stem)
for path in sorted(args.tree_lod.glob('*_LOD.glb')):bundle(path,path.stem)
for filename,key in [('forest_ruin_gate','gate'),('forest_beacon_plinth','beacon'),('forest_trail_bridge','bridge')]:bundle(args.ruins/(filename+'.glb'),key)
for stem in ['forest_ground_04','bark_willow']:
 manifest['surfaces'][stem]={}
 for name in ['diff','nor_gl','rough']:
  p=env/'textures'/f'{stem}_{name}_1k.jpg';im=Image.open(p)
  for label,size in [('high',1024),('low',512)]:
   target=TEX/f'{stem}_{name}_{label}.jpg';im.resize((size,size),Image.Resampling.LANCZOS).convert('RGB').save(target,quality=92,optimize=True)
   manifest['surfaces'][stem][name+'_'+label]='assets/limit/textures/'+target.name
shutil.copy2(hero/'LICENSE.txt',ROOT/'KAYKIT-LICENSE.txt');shutil.copy2(env/'SOURCES_AND_LICENSES.md',ROOT/'SOURCES_AND_LICENSES.md')
shutil.copy2(Path(__file__).parent/'limit'/'ORIGINAL-ASSETS-LICENSE.txt',ROOT/'ORIGINAL-ASSETS-LICENSE.txt')
(ROOT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Prepared',len(manifest['models']),'self-contained models;',len(list(TEX.iterdir())),'local textures;',sum(p.stat().st_size for p in ROOT.rglob('*')if p.is_file()),'bytes')
