# Milestone 5 asset and geometry provenance

No external assets, paid services, runtime keys or dependency upgrades were introduced.

- Heroes, rogue, imported idle/walk/run/attack/cast/dodge/death/cheer clips, gateway and beacon remain the original local GLBs under `dist/assets/limit/`. Exact source/license records are unchanged in `SOURCES_AND_LICENSES.md`, `manifest.json` and the bundled license texts. The Crown Warden scales the existing knight rig; it is not a newly acquired model or an unverified replacement skeleton.
- Existing Poly Haven ground/bark color/normal maps remain local and unchanged. Original 98 asset/vendor SHA checks continue to match the migration baseline.
- Castle walls/rooms/stairs/windows/beamwork/doors/banners, Arena galleries/cover/ring, and Chamber ribs/reactor composition are original authored procedural project geometry in `dist/js/limit/journey-worlds.js` and `journey-scene.js`. The same main extents drive rule and Havok collision. Small cosmetic trim is not a general per-triangle collision promise.
- The new 512px masonry tile is drawn deterministically on a local canvas by `journey-scene.js` and uploaded as a Babylon DynamicTexture. It uses original rectangles, mortar, edging and local grain; it does not download or edit an external image. Compatibility mode uses that canvas when available and retains local surface fallbacks. Its texture, materials, meshes and physics are owned/disposed by the area scene.
- `adventure-actors.js` reuses the existing 41-joint rigs and the actual bundled weapon/hand-slot selection. Real large-boss blade/casting-palm alignment is tested against the measured imported contact data. Imported-hero ragdolls and new animation asset production are not claimed.

This documents new project code and reuse; it does not relicense the overall application or alter any existing asset license. No original checksum file was edited to accommodate these changes.
