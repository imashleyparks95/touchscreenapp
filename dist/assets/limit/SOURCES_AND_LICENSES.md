# Environment assets — source and license record

Acquired 2026-10-27 from creator-owned primary sources. All asset files in this folder are CC0-1.0 and may be modified, embedded in a game, and redistributed commercially. Attribution is optional; crediting Quaternius and Poly Haven is appreciated.

## Quaternius Ultimate Stylized Nature Pack

- Creator page: https://quaternius.com/packs/ultimatestylizednature.html
- License linked by creator: https://creativecommons.org/publicdomain/zero/1.0/
- Creator page lists CC0, textured FBX/OBJ/Blend/glTF assets, seamless textures and normal maps, and personal/commercial use.
- Official download folder reached from creator page: https://drive.google.com/drive/folders/1IV3bXHzkNvuNWFHPi4KPx-G4ghuxIuT-
- glTF subfolder: https://drive.google.com/drive/folders/1-ob9Aade1RIM3A_XKoQAOG6XqF2IDAIC
- Models: BirchTree_1, BirchTree_2, MapleTree_1, MapleTree_3, DeadTree_1, Bush_Large, Bush_Small, Grass_Large, Grass_Small, Flower_1_Clump.
- Derivation: original glTF geometry and materials preserved and packed into self-contained GLB; bark maps reduced to at most 1024px, normal maps JPEG quality 90. Leaf alpha remains PNG. Original downloads retained in parent scratch directory.

## Poly Haven

- License: https://polyhaven.com/license
- License policy explicitly allows commercial use, modification and redistribution of raw asset files under CC0.
- Boulder 01: https://polyhaven.com/a/boulder_01 — Rico Cilliers.
- Fern 02: https://polyhaven.com/a/fern_02 — Rico Cilliers (modeling), Rob Tuytel (scanning).
- Forest Ground 04: https://polyhaven.com/a/forest_ground_04 — Rob Tuytel (photography/processing), Rico Cilliers (minor adjustment).
- Bark Willow: https://polyhaven.com/a/bark_willow — Dimitrios Savva (photography), Dario Barresi (processing).
- Direct official asset downloads use https://dl.polyhaven.org/file/ph-assets/ URLs discovered through each page's linked files endpoint. These are static local assets; the game needs no Poly Haven API access.
- Boulder derivation: downloaded glTF actually contains 66,122 triangles. It was reduced with meshoptimizer 1.3.0 attribute-aware simplification, preserving normals/UVs, to 12,000 triangles (high, relative appearance error 0.00805) and 2,000 triangles (low, error 0.04936). Self-contained GLBs use original 1K color/normal/ARM maps.
- Fern: original 6,232-triangle scene includes four distinct fern clumps. Child nodes can be selected for individual plants.
- Ground/bark PBR sets: original 1K JPG diffuse, OpenGL normal, roughness. Boulder standalone maps include packed ARM (R=AO, G=roughness, B=metallic).

## Integration

- Copy GLBs and needed textures only; source download HTML/scripts are outside this ready folder.
- Reuse loaded tree geometry/materials when instancing or cloning. Individual tree GLBs each embed shared textures for portability.
- Alpha foliage materials are already encoded in glTF. Preserve alpha cutoff/double-sided settings.
- Mesh units are meters. BirchTree_1 is approximately 5.45m tall. Scale trees 1.3–2.2x for a towering forest.
- The ground material tile width is approximately 3.2m; willow bark approximately 1m.
- Use boulder_high nearby and boulder_low for distant placements. Neither GLB includes the 66K source mesh.
- manifest.json records exact files, byte sizes, triangle counts, SHA-256 and source URLs. GLB container, embedded-resource bounds and index ranges were checked after creation.
