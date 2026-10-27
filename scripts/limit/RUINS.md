# Original forest ruin set

Three original game-ready meshes with meters as units and Y up. All are self-contained GLB 2.0 with embedded stone PBR and original woodgrain textures. No runtime external URLs, Draco, or meshopt extension decoder required.

| Asset | Triangles | Dimensions and origin |
| --- | ---: | --- |
| forest_ruin_gate.glb | 3,416 | 4.61m wide, 4.18m high, ~0.92m deep; base y=0, opening centered x=0, runs through Z; opening ~3m wide |
| forest_beacon_plinth.glb | 1,080 | 1.05m wide/deep, 1.30m high; base y=0 |
| forest_trail_bridge.glb | 2,764 | deck spans ~3.3m along Z, 2.6m deck width along X; nominal deck top y=.15m; stone footings extend to -.275m; rails top ~1.2m |

## Rendering and activation

- Every asset has a child node named `glow` and a material named `glow_teal_rune_insets`. Clone shared materials before changing one instance's state. Its `emissiveFactor` can be multiplied for activation; bloom is optional.
- Stone material uses Poly Haven color, OpenGL normal, and packed ARM (R=AO, G=roughness, B=metallic), with an original moss/gray material tint.
- Original geometry includes beveled irregular masonry, curved segmented arch wedges, layered octagonal carvings, carved inlay sigils, moss cushions, hewn planks, and diagonal rail braces.
- No collision mesh is encoded. Gate passage is open; bridge deck collision can be a box at y=.09, size [2.6,.12,3.3].
- The bridge origin is the center of its deck span, y=0; the deck itself sits .15m above that origin.

## Reproduce

Requires Python 3, numpy and Pillow:

```bash
python generate_ruins.py
python render_preview.py
```

`textures/` includes the exact CC0 source maps needed by the generator. Geometry and original woodgrain are deterministic with seed 42917. Each GLB's SHA-256, exact size and bounds are in `manifest.json`. Preview JSON files are geometry intermediates for the included lightweight CPU renderer; they are not runtime game dependencies.

## License / provenance

All original geometry, rune designs, procedural woodgrain, and source scripts in this folder are hereby dedicated to the public domain under **CC0 1.0 Universal**: https://creativecommons.org/publicdomain/zero/1.0/

The embedded source stone images are **Boulder 01 by Rico Cilliers / Poly Haven**, also CC0:

- Asset: https://polyhaven.com/a/boulder_01
- License policy: https://polyhaven.com/license
- Maps: `boulder_01_diff_1k.jpg`, `boulder_01_nor_gl_1k.jpg`, `boulder_01_arm_1k.jpg`

Poly Haven's primary-source license policy explicitly permits commercial use, modification, embedding, and raw asset redistribution. Attribution is optional. These source image files are unmodified; their displayed GLB color tint is a material setting. No third-party models or logos were copied.
