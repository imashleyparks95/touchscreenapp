#!/usr/bin/env python3
"""Generate the original Wobbly Wars toy soldier: custom lofted mesh + glTF skin.

No downloaded assets, textures, external Python packages or geometry primitives.
All ring profiles and costume pieces below are authored specifically for this game.
"""
import json, math, pathlib, struct

OUT = pathlib.Path(__file__).resolve().parents[1] / 'dist/assets/wars3d'
OUT.mkdir(parents=True, exist_ok=True)
NAMES = ['root', 'hips', 'spine', 'head', 'armL', 'foreL', 'armR', 'foreR', 'legL', 'shinL', 'legR', 'shinR']
POS = [(0,0,0),(0,.85,0),(0,1.15,0),(0,1.55,0),(-.34,1.35,0),(-.38,1.05,0),(.34,1.35,0),(.38,1.05,0),(-.15,.85,0),(-.15,.45,0),(.15,.85,0),(.15,.45,0)]
PARENTS = [None,0,1,2,2,4,2,6,1,8,1,10]
COLORS = {'team':(.16,.44,.76,1),'skin':(.95,.69,.43,1),'boots':(.15,.12,.15,1),'steel':(.43,.57,.66,1),'gold':(.98,.69,.20,1),'eyes':(.035,.045,.07,1),'white':(.98,.94,.79,1),'leather':(.36,.21,.16,1),'plume':(.95,.36,.20,1)}
GEOM = {m: {'p':[], 'n':[], 'j':[], 'w':[]} for m in COLORS}

def tri(mat,bone,a,b,c):
    u=[b[i]-a[i] for i in range(3)]; v=[c[i]-a[i] for i in range(3)]
    n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]]
    norm=math.sqrt(sum(x*x for x in n))
    if norm < 1e-10: return
    n=[x/norm for x in n]; g=GEOM[mat]
    for p in (a,b,c):
        g['p'].extend(p); g['n'].extend(n); g['j'].extend([bone,0,0,0]); g['w'].extend([1,0,0,0])

def loft(mat,bone,cx,cz,rings,sides=8,phase=math.pi/8):
    """rings: authored vertical profile (y, half-width, half-depth [, x offset, z offset])."""
    layers=[]
    for ring in rings:
        y,rx,rz,*off=ring; ox=off[0] if off else 0; oz=off[1] if len(off)>1 else 0
        layers.append([(cx+ox+rx*math.cos(phase+k*2*math.pi/sides),y,cz+oz+rz*math.sin(phase+k*2*math.pi/sides)) for k in range(sides)])
    for lower,upper in zip(layers,layers[1:]):
        for k in range(sides):
            j=(k+1)%sides; tri(mat,bone,lower[k],upper[k],lower[j]); tri(mat,bone,lower[j],upper[k],upper[j])
    for layer,top in [(layers[0],False),(layers[-1],True)]:
        center=tuple(sum(p[i] for p in layer)/sides for i in range(3))
        for k in range(sides):
            j=(k+1)%sides
            tri(mat,bone,center,layer[k] if top else layer[j],layer[j] if top else layer[k])

def plate(mat,bone,coords,depth=.014):
    """Custom face outline, front in +Z, thin solid with flat back."""
    center=tuple(sum(p[i] for p in coords)/len(coords) for i in range(3)); back=[(x,y,z-depth) for x,y,z in coords]
    cb=(center[0],center[1],center[2]-depth)
    for k,a in enumerate(coords):
        j=(k+1)%len(coords); b=coords[j]
        tri(mat,bone,center,b,a); tri(mat,bone,cb,back[k],back[j])
        tri(mat,bone,a,b,back[k]); tri(mat,bone,b,back[j],back[k])

# The tunic has a sculpted trapezoid silhouette and raised central breastplate.
loft('team',1,0,0,[(.72,.24,.15),(.78,.29,.19),(.91,.25,.16),(1.02,.23,.15)],8)
loft('team',2,0,0,[(.94,.23,.15),(1.07,.25,.17),(1.30,.31,.19),(1.40,.28,.16),(1.43,.18,.13)],8)
plate('steel',2,[(-.20,1.29,.181),(-.13,1.35,.205),(.13,1.35,.205),(.20,1.29,.181),(.16,1.07,.173),(0,1.01,.196),(-.16,1.07,.173)],.032)
plate('gold',2,[(0,1.28,.218),(.067,1.20,.222),(0,1.12,.221),(-.067,1.20,.222)],.01)
plate('white',2,[(-.012,1.257,.232),(.012,1.257,.232),(.012,1.147,.232),(-.012,1.147,.232)],.005)
loft('leather',1,0,0,[(.91,.257,.171),(.98,.251,.169)],8)
plate('gold',1,[(-.06,.97,.176),(.06,.97,.176),(.06,.91,.176),(-.06,.91,.176)],.012)
plate('boots',1,[(-.035,.956,.191),(.035,.956,.191),(.035,.924,.191),(-.035,.924,.191)],.004)
# Neck, oversized cheeks, jaw and eyebrow rim. A bespoke 10-sided sculpt, no sphere.
loft('skin',3,0,0,[(1.39,.095,.09),(1.54,.105,.095)],8)
loft('skin',3,0,.008,[(1.48,.12,.10),(1.52,.19,.17),(1.62,.245,.20),(1.76,.24,.20),(1.84,.19,.16),(1.87,.10,.10)],10,math.pi/10)
for x in [-.24,.24]:
    loft('skin',3,x,0,[(1.63,.033,.05),(1.70,.055,.065),(1.74,.03,.04)],6)
# Bright whites, offset pupils and glints give an expressive face at battle scale.
for x in [-.092,.092]:
    plate('white',3,[(x-.054,1.72,.204),(x+.052,1.72,.204),(x+.047,1.64,.214),(x-.048,1.64,.214)],.008)
    plate('eyes',3,[(x-.023,1.710,.220),(x+.021,1.710,.220),(x+.021,1.650,.226),(x-.023,1.650,.226)],.005)
    plate('white',3,[(x-.014,1.70,.232),(x,1.70,.232),(x,1.684,.232),(x-.014,1.684,.232)],.003)
    plate('boots',3,[(x-.058,1.746,.207),(x+.052,1.738,.207),(x+.052,1.718,.211),(x-.058,1.725,.211)],.01)
# Nose wedge, curved smiling mouth strip and raised cheeks.
tri('skin',3,(-.031,1.662,.215),(.031,1.662,.215),(0,1.615,.276))
tri('skin',3,(.031,1.662,.215),(.036,1.61,.223),(0,1.615,.276))
tri('skin',3,(0,1.615,.276),(.036,1.61,.223),(-.036,1.61,.223))
tri('skin',3,(-.036,1.61,.223),(-.031,1.662,.215),(0,1.615,.276))
plate('eyes',3,[(-.075,1.595,.198),(-.034,1.577,.218),(.034,1.577,.218),(.075,1.595,.198),(.040,1.560,.215),(-.040,1.560,.215)],.006)
plate('white',3,[(-.053,1.589,.217),(.053,1.589,.217),(.029,1.577,.229),(-.029,1.577,.229)],.003)
# Open-faced angular helmet, folded crest and painted team band.
loft('steel',3,0,-.014,[(1.78,.26,.219),(1.82,.266,.224),(1.91,.223,.194),(1.98,.105,.12),(2.0,.035,.052)],10,math.pi/10)
loft('team',3,0,-.014,[(1.777,.266,.223),(1.817,.271,.228)],10,math.pi/10)
plate('gold',3,[(-.055,1.82,.223),(0,1.89,.222),(.055,1.82,.223),(0,1.79,.234)],.01)
plate('plume',3,[(-.035,1.93,-.03),(-.05,2.09,-.08),(.018,2.15,-.12),(.06,2.06,-.16),(.04,1.95,-.12)],.08)
# Layered pauldrons, tapered sleeves and forearm gauntlets.
for side,upper,fore in [(-1,4,5),(1,6,7)]:
    x=side*.345
    loft('team',upper,x,0,[(1.11,.092,.10),(1.25,.105,.12),(1.38,.13,.14)],8)
    loft('steel',upper,x,0,[(1.30,.139,.15),(1.38,.15,.16),(1.43,.11,.13)],8)
    loft('gold',upper,x,0,[(1.295,.143,.155),(1.325,.151,.164)],8)
    loft('skin',fore,side*.38,0,[(.94,.075,.075),(1.10,.086,.09),(1.15,.083,.088)],8)
    loft('leather',fore,side*.385,0,[(.91,.086,.09),(1.00,.092,.096)],8)
    loft('skin',fore,side*.388,.012,[(.84,.065,.065),(.88,.083,.082),(.94,.078,.078)],8)
    loft('skin',fore,side*.321,.040,[(.87,.030,.04),(.94,.036,.043),(.97,.027,.032)],6)
# Trouser legs and deliberately long, flattened boots stay precisely on the floor.
for side,thigh,shin in [(-1,8,9),(1,10,11)]:
    x=side*.15
    loft('team',thigh,x,0,[(.45,.10,.105),(.69,.115,.115),(.85,.112,.12)],8)
    loft('steel',shin,x,.005,[(.34,.098,.095),(.47,.115,.115),(.52,.09,.09)],8)
    loft('boots',shin,x,.035,[(.025,.117,.175),(.065,.13,.19),(.15,.122,.18),(.19,.105,.125),(.36,.094,.095)],8)
    loft('leather',shin,x,0,[(.29,.101,.103),(.35,.103,.105)],8)
    plate('gold',shin,[(x-.042,.34,.103),(x+.042,.34,.103),(x+.042,.30,.106),(x-.042,.30,.106)],.008)

blob=bytearray(); views=[]; accessors=[]
def accessor(values,kind,components,component=5126,minimum=False):
    while len(blob)%4: blob.append(0)
    off=len(blob); fmt='f' if component==5126 else 'H'; blob.extend(struct.pack('<'+fmt*len(values),*values))
    view=len(views); views.append({'buffer':0,'byteOffset':off,'byteLength':len(blob)-off})
    a={'bufferView':view,'componentType':component,'count':len(values)//components,'type':kind}
    if minimum:
        a['min']=[min(values[i::components]) for i in range(components)]; a['max']=[max(values[i::components]) for i in range(components)]
    accessors.append(a); return len(accessors)-1

materials=[{'name':name,'doubleSided':True,'pbrMetallicRoughness':{'baseColorFactor':list(color),'metallicFactor':.35 if name in ('steel','gold') else 0,'roughnessFactor':.75}} for name,color in COLORS.items()]
primitives=[]
for mat,g in GEOM.items():
    if not g['p']: continue
    attrs={'POSITION':accessor(g['p'],'VEC3',3,minimum=True),'NORMAL':accessor(g['n'],'VEC3',3),'JOINTS_0':accessor(g['j'],'VEC4',4,5123),'WEIGHTS_0':accessor(g['w'],'VEC4',4)}
    primitives.append({'attributes':attrs,'material':list(COLORS).index(mat),'mode':4})
nodes=[]
for i,(name,p,parent) in enumerate(zip(NAMES,POS,PARENTS)):
    base=POS[parent] if parent is not None else (0,0,0)
    nodes.append({'name':name,'translation':[p[k]-base[k] for k in range(3)],'children':[j for j in range(len(PARENTS)) if PARENTS[j]==i]})
    if not nodes[-1]['children']: del nodes[-1]['children']
inverse=[]
for x,y,z in POS: inverse.extend([1,0,0,0,0,1,0,0,0,0,1,0,-x,-y,-z,1])
ibm=accessor(inverse,'MAT4',16)
nodes.append({'name':'WobblySoldier','mesh':0,'skin':0})
# Embedded clips make this a portable animated game-ready asset; combat controller
# also blends quaternion poses directly for role-specific strikes and hit reactions.
animations=[]
def quat_x(a): return [math.sin(a/2),0,0,math.cos(a/2)]
times=[0,.2,.4,.6,.8]
walk={'name':'Walk','samplers':[],'channels':[]}
time_id=accessor(times,'SCALAR',1,minimum=True)
for bone,phase,amount in [(8,0,.65),(10,math.pi,.65),(4,math.pi,.42),(6,0,.42),(9,.6,.33),(11,math.pi+.6,.33)]:
    values=[]
    for t in times: values.extend(quat_x(math.sin(t/.8*math.tau+phase)*amount))
    idx=len(walk['samplers']);walk['samplers'].append({'input':time_id,'output':accessor(values,'VEC4',4),'interpolation':'LINEAR'});walk['channels'].append({'sampler':idx,'target':{'node':bone,'path':'rotation'}})
animations.append(walk)
idle={'name':'Idle','samplers':[],'channels':[]}
it=accessor([0,1,2],'SCALAR',1,minimum=True)
ip=accessor([0,.85,0,0,.862,0,0,.85,0],'VEC3',3)
idle['samplers'].append({'input':it,'output':ip,'interpolation':'LINEAR'});idle['channels'].append({'sampler':0,'target':{'node':1,'path':'translation'}});animations.append(idle)
gltf={'asset':{'version':'2.0','generator':'Little Big Arcade original authored low-poly rig','copyright':'Original Little Big Arcade asset; CC0-1.0'},'scene':0,'scenes':[{'name':'Wobbly Soldier','nodes':[0,len(nodes)-1]}],'nodes':nodes,'meshes':[{'name':'WobblySoldierMesh','primitives':primitives}],'skins':[{'name':'WobblySoldierRig','inverseBindMatrices':ibm,'skeleton':0,'joints':list(range(len(POS)))}],'materials':materials,'animations':animations,'buffers':[{'byteLength':len(blob)}],'bufferViews':views,'accessors':accessors,'extras':{'forward':'+Z','up':'+Y','units':'metres','description':'Original toy knight, custom ring-lofted silhouette, expressive face, layered costume. All vertices carry skin weights.'}}
js=json.dumps(gltf,separators=(',',':')).encode();js+=b' '*((-len(js))%4);blob+=b'\0'*((-len(blob))%4)
output=struct.pack('<III',0x46546c67,2,12+8+len(js)+8+len(blob))+struct.pack('<II',len(js),0x4e4f534a)+js+struct.pack('<II',len(blob),0x004e4942)+blob
(OUT/'soldier.glb').write_bytes(output)
assert all(0<=j<len(POS) for g in GEOM.values() for j in g['j'])
assert all(abs(sum(g['w'][i:i+4])-1)<1e-7 for g in GEOM.values() for i in range(0,len(g['w']),4))
assert all(v['byteOffset']+v['byteLength']<=len(blob) for v in views)
assert all(all(math.isfinite(v) for v in g['p']+g['n']+g['w']) for g in GEOM.values())
print(json.dumps({'path':str(OUT/'soldier.glb'),'bytes':len(output),'triangles':sum(len(g['p'])//9 for g in GEOM.values()),'joints':NAMES,'clips':[a['name'] for a in animations],'materials':list(COLORS)},indent=2))
