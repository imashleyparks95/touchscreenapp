# Creative Freedom delivery — v6.33.0

Two original complete games are integrated into the existing arcade. The original request is preserved verbatim in CREATIVE_FREEDOM_MASTER_PLAN.md; the chosen concepts/inventory are in CREATIVE_FREEDOM_DESIGN.md. This adds two worlds, retaining every one of the original 25 public IDs, the hidden entry, original art/vendor files, Beat Lab v6.32 features and family storage. It does not change shared 3D toolkit API 1.0 or existing game mechanics.

## Cloudwake Couriers — original 3D flight/delivery

Fly a sail-wing courier among Copper Quay, Orchid Reach, Bellweather and Moss Lantern. Pick up the parcel at the glowing harbor; fly to the next beacon, brake and descend, then dock low/slow to deliver. Independent momentum, three-dimensional altitude, energy-limited boost, moving storm fronts, collision spires, hull/shield/recovery and optional elevated wind rings create routing choices. Unlimited route retries; the weather timer gives genuine failure. Six route configurations change obstacles, storm count and later delivery patterns; five difficulties change pressure/time. Completed deliveries survive a hull recovery, while an unfinished parcel returns to its source. Each courier must finish their own assigned deliveries for a co-op win.

Original game-owned lofted mesh geometry defines an enamel gondola, fabric wings/tail, struts, helmet/goggles, spinning propeller and carried parcel. Floating cliff harbors include turf, houses, copper roofs, windows, dock posts, signals and lanterns. WebGL uses three original procedural cloth/wood/turf textures, light/shadow/fog depth, clouds/storms, wind rings and pooled delivery/impact effects. Close follow framing keeps craft legible; Harbor Map toggles overview and a separate live map shows all destinations/couriers. No external models, paid assets, image services or new downloads/dependencies were introduced. This is a vehicle game; there is no humanoid skeleton/character-combat claim.

Controller priority: actual GamepadHub, padAxis and padButton, stable P1/P2 slots. Left stick flies, right stick Y changes altitude, A docks, X boosts, B brakes; Menu pauses, View reviews help. Keyboard P1 WASD/Q/E/F/Space/left Shift; P2 arrows/PageDown/PageUp/Enter/right Shift. Independent captured touchscreen sticks and large hold action buttons support simultaneous mixed input. Two standard controllers or keyboard/touch can cooperate; a mouse alone cannot provide simultaneous contacts. Disconnect/background/help pause and release input; reconnect never resumes automatically. Setup/pause/results return controller ownership to the existing menu cursor.

The existing create3DScene/Babylon/Havok lifecycle, staticCollider/controlledCapsule, create3DEffects and audio are reused unchanged. Authoritative flight acceleration and circular spire/storm contacts are deterministic game-owned kinematic rules, not a claim that Havok calculates an aerodynamic simulation. Real Havok static/animated collision proxies accompany the scene. Fixed 1/60s rule stepping has bounded catch-up. Loading is session-token guarded; pause/background during loading stays paused. Failed engine startup leaves recovery controls. Scene bodies, effects, textures/materials, observers, RAF/input/audio ownership are disposed at exit.

## Inkfin Lagoon — original illustrated water-lure rescue

Call an illustrated school of ten fish toward a lighted sanctuary. Hold a lure near fish and move it gradually ahead; Push changes attraction to repulsion. Fish retain their own velocity, nearby flock alignment/separation and tide response. Rocks physically redirect them; moving jellyfish briefly startle them without permanent removal. Lures have stamina, replenish when released and refill quickly over bubbling vents. Rescue eight before the tide ends. Six reef configurations add rock/route/hazard variation, five difficulties adjust time/pressure, and early completion/startle avoidance improve score. Solo or two-player shared-school co-op is available from the start.

Original Canvas paths illustrate body contours, tail/dorsal/pectoral fins, scales/eyes, coral-crowned rocks, layered kelp, light shafts, bubbles, translucent jellyfish and the sanctuary arch. Smooth fins/kelp/tentacles and current-lure feedback supply motion; reduce-motion/effect preferences reduce decorations while leaving game hazards/rules intact. Canvas backs to at most 2× device pixel ratio and uses fixed world coordinates without adding a physics dependency.

Touchscreen-first: hold/drag anywhere in the water. Each touch keeps its assigned owner after crossing the midpoint; cancel/pause/exit releases it without another player's action. Two independent lures can gather stragglers and lead the school. Mouse Player buttons select the owner when only one pointer exists. Native controller sticks position lures, A/RT call and B pushes; Menu/View pause/help. Keyboard P1 WASD/F/Space and P2 arrows/Enter/right Shift work as alternatives. No camera/microphone/device processing is used.

## Integration, records and original data

Both have original SVG covers/thumbnails, metadata/categories/capability labels, title/setup, journey/difficulty/partner selection, start acknowledgement/manual shared instructions, pause/restart/next journey/selection/exit and fullscreen access. Each has its own original synth cues and quiet melody, using the existing unlocked audio context and respecting sound/music/mute settings. Global lobby music is suspended only while the game owns audio.

Local records are isolated by game ruleset (`cloudwake-v1` / `inkfin-v1`), journey, difficulty and solo/co-op competition. A co-op completion calls the existing atomic single-profile result API once for each participant; it never creates rivalry, draws or head-to-head wins. Each profile's completed journeys and matching high scores appear in setup; Journey records compare only the same level/difficulty/competition. The global board routes these new games to their journey selector/records. Both have a distinct discovery badge. Records persist in the existing schema-3 store and binary backup; strict new record ID/ruleset/team/level/time/completion checks complement the unchanged old validators. Favorites expand from 25 to 27 and old favorites/recents still validate. No global storage reset/migration is required.

## Added and modified files

New runtime, all under `dist/js/creative/`:

- `cloudwake-core.js`: pure flight/delivery rules and six routes.
- `cloudwake-scene.js`: original lofted models, material textures, harbor scene/batching, physics proxies, cameras/map ownership, animation and effects.
- `inkfin-core.js`: fish/current/lure/stamina/collision/rescue simulation and six reefs.
- `inkfin-art.js`: original layered Canvas artwork/animation.
- `input.js`: game-owned native controller, keyboard and captured touch adapter over tested shared interfaces.
- `covers.js`: original offline launcher/title/instruction SVG artwork.
- `games.js`: acknowledged setup/lifecycle, UI, audio, fixed stepping, per-profile records/badges and cleanup.

Integration modifies `shell.js`, `visuals.js`, `cover-art.js`, `game-instructions.js`, `library.js`, `data.js`, scoped `arcade-polish.css`, releases/package/lock versions and `sw.js`. The read-only audit recognizes Cloudwake's renderer/native controls. Existing roster/cover/card/instruction count tests now expect 27 public worlds (28 with the preserved hidden entry); original protected-ID assertions and old game tests remain. New tests are `creative-freedom.mjs`, `creative-freedom-scene.mjs`, `creative-freedom-browser.mjs`, `creative-freedom-live-browser.mjs`. Documentation/progress/handoff and `docs/revamp/FREEDOM_*` preserve specification, design, evidence and exact publication. No prior gameplay module or original asset/vendor hash changes.

## Verification and performance

Pure legal-input tests complete **all 60 combinations per game** (six journeys × five difficulties × solo/co-op): 120 combinations total. They use actual acceleration/altitude/brake/dock rules or actual bounded lure/flocking/stamina forces, not teleports, invulnerability or direct completion flags. They also check terminal clocks, genuine timeout, docking rejection, collision shield and stamina drain/recovery.

Independent Babylon/Havok tests verify custom craft vertices/normals, animated/frozen propeller, exact craft/proxy motion, follow/overview and repeated scene disposal. Three maximal-route/two-courier scenes each contain **89 meshes, 35 materials, 12 bodies, 28,226 vertices**. Static material batching and merged storm puffs reduce 203 original mesh objects to 89 without reducing model vertices/collision proxies. Low caps decorative clouds and the existing quality presets scale resolution/shadows/particles; user selects quality on setup. Scenery is bounded and materials/textures are reused. No unsupported claim of meshoptimizer/LOD streaming or rigidbody aerodynamics.

Actual browser tests run acknowledged 3D and 2D scenes, native adapter-to-game full co-op completions, independent real captured stick/lure contacts, crossing ownership, pause/help/frozen time, rematch without another acknowledgement, disconnect/background, exit/reopen, saved outcomes/badges and compatible binary backup. The deterministic completion fixture injects only read-only state observation and a controlled frame entry into the served module, then feeds real input adapters; it does not alter game positions, forces or completion rules. Four desktop/phone accessibility/layout audits and reviewed screenshots cover new gameplay screens.

A separate **unmodified production module** browser test verifies real RAF keyboard altitude changes, mouse lure stamina, paused clock, actual service-worker offline 27-card reload and both real offline 2D/3D engines, plus recoverable local-engine startup failure. Full unit regression, expanded shell/library offline/controller/layout suites and Beat Lab's complete fourteen-step WAV/MP3/workers/save/browser flow are included. Final exact results and counts are in ARCADE_REVAMP_PROGRESS.md; evidence in `docs/revamp/FREEDOM_*`.

Cloud-host WebGL metrics are short uncontrolled setup windows, not representative target-PC benchmarks: after batching one run reported 29 FPS / 78.9ms p95 with 54 active meshes and six solo-route proxies; other concurrent-host runs vary. This does not establish 60 FPS, steady frame pacing or Windows GPU quality. Use Low on modest hardware and test both presets/audio/controller/multitouch on the actual touchscreen PC. Node simulation timings are not GPU measurements. Canvas compatibility retains real 3D geometry/gameplay but lacks WebGL texture/shadow fidelity; failure paths are labeled/recoverable.

## Known limits and delivery

Local solo/co-op only, not online play or head-to-head competition. A mouse supplies one contact; use two controllers/keyboard/touch for independent simultaneous input. Routes are bounded authored configurations, not an open-world flight simulator or real fluid dynamics. No partial mid-journey resume; completed journeys, records and badges persist. Native input fixtures and generated scene checks do not certify physical USB/Bluetooth/Windows touchscreen behavior, speaker quality or target GPU performance. Fullscreen uses the existing shared browser/fullscreen control and resize cancellation; physical target fullscreen still needs trial.

Both games are software-complete and ready for the existing Sites deployment/user trial once final checked publication is pinned in WORK_MODE_HANDOFF.md. No deployment occurs in this coding workspace. Preserve project/URL/access policy/family storage; stop for the user's trial after this two-game checkpoint.

Verified publication: tested application `35515b80596b8b0833de9ab84e5e3024a4f2ae47`, branch `creative/cloudwake-inkfin`, version 6.33.0; remote verified. Documentation-only descendant is the final handoff checkpoint.
