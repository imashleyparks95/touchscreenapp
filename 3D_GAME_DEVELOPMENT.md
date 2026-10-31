# Little Big Arcade — 3D game development toolkit

## Cloudwake Couriers — original game-owned consumer (6.33.0)

Cloudwake adds a separate vehicle/delivery game in `dist/js/creative/`, not another Forest/Wobbly ruleset. It reuses create3DScene, staticCollider/controlledCapsule, create3DEffects, createSynthAudio and GamepadHub/padAxis/padButton with toolkit API 1.0 unchanged. Original lofted craft/harbor geometry, three procedural WebGL surface textures, batching, movement/altitude/collisions, parcel rules, camera/map and presentation remain game-owned. Authoritative collisions are deterministic kinematic flight rules with real static/animated Havok scene proxies; no rigidbody-aerodynamics claim. Native ownership yields during setup/pause/results; disconnect/help/background/late loading pause and captures cancel.

`tests/creative-freedom-scene.mjs` checks actual custom geometry/normals, real physics proxies, propeller freeze, exact positions, camera modes, repeatable maximal-scene counts (89 meshes / 35 materials / 12 bodies / 28,226 vertices) and full scene disposal. Pure tests legally complete all 60 solo/co-op route/difficulty combinations; browser fixtures complete actual native co-op play, and a separate unmodified browser test runs RAF/keyboard and real offline engine reload/failure recovery. Shared toolkit/starter and full prior game regressions remain. See `docs/CREATIVE_FREEDOM_DELIVERY.md` and progress/evidence for exact results/limits. Physical Windows/controller/multitouch/GPU/audio verification remains a user trial; short cloud-host render statistics do not certify target 60 FPS.

## Lighting and live effects quality — 6.25.0 (Milestone 8E)

`createWarEnvironment` colors the existing `sky` hemisphere and `sun` directional lights using restrained snow/volcanic/daylight tints and the biome's soil bounce. No extra lights, passes, physics bodies or shared renderer defaults. Light lookup is optional for standalone fixture scenes. Existing geometry/material art and Low compatibility rendering remain.

Shared `create3DEffects` retains its API but now resets pooled spark scale before reuse. It reads particle caps from existing `QUALITY`, applies presentation/reduced-motion preferences to that cap, and trims existing active sparks in `update(0)` as well as live updates. Thus Off takes effect while paused; lowering quality cannot leave a previous high-quality burst active above the new cap. Pooled meshes stay bounded; inactive meshes remain reusable until disposal. Event callbacks/audio routing remain independent of decorative visibility. Shared toolkit/starter and Forest regressions are required for this shared fix.

Independent `tests/3d-effects.mjs` uses real Babylon meshes to check reset, live full/reduced/off and quality caps, paused motion, callback delivery, bounded reuse and disposal. Ten-map environment tests verify existing two-light tint and unchanged collision/art bounds. Browser presentation regression switches actual high/medium/low graphics while paused and checks engine scaling, frozen clock and two-light policy. Physical PC frame pacing is still a user trial, not implied by these correctness tests.

## Wobbly AI stability — 6.24.0 (Milestone 8D)

Game-owned Battle3D keeps an active attack's living target through its windup/release. A dead locked target cancels that obsolete attack; changing navigation target clears the old route. Fixed-step ID lookup uses a local Map of live units; it is rebuilt each step, so no persistent cache survives resets or split spawns. Existing shared targeting/navigation and deferred contact resolution remain unchanged. Each actor resets movement velocity/speed before decisions, preventing stopped/stunned attackers from retaining a previous walking velocity. No damage, budget, period, physics, rig, hand/weapon or shared toolkit API changes.

`tests/wars3d-ai.mjs` covers attack locks/dead-target recovery and stopped/stunned velocity, then legally places 48 mixed troops per side on four battlefields. It checks terrain-safe finite actors, bounded projectiles/splitting, battle termination and terminal clock. Logged CPU duration is simulation work, not GPU/frame-rate evidence. The ordinary core suite still checks all 100 campaign/difficulty solutions.

## Wobbly model presentation and framing — 6.23.0 (Milestone 8C)

Game-owned `wars3d-presentation.js` supplies `createWarFraming(runtime,{onChange})` and pure `warPropMotion(unit,{clock,deathAge,reduceMotion})`. Shared toolkit API 1.0, camera factory defaults, rigs and measured hand/weapon paths remain unchanged. The game observes CSS and render aspect ratios from its existing render callback; no extra observer/loop is introduced. Overview fitting projects all eight corners of the 24×14 m battlefield / 0–3.8 m actor-height box through the actual Babylon view/projection matrices, uses bounded radius search and reserves space for stage controls. Tested desktop/portrait aspect ratios fit those extents. This is not an automatic chase camera or a guarantee that off-board scenery/projectiles always fit.

Initial/Reset overview uses a portrait-friendly orientation; resizing refits while preserving orbit. Manual orbit/zoom remains until resize or Reset. Fit cancels pending deployment first, preserving original formation. Inspect Troop centers the selected placed/live troop (or first active-side troop), radius 7 with close limit 6; Reset restores overview with close limit 12. Overview's far limit expands as needed up to 125 within the existing far clip plane; native and UI zoom read the live limits. `openWars3D` accepts a game-owned framing-factory injection for controller-only fixtures; real engine and browser tests cover actual fitting. Shared `cameraRig.zoom` still owns its original configured limits, so Wobbly's buttons use the current camera limits directly.

`wars3d-details.js` adds real-spine accessories for Archer (quiver/stored arrows), Slinger (pouch/clasp), Scout (trailing scarf) and Pulse Ranger (plated core). Each adds at most two meshes and no body. Visibility/fade applies to every accessory; decorative scarf/core/cloth motion respects reduce-motion and zero dt. Existing imported meshes remain intact. Mounted prop legs and cannon wheels remain distance driven. Dragon wing presentation responds to movement, reduced motion and renderer-owned defeat age so it settles even after the battle clock stops. This does not alter actor rig targets, weapon sockets, contact timing or game damage.

`tests/wars3d-presentation.mjs` checks actual camera matrices and portrait/rotated fits, inspect/stable resizing/disposal, actual imported-rig accessory sockets/body counts/pause/reduce-motion/fade, and real imported pony legs, cannon wheels and dragon wing/death transforms. Existing 630-pose weapon and all toolkit/starter/Forest regressions still run. `npm run test:wars:presentation:browser` derives projection checks from the real battlefield mesh bounds, deploys/inspects the four classes, cancels held movement through resize and checks separated phone controls. Layout audits pause a legally started battle via its real UI so audits do not race a completed battle. Native and pointer browser regressions also wait for real resize/neutral-input transitions. Physical hardware, GPU/frame pacing and audible audio remain separate trials.


## Native Wobbly battlefield controls — 6.22.0 (Milestone 8B)

`wars3d-native.js` is a **game-owned** adapter over the independently tested `GamepadHub`, `padAxis`/`padButton` and `cameraRelativeMovement`; toolkit API 1.0 and those interfaces are unchanged. It owns an input-only RAF after acknowledged scene startup. `createWarNative({players,getContext,getPads,onPlace,onPick,onPreview,onDrop,onCancel,onCycle,onReady,onPause,onHelp,onMenus})` returns `hub`, `states`, `tick`, `refresh`, `cancel`, `cursors` and `dispose`; optional `auto:false`/request/cancel injection supports independent fixtures. It never advances combat, physics, audio or scores. All costs/placement, ready/turn checks and moves route back through the existing game functions.

Active field controls set the existing `[data-native-gamepad="true"]` marker so the shared arcade cursor yields. Setup/loading/dialogs/pause/results and explicit **B → menu cursors** release ownership. **GAMEPAD: FIELD** restores it; entering/resuming/changing contexts requires released buttons. Slot ownership is stable through sparse device indices and disconnects. Disconnect during native input pauses the game, cancels held moves, and never resumes on reconnect. The shared adapter still owns menu pairing/navigation; its input algorithm is unchanged.

Left stick moves a camera-relative, bounded ground cursor; LT gives precision. D-pad cycles available troops. A uses original deploy/commit logic, X picks an owned existing troop, B cancels a move or exits field controls, Y uses original Ready/Start buttons, Menu pauses and View reviews instructions. Right stick orbits; LB/RB zoom within existing limits. P1's active camera intent takes priority when both look; P2 can look while P1 is neutral. Camera input waits until held deployment moves are finished/canceled, protecting mixed-touch projection. P1 has a cyan circular marker, P2 an amber diamond; these non-pickable scene meshes have no physics bodies and are owned by `createWarScene`'s optional `getNativeCursors` callback. Each co-op cursor stays in its own blue half. Touch and native handles share the original preview Map and cannot steal one another's troop.

Choose **Simultaneous · touch / two controllers** for simultaneous controller deployment even on a display that reports no multitouch. Alternating turns remain supported. Two native cursors need two standard controllers; a one-controller two-player session can use menu-cursor mode/pass-and-play or mixed touch. Classic remains cursor-controlled. The library and instruction text distinguish these capabilities. Result input descriptions now say pointer/field-controller or simultaneous input, while retaining old descriptions in earlier records; no score edition or schema change.

Verification: `tests/wars3d-native.mjs` covers real army cost/ownership calls with input fixtures, neutral/context/button edges, cancel-before-menus, camera basis/drift/limits, repeat, independent co-op/versus, sparse slots/disconnect and disposal. `tests/wars3d-controller.mjs` executes the actual adapter-to-game wiring for paid placements, mixed native/touch held moves, Ready/start and alternating-turn edge safety. Real imported-rig scene tests verify visible marker transforms, shape distinction, hidden state/disposal and no new bodies. `npm run test:wars:native:browser` exercises the production native and global adapters with explicit `getGamepads` fixtures and actual Babylon/Havok; `test:wars:browser` retains the real pointer/save/gallery path. Independent toolkit/starter/Forest and full arcade regressions still run. These checks do not certify physical Windows, USB/Bluetooth, audio or target-GPU behavior.


## Wobbly Wars checkpoint — 6.21.0 (Milestone 8A)

Toolkit API 1.0, Babylon/Havok versions, imported rig/hand mappings and classic edition remain unchanged. New game-owned `wars3d-polish.js` provides immutable deployment/camera guidance and `commitWarMove(model,handle,point,{coop})`: only a legal release changes authoritative formation and adds one undo state. `wars3d.js` owns per-unit held previews and source-card captures; `createWarScene(runtime,model,{getDeploymentPreviews})` optionally reads that game-owned Map to display copied coordinates during build. It does not modify model items, budgets, combat, or shared engine policy. Cancel/pause/camera/scene changes drop previews. Ready clears only its owner's previews; another player can finish their independent drag. Tap-to-purchase remains immediate on pointer-down, as before.

Saved-army gallery loading permits the deliberate pause while retaining phase, turn, Ready, budget, ownership and co-op-half checks. Save/gallery close restores prior pause state unless a later hide/blur occurred. A scene finishing local asset loading while hidden or unfocused stays paused. `engine.canvasTabIndex=0` is set by this game because Babylon otherwise restores its positive default after pointer input. Shared input and scene APIs are unchanged.

`wars3d-details.js` adds segmented nine-vertex cloth and one nine-vertex/twelve-triangle enamel crest for the seven existing cloaked classes. Both follow the real spine through `createBoneAttachments`, pause/fade and dispose together. Material policy and rig bone names remain game-owned. This adds no physics body and leaves measured weapon/palm/support/shield paths intact. The software renderer retains its existing material-only color limitations; vertex enamel/cloth shading requires the WebGL path. No imported asset replacement is claimed.

Verification: `tests/wars3d-polish.mjs` uses actual imported rigs/Havok/sockets, 14 costume variants, real scene preview positions without model mutation, legal commits/undo, pause/fade/disposal and unchanged body counts. `tests/wars3d-controller.mjs` retains 133 real card-to-model purchase scenarios and adds actual cancel/commit/undo, co-op ownership, gallery/name-close/background and late-load checks. `npm test` runs independent toolkit/starter, all weapon/arm-clearance/campaign/Forest regressions. `npm run test:wars:browser` uses actual Babylon/Havok, projected ground pointers, save/load/backups, camera/battle/pause/cleanup and desktop/phone audits. Browser fixtures are not physical Windows, controller, audio or target-GPU acceptance. Controller access is still the shared cursor; native battlefield controls remain proposed M8B work.


## Controller ownership update — 6.11.0

The lightweight 2D Slime Lab/Shadow Ninjas adapter in `dist/js/touch-native.js` reuses the existing independent `GamepadHub`, `padAxis` and `padButton` without changing toolkit API 1.0 or any 3D rules. The global arcade cursor yields both to Forest's `.lb-app` and to active `[data-native-gamepad="true"]` motion-game panels. Motion-game menus/paused screens return to global navigation. Preserve this ownership boundary when adding consumers; do not poll two gameplay adapters into the same player. See `ARCADE_REVAMP_PROGRESS.md` M7C and `tests/motion-revamp.mjs` / `tests/motion-browser.mjs` for exact supported actions and fixture-versus-hardware limits. Other pointer games retain cursor support; this is not universal native-gameplay certification.


## Five-world benchmarking — 6.8.0

`limit/benchmark-suite.js` is a game-owned adapter over the existing independent `BenchmarkRun`/`FrameLog`, graphics presets, telemetry and real Forest/Journey scenes. Shared toolkit API 1.0 and other consumers are unchanged. `SUITE_STAGES` defines Forest rendering, Castle lighting, Arena combat, Chamber physics/particles and combined Chamber load. Each is freshly loaded, warmed for 3 seconds and recorded for 8 seconds. Loading/warm-up frames are excluded; settings are fixed per preset, with no adaptive quality. A fixed seeded model and camera path run with scripted 60 Hz intents. Catch-up is capped at 100 ms per rendered frame; very slow machines therefore advance less simulation time, recorded per scenario. Havok/backend scheduling is not bit-for-bit deterministic. Invulnerable benchmark actors preserve the combat workload; these are intentional benchmark rules, never adventure behavior.

Chamber tests use actual animated rigs/AI/crates/pulses/motes/lights with compatibility caps; crates receive periodic impulses rather than remaining asleep after warm-up. Scene ownership and asynchronous session tokens remain unchanged. Pause/help/settings/focus/resize abort without a partial history entry. Safe graphics recovery returns to the adventure. Formal tests produce no arcade points or adventure progression.

`four-worlds-v1` history shares the existing bounded 20-run device-local history and schema-3 backup. Per-scenario raw arrays must concatenate exactly to the aggregate. JSON includes raw samples, settings, browser/backend/GL info, effective resolution, actual scene counters and simulation time. CSV includes identity, scenario summaries and raw per-scenario frames. History identifies edition/settings/backend/browser/resolution/seed matches and shows average-FPS differences against the latest other matching run. This does not control OS load or prove identical hardware. Preserve all historical Forest editions.

Settings → Find My Best Settings runs all five scenarios at each supported preset (Low through Experimental Maximum, Low only on Canvas compatibility). Targets remain 30/60 FPS. Every scenario must meet average FPS ≥ target, 1% low ≥ 75% of target and p95 ≤ 1.35 × target frame budget. Highest passing tested preset wins; otherwise select Low with a warning. Preferences remain manually overridable. Tuning uses transient reports rather than polluting formal history. Allow roughly a minute per preset plus loading.

Verification: `tests/limit-benchmark.mjs` tests seeded workload repeatability/caps, warm-up exclusion, aggregation, comparisons, export and actual backup validation. `tests/limit-controller.mjs` also tests all 25 tuning samples and lifecycle with explicit capability/frame fixtures. `npm run test:benchmark:browser` runs actual five scenes, real exports/history/backups, responsive results and abort/safe recovery. Fixture timing is not hardware evidence. See the current progress record and `docs/revamp/M6_*` for actual results. All older sections below retain their historical scope.


## Connected expedition — 6.7.0 (current Limit Break scope)

The historical Forest-only sections below describe earlier releases. Project Limit Break now offers a separate **Full Expedition** through Living Forest → Ancient Castle → Crown Arena → Chaos Chamber, while retaining **Play the Forest** and the unchanged five-stage Forest Baseline. These areas are serial chapters with explicit Continue transitions, not a streamed open world or new public game registrations. Unfinished expeditions restart from the Forest; only complete four-area runs write the new `limit-expedition-v1` / `four-paths-1` edition. Solo/co-op records are separate; the adventure records UI also retains Forest v1/v2 and the benchmark-history link. Schema-3 backups validate the optional new completion shape without rejecting old Forest editions.

`limit/journey-worlds.js` owns authored room/wall/stair/door/seal/exit extents. Visible main architecture, rule collisions, dynamic-door camera walls and real Havok proxies derive from those definitions; imported seal/lever/gateway supports have invisible proxies. Castle side rooms require Interact to raise their doors; two seals, guardians and the keep lever unlock the next exit. The Arena has cover, stepped galleries and a scaled imported Crown Warden that adds ranged casts below half health. The Chamber has two reactors, guardians and the return exit. Both explorers must reach each exit; health/objectives reset for the next chapter. Existing obstacle-aware movement, fixed-step combat, dodge/recovery, measured blade/palm paths and native input are reused.

`limit/core.js` accepts an optional game-owned `world` configuration; defaults preserve the Forest behavior. `LimitExpedition` in `limit/journey.js` owns progression/aggregate summaries, has no renderer/storage dependency, and refuses to advance an unfinished area. `ExpeditionArea` owns the boss phase and optional workload units. `limit/adventure-actors.js` centralizes these exact bundled KayKit rigs/clips/hand slots for both renderers; it is **not** advertised as a generic humanoid toolkit. `limit/journey-scene.js` owns the new procedural architecture, original runtime masonry texture, imported scenery/actors, real physics, lighting transitions and bounded scene cleanup. No shared toolkit API/version or engine upgrade is introduced.

Chamber controls bound animated guides, optional AI, actual Havok crates, non-damaging demo pulses, energy motes, extra lights and decorative complexity. Keyboard/touch/controller interfaces and per-game graphics still supply draw distance/resolution/capability-gated effects. `configureChamber` plus `refreshLoad` pause/reconcile units and resources; reset removes optional actors/effects and restores defaults. Repeated actual Babylon/Havok tests prove stable body/mesh/material counts after warm-up/reset. Optional enemies do not lock completion. Current load counters distinguish optional alive AI from the objective guardians. A fresh monitor window starts after each load change; up to eight transient measured windows can be captured/exported with actual counts, renderer/resolution and frame statistics. They are **interactive measured windows, not controlled formal benchmark runs**; M6 still needs repeatable multi-zone scenarios and comparisons. The existing Forest workload ID/history is unchanged.

New entrances have clearance for the third-person camera. Async loading that completes while hidden/unfocused remains paused; it must not resume a chapter or start a formal run automatically. Scene transitions dispose prior input/captures/audio/graphics/physics/engine, guard late results with session tokens, preserve the shared native controller hub, and do not repeat the open-session instruction acknowledgement.

Required checks: `npm test` (41 programs), `npm run test:browser`, `npm run test:library:browser`, `npm run test:limit:browser`, `npm run test:expedition:browser`, audit and build. `tests/limit-expedition.mjs` completes all objectives through legal solo/co-op movement/attacks, doors and exits with no forced kills/unlocks; it tests edition-specific persistence/backup compatibility. `tests/limit-journey-scene.mjs` loads real rigs/architecture/Havok, checks large-boss weapon/palm alignment and repeated workload reset/disposal. The actual UI fixture isolates transition/scoring and hidden-load pauses. The browser expedition test uses real scenes/keys/load/export/records/cleanup, with explicitly forced objective state only to isolate transitions and controlled actor placement for collision/visual inspection. It is not a full physical playthrough. Windows/touch/controller/GPU/audio testing remains on the target device.

Imported-hero ragdolls, destructible castle architecture, free backtracking/streaming and saved mid-expedition resume are not claimed. Models are the existing licensed imports; authored environments and the boss encounter are new. See `docs/revamp/M5_ASSET_PROVENANCE.md` and current progress/evidence for exact scope.

## Shared arcade foundation — 6.5.0

Read `SHARED_ARCADE_SYSTEMS.md` for lightweight lifetime, pointer-coordinate/contact, menu, music-clock and decorative-presentation contracts. Forest LOOK and both menu adapters use independently tested shared helpers without moving Forest policy into the toolkit. GamepadHub and existing 3D graphics capability negotiation remain the reusable foundations; no incompatible toolkit API version change is introduced.

`bind3DInput` now releases actual captures on normal completion, cancellation, blur/hide/pagehide and disposal. `pointercancel`/`lostpointercapture` call cancellation instead of successful `up`, preventing cancelled deployment/interactions from committing. Cancellation can receive `(handle,event)` for an individual contact; explicit `cancel()`/disposal still invoke the game cleanup callback without arguments. `ground(event)` returns null for a zero-size surface and uses the current CSS rectangle. Independent real Babylon projection/two-player/capture/cancellation tests cover this correction, followed by starter, Wobbly Wars and actual Forest browser regressions.

`create3DEffects(runtime,{onEvent,getPresentation})` adds an optional settings callback, defaulting to unchanged full effects. It reads only decorative particle intensity/reduced-motion; events still route to audio/game callbacks when visual particles are off. Wobbly Wars passes the arcade settings; unrelated games and formal Forest benchmark workloads retain their own configuration. Do not relabel this as native controller gameplay support or a new graphics engine.

## Forest foundation controls — 6.4.0

`dist/js/limit/input-settings.js` is Forest-owned policy, not a new shared engine contract. It normalizes bounded controller/touch camera speeds, camera-stick deadzone, invert-Y and Auto/Show/Hide touch preferences. Optional preferences live in `DB.settings.limitBreak.input`; older backups without them remain valid. `limit/records.js` rejects malformed or out-of-range saved options.

The native menu adapter accepts optional `getLookDeadzone` and `onActivity` callbacks. Active controller input can hide Auto touch UI; mixed co-op retains a touch partner's controls, and active touch captures keep Auto UI visible until released. A persistent toolbar control restores explicitly hidden controls. The separate LOOK region owns one camera pointer independently of both movement sticks and action buttons. Pause, explicit hiding and disposal cancel captures and release touch-run state. Dedicated Forest controller ownership still excludes the global cursor adapter.

The monitor and minimap use separate wide-screen positions; the active header/stage also fit narrower screens. Controls never participate in the fixed-camera formal benchmark, and benchmark results can return directly to the arcade. Verify physical touch reach/controller feel on the target PC; CDP-injected contacts and standard-controller fixtures do not establish hardware reliability.

Tests: `tests/limit-input-settings.mjs`, the menu tests in `tests/3d-gamepads.mjs`, the actual Forest UI fixture in `tests/limit-controller.mjs` and the real scene/input/export/exit path in `tests/limit-browser.mjs`. The full arcade suite, independent toolkit/starter and Wobbly Wars tests remain required regression checks.

## Presentation and arcade controller integration — 6.3.0

`dist/js/wars3d-details.js` owns the authored class capes and toy-soldier material refinements. Capes use the existing independent bone-attachment API on the actual spine, including physics-detached bones. They do not change rig geometry, wrist sockets, combat shapes, prices or input rules. Authored cloth motion freezes at zero dt and fades/disposes with the actor. Wobbly Wars health fills now share a billboard frame with their backing, and ownership rings scale for giants and mounted units. `tests/wars3d-weapons.mjs` covers the costume attachment, paused cloth, backing and scene cleanup alongside its existing rendered weapon/hand and ragdoll checks.

The arcade-wide `dist/js/arcade-controller.js` reuses `GamepadHub` for neutral-button detection and stable ownership. It adds DOM menu navigation and labeled virtual pointers for pointer-driven games, including Wobbly Wars deployment. Its pointer-capture shim applies only to its own virtual IDs and is removed when all pointers finish. Physical pointers continue to use the native methods. It cancels held input on context changes, blur and disconnect, and yields completely while Living Forest's `.lb-app` owns controller input. `tests/shell-browser.mjs` independently exercises menu selection, disabled options, two captured pointers, actual drawing, disconnect pause and acknowledgement boundaries. No new shared 3D toolkit contract is introduced.

The browser suite audits setup screens and shell layouts; it does not establish physical Bluetooth/USB reliability or GPU appearance. Inspect cape silhouettes, health-bar layering and increasing army sizes on the target GPU before deployment. The export's `SOURCE_SHA256.json` remains the immutable migration baseline; intentional post-migration source changes are documented separately.

Toolkit interface version **1.0**, introduced with application **6.0.0**. Read this document before creating a 3D game or changing a shared 3D system. Reuse the tested components here; add game-specific rules and art outside `dist/js/3d/`. A shared renderer does not prescribe a theme, camera angle, character design, scoring system or game genre.

## Technology and project architecture

The arcade remains a buildless static application: HTML, CSS, JavaScript ES modules, npm and a service worker. There is no React, Unity, npm dev server or project-wide engine migration.

- **Babylon.js 9.32.0**, including matching glTF loaders: GPU rendering, scenes, cameras, skeletons, animation, meshes and materials. Apache-2.0.
- **Havok 1.3.14**, bundled WebAssembly: 3D rigid bodies and jointed ragdolls. MIT.
- **Controlled character navigation**: toolkit flat-ground circle/capsule controllers, obstacle paths and crowd steering. Walkers are controlled characters, not loose dynamic ragdolls.
- **Combat simulation**: game-owned fixed-step rules using toolkit attack timelines, contact checks and swept projectiles. Navigation, damage and scoring are independent of render-frame cadence.
- Existing **Matter.js 0.20.0** and `poly-decomp` remain available to existing 2D games. Their behavior and records are preserved.
- Dependencies, WASM, GLBs and licenses are local in `dist/`; runtime rendering and physics need no CDN, account, key or paid service. The first online load must finish before offline play.

Babylon is loaded lazily when a 3D session starts. A browser without WebGL uses the labeled software renderer with the same meshes, skeleton transforms and Havok world. This is a compatibility mode with reduced visual features and substantially lower performance, not a claim that the GPU path was exercised.

Official references: [Babylon Havok integration](https://doc.babylonjs.com/features/featuresDeepDive/physics/havokPlugin/), [bones and skeletons](https://doc.babylonjs.com/features/featuresDeepDive/mesh/bonesSkeletons), [physics constraints](https://doc.babylonjs.com/features/featuresDeepDive/physics/constraints/). Test the pinned versions before upgrading; examples for other Babylon versions may use removed APIs.

## Directory structure

| Path | Responsibility |
|---|---|
| `dist/js/3d/index.js` | Public toolkit exports and `TOOLKIT_API_VERSION`. Prefer these exports in new games. |
| `dist/js/3d/attachments.js` | Independently tested bone sockets, grip offsets/pivots and analytic two-bone IK; see the attachment interface below. |
| `dist/js/3d/*.js` | Reusable engine-level components described below. No Wobbly Wars imports, profiles, unit classes, default character asset or launcher styling. |
| `dist/vendor/3d/` | Pinned Babylon, loaders, Havok JS/WASM, source notes and licenses. |
| `dist/dev/3d-starter/` | Runnable **Beacon Couriers** starter, its independent rules, UI and sample asset. Not a normal arcade tile and never writes profile data. |
| `dist/js/wars3d-core.js` | Wobbly Wars armies, class stats, campaign, tactics, budgets and combat rules. |
| `dist/js/wars3d-weapons.js`, `wars3d-poses.js`, `wars3d-equipment.js` | Central weapon/grip configuration, deterministic limb poses/contact points, and game-owned equipment geometry. No weapon is world-positioned separately from its hand. |
| `dist/dev/weapon-inspector/` | Runnable development-only actual-rig inspector, offset export and real combat preview. Never writes profiles or appears as a launcher tile. |
| `dist/js/wars3d-rig.js` | Wobbly Wars skeleton-specific poses, ragdoll dimensions and costume palette. |
| `dist/js/wars3d-environment.js` | Ten Wobbly Wars natural palettes, bounded decorative scenery and game-specific lighting. `WAR_ENVIRONMENTS`, `WAR_LIGHTING`, `createWarEnvironment(runtime, model, materialFactory)`; collision maps remain game-owned. Tested in `tests/wars3d-environment.mjs`. |
| `dist/js/wars3d-scene.js` | Wobbly Wars environments, weapons, mounts, effects and visual presentation. |
| `dist/js/wars3d.js`, `dist/wars3d.css` | Wobbly Wars setup, deployment, multiplayer, session lifecycle, records and styling. |
| `dist/assets/wars3d/` | Original CC0 soldier, articulated pony/dragon/cannon and asset documentation. |
| `dist/js/wars-core.js`, `wars-art.js`, `premium.js` | Preserved classic edition and old record compatibility. Do not delete old saves or overwrite their record edition. |
| `tests/3d-toolkit.mjs` | Independent toolkit/real Havok/GLB/starter tests, with no Wobbly Wars imports. |
| `tests/wars3d-core.mjs` | Wobbly Wars-specific legal actions, combat, all campaign/difficulty solutions, battle-size checks. |

## Stable public interfaces

All distances are metres, times are seconds, +Y is up and X/Z form the navigable ground plane. Scenes use right-handed coordinates; example models face +Z. Disposal belongs to the creator. Each game must stop its session, input, sounds and resources when it exits. Callback functions contain the game's rules, not hidden engine policy.

| Component and dependencies | Interface | Configuration / result | Working example and independent coverage |
|---|---|---|---|
| `scene.js`: browser, Babylon, Havok; imports assets/camera/performance/software renderer | `await create3DScene(canvas, options)` | `quality: low/medium/high`, camera options, `onError(error)`, ambient/sun lighting. Returns `B`, `scene`, `engine`, `camera`, `cameraRig`, `assets`, `software`, `failure`, `setUpdate(fn)`, `pause(bool)`, `setQuality(name)`, `stats()`, `dispose()`. Starts paused. A frame exception stops the loop and reports `onError`; restart/dispose the failed scene instead of silently continuing. `load3D()` deduplicates local engine loading. | `starter.js`; browser startup/pause/cleanup plus real engine fixtures. GPU verification is separate. |
| `assets.js`: injected `{B, scene}` | `createAssetLibrary(runtime)` → `load(url)`, `size`, `dispose()` | Concurrent URL loads share a container; failures can retry. An exit during a pending load disposes the late container. Caller retains asset/license policy. | Independent deduplication/disposal test and starter model import. |
| `actors.js`: scene, assets, animation, physics, performance | `await createActorFactory(runtime, config)` → `create(instance)`, `size`, `ragCount`, `dispose()` | Required `url`; optional `clips`, `pose(state, rest)`, `palette`, `collider`, `strideSpeed`, and explicit `ragdoll` configuration. Instances expose `root`, `nodes`, `rest`, `meshes`, `skel`, `update(state,dt)`, `knockdown(impulse)`, `endRagdoll()`, `shadows()`, `dispose()`. | Starter uses imported clips and its own palette. Independent GLB import, bone transforms, recovery and repeated zero-body-leak checks. |
| `animation.js`: pure state machine; pose/clip functions receive Babylon or groups | `AnimationStateMachine({initial,states,onTransition})`; `set`, `update`. `blendJointPose(B,nodes,targets,rest,dt,options)`. `createClipMixer(groups,mapping)` → `set`, `update`, `dispose` | States can have `enter/exit/update`, `duration`, `next`; blending uses exponential responsiveness. Pose targets contain local position and Euler rotation or quaternion (a Babylon Quaternion or serialized `[x,y,z,w]`). Optional `immediate:true` applies an already-interpolated deterministic pose directly, including at dt=0; other targets keep the existing exponential blending. Clip names and movement-speed ratios are caller-owned. | Independent transitions, frozen dt=0, clip cross-fades and Walk→Idle stopping. |
| `controllers.js`: math/collision paths | `new CharacterController(config)` → `moveTo({x,z})`, `update(dt)`, `stop()` | Position, radius, speed, turn speed, rectangular obstacles and arbitrary `{minX,maxX,minZ,maxZ}`. Exposes position, angle, movement state, speed and distance-based `walk` phase. `crowdSteering(self,agents,{padding,strength})` returns an avoidance vector. | Starter paths around walls in a differently sized arena. Custom-bound tests prevent clipping. |
| `physics.js`: injected runtime with enabled Havok | `staticCollider(runtime,mesh,options)`, `dynamicBox(...)`, `controlledCapsule(runtime,options)` | Mass/friction/restitution and collision membership/masks are explicit. Capsule returns `{mesh,aggregate,move(x,y,z),dispose}`. Other helpers return owned PhysicsAggregate handles. Dispose them with their meshes. | Real falling crate settles on real ground. Repeated rig/controller disposal returns body counts to baseline. |
| `math.js`: no engine dependency | `free`, `moveCircle`, `findPath`, `rayBox`, `segmentDistance`, `blocked`, `distance`, `turnToward`, `seeded`, `clamp` | Ground bounds/cell size and collider padding are configurable. Default navigation bounds match the initial 22.8×13.2 m sample battlefield; pass explicit bounds for other games. | Custom bounds, obstacle routes, wall/ray checks and camera ground-plane roundtrips. |
| `ai.js`: controllers/math | `acquireTarget(self,candidates,{eligible,bias,metric})`; `new NavigationBehavior(controller,options)` → `update(dt,world)` | Caller defines candidates, tactical bias, think interval, pursuit/hold distance and retreat distance. No hardcoded teams, weapons or enemy definitions. Exposes behavior state. | Independent target bias and pursuit/hold tests; neutral starter guide follows nearby couriers. |
| `combat.js`: math | `createAttack({duration,windup,activeEnd,target})`; `advanceAttack`; `contactTargets(config)`; `frontalBlock(config)`; `combatAction(unit,now)`; `hitReaction(now,lastHit,duration=.24)` | Attack has progress and per-swing hit Set. Contact uses current weapon segment plus previous-tip sweep, caller-provided target positions/radii and eligibility. Returns contacts; the game applies damage. `combatAction` prioritizes dead → down → recover → stun → stagger → attack, returning null for caller-owned locomotion/blocking. `hitReaction` returns a bounded 0–1 additive envelope without mutating an attack or accumulating stun. Both functions are pure and independently tested on unrelated fixtures. Blocks use facing angle and configurable reduction. | Independent no-damage-before-active-frame, contact, one-hit-per-swing and frontal/back tests. Wobbly Wars uses it for actual weapon swings. |
| `projectiles.js`: math | `new ProjectilePool({limit})` → `spawn(values)`, `update(dt,{collision,onHit,onExpire})`, `clear()`, `active`, `free` | Projectile values require x/y/z, vx/vy/vz, life and optional g/r/metadata. `integrateProjectile` and `sweptTarget` are separately exported. Pool limit and collision policy are caller-owned. Gravity is metres/s² downward. | Swept fast projectile hits, expiry and reuse tests. Starter pulses and Wobbly Wars arrows/bolts use this system. |
| `camera.js`: injected Babylon/scene | `orbitCamera(B,scene,options)` → `{camera,reset,zoom}` | Position angles, radius, target, min/max radius/beta, FOV. Does not attach competing default browser inputs. | Starter uses a different camera configuration; actual projected ground coordinates roundtrip through input. |
| `input.js`: scene/camera, Pointer Events | `bind3DInput(canvas,runtime,callbacks)` → `{ground,cancel,dispose}` | `ownerAt`, `cameraMode`, `down(point,event,owner)`, `move(point,handle,event)`, `up`, `cancel`. Separate pointer handles; capture, cancel and release are owned by this binder. Camera mode explicitly separates orbit/pinch from game actions. | Two simultaneous pointer fixtures cross sides while preserving ownership. All event handlers are removed on disposal. Physical USB testing remains required. |
| `multiplayer.js`: pure | `PointerOwnership(ownerAt)` → `begin/get/end/clear`; `canDeploy(options)`; `splitBudget(total,count)` | No assumed split-screen orientation, player colors or scoring. Game chooses versus/co-op/pass-and-play rules. Odd budgets divide deterministically. | Ownership, crossing/release, turn restrictions and budget tests. |
| `audio.js`: injected/native Web Audio | `createSynthAudio({contextFactory,getSettings,ownsContext})` → `resume`, `play(cue)`, `pause`, `dispose` | Cue: frequency, duration, waveform, volume, delay, slide. Settings callback supplies current mute/volume. Audio initializes only after player intent. Shared arcade context uses `ownsContext:false`. | Independent muted/no-init, playback and cleanup fixtures; starter gives pulses their own sound. |
| `effects.js`: injected runtime | `create3DEffects(runtime,{onEvent})` → `burst`, `event`, `update`, `dispose` | Pooled visual spark meshes; `burst(point,color,count)` lets each game choose colors/count. Event hook routes game-specific audio outside this module. Quality bounds particles. | Independent pool/cleanup test, starter impacts and Wobbly Wars hit/block/projectile feedback. |
| `performance.js`: pure | `QUALITY`; `FrameSampler({capacity,slowThreshold,onPressure})` → `add(ms)`, `report`, `reset` | Presets bound resolution, shadows, ragdolls and effects. Reports measured average FPS, median and p95 frame time. CPU simulation timings are separate from rendering/GPU measurements. | Deterministic sample/pressure tests. Both examples show live counters. |
| `software-renderer.js`: Canvas 2D and actual Babylon scene geometry | `createSoftwareRenderer(canvas,B,scene,engine)` → `render`, `fps`, `triangles` | Projects indexed/non-indexed triangles and skinned vertices. Set floor meshes' `metadata.softwareLayer=-20` to keep large ground polygons behind actors. Styles/material colors are game-owned. | Independent actual GLB triangle-render test; cloud browser uses this path. |

Version-1 contracts are exercised by `tests/3d-toolkit.mjs`. Changes to signatures need a migration, a toolkit version change when incompatible, documentation and regression tests in every dependent game. Do not label additional adapters reusable simply because they were moved into this directory.

## Bone attachments and support-hand IK

`attachments.js` exports stable, game-independent interfaces tested in `tests/3d-attachments.mjs` against the separate starter GLB and actual Havok ragdolls, without Wobbly Wars imports.

- `createBoneAttachments({B,scene}, {skeleton,mesh,sockets})` takes an actual skeleton and the mesh whose world matrix places it. Each socket declares `{bone, position:[x,y,z], rotation:[x,y,z]}` in the bone's local coordinates. No bone names or handedness are assumed.
- `attach(node,{socket,position,rotation,pivot,scale})` creates an owned mount and parents the equipment to it. `position` and `rotation` configure the mount within the socket; `pivot` is the grip point in the model's coordinates. Character world scale is inherited exactly once. The returned mount supports development adjustments.
- `point(socket,local=[0,0,0])` returns a Babylon Vector3 in world space after updating the actual skeleton matrices. Sockets follow physical bones when ragdoll detaches their animation nodes. `anchors` provides named TransformNodes for development axes; `dispose()` owns mounts, attached equipment and socket nodes, not the character.
- `solveTwoBoneIK({root,target,upperLength,lowerLength,pole})` is engine-independent and returns `{elbow,end,error}`. `pole` selects the bend side. Unreachable targets clamp rather than stretching/exploding; check `error` when authoring support grips. The module also exposes quaternion/vector helpers internally usable by game-owned deterministic rigs.

```js
import {createBoneAttachments,solveTwoBoneIK} from './3d/index.js';
const equipment = createBoneAttachments(runtime, {
  skeleton: actor.skel, mesh: actor.meshes[0],
  sockets: {tool: {bone:'MyWrist',position:[0,-.04,0]}}
});
equipment.attach(myWeaponMesh, {
  socket:'tool',pivot:[0,.12,0],rotation:[Math.PI/2,0,0]
});
// Update the actor through its normal animations; equipment follows its real bone.
// Put the other hand on a weapon-local support grip using solveTwoBoneIK.
const elbow = solveTwoBoneIK({root:shoulder,target:supportPoint,
  upperLength:.3,lowerLength:.25,pole:{x:1,y:0,z:0}});
// On exit, dispose equipment before its actor. Asset-specific wrist names,
// lengths, animation poses, weapon geometry and collision policy stay in the game.
```

### Wobbly Wars reference and inspection

The original soldier's forearm pivots were below the elbows and it lacked wrist joints. `scripts/upgrade-wars-hands.mjs` upgrades the original CC0 GLB to fourteen joints, preserves its rest geometry through new inverse bind matrices, and weights its palms/thumbs to separate wrists. Running it on an upgraded asset is a no-op. Then `scripts/fit-wars-arm-reach.mjs` refits the existing sleeve/forearm geometry, elbow and wrist rest translations and inverse bind matrices to the broad torso: .283 m upper arms and .29 m forearms. It is idempotent via the asset revision marker. No runtime arm stretching or outward shoulder teleport is used. The independent starter asset remains unchanged.

`WAR_WEAPONS` centralizes the canonical geometry axes (+Y for blades/shafts, +Z for gun/arrow fire), grip pivots/offsets, primary sockets, support grips, sizes, shapes and animation classes. `warWeaponFrame` computes the same authored body/wrist pose and equipment transforms for visible meshes, melee contact segments, shield normals and projectile origins. Do not reinstate a separate world-space weapon animation. Longswords, large clubs/axes, hammers, banner poles and infantry spears use synchronized two-handed grips; shield swords and mounted lances retain their intended one-hand use. Bows use a turned shooting stance, off-hand bow grip, draw-hand/string synchronization and a nocked arrow.

Run the preview and open `/dev/weapon-inspector/index.html`. Start explicitly, choose any of the 21 classes, small/normal/giant scale, either hand, and idle/move/attack/block/hit/knockdown/recovery/death. Use front/side/rear/overhead views or orbit/pinch. Toggle local axes and actual contact/release markers; edit position/rotation/pivot offsets live and export JSON candidates. Commit finalized values in `wars3d-weapons.js` and run the tests; browser-local inspector edits never silently become production configuration. The unarmed checkbox exposes the natural rig stance; Overlay normal hit reaction previews damage feedback over an attack. Actual Combat Encounter runs the real Battle3D rules and Havok scene without profile writes. GPU and physical touch inspection remain hardware checks when the browser uses compatibility rendering.

### Combat actions and arm clearance (6.0.4)

Routine damage updates health, statistics and `hurtAt`; it does not clear `attack`, reset cooldown/progress, clear the per-swing hit Set, or enter a reaction action. `warWeaponFrame` adds a small torso/head recoil while solving the wrists and elbows against the same authoritative attack phase. Elbow guidance is defined in the torso's frame and points outward, rather than flipping with the weapon's rotation. Weapon animation classes own carry/strike/aim poses; heavy and spear stances turn the torso, and the bow draw hand raises/returns around the chest. Bow draw length fits the corrected reach and aim pitch lifts the bow without pushing its draw hand into the chest.

`Battle3D.step` collects melee and projectile contacts before resolving their damage. Both attacks at the same fixed step therefore connect even in a lethal trade; array iteration order cannot cancel an already-connected counter-hit. `hit` remains immediate outside a fixed-step collection, for explicit tools/tests. Dead sources can resolve contacts already collected that step; dead targets receive no duplicate damage/kill. Victory is evaluated after all contacts resolve.

`Battle3D.applyStatus(unit,{kind,duration,recovery,impulse})` explicitly interrupts for `down`, `stun` or `stagger`, preserving death priority. `WAR_IMPACTS` lists the existing cannon/splash/golem/charge knockdown abilities, their impulse, health threshold and duration; a routine weapon's damage alone cannot activate them. Blocked impacts do not create knockdowns. No new random stun, damage scaling, unit prices or campaign data were added.

`tests/wars3d-exchanges.mjs` exercises simultaneous/nonlethal/lethal swords in both iteration orders, mid-swing damage retaining attack data, repeated multiple attackers, real arrow damage while fighting, and explicit status recovery/death. `tests/wars3d-arm-clearance.mjs` validates the actual GLB bind, joints and skinned distal sleeves/forearms/cuffs/palms/thumbs through full attack cycles, normal-hit overlays, movement, both hands, supported aim pitch and unarmed stance. It checks the torso core and deliberately excludes the proximal sleeve/pauldron seam. It is not a claim of zero overlap for every costume or armor triangle. The real Babylon attachment tests separately verify rendered sockets, weapons, shields and projectile origins at three character scales.

Defeated Wobbly Wars troops use the authored knee-fall (1.1 seconds), hold until 1.4 seconds, then fade through 4.8 seconds. This visual lifetime advances on unpaused visual dt even after the battle clock stops; retired actors never reappear. Living impact knockdowns retain Havok ragdolls and attached equipment.

Terrain variation is batched into four disjoint triangle groups covering the original floor once. The collider's redundant rendered top is removed; path and translucent deployment decals have explicit depth bias. Do not stack overlapping coplanar ground patches: that causes the striped GPU z-fighting seen in the user reference.

## Run the starter

From the checkout:

```bash
npm ci
sites-preview start /workspace/sites/little-big-arcade
```

Use the exact preview origin returned by the command, followed by `/dev/3d-starter/index.html`. The published Site serves the same path. The starter is deliberately absent from normal game selection.

1. Choose one or two players; press **START STARTER GAME**.
2. Tap a ground location in your half to navigate around the wall. The neutral guide demonstrates AI pursuit.
3. Once beyond the wall, use your **FIRE PULSE** button three times to activate the beacon.
4. Walk into the gate to finish. Two-player completion requires both deliveries.
5. Drop the four reusable crates to inspect rigid-body gravity/collisions. Switch Camera mode, orbit/zoom, pause and restart.

The starter is a real complete small game and a source template. It does not create scores, achievements or profiles. Its sample model can be replaced; its blue/pink sci-fi presentation is not a toolkit theme.

## Preserve existing interfaces during upgrades

An engine or graphics upgrade must retain the existing menus, visual purchasing controls, pricing, resource indicators and established input workflow unless the user explicitly requests a redesign. Adapt those controls to the shared 3D runtime; do not replace recovered card/tool interfaces with dropdowns. The starter is a template for new games, not a reason to replace an existing game’s UI.

For restoration, first inspect Git history, the preserved edition and backups. If only part is recoverable, keep verified controls operational and reconstruct only the missing part from identified references. Record what is exact and what is approximate. Never fabricate material purchases, erase progress or silently switch to a 2D game as a missing-interface fallback. A missing original must remain an explicit verification gap until a faithful, tested reconstruction is available.

## Create a new 3D game

1. Read this document and `AGENTS.md`. Inspect the existing launcher and persistence rather than assuming a framework.
2. Copy `dist/dev/3d-starter/` into a new game-owned directory. Change the rules in its core, visual scene and UI; import from `dist/js/3d/index.js`. Do not copy/reimplement engine code.
3. Give the new game an owner object with one cleanup function. Guard asynchronous scene/asset creation with a session token so late completions cannot revive an exited game.
4. Keep core rules pure where possible. Use a bounded fixed-step accumulator for competitive simulation (Wobbly Wars uses 1/60 s). Scene rendering can have a different cadence.
5. Create the renderer, simulation, audio and input **inside** the existing shared instruction gate's start callback. No hidden simulation under instructions.
6. Provide pause/restart/exit and manual How to Play. Pause both the rule clock and `runtime.pause(true)`; cancel held pointers. Resume only through an intentional control. Internal rematches do not re-show the mandatory instructions in an already acknowledged session.
7. Design two-player play initially. Use independent pointer ownership for simultaneous input; provide understandable turns when the hardware only reports a mouse.
8. Add independent rules tests and browser checks. Include new essential files in the service-worker cache, then run the regression suite.

Minimal scene/actor example (the complete, tested version is `starter.js`):

```js
import {
  create3DScene, createActorFactory, CharacterController,
  bind3DInput, staticCollider
} from './3d/index.js';

const runtime = await create3DScene(canvas, {
  quality: 'medium', camera: {radius: 23, minRadius: 10, maxRadius: 37}
});
const {B, scene} = runtime;
const floor = B.MeshBuilder.CreateBox('floor', {width: 20, height: .4, depth: 12}, scene);
floor.position.y = -.2;
floor.metadata = {softwareLayer: -20};
staticCollider(runtime, floor);
const factory = await createActorFactory(runtime, {
  url: 'my-game/assets/character.glb',
  clips: {idle: 'Idle', walk: 'Walk'},
  palette: {team: ['#6dd8dc']}
});
const actor = factory.create();
const controller = new CharacterController({
  obstacles: [], bounds: {minX:-9,maxX:9,minZ:-5,maxZ:5}
});
const input = bind3DInput(canvas, runtime, {
  ownerAt: () => 0,
  down: point => controller.moveTo(point)
});
runtime.setUpdate(dt => {
  controller.update(dt);
  actor.update({...controller, scale:1}, dt);
});
runtime.pause(false);
// On exit: input.dispose(); factory.dispose(); runtime.dispose();
```

## Model import and animation

Use licensed GLB/glTF with an explicit rest pose, metre scale, known forward axis, appropriate skin weights and meaningful joint/clip names. Keep licenses next to assets. The toolkit infers linked skeleton nodes and rest translations; it does not assume humanoid bone names. Imported clips are blended and stopped when the character stands still. Match clip speed to movement speed/stride; do not continue a walking loop at zero velocity.

Actor update state uses `{x, y:0, z, angle, scale:1, state:"idle"|"walk"|"run", speedNow, animationSpeed?, recover?:boolean}`. Additional state is passed unchanged to a custom pose callback. `strideSpeed` is the speed in m/s represented by the source walk clip at ratio 1; automatic clip rate follows measured movement speed and model scale, and a game can override `animationSpeed`. Author and verify it per model.

For custom poses, pass `pose(state, rest)` returning per-joint local targets. Keep the mapping in a game-specific rig module, as Wobbly Wars does. Do not put one game's head/neck proportions, helmet, weapon locations or animations into shared actors. Controlled movement sets the root translation/yaw; animation affects joints. Use world-space movement distance for gait phase rather than a time-only marching-in-place animation.

Ragdolls require an explicit collider/joint configuration for that rig. Call `knockdown(impulse)` only for impact/death states. The factory enforces quality caps, detaches animation from physical bones, uses bounded joints and relinks/blends on recovery. It does not automatically infer anatomically correct limits for arbitrary imported skeletons. Rendered weapons, hit shapes and projectile sockets must agree; test them from several camera angles.

## Movement, AI, combat and physics

Ground controllers use swept substeps against rectangular obstacles and bounded separation. `findPath` returns a nearest reachable path instead of blindly walking through a wall. Target selection and tactical bias are injected. Use distinct desired distances and retreat policies for ranged/support/melee classes. Detect prolonged no-progress situations and define a fair game outcome rather than infinite combat.

Create an attack once, advance its timeline using simulation dt, compute the visible weapon segment, and call `contactTargets`. Only returned contacts may cause damage. Never award damage merely because an animation started. Use `ProjectilePool` with swept collision against characters and terrain, not endpoint-only checks. Apply healing, splash effects, shields and victory rules in the game core.

Havok categories in the examples: ground `1`, controlled capsule `4`, dynamics/ragdolls `8`. These are configurable conventions. Walking uses controlled capsules; full dynamic gravity applies to props and knockdowns. Use simple collision shapes and 1/60 s physics substeps. Bound active bodies, projectiles and particles. Do not feed arbitrary long frame delays into combat. Avoid teleports with large constraint error; dispose constraints/aggregates before disposing their meshes.

## Touchscreen and local multiplayer

All game canvases use `touch-action:none` and `user-select:none`. Controls are large, explicit and work with mouse. `bind3DInput` converts CSS screen coordinates to engine render coordinates, projects onto the ground plane and captures each pointer. An existing handle remains assigned to its original player after crossing the screen. Cancel every pointer on pause, mode changes and exit.

`navigator.maxTouchPoints >= 2` only indicates reported capability. It does not prove the NEC/USB touchscreen supplies simultaneous independent contacts. Wobbly Wars therefore offers simultaneous deployment only when reported and retains alternating deployment. Co-op divides its shared budget and workspace; versus uses equal independent budgets. Do not silently convert co-op results into head-to-head wins or draws: commit one solo/team entry per profile, with a co-op competition key.

The toolkit implements local input ownership, not online networking, remote synchronization, rollback netcode, split GPU viewports or hardware touch calibration. Add those as separately tested systems when requested.

## Add a finished game to the launcher

- Add a stable game ID/metadata/art in `dist/js/visuals.js` and a targeted route in `dist/js/shell.js`. Retain every existing ID and unrelated route.
- Follow `setupGame` / `selectGameSession`, the shared instruction gate in `game-instructions.js`, and the cleanup/immersive layout pattern. Add accurate per-mode instructions and two-player rules.
- Use existing `data.js` profiles, `save`, `commitRound`, `recordKey`, badges and backup validators. Keep game-specific progress in its own validated property. Do not reset `lba-universe-v3` or migrate unrelated data.
- Assign a new `ruleset` for materially different competitions. Include difficulty/mode/map/budget/series in fair record keys. Preserve older records under their old editions.
- Update `releases.js`, package version and `sw.js` coherently. Shared changes get application notes; only affected games get game notices. Do not expose hidden Easter eggs in release notes.
- Cache essential code, models, engine/WASM and licenses. Never automatically activate a downloaded service worker under an active match. `app-updates.js` permits explicit activation from the lobby/Settings only; `sw.js` rejects activation while another arcade window is open. Its message-only `skipWaiting` path is covered by `tests/offline.mjs` and must not be called by install/updatefound handlers. The internal `terminal.local` preview bypasses fetch caching to prevent stale QA files; production caching remains active.

## Required checks and optimization procedure

```bash
node tests/3d-toolkit.mjs
node tests/3d-attachments.mjs
node tests/wars3d-weapons.mjs
node tests/wars3d-exchanges.mjs
node tests/wars3d-arm-clearance.mjs
node tests/wars3d-core.mjs
node tests/wars3d-controller.mjs
npm test
```

Run the actual commands and record results. This project is buildless; there is no production transpilation. The migration adds `npm run build` to copy authoritative `dist/` into `build/`. Packaging verifies static assets/source provenance. When dependencies change, use npm with the pinned lockfile and regenerate the local vendor bundle; do not replace runtime URLs with CDN dependencies.

For every shared change, run independent toolkit tests, the starter and Wobbly Wars checks, then the full arcade suite. Test entry/acknowledgment, single/two-player completion, pause/help, restart/rematch, fullscreen/resize, exit/reopen, failed GLB/WASM/WebGL startup and saved-data roundtrips. Check repeated creation/disposal body and mesh counts. Keep screenshots and any unverified behavior in the acceptance report.

Measure 16, 48 and 96 unit simulations separately from browser rendering. The Wobbly Wars performance overlay reports FPS, meshes/draws, physics bodies and active ragdolls; the starter also reports p95 frame time. Measure increasing army sizes and Low/Medium/High presets on the intended PC. Start by identifying CPU AI/pathfinding, draw-call, skinning, shadow, fill-rate or physics pressure. Preserve readable art and controls while reducing expensive shadows/resolution/ragdolls/effects. Models share geometry/materials and prop instances; no repeated GLB fetch per unit. Wobbly Wars switches to Low after sustained measured rendering pressure. Current systems do not include meshoptimizer/Draco/KTX transcoding, GPU crowd skinning or a generic multi-mesh LOD generator. Do not claim those optimizations exist.

Targets are approximately 30 FPS on modest supported GPU hardware and higher where available, subject to measurement. A passed Node simulation test is not an FPS benchmark. Software rendering in the cloud is slower and is not evidence of Windows GPU performance.

## Hardware, verified scope and limitations

Intended desktop environment: Windows 10/11 with a modern Chrome/Edge-class browser supporting ES modules, Pointer Events, WebAssembly SIMD and preferably hardware-accelerated WebGL2. No dedicated graphics card is inherently required, but the actual integrated GPU, drivers, resolution and unit count determine performance. Touchscreen simultaneous play requires real multi-contact support; mouse-only USB reports use turns. No physical NEC/Windows/USB multitouch verification is implied by synthetic fixtures.

Independent tests use the real bundled Havok WASM and Babylon NullEngine; browser QA in this cloud uses software 3D because WebGL context creation is unavailable. The GPU shaders, shadow appearance and Windows frame rates remain hardware verification items.

Version 1 controllers navigate flat ground and rectangular obstacles. They are not a general navmesh, slope/stair/jump controller, bone-level weapon collider or platformer motor. Projectile characters use swept body volumes, not per-triangle skin hits. Ragdoll rigs need authored configuration and may need different limits per model. Collision and joint behavior should be inspected interactively for every new rig.

The software renderer uses flat material colors and painter ordering. It supports the sample indexed/non-indexed meshes and skin matrices, but does not reproduce GPU shadows, texture maps, postprocessing or exact intersecting-polygon depth. It is intended for small compatibility scenes. Large armies require WebGL or the preserved classic edition. It must be labeled honestly, not advertised as equivalent GPU quality/performance.

Future 3D games must inspect and reuse this toolkit, retain their own visual identity, and add independent tests before promoting new shared abstractions. Update this document and retest both consumers whenever a shared contract changes.

## Adventure and benchmark additions — 6.1.0

These additive interfaces retain toolkit API version 1.0. They are tested independently of Wobbly Wars **and** Project Limit Break in `tests/3d-adventure.mjs`; their public modules import no game rules, profiles, assets or themes.

| Interface | Configuration / dependencies | Independent verification |
|---|---|---|
| `ThirdPersonController` from `third-person.js` | `{x,z,radius,speed,runSpeed,jumpSpeed,gravity,acceleration,stepHeight,groundAt,obstacles,navigationObstacles,bounds}`. Meters/seconds, feet at `y`; pure toolkit math/controllers. `setIntent({x,z,run,jump})`, `navigate({x,z})`, `update(seconds)`, `stop()`, `reset({x,z})`. | Tall-wall collision, terrain, jump/landing, normalized diagonals, tap routing and zero-dt freeze. |
| `createThirdPersonCamera(runtime, options)` | Existing Babylon orbit camera; `{distance,height,smoothing,maxDistance,obstacles,groundAt}`. AABBs use `minX/maxX/minY/maxY/minZ/maxZ`. `update(players,dt)`, `reset()`. | Wall occlusion, recovery and persistent manual zoom. Co-op follows the centroid and expands distance. |
| `ActionInput` / `bindActionInput` | Independent players with keyboard, sticks, edge-triggered actions and gamepads. Binding takes `{target,onPause,onSelect,enabled,pauseEnabled}` and returns `dispose()`. DOM uses `data-stick`, `data-action` + `data-player`, `data-run`. Caller owns modal/pause policy. | Actual DOM adapter fixture with two pointer IDs, foreign-pointer rejection, cancel, disabled controls, pause shortcut and cleanup. Physical hardware is separate. |
| `GRAPHICS_PRESETS`, `rendererCapabilities`, `resolveGraphics`, `createGraphicsControl` | Babylon runtime; `apply(preset, overrides)`, `settings`, `caps`, `addShadowCaster`, `removeShadowCaster`, `dispose`. Low/Medium/High/Ultra/Maximum/Auto. Capability gates shadow maps, SSAO2, planar reflection eligibility, post-processing and MSAA. | Capability resolution and safety caps independently tested. Actual GPU effect rendering still needs GPU hardware QA. |
| `FrameLog`, `BenchmarkRun`, `benchmarkCSV`, `recommendPreset` | Pure JavaScript; measured positive frame durations only. Run config `{stages:[{name,seconds}],warmup,seed,settings,metadata}`; `frame(ms)`, `abort(reason)`, `result()`. Settings/metadata cloned at construction. | Exact statistics, warm-up boundary, immutable config, abort, CSV quoting and frame-pacing recommendation. |
| `createSceneMonitor(runtime, {memory})` | Babylon scene/engine instrumentation plus rolling frame samples; `frame(ms)`, `snapshot({characters})`, `metadata()`, `dispose()`. Optional injected byte-valued JS heap provider for tests. | Real Babylon/Havok scene fixture checks body/character counts, memory conversion and N/A GPU values. |

Minimal controller example, independent of any game's art:

```js
import {ThirdPersonController, createThirdPersonCamera, ActionInput} from './js/3d/index.js';
const hero = new ThirdPersonController({groundAt: (x,z) => terrain.height(x,z), obstacles: walls});
const follow = createThirdPersonCamera(runtime, {groundAt: terrain.height, obstacles: cameraBoxes});
const input = new ActionInput(1);
runtime.setUpdate((dt, frame) => {
  hero.setIntent(input.read(0, navigator.getGamepads?.()[0]));
  hero.update(dt);
  actor.update({...hero, scale: 1}, dt); // caller's actual imported asset/clip map
  follow.update([hero], dt);
});
```

Convert input to the chosen camera frame when using camera-relative movement; Limit Break demonstrates this in `ui.js`. Character control is a terrain-following kinematic solver with substeps, not Havok character dynamics or ragdoll. `navigationObstacles` can include route-only exclusions. Use `staticCollider(runtime,mesh,{shape:B.PhysicsShapeType.MESH})` for real terrain contact; the prior default BOX remains unchanged. Dynamic props still use actual Havok. A first-person shooter or vehicle should choose a different controller rather than forcing these rules.

Benchmark example:

```js
const run = new BenchmarkRun({
  warmup: 5, seed: 872341,
  stages: [{name:'Outdoor path',seconds:10},{name:'Physics grove',seconds:10}],
  settings: graphics.settings, metadata: monitor.metadata()
});
runtime.setUpdate((dt, frame) => {
  if (dt > 0) run.frame(frame.frameMs);
  // Caller positions camera and resets the same workload each run.
  if (run.done) saveMeasuredResult(run.result());
});
```

`create3DScene.setUpdate` now receives the additive second argument `{frameMs,wallTime,paused}`. `dt` remains clamped to 0.1 seconds for safe gameplay; **benchmark measurements use raw wall-frame intervals**, not that clamp or engine FPS. Existing one-argument consumers continue unchanged. Do not save a run aborted by hidden tabs, resizing, settings changes or pausing. Warm-up discards the complete boundary interval. Each full frame belongs to the stage active at its start; stage durations can overshoot by one interval.

Statistics: average FPS = `1000*N/sum(ms)`. 1% low = `1000/mean(slowest ceil(N*.01) samples)`. Percentiles select sorted index `floor((N-1)*q)`. Results include raw samples, histogram, worst spikes and a small-sample warning. Auto-tuning chooses the highest tested preset whose mean reaches target, 1% low reaches 75% of target and p95 stays within 1.35 frame budgets. Short tests are recommendations, not a sustained hardware guarantee. Exported CSV summarizes stages; JSON contains raw samples and complete metadata. No synthetic score.

GPU timer queries, draw calls and indices depend on actual engine capabilities. Unavailable values remain null/N/A. Chrome's `performance.memory.usedJSHeapSize`, when available, is **JavaScript heap only**. Do not report it as system RAM or VRAM. The software path counts triangles submitted to its Canvas rasterizer; it does not expose GPU draws/timing. Its opt-in `mesh.metadata.softwareTexture` samples local base-color UVs with affine Canvas triangles and preserves opacity. It has no perspective-correct GPU depth buffer, PBR lighting, shadows, AO or reflections. Limit Break prepares reduced 512px, subdued compatibility color maps and caps view/foliage/props. Existing games without that texture metadata keep their previous path.

### Reference implementation and current scope

`dist/js/limit/` owns Living Forest rules, asset/clip mappings, lighting/weather, ambient audio, imported scenery placement, checkpoint objectives, co-op tether, graphics UI, local benchmark history and profile integration. This game-specific weather and audio palette is **not** advertised as a generic tested weather engine. Shared combat, AI, projectiles and ragdolls remain the previously documented toolkit; this milestone does not add a new combat system.

`dist/assets/limit/` contains 22 self-contained CC0 GLBs and local surface maps. Heroes use KayKit's 41-joint models, actual imported idle/walk/run/jump/interact/cheer clips and hidden spare equipment. Trees/foliage are Quaternius, surfaces/rocks/ferns are Poly Haven, and the textured arch/bridge/lantern plinths are original generated geometry. Exact provenance, hashes, LOD triangle counts and reconstruction instructions are in the manifest and `scripts/limit/README.md`. Near trees and boulders have true reduced-geometry LODs; GPU static assets reuse loaded geometry through Babylon instances. Alpha foliage settings must be retained.

Milestone 1 is a complete forest expedition with three lanterns, deep-water checkpoint recovery, bridge crossing and a co-op exit. It has a **forest-only** five-stage baseline: canopy, water, ruins, animated explorers and physics grove. The extra explorers follow scripted patrols, not combat AI. Castle rooms, doors, enemies, combat, wildlife, ragdolls for these imported heroes and the adjustable Chaos Chamber are future milestones. Do not rename the forest stages to imply those workloads were tested. Fixed seeds/camera paths make workloads comparable, but Havok and browser scheduling are not promised bit-for-bit across machines.

### Required checks and hardware limits

Run `npm run test:limit` for independent interfaces, GLB/offline/license checks, complete solo/co-op objective routes, real controller gating/profile/backup fixtures and the actual Babylon/Havok scene. Run `npm test` before publishing shared changes; it includes the separate runnable starter and Wobbly Wars regressions. This static project has no production bundler; `npm run build` copies authoritative `dist/` into `build/` without transpiling. Syntax-check edited modules and inspect the live launcher, instructions, both heroes, movement/camera, settings, complete baseline/export/history and cleanup.

Use a current browser with WebGL 2 and WebAssembly for the intended visuals. Exact Windows GPU/CPU/RAM minimums and 30/60 FPS capability remain **unestablished until hardware measurements**. WebGL 1 disables unsupported features; no-WebGL mode is a visibly reduced Canvas compatibility renderer (900px width cap), not the visual target. GPU/Windows touchscreen, simultaneous physical touch, real gamepads, audible sound quality and advanced effect correctness must be tested on target hardware. Never turn automated fixtures or cloud software results into a hardware pass.

## Forest gameplay / collision corrections — 6.2.0

The current Project Limit Break reference is **Milestone 2**, extending the existing forest with complete solo/co-op combat and a lever-operated gate. The Milestone 1 description above records the earlier release; combat encounters are now shipped. Castle interiors, imported-hero ragdolls and the adjustable Chaos Chamber remain future work.

### Shared additive interfaces, independently tested

- `cameraRelativeMovement({x,z}, alpha)` in `third-person.js`: screen input uses +X right and +Z down; output is a normalized-compatible ground vector for the right-handed Babylon ArcRotate camera. This deliberately uses `right=(sin(alpha), -cos(alpha))`. World +X is screen-left when looking north from a southern camera in this coordinate system. Verify by projecting world points; do not copy a left-handed basis. Independent tests project right/left/forward at seven camera angles. Keyboard, sticks and gamepad all call the same helper.
- `ThirdPersonController` additionally accepts `height` (default 1.8m). Solids can specify absolute `minY/maxY`, with legacy `top` preserved. Horizontal collision tests consider the character's vertical span. `floorAt(x,z,previousY)` includes reachable solid tops so jumping onto a low rock/crate lands on its top rather than falling into it. `noStand:true` prevents people becoming platforms. The caller supplies live moving-object snapshots before updating. Terrain navigation remains kinematic; it does not claim Havok character-controller dynamics. Independent platform/wall/jump tests pass.
- `createClipMixer(...).sample(progress,{exclusive=false})`: an optional authoritative normalized clip phase. Finite phase pauses/samples the imported animation; exclusive sampling stops competing clips and disables startup blending for this action. Calling `sample(undefined)` resumes ordinary locomotion. `createActorFactory.update` accepts `animationProgress` and `animationExclusive` and uses this API. Existing pose-driven/ordinary blended actors retain their behavior. Independently tested without game imports, then validated against actual forest weapon/palm transforms. Normal damage is still a game-owned overlay; it does not switch away from an attack.
- `sweptBoxFraction(from,to,box,radius=0)` and `sweptSphereFraction(from,to,center,radius)` return the earliest 0–1 contact time or null. Coordinates are finite 3D points; boxes have `minX/maxX/minY/maxY/minZ/maxZ`. Games compare these fractions to resolve the first wall or target along a fast projectile, rather than selecting an arbitrary array order. Existing `ProjectilePool` remains unchanged.
- `ActionInput` adds optional edge-triggered `attack`, `cast`, `dodge` actions. P1 uses F/R/C; P2 uses Numpad 2/3/4. Legacy default gamepad B/Y/LB trigger them; games can supply their own map (see Xbox support below). Existing jump/interact/run controls and pointer ownership remain. The DOM adapter continues to use generic `data-action`/`data-player` buttons. Actions are consumed once, separately per player.

Example:

```js
const actions = input.read(playerIndex, gamepads[playerIndex]);
hero.setIntent({...actions, ...cameraRelativeMovement(actions, runtime.camera.alpha)});
hero.obstacles = [...staticSolids, ...movingBoxSnapshots];
hero.update(dt);
actor.update({...hero,
  state: hero.attack ? 'attack' : hero.state,
  animationProgress: hero.attack?.progress,
  animationExclusive: !!hero.attack
}, dt);
```

The source mesh's actual bone/socket names and animation mapping remain game-owned. Use phase sampling for deliberate authored actions that require exact timing; keep normal clip cross-fades for idle/walk/run. Runtime animations cache their blending configuration when started, so phase sampling restarts the sampled group with blending disabled rather than merely changing a flag after startup.

### Game-owned geometry, NPCs and combat

`dist/js/limit/world.js` derives rotated/scaled solid boxes from `geometry-data.js`. All rocks, measured lower trunks, the fallen log, lantern/lever bases, bridge rails and gate pillars are covered. Trees use lower trunk geometry rather than treating the entire foliage canopy as a giant wall. Soft grass/leaf decoration is deliberately passable. Both the kinematic rule world and Havok static proxy meshes use these same extents. Bridge meshes also have actual Havok mesh contact. NPC/player bodies use independent character obstacles; dead units cease blocking the rule world.

`createLivingForestScene.syncCollision()` snapshots real Havok crate transforms/bounds into the rule world before an update. Blocked player contact emits bounded, fixed-step impulse requests; scene code applies them to the actual body with a 3m/s push-force cutoff. The solver blocks penetration, supports landing on crate tops and follows the crate's new location. Changing graphics/physics object count, resetting, and exiting update/dispose those bindings. This is a game adapter using shared controller/physics APIs, not a new generalized physics engine.

Wardens now follow authored routes, pause to watch, and provide contextual guidance when approached and interacted with. Sentinels acquire visible explorers, navigate around obstacles, pursue/hold/retreat according to role, telegraph attacks, use cooldowns and return to patrol when a target is lost. These forest-specific behaviors use the existing controller and target-selection interfaces, rather than render-time sine/cosine circles. AI does not claim a navmesh or machine learning.

`scripts/limit/bake-gameplay.mjs` reproducibly samples the **bundled** GLBs into measured collision extents and weapon contact/release paths. Run it from the repository root with the pinned Babylon/loaders already installed. No asset download or new dependency is needed. It uses the original KayKit hand-slot parents and intended sword/knife meshes; spare accessories stay hidden. `dist/js/limit/combat.js` interpolates those model-specific samples at the authoritative attack/cast phase and transforms them by the character's actual scale/yaw/position. Do not substitute a distance-only melee hit or a hand-independent projectile origin.

Forest combat runs fixed 1/60-second steps, collecting contacts before applying damage so legitimate simultaneous hits can trade. Normal hits preserve attack progress/history/cooldown. Dodge has a short explicit immunity window; ordinary impacts give bounded collision-aware knockback. Energy pulses use a bounded pool and earliest solid/target swept contacts. No friendly fire. Zero health triggers an imported defeat animation and checkpoint recovery, with unlimited retries and a brief recovery shield. Lanterns heal. Three lanterns, three sentinel victories, a lever interaction, a raised door and both co-op explorers at the exit complete the adventure.

The revised traversal baseline identifies itself as `living-forest-v2-navigation`; it includes actual warden navigation but disables adventure encounters and awards no points. It is **not a combat stress benchmark**. Preserve v1 history and compare runs from the same workload edition. Adventure records use `limit-forest-v2` / `forest-2`; prior `limit-forest-v1` records remain saved.

### Verification

`npm run test:limit` now includes `tests/limit-gameplay.mjs`: legal complete solo/co-op adventures with no forced kills/unlocks, all solid scenery, moving/waiting NPCs, NPC/crate contact, attack preservation, dodge/recovery, gate conditions and wall-before-enemy projectiles. The actual Babylon/Havok scene test checks intended hand-held equipment, imported blade/casting-palm agreement, real crate displacement, terrain, weather, reset bounds and cleanup. Numeric alignments are reported by tests, not assumed from similar-looking poses. Run `npm test` for the starter/Wobbly Wars/all-games regressions after shared changes. Physical Windows touchscreen/gamepad and GPU shader checks remain separate hardware verification.

### Standard Xbox-compatible controllers (6.2.0)

`dist/js/3d/gamepads.js` has no Babylon/DOM dependency. `new GamepadHub({players:2,onConnect(player,pad),onDisconnect(player,slot)})` owns stable local player slots. Call `hub.poll(navigator.getGamepads(), contextKey)` from one input loop, then read `hub.pad(player)` and edge-triggered `hub.pressed(player,button)`. Sparse browser device indices do not become player numbers; P2 keeps its slot if P1 disconnects. Standard-mapped devices only; `hub.unsupported` lists unsupported devices for an honest keyboard/touch fallback. `hub.clear()` suppresses buttons immediately and requires release; call `dispose()` on exit. Changing `contextKey` requires release before a held confirmation can act in another menu or gameplay. `padAxis(pad,index,deadzone=.18)` rescales a deadzone; `padButton(pad,index)` accepts digital or analog trigger values above .4.

`ActionInput(players,{gamepad:buttonMap})` accepts configurable standard button indices without changing its legacy defaults. Exported `XBOX_ACTIONS` supplies A jump, X strike, B dodge, Y interact, RT pulse and RB run. Left stick moves. Menu/camera bindings remain in the game-owned UI adapter. Never route the same physical controller into both player slots.

```js
const hub = new GamepadHub({players: 2,
  onDisconnect: () => pauseAdventure(true)});
const actions = new ActionInput(2, {gamepad: XBOX_ACTIONS});
// An input-only RAF can continue while the physics/world timer is paused.
hub.poll(navigator.getGamepads(), acknowledged ? 'forest-play' : 'instructions');
const intent = actions.read(0, hub.pad(0));
hero.setIntent({...intent, ...cameraRelativeMovement(intent, camera.alpha)});
// Exit: stop the owning input loop, actions.clear(), hub.dispose().
```

Living Forest's `createControllerUI({...})` in `dist/js/limit/controller-ui.js` is a game-owned menu adapter with injectable `getPads`, `document`, RAF/cancel, `getContext()` and pause/back/help/look/recenter/status callbacks. It never advances the world, physics, audio or score. `getContext()` supplies `{key,mode,surface,canPause}`; mode is menu/game/loading/baseline/background. `auto:false` and `tick(now)` allow independent fixtures. `.dispose()` cancels its RAF and clears the hub. D-pad/left stick navigates visible enabled controls, left/right adjusts options, A confirms, B backs out. It preserves focus after setup re-rendering. Shared instructions remain mandatory. Right stick looks, LB recenters, Menu pauses/resumes and View opens How to Play. The common camera is shared in co-op. Focus loss, tab hiding and controller disconnect pause an active adventure; reconnection never automatically resumes it. The baseline disables gameplay input and aborts if paused.

Users pair controllers in Windows first: [Microsoft's Windows controller pairing guide](https://www.microsoft.com/en-us/windows/tips/controller). Bluetooth-capable Xbox controllers or wired USB standard controllers are supported when exposed by the browser. Press a controller button while this HTTPS browser tab is focused to expose the device; release it before confirming. No game-specific Bluetooth pairing API or paid software is used. The Xbox logo button belongs to Windows. Chrome/Edge on Windows are the target; physical PC/controller tests remain required. If browser autoplay blocks audio, tap the touchscreen once. Input fixtures cannot verify physical Bluetooth reliability, rumble, GPU speed, controller firmware or OS button interception. Rumble is not implemented.

Independent `tests/3d-gamepads.mjs` verifies hub ownership, sparse indices, mapping rejection, disconnect/replacement, analog RT, configurable actions and two-player isolation; its separate DOM fixture verifies menu navigation, held-button acknowledgement, camera/help/pause callbacks, focus blocking and RAF cleanup independently of either 3D game. `tests/limit-controller.mjs` additionally executes the actual adventure disconnect callback and checks its clock remains frozen until intentional resume. These are device fixtures, not physical hardware results. The starter and Wobbly Wars regressions remain required whenever shared input changes.
