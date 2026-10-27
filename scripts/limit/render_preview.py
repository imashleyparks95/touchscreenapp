from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageFilter
import numpy as np,json,math
b=Path(__file__).parent;N=700
stone=np.asarray(Image.open(b/'textures/boulder_01_diff_1k.jpg').resize((512,512)).convert('RGB'),float)/255
wood=np.asarray(Image.open(b/'original_woodgrain.png').convert('RGB'),float)/255
colors=np.array([[.68,.76,.68],[.46,.28,.075],[.12,.24,.075],[.08,.62,.46],[.85,.83,.76]])
light=np.array([-3,6,5],float);light/=np.linalg.norm(light)
def render(name,cam,target):
 bg=np.zeros((N,N,3),float);bg[:]=[.09,.13,.115];y,x=np.mgrid[:N,:N];gradient=(1-y/N)*.055;bg+=gradient[:,:,None]
 # Shadow plane for visual grounding.
 shadow=np.exp(-(((x-N*.5)/(N*.31))**2+((y-N*.84)/(N*.05))**2))*0.035;bg-=shadow[:,:,None]
 depth=np.full((N,N),np.inf);cam=np.array(cam,float);target=np.array(target,float);fwd=target-cam;fwd/=np.linalg.norm(fwd);right=np.cross(fwd,[0,1,0]);right/=np.linalg.norm(right);up=np.cross(right,fwd);focal=N*.99
 for mesh in json.loads((b/(name+'.preview.json')).read_text()):
  pts=np.asarray(mesh['positions']);norms=np.asarray(mesh['normals']);uv=np.asarray(mesh['uv']);mat=mesh['material'];rel=pts-cam;zs=rel@fwd;screen=np.column_stack([N*.5+(rel@right)/zs*focal,N*.5-(rel@up)/zs*focal])
  for i in range(0,len(pts),3):
   pp=screen[i:i+3];zz=zs[i:i+3]
   if min(zz)<=0:continue
   x0=max(0,int(np.floor(pp[:,0].min())));x1=min(N-1,int(np.ceil(pp[:,0].max())));y0=max(0,int(np.floor(pp[:,1].min())));y1=min(N-1,int(np.ceil(pp[:,1].max())))
   if x1<x0 or y1<y0:continue
   yy,xx=np.mgrid[y0:y1+1,x0:x1+1];xx=xx+.5;yy=yy+.5
   ax,ay=pp[0];bx,by=pp[1];cx,cy=pp[2];den=(by-cy)*(ax-cx)+(cx-bx)*(ay-cy)
   if abs(den)<1e-8:continue
   w0=((by-cy)*(xx-cx)+(cx-bx)*(yy-cy))/den;w1=((cy-ay)*(xx-cx)+(ax-cx)*(yy-cy))/den;w2=1-w0-w1
   valid=(w0>=-1e-5)&(w1>=-1e-5)&(w2>=-1e-5);inv=w0/zz[0]+w1/zz[1]+w2/zz[2];z=1/np.maximum(inv,1e-8);valid&=z<depth[y0:y1+1,x0:x1+1]
   if not np.any(valid):continue
   n=norms[i];shade=.44+.56*max(0,float(n@light));col=colors[mat]*shade
   if mat in [0,4]:
    tex=stone if mat==0 else wood;h,w=tex.shape[:2];coords=(w0[:,:,None]*uv[i]/zz[0]+w1[:,:,None]*uv[i+1]/zz[1]+w2[:,:,None]*uv[i+2]/zz[2])/inv[:,:,None];tx=((coords[:,:,0]%1)*w).astype(int)%w;ty=((coords[:,:,1]%1)*h).astype(int)%h;col=tex[ty,tx]*col*1.4
   else:col=np.broadcast_to(col,valid.shape+(3,)).copy()
   if mat==3:col=np.broadcast_to([.1,.9,.66],valid.shape+(3,))
   bg[y0:y1+1,x0:x1+1][valid]=col[valid];depth[y0:y1+1,x0:x1+1][valid]=z[valid]
 img=Image.fromarray(np.uint8(np.clip(bg,0,1)*255));return img
jobs=[('forest_ruin_gate',[5.9,4.0,7.4],[0,2.04,0],'WAYFARER GATE','3,416 triangles · 4.18m high'),('forest_beacon_plinth',[1.8,1.47,2.3],[0,.64,0],'VERDANT BEACON','1,080 triangles · 1.30m high'),('forest_trail_bridge',[4.2,3.2,5.0],[0,.38,0],'TRAIL BRIDGE','2,764 triangles · 3.3m deck span')]
out=Image.new('RGB',(N*3,N+110),(16,25,21));draw=ImageDraw.Draw(out)
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
try:f1=ImageFont.truetype(font,23);f2=ImageFont.truetype(font,15)
except:f1=f2=ImageFont.load_default()
for i,(name,cam,targ,title,sub) in enumerate(jobs):
 im=render(name,cam,targ);out.paste(im,(i*N,0));draw.text((i*N+32,N+20),title,font=f1,fill=(222,229,205));draw.text((i*N+32,N+59),sub,font=f2,fill=(135,168,145))
out.save(b/'forest_ruins_preview.png');print(b/'forest_ruins_preview.png')
