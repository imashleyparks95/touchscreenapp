from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import numpy as np,json,struct,io
b=Path(__file__).parent;src=b.parent/'ready';N=420;H=560
names=['BirchTree_1','BirchTree_2','MapleTree_1','MapleTree_3'];stats=[]
def parse(p):
 raw=p.read_bytes();jl=struct.unpack_from('<I',raw,12)[0];d=json.loads(raw[20:20+jl]);binary=raw[28+jl:]
 def acc(i):
  a=d['accessors'][i];v=d['bufferViews'][a['bufferView']];width={'SCALAR':1,'VEC2':2,'VEC3':3}[a['type']];dtype={5126:'<f4',5125:'<u4',5123:'<u2'}[a['componentType']];return np.frombuffer(binary,dtype=dtype,count=a['count']*width,offset=v.get('byteOffset',0)+a.get('byteOffset',0)).reshape((-1,width))
 images=[]
 for im in d['images']:
  v=d['bufferViews'][im['bufferView']];images.append(np.asarray(Image.open(io.BytesIO(binary[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']])).convert('RGBA'),float)/255)
 meshlist=[]
 for mesh in d['meshes']:
  for p in mesh['primitives']:
   a=p['attributes'];mat=d['materials'][p['material']];meshlist.append((acc(a['POSITION']),acc(a['NORMAL']),acc(a['TEXCOORD_0']),acc(p['indices']).reshape(-1,3),mat))
 return d,images,meshlist

def render(parsed,bounds):
 d,images,meshes=parsed;lo,hi=bounds;center=(lo+hi)/2;extent=hi-lo;cam=center+np.array([extent[1]*.9,extent[1]*.2,extent[1]*1.65]);forward=center-cam;forward/=np.linalg.norm(forward);right=np.cross(forward,[0,1,0]);right/=np.linalg.norm(right);up=np.cross(right,forward);corners=np.array([[x,y,z] for x in [lo[0],hi[0]] for y in [lo[1],hi[1]] for z in [lo[2],hi[2]]])-center;framing=max(np.max(abs(corners@right))*H*1.46/(N*.44),np.max(abs(corners@up))*H*1.46/(H*.44))+np.max(abs(corners@forward));cam=center-forward*framing;light=np.array([-3,6,4],float);light/=np.linalg.norm(light);focal=H*1.46
 bg=np.full((H,N,3),[.08,.12,.105]);depth=np.full((H,N),np.inf);mask=np.zeros((H,N),bool)
 for pos,norm,uv,idx,mat in meshes:
  rel=pos-cam;z=rel@forward;scr=np.column_stack([N/2+(rel@right)/z*focal,H*.51-(rel@up)/z*focal]);pbr=mat.get('pbrMetallicRoughness',{});base=np.array(pbr.get('baseColorFactor',[1,1,1,1]));texref=pbr.get('baseColorTexture');texture=images[d['textures'][texref['index']]['source']] if texref else np.ones((1,1,4));cut=mat.get('alphaCutoff',.5) if mat.get('alphaMode') in ['MASK','BLEND'] else 0.001
  for tri in idx:
   pp=scr[tri];zz=z[tri];x0=max(0,int(np.floor(pp[:,0].min())));x1=min(N-1,int(np.ceil(pp[:,0].max())));y0=max(0,int(np.floor(pp[:,1].min())));y1=min(H-1,int(np.ceil(pp[:,1].max())))
   if x1<x0 or y1<y0:continue
   yy,xx=np.mgrid[y0:y1+1,x0:x1+1];xx=xx+.5;yy=yy+.5;ax,ay=pp[0];bx,by=pp[1];cx,cy=pp[2];den=(by-cy)*(ax-cx)+(cx-bx)*(ay-cy)
   if abs(den)<1e-8:continue
   w0=((by-cy)*(xx-cx)+(cx-bx)*(yy-cy))/den;w1=((cy-ay)*(xx-cx)+(ax-cx)*(yy-cy))/den;w2=1-w0-w1;inv=w0/zz[0]+w1/zz[1]+w2/zz[2];valid=(w0>=-1e-5)&(w1>=-1e-5)&(w2>=-1e-5)&(inv>0);dep=1/np.maximum(inv,1e-8);valid&=dep<depth[y0:y1+1,x0:x1+1]
   if not valid.any():continue
   coords=(w0[:,:,None]*uv[tri[0]]/zz[0]+w1[:,:,None]*uv[tri[1]]/zz[1]+w2[:,:,None]*uv[tri[2]]/zz[2])/np.maximum(inv[:,:,None],1e-8);th,tw=texture.shape[:2];tx=((coords[:,:,0]%1)*tw).astype(int)%tw;ty=(((1-coords[:,:,1])%1)*th).astype(int)%th;color=texture[ty,tx]*base;valid&=color[:,:,3]>=cut
   n=norm[tri[0]];shade=.42+.58*abs(float(n@light));rgb=color[:,:,:3]*shade
   bg[y0:y1+1,x0:x1+1][valid]=rgb[valid];depth[y0:y1+1,x0:x1+1][valid]=dep[valid];mask[y0:y1+1,x0:x1+1][valid]=1
 return Image.fromarray(np.uint8(np.clip(bg,0,1)*255)),mask
out=Image.new('RGB',(N*4,H*2+160),(15,24,20));draw=ImageDraw.Draw(out)
try:font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',20);small=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',15)
except:font=small=ImageFont.load_default()
reports=json.loads((b/'manifest.json').read_text())['models']
for i,name in enumerate(names):
 high=parse(src/(name+'.glb'));low=parse(b/(name+'_LOD.glb'));allpos=np.concatenate([m[0] for m in high[2]]);bounds=(allpos.min(0),allpos.max(0));hi,hm=render(high,bounds);lo,lm=render(low,bounds);out.paste(hi,(N*i,40));out.paste(lo,(N*i,H+105));draw.text((N*i+20,12),name,font=font,fill=(221,230,208));r=reports[i];draw.text((N*i+20,H+55),'NEAR  '+str(r['sourceTriangles'])+' triangles',font=small,fill=(154,188,161));draw.text((N*i+20,H*2+115),'LOD  '+str(r['triangles'])+' triangles',font=small,fill=(154,188,161));stats.append({'name':name,'maskAreaRatio':round(float(lm.sum()/hm.sum()),3),'silhouetteIoU':round(float((lm&hm).sum()/(lm|hm).sum()),3)})
out.save(b/'tree_lod_comparison.png');(b/'preview_metrics.json').write_text(json.dumps(stats,indent=2));print(stats)
