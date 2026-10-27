# Practical tree LODs

Four low-detail self-contained GLBs derived from the acquired Quaternius Ultimate Stylized Nature Pack. Original near-detail files in `../ready` are unchanged. Tree node names, coordinate system, original material/alpha settings, UVs and embedded textures are preserved. No decoder extensions or runtime network access required.

| LOD file | Original triangles | LOD triangles | Original triangles retained | Bark appearance error | Foliage appearance error |
| --- | ---: | ---: | ---: | ---: | ---: |
| BirchTree_1_LOD.glb | 4,596 | 1,200 | 26.1% | .01196 | .09303 |
| BirchTree_2_LOD.glb | 7,660 | 1,444 | 18.9% | .01863 | .09178 |
| MapleTree_1_LOD.glb | 3,848 | 1,000 | 26.0% | .01814 | .11305 |
| MapleTree_3_LOD.glb | 6,678 | 1,400 | 21.0% | .01906 | .08010 |

Errors are meshoptimizer's approximate combined appearance error relative to object scale, including weighted UVs/normals; they are not a measured frame rate or pixel difference. Detailed per-canopy-group errors, exact file/source hashes, bytes, flags and ratios are in `manifest.json` and each GLB's `asset.extras.lod`.

## Method / distant silhouette

Bark is reduced with meshoptimizer 1.3.0 attribute-aware simplification. The alpha foliage receives a larger share of the budget and higher UV weights. Whole connected leaf cards are grouped into eight deterministic spatial clusters; each cluster receives a proportional triangle budget before simplification. This avoids pruning a complete small canopy clump while retaining another unchanged. Original vertices are reused, so retained card UVs stay exact. All source alpha textures, alpha settings, samplers and materials remain byte-identical.

The rendered comparison uses the same camera for near and LOD meshes and alpha-tested CPU previewing. `preview_metrics.json` records a single-view silhouette comparison. Inspect `tree_lod_comparison.png`; runtime lighting and transparency can differ. Keep the original green/autumn tint handling consistent between near and LOD instances. Use these at distance or in the software fallback; this is intentionally an aggressive branch reduction.

## Reproduce / validate

Node.js plus pinned `meshoptimizer` 1.3.0 is required. It is currently available in the parent asset-acquisition directory. To reproduce independently:

```bash
npm install
node generate_tree_lod.mjs ../ready .
python validate_tree_lod.py
```

The generator accepts alternative source and output paths as its two positional arguments. Input files are `BirchTree_1.glb`, `BirchTree_2.glb`, `MapleTree_1.glb`, and `MapleTree_3.glb` from the source `ready` directory. Preview generation additionally requires numpy and Pillow:

```bash
python render_tree_lod_preview.py
```

Validation covers self-contained GLB containers, all embedded resource bounds/alignment, valid mesh index ranges, finite attributes, triangle budgets, source hashes, and unchanged materials/samplers/image bytes. Repeated generation was checked for deterministic hashes.

## Source and license

All tree asset derivatives are **CC0-1.0**, inherited from the creator's official pack:

- Creator: Quaternius
- Official page: https://quaternius.com/packs/ultimatestylizednature.html
- License linked on official page: https://creativecommons.org/publicdomain/zero/1.0/
- The creator's page explicitly lists CC0, textured glTF models, and use in personal/commercial projects.

These original generator/validation/preview scripts are also dedicated to CC0-1.0. meshoptimizer is a separately installed MIT-licensed tool; its source is not embedded in the GLBs. Attribution to Quaternius is optional but appreciated.
