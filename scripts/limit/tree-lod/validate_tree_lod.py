"""Read-only GLB/manifest check. Python standard library only."""
from pathlib import Path
import json,struct,hashlib,math
b=Path(__file__).parent
report=json.loads((b/'manifest.json').read_text())
for item in report['models']:
 p=b/item['file'];raw=p.read_bytes();assert hashlib.sha256(raw).hexdigest()==item['sha256'];assert len(raw)==item['bytes'];assert struct.unpack_from('<III',raw)==(0x46546c67,2,len(raw))
 jl,jt=struct.unpack_from('<II',raw,12);assert jt==0x4e4f534a;d=json.loads(raw[20:20+jl]);bl,bt=struct.unpack_from('<II',raw,20+jl);assert bt==0x004e4942;binary=raw[28+jl:];assert bl==len(binary)
 assert all('uri' not in x for x in d['images']+d['buffers'])
 for v in d['bufferViews']:assert v.get('byteOffset',0)%4==0 and v.get('byteOffset',0)+v['byteLength']<=bl
 def accessor(i):
  a=d['accessors'][i];v=d['bufferViews'][a['bufferView']];width={'SCALAR':1,'VEC2':2,'VEC3':3}[a['type']];code={5126:'f',5125:'I',5123:'H'}[a['componentType']];return struct.unpack_from('<'+str(a['count']*width)+code,binary,v.get('byteOffset',0)+a.get('byteOffset',0))
 triangles=0
 for mesh in d['meshes']:
  for p in mesh['primitives']:
   ids=accessor(p['indices']);assert len(ids)%3==0;triangles+=len(ids)//3;assert max(ids)<d['accessors'][p['attributes']['POSITION']]['count']
   for key,i in p['attributes'].items():assert all(math.isfinite(x) for x in accessor(i))
 assert triangles==item['triangles'] and 700<=triangles<=1500
 source=(b.parent/'ready'/item['source']).read_bytes();assert hashlib.sha256(source).hexdigest()==item['sourceSha256'];sl=struct.unpack_from('<I',source,12)[0];sd=json.loads(source[20:20+sl]);assert d['materials']==sd['materials'] and d['samplers']==sd['samplers']
 sb=source[28+sl:]
 for image,old in zip(d['images'],sd['images']):
  a=d['bufferViews'][image['bufferView']];ov=sd['bufferViews'][old['bufferView']];assert binary[a['byteOffset']:a['byteOffset']+a['byteLength']]==sb[ov['byteOffset']:ov['byteOffset']+ov['byteLength']]
 print(item['file'],triangles,'triangles: valid GLB, indices, finite attributes, source/material/texture preservation.')
