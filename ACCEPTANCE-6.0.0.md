# Little Big Arcade 6.0.0 — acceptance and limits

## Scope and recovery

Upgrades Wobbly Wars inside the existing static arcade. Adds a reusable, documented 3D toolkit and a separate runnable starter. Existing 24 normal games, hidden game access, profiles, scores, projects and schema-3 backups remain. The other games retain their engines and designs.

Starting source: `fedbb1e2dc44a1b1cc9a0b48370d784009ef0d8f` (5.6.0). Recovery branch: `checkpoint/wobbly-wars-before-3d`. The preserved classic Wobbly Wars edition remains accessible, with separate old record editions.

## Delivered functionality

- Babylon.js 9.32.0, glTF loaders and Havok 1.3.14 are pinned and bundled locally with licenses. No runtime CDN, paid API or new account requirement.
- Original CC0 12-joint skinned soldier, 1,872 triangles, with custom character geometry, imported clips and game-specific blended poses. Original articulated pony/dragon/cannon assets include leg, wing and wheel pivots. Unit class art, rig mapping, weapons and environment palettes are outside the toolkit.
- Controlled ground navigation, obstacle routes, crowd separation, facing, distance-based gaits, timed windup/contact/recovery, shields, knockback, stagger, bounded physical ragdolls and blended recovery.
- Visible sword/club/heavy sweeps, spear thrusts, bow releases, cannon muzzle shots, healing and distinct arrow/stone/shell/elemental/pulse projectiles. Combat uses active weapon contacts and swept projectile collision, not invisible proximity damage pulses.
- 21 classes, 20 campaign battles, ten battlefield variants, five difficulties (Hard default), budgets/caps/factions, solo, local versus, co-op, sandbox, random armies and endless reinforcements.
- Independent simultaneous pointer ownership on reported multitouch hardware; clear deployment turns for mouse-style devices. Both players must be ready before combat. Best-of-five waits for three victories; drawn rounds continue.
- Tap placement, drag repositioning and drag-to-deploy cards, camera orbit/pinch/zoom, pause, playback speed, restart/rematch, saved armies, current/classic records, existing achievements and autosaved profile outcomes.
- Shared instruction gate before model/engine/audio initialization; manual help pauses. Internal restarts do not repeat acknowledgment. New sessions require acknowledgment.
- Low/Medium/High presets, bounded ragdolls/effects/projectiles, shared geometry and cached containers, development counters, explicit software compatibility rendering, startup error/retry/classic fallback and reported frame failures.
- Dedicated `dist/js/3d/` toolkit, public API 1.0, `3D_GAME_DEVELOPMENT.md`, independent tests and the Beacon Couriers starter at `/dev/3d-starter/index.html`. Starter has its own rules/UI and no Wobbly Wars or profile imports. New project instructions require future 3D work to inspect/reuse these systems and regression-test consumers.

## Commands and results

- `npm install --save-exact babylonjs@9.32.0 babylonjs-loaders@9.32.0 @babylonjs/havok@1.3.14` — succeeded using the existing npm project.
- `node scripts/vendor-3d.mjs` — reproducibly copied engine/loader/WASM/licenses into the local bundle.
- `python scripts/generate-wars-props.py` — generated and checked articulated pony (816 triangles), dragon (840), cannon (754), with finite bounds and valid GLB structure. Soldier generation/binary/skin validation also passed.
- `node tests/3d-toolkit.mjs` — independent component tests passed without Wobbly Wars imports. Includes custom-size controller/navigation tests, imported clip transitions, timed contact, swept pooled projectiles, pointer crossing/release ownership, camera picking roundtrips, budget rules, asset deduplication/disposal, muted audio lifecycle, particle cleanup, frame statistics, real Havok settling, five ragdoll recovery/disposal cycles, actual skinned triangle software rendering and scene error/cleanup handling. One- and two-player starter games complete through legal movement and shots.
- `node tests/wars3d-core.mjs` — legal winning formations found for all 20 campaign levels at each of five difficulties (100/100). Also verifies costs, caps, refunds, atomic saved-army loads, mirrored red formations, co-op ownership, obstacle-safe controllers, active weapon contact, swept arrows, shields, both teams winning and larger armies.
- Increasing pure simulation checks: 16, 48 and 96 units finish with finite positions/outcomes. Representative complete-battle CPU timings were approximately 26 ms / 131 ms / 478 ms in one run. These totals are CPU simulation measurements, not rendered FPS or Windows benchmarks; formations/battle durations differ.
- `node tests/wars3d-controller.mjs` — actual controller event handlers block early initialization, pause clocks, retain the session gate across restarts, isolate turns/workspaces, continue drawn series, commit exactly once and record co-op independently. Real arcade APIs verify achievements, old/new ruleset separation, no co-op head-to-head changes, preferences and saved-army backup roundtrip.
- `npm test` — all 23 suites passed, including all existing games, physics, spelling/voices, camera fixtures, math (119,400 problems), gladiator careers, backup safety, offline/update lifecycle and the three new 3D suites. Final packaging reruns the same command against the packaged source.
- `git diff --check` — passed.
- No production build script exists: this remains a buildless static application. No transpilation/build pass is claimed.

## Interactive browser checks

- Application-wide 6.0.0 update notice and Wobbly Wars-specific notes appeared and required acknowledgment.
- Wobbly Wars instructions appeared after Play; the battlefield canvas count remained zero until Start acknowledgment.
- Loaded a 24-unit mixed sandbox deployment with actual soldier, mount, cannon and class accessories. Costs stayed within 2,000 coins per army; both sides could be edited independently.
- Completed an actual local two-player battle: Player 1 deployed a 330-coin Hammer Giant, pressed Ready; Player 2 deployed a 60-coin Club Fighter and pressed Ready. Both started together. The battle finished in 3.5 simulation seconds with blue victory, one survivor and a real result screen. No `3D frame` console errors were reported.
- Actual stored record screen showed Kelly 1,272 points/victory and Roxy 0 points, with `wars-3d-v1`, versus-campaign and field/budget/cap/faction/series conditions. Classic record editions remained separately selectable.
- Starter launched with two couriers, neutral AI guide and four dynamic crates. A mouse ground tap moved only Player 1 (from -6,3 toward -9.3,-3); Player 2 remained at 6,3. Pause/Resume controls worked. Synthetic tests independently complete both player routes and firing objectives.
- Screenshots record the observed browser result. Browser tests use mouse input and the labeled software compatibility renderer.

## Bugs caught and corrected

Removed an obsolete Babylon support-check API; engine construction now detects capability failure. Fixed scene color conversion, non-indexed GLB rendering and ground painter order. Corrected camera orientation, projectile/weapon orientation and socket alignment. Fixed split-slime placement near obstacles, duplicate formation IDs, atomic failed loads and red-army normalization. Preserved pointer ownership/workspaces and stopped multiplayer Undo from modifying another player's placement. Co-op now commits one profile at a time; series draws no longer finish Best-of-Five. Fixed use of the real profile object in the achievement API and prevented unranked sandbox achievement XP. Updated old release-count fixtures without changing update acknowledgment behavior.

## Verification limits and known constraints

The cloud browser cannot create a WebGL context. Actual GPU shaders, lighting/shadows, Windows integrated-GPU performance and physical NEC/USB multitouch were not tested. Do not interpret the successful Node/NullEngine/Havok fixtures as physical hardware verification.

Software rendering ran at only a few measured FPS (often approximately 1 FPS in this cloud browser), with high frame latency. It is a labeled small-scene compatibility path, not equivalent GPU quality/performance. Large armies should use supported WebGL hardware or the preserved classic edition. Approximately 30 FPS on modest Windows GPU hardware remains a target requiring measurement on that PC.

Version-1 navigation handles flat ground and rectangular obstacles, not arbitrary navmeshes, terrain slopes or stair/jump motors. Projectile hits use swept body volumes, not individual animated skin triangles. Ragdoll caps use animated death poses when the physical-body budget is exhausted. Per-rig anatomical limits need authoring and visual review. The software renderer uses flat colors/painter ordering, with no GPU shadows/textures/postprocessing or exact intersecting-polygon depth. No online multiplayer, rollback netcode, compressed model/texture decoder, generic LOD generator or GPU crowd-animation system is claimed.

These limits are documented in the reusable development guide. Existing games, saved data, voices and camera behavior were regression-tested rather than redesigned.
