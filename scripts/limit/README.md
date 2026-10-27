# Forest asset pipeline

Runtime files are already bundled in `dist/assets/limit/`; playing and testing needs no asset download or generation tool. `manifest.json` records exact source/derived model SHA-256, triangles, sizes, texture sources and clip names. Primary-source license links and creators are in `SOURCES_AND_LICENSES.md`, `KAYKIT-LICENSE.txt` and `ORIGINAL-ASSETS-LICENSE.txt`.

Rebuilding imported art is an explicit offline developer operation. Obtain the original CC0 packs from the documented creators. Preserve the source names, materials and alpha cutoffs. The environment staging directory contains the ten Quaternius GLBs and Poly Haven fern/boulder derivatives listed in the manifest, plus `textures/forest_ground_04_{diff,nor_gl,rough}_1k.jpg` and the equivalent `bark_willow` files. Boulder high/low derivatives are 12,000/2,000 triangles; do not substitute the 66,122-triangle source.

Original ruins can be reproduced with Python, numpy and Pillow; the exact CC0 stone source maps are included in `textures/`:

```bash
python scripts/limit/generate_ruins.py --out /tmp/forest-ruins
```

Tree LOD generation uses the isolated `scripts/limit/tree-lod/package.json` (meshoptimizer 1.3.0, MIT). Install that development dependency there, then:

```bash
node scripts/limit/tree-lod/generate_tree_lod.mjs /path/to/environment-ready /tmp/tree-lod
```

This is optional asset tooling, not an arcade runtime dependency. See `tree-lod/README.md` and the retained generation manifest for the exact attribute-aware simplification and spatial canopy budgets. Its single-view preview metrics describe silhouette retention, not frame-rate gains.

Bundle the acquired originals and derivatives from explicit input directories:

```bash
python scripts/prepare-limit-assets.py \
  --hero-root /path/to/kaykit_character_pack_adventures \
  --environment /path/to/environment-ready \
  --tree-lod /tmp/tree-lod \
  --ruins /tmp/forest-ruins
node tests/limit-assets.mjs
```

The hero root contains `Characters/gltf/Knight.glb`, `Rogue_Hooded.glb` and `LICENSE.txt`. The bundler retains 14 actual animations, prunes unused accessors/buffer views, keeps stable node indices, embeds optimized 1K textures, preserves alpha PNGs and emits deduplicated compatibility textures plus 512/1024px surface maps. No decoder extension or CDN is required. Update offline precache entries if filenames change, then run `npm test` and visually inspect the browser; hashes alone do not prove visual correctness.

Gameplay collision/contact data is additionally baked from the shipped GLBs:

```bash
node scripts/limit/bake-gameplay.mjs
node tests/limit-gameplay.mjs
node tests/limit-scene.mjs
```

This writes `dist/js/limit/geometry-data.js`. Lower trunk and rock bounds derive from actual vertices; sword/knife tip and casting-hand paths derive from the imported action clips at 65 phases. The runtime keeps original authored hand-slot attachments. Regenerate and revalidate if any source model, animation, scale or grip changes. The scene test compares real rendered transforms with these samples and fails on a mismatch.
