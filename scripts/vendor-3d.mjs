import fs from 'node:fs';
const root='dist/vendor/3d/';fs.mkdirSync(root,{recursive:true});
for(const[from,to]of [['babylonjs/babylon.js','babylon.js'],['babylonjs-loaders/babylonjs.loaders.min.js','loaders.js'],['@babylonjs/havok/lib/umd/HavokPhysics_umd.js','HavokPhysics.js'],['@babylonjs/havok/lib/umd/HavokPhysics.wasm','HavokPhysics.wasm'],['@babylonjs/havok/LICENSE','HAVOK-LICENSE.txt'],['babylonjs/license.md','BABYLON-LICENSE.txt'],['babylonjs-loaders/license.md','LOADERS-LICENSE.txt']])fs.copyFileSync('node_modules/'+from,root+to);
console.log('Copied pinned local 3D engine, loader, WASM and licenses. Run npm run test:3d and npm test before publication.');
