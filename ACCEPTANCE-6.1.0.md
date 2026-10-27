# Acceptance — Little Big Arcade 6.1.0 / Project Limit Break

Date: 2026-10-27. Scope: **Milestone 1, the Living Forest**, as requested by the final implementation-priority paragraph. This is a complete short forest objective and its forest-only benchmark, not completion of the four-zone long-term game.

## Delivered behavior

- New 25th launcher game in the existing application; existing 24 games, profiles, records, creations and hidden-game access remain.
- Solo or simultaneous two-player co-op: walk, run, jump, tap-to-navigate, camera orbit/zoom, independently owned movement/action inputs and a shared camera tether.
- Restore three lanterns within interaction range, use the bridge over deep water, recover at lantern checkpoints and finish through the northern gate. Co-op waits for both explorers. Unlimited restarts, once-only completion records, separate co-op profile awards and two new achievements.
- Mandatory instructions before scene/physics/audio initialization. Internal replay does not repeat them; a new open session does. Manual help pauses the world; Escape cannot resume through it. Loading controls are guarded, pause stops physics and input, and async exits dispose stale scenes.
- Imported textured 41-joint KayKit Knight/Rogue heroes with 14 retained actual clips; ten Quaternius tree/foliage models, Poly Haven rock/fern/surface maps, four genuine tree LODs and three original textured ruin models. 22 self-contained GLBs with exact hashes and CC0 license records. Original ruins have 3,416/1,080/2,764 triangles; no placeholder castle/combat zones.
- Babylon.js 9.32.0 and Havok 1.3.14 reused. Real terrain MESH contact, controlled character capsules and bounded dynamic prop bodies. Physics crates settle and can reset without body leaks. Character locomotion is a kinematic terrain solver; no imported-hero ragdoll is claimed.
- PBR ground/bark/stone, actual base-color/normal/roughness maps, instanced static imports on GPU, LOD/distance/foliage culling, wind transforms, atmospheric motes, procedural local ambient audio and four lighting/weather configurations.
- Low/Medium/High/Ultra/Experimental Maximum/Auto, plus individual graphics controls and safe recovery. Hardware caps bound resources. Software mode explicitly removes GPU-only effects and reduces geometry/texture workload.
- Actual frame monitor, five-stage 35-second forest baseline (5-second warm-up, 30 seconds measured), history capped at 20 runs, comparison, JSON/raw sample export, CSV stage export, measured 30/60 FPS settings finder. Benchmark input/scoring/adaptive reductions disabled. Pause, settings, hidden tabs and resize abort unfinished runs without results.
- Version 6.1.0, home version/summary, first-launch and per-game introduction notes, full local offline precache. No unrelated release history overwritten.

## Actual browser evidence

Managed Chrome preview at 1363×936. Renderer: **Software compatibility**, WebGL unavailable. Effective canvas **900×571**, Compatibility Low, 8 dynamic props, two animated characters in the automatic baseline, day lighting, no ambience during measurement, AO/reflections/post/shadows off. System RAM/VRAM and GPU counters unavailable, explicitly N/A. JS heap is labeled separately.

| Actual metric | Value |
|---|---:|
| Average FPS | 1.20286 |
| 1% low FPS | 0.98299 |
| Frames | 37 |
| Recorded interval sum | 30759.90 ms |
| Median | 1016.20 ms |
| p95 | 1016.90 ms |
| Worst | 1017.30 ms |
| Intervals over 50 ms | 36 |

| Forest stage | Average FPS | 1% low FPS | p95 ms |
|---|---:|---:|---:|
| Canopy trail | 0.984 | 0.983 | 1016.60 |
| Water and reflections | 1.347 | 0.983 | 1016.60 |
| Ruins and lighting | 0.984 | 0.983 | 1016.70 |
| Animated explorers | 1.729 | 0.983 | 1016.70 |
| Physics grove | 0.984 | 0.983 | 1016.90 |

This is a **poor software-rendering result**, below both targets. Its 37-frame sample is explicitly flagged small. It does not establish Windows GPU performance, 30/60 FPS support or minimum hardware specifications. The nearly one-second cadence's precise cause was not established; do not attribute it solely to CPU/GPU hardware or assert a measured optimization gain.

Evidence: `verification/6.1.0/forest-baseline-software.json`, matching `forest-baseline-software.csv`, and `forest-baseline-results.jpg`. `forest-live-software.jpg` records the actual reduced live scene; it is not presented as GPU visual quality. Exported average was independently recomputed from the actual raw intervals; CSV numbers match JSON. The first CSV download did not produce a file; a later intentional export succeeded and its nonempty file was verified. The initial completed run found an HTTP-preview UUID API failure; the arcade's existing compatible `uid()` helper corrected it before this successful result.

Live checks observed: launcher version/notes and 25 games; game-specific introduction; solo and co-op setup/instructions; both actual imported heroes; independent WASD/arrow movement; settings and disabled N/A effects; loading guards; completed baseline; JSON/CSV downloads; result/history reopening; result/history persistence and Low preference after reload; results dialog fits with scrollWidth equal to clientWidth (818px); document has no horizontal overflow. Find My Best Settings correctly reports failure to sustain 30 FPS and selects Low. No fixture FPS is presented as hardware evidence.

## Automated verification

- `npm test`: 33 test programs, including existing 2D games, saves/backup, instructions, math/spelling/media/camera fixtures, shared 3D toolkit/starter and Wobbly Wars regressions. The final packaging workflow runs the suite against the exact source before committing.
- `node tests/3d-adventure.mjs`: independently exercises terrain/collision/navigation/jump, camera wall recovery/zoom, actual DOM adapter with two pointer IDs, input gating/cleanup, frame statistics, warm-up/abort, immutable settings, CSV, pacing recommendations, bounded graphics caps and affine texture draw calls. No Wobbly Wars/Limit rules imported.
- `node tests/limit-core.mjs`: complete solo and co-op routes through legal navigation and real interaction ranges; all lanterns, bridge, checkpoint recovery, both-at-exit condition, frozen completion and seeded camera paths.
- `node tests/limit-controller.mjs`: actual UI controller with explicit fixtures verifies no model/engine before acknowledgment, pause, internal restart, once-only scoring, no benchmark points, two separate co-op records, aborted run rejection, real achievement API and backup roundtrip/rejection of incomplete raw data.
- `node tests/limit-assets.mjs`: every GLB hash/size/container/embedded resource, triangle count, 41-joint/14-clip imports, true LOD reduction, local texture limits, license files and offline coverage.
- `node tests/limit-scene.mjs`: real Babylon NullEngine + bundled Havok + actual GLBs; visible accessory policy, actual skeleton animation changes, PBR texture objects, upward terrain normals, real crate settling, two heroes, telemetry N/A/memory conversion, weather settings and zero bodies after complete disposal. Image decode objects here are fixtures; browser image QA is separate.
- `node --check`: all 16 new/modified scene/game/shared modules passed. `git diff --check` passed. Buildless HTML/JS has **no production bundler/build script**; static packaging is the production output.

Old VM backup fixtures now receive the real new validator import. Old launcher/instruction count assertions were updated from 24/25 to 25/26; their prior gameplay/saved-data assertions remain.

## Source organization and reuse

Shared additive interfaces: `dist/js/3d/third-person.js`, `action-input.js`, `benchmark.js`, `graphics.js`, `telemetry.js`; exported through `index.js`. Existing scene callback adds raw frame metadata, physics collider accepts optional shape, software renderer supports opt-in local UV textures/opacity and active-mesh traversal. Existing consumers preserve their APIs. Independent tests establish reuse rather than merely extracting game code.

Game-specific rules/assets/UI/audio/art remain in `dist/js/limit/`, `dist/assets/limit/`, `dist/limit-break.css`. Integration changes are in `shell.js`, `visuals.js`, `data.js`, `game-instructions.js`, `releases.js`, `index.html`, service worker and version/test manifests. Asset generators, source maps and provenance are under `scripts/limit/` and the parameterized `scripts/prepare-limit-assets.py`. See `3D_GAME_DEVELOPMENT.md` for interfaces, dependencies, examples, new-game integration and required checks. Wobbly Wars gameplay/purchasing/weapon code was not edited.

## Explicit limits / next milestones

- **Not shipped:** castle/interior exploration, working doors, combat/enemies/AI stress, melee/projectiles/dodge, boss, imported-hero ragdolls, destructibles, wildlife, four-zone progression or adjustable Chaos Chamber. Existing toolkit combat/AI/ragdolls remain available but are not falsely counted as this game's new content.
- Shadow maps, SSAO2, planar water reflections, ACES/post-processing and GPU instancing are implemented behind actual capability gates but **not visually or performance-validated on GPU hardware in this environment**. WebGL 1 and resource-failure behavior need target-device verification.
- Software Canvas uses affine texture projection and painter ordering, with reduced detail; it does not have GPU depth/PBR/shadows/reflections. It remains visually inferior, with visible distant clipping/texture artifacts in its live screenshot, and its measured frame rate here is unsuitable for smooth action. No target-hardware performance pass is claimed.
- Simultaneous physical Windows touchscreen input, true hardware gamepads, audible sound quality, multiple actual display resolutions/fullscreen transitions and end-to-end human-controlled completion on the target PC are unverified. The independent pointer/gamepad/controller and full completion-route fixtures pass. Live keyboard movement was observed; a whole live chapter was not manually completed at the poor cloud cadence.
- The original ruin preview and imported geometry are real art assets; an offline art preview is not substituted for a game screenshot. The attached proof is an actual browser result.
- Benchmark camera/seed/settings are repeatable; browser scheduling and Havok are not bit-for-bit deterministic across hardware. Stage boundaries can overshoot by one interval. Short auto-tune samples are not sustained performance guarantees.
- Offline asset/cache behavior passes fixtures; the HTTP preview cannot install service workers, so actual offline launch on Windows remains unverified. Private sign-in on a new browser can still require network access.

Publication uses the existing Site and preserves its owner-private audience. No local profile data is uploaded as part of the game source or benchmark evidence.
