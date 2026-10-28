# Little Big Arcade revamp — persistent progress

## Resume here

- **Current checkpoint: Milestone 1, audit and existing-state recovery — implemented and verified; awaiting the user’s trial/review.** Do not begin Milestone 2 implementation yet.
- **User review gate:** stop after each milestone and let the user try it. Do not begin Milestone 2 implementation until the user has reviewed Milestone 1 and asks to continue. Investigating the existing foundation is part of Milestone 1, not a new Milestone 2 implementation.
- **No deployment is authorized for this revamp.** Earlier deployment requests concerned the old `2c31e13` polish commit. Do not infer authorization for subsequent milestones. No Sites deployment access exists in this environment; GitHub pushes do not publish the site.
- Master specification: [complete original plan](docs/ARCADE_REVAMP_MASTER_PLAN.md), retained in full from the uploaded text. Read it and `AGENTS.md` before continuing; read `3D_GAME_DEVELOPMENT.md` before 3D changes.
- Starting source: **`2c31e13c0fc06519e5d845241feb2d5299bb4958`**, version **6.3.0**. This session's branch is **`revamp/milestone-1-audit`**, based on the prior polish work. Do not reset to a different `main` and lose that work.
- `dist/` is authoritative editable runtime source. `build/` is an ignored static copy. Use the existing checkout; no worktree is needed.

## Milestone ledger

These are the **new master plan's** milestones. Old “Milestone 2” labels inside the game describe the earlier Forest release and do not establish completion of this new plan.

| Milestone | Status | Evidence / remaining work |
| --- | --- | --- |
| 1 — Audit and existing-state recovery | **Complete; user trial/review pending** | Complete inventory and preservation audit; original baseline plus actual solo/co-op Forest movement/cleanup and a real five-stage Forest benchmark verified. |
| 2 — Limit Break foundation | Existing implementation substantially present; not signed off against this plan | Imported Forest, animated heroes, traversal, camera, collision, native controllers, touch and monitoring exist. Reuse them. Review target-PC visuals, input ergonomics and unfinished foundation options before choosing a focused change. |
| 3 — Shared systems | Partially inherited | Independent 3D toolkit, controller hub, cursor/menu adapter, lifecycle and audio systems exist. Shared controller cursor is not native direct-action support in every game. |
| 4 — Launcher redesign | Partially inherited from 6.3.0 | Warm shell, search, categories, daily picks and last-opened shortcut exist. Favorites, richer previews and accurate per-game capability indicators are unfinished. |
| 5 — Gameplay expansion | Forest chapter only | Three lanterns, three sentinels, lever/gate and chapter completion exist. Ancient Castle, separate Combat Arena, Chaos Chamber and a connected four-zone adventure do not. |
| 6 — Scientific benchmarking | Forest-only implementation | Six presets including Auto; actual frame logging, five Forest stages, warm-up, history, JSON/CSV and short tuning runs exist. No castle/combat/chaos benchmark claims are valid yet. |
| 7 — Every 2D game | Not complete | A prior shading pass affected four illustration families. Entry-screen checks do not replace individual active-game artwork/gameplay/audio/input reviews. Use the complete roster below. |
| 8 — Other 3D experiences | Partially inherited | Wobbly Wars has imported rigs, real wrist attachments, authored combat, scenery, costumes and a preserved illustrated purchase UI. Further native controller/camera/art/performance work needs targeted review. |
| 9 — Multiplayer/replayability | Existing modes preserved; further work pending | Many games already have versus, co-op or alternating turns. Simulated regressions pass; physical mixed-input play and new engagement work remain. |
| 10 — Final quality pass | Pending | Full per-game playthrough/hardware matrix, integrated four-zone checks and target-device performance remain. |

## Actual Limit Break inventory

| Area | Current verified scope | Limits / next investigation |
| --- | --- | --- |
| Registration | One public `limit` entry in the 25-world registry; no duplicate game | Maintain the stable ID and existing records. |
| Engine | Babylon.js **9.32.0**, Havok **1.3.14**, ES modules; WebGL with labeled Canvas compatibility fallback | A software renderer and SwiftShader are not physical integrated-GPU results. Do not migrate engines unnecessarily. |
| Assets | 22 local GLBs; actual imported textured heroes, foliage, ruins and props; normal/roughness maps, true tree/boulder LODs | KayKit Adventurers, Quaternius, Poly Haven and original geometry; licenses/provenance in `dist/assets/limit/`. No mandatory runtime account, paid API or CDN. |
| Heroes/animation | Imported 41-joint hero/rogue rigs and idle/walk/run/jump/interact/attack/cast/dodge/defeat/cheer clips | Do not substitute generic poses for the measured imported weapon/palm paths. Physical display inspection remains. |
| Living Forest | Seeded terrain, bridge/stream, trees/rocks/foliage, ruins, gate, lanterns, wardens and sentinels | No explorable castle interior, dedicated arena, wildlife showcase or Chaos Chamber. |
| Movement/camera | Acceleration, gravity, terrain/obstacle collision, camera-relative movement, following shared camera and wall recovery | Co-op uses one shared camera, not split-screen. Input sensitivity and optional touch-UI hiding need review. |
| Actions/combat | Jump/run/interact, melee strike, pulse, dodge, health/recovery; obstacle-aware NPC navigation and swept contacts | Normal damage preserves attacks. Full four-zone progression and a larger boss encounter are future work. |
| Objectives | Restore three lanterns, defeat three sentinels, operate lever, raise gate, finish together; restart chapter | Unfinished adventures restart; no mid-chapter save/checkpoint resume across sessions is claimed. Existing completed scores remain. |
| Keyboard/touch | P1 WASD/Space/E/F/R/C; P2 arrows/Numpad actions; independent on-screen sticks/actions; right-drag orbit | Physical USB multitouch, large-display reach, simultaneous stick/action/camera ergonomics not verified here. |
| Controllers | Stable two-player Gamepad API hub, neutral-button protection, disconnect pause; A jump, X strike, Y interact, RT pulse, B dodge, RB run, LB recenter, right stick camera | Actual Windows Bluetooth/USB pairing, physical connection reliability and configurable sensitivity remain unverified/unfinished. Do not confuse recommended mappings in the plan with implemented mappings. |
| Graphics | Auto/Low/Medium/High/Ultra/Experimental Maximum; bounded resolution/shadows/surfaces/foliage/particles/physics/effects; day/dusk/night/rain demos | Unsupported effects are gated. GPU shaders and sustained speed on the intended PC still need testing. |
| Monitoring | Real frame samples, average/1% low/percentiles/spikes; scene counts and available engine data; missing metrics N/A | JS heap is not RAM/VRAM. Do not invent GPU timing or memory figures. |
| Benchmark | Five **Forest** camera stages, five-second warm-up plus ~30 measured seconds, fixed settings, local history capped at 20, raw samples, JSON/CSV, 30/60 FPS recommendations | Stages: canopy, water, ruins, navigating wardens, physics grove. They are not castle/combat/chaos scenarios. Physics is not promised bit-for-bit identical across devices. |
| Reuse | `dist/js/3d/` controllers, camera, animation, attachments, physics, AI, combat, projectiles, assets, graphics, monitoring, benchmark, gamepads, lifecycle; independent starter | Keep game-specific rig/asset mappings outside the toolkit. Reuse tested interfaces rather than copying Forest internals. |

## Preservation inventory

- Profiles/settings/records/achievements/rivalries/progress: `localStorage['lba-universe-v3']`, schema 3. Old unassigned records are imported from `lba-records`.
- Saved drawings, audio, media, armies and other creations: IndexedDB **`lba-universe-media`**, version **1**, store **`items`**. Backup format is **`little-big-arcade`**, version **3**, including packed binary media.
- Existing tests exercise binary audio backup roundtrips, invalid restore rejection, failed media transaction recovery, score/ruleset separation and co-op records without head-to-head wins.
- Update acknowledgements are separate: **`lba-update-notices-v1`**. Last-opened world is separate: **`lba-last-world`**. Do not reset either when switching players or upgrading gameplay.
- This session does **not** read real family browser data. Test-created profiles/storage are isolated fixtures. Export a real backup in the original browser before testing on a different device/origin.
- All **98** original files under `dist/assets/` and `dist/vendor/` match the original migration checksums. `SOURCE_SHA256.json` and `EXPORT_TREE.txt` remain historical migration provenance, not a current hash of intentionally changed source. Future asset replacements need explicit provenance and an updated audit policy, not silently edited original checksums.
- Existing source baseline has **25 public worlds**, **one hidden game**, the classic Wobbly Wars edition and retained older rulesets/results. Developer-only Beacon Couriers and Weapon Workshop are not new public launcher registrations.

## Game-by-game ledger

**M1 adds no game artwork or rule changes.** “Inherited” means already present at starting commit `2c31e13`; it is not work newly completed in this audit. Shared controller navigation/cursor support is available across pointer-driven games, with real camera/microphone/speech requirements preserved. Native direct movement/action mappings are established for Forest, not every 2D game.

| Game / stable ID | Existing implementation and baseline evidence | Unfinished revamp / next review |
| --- | --- | --- |
| Gladiator Arena / `gladiator` | Tactical equipment/turn-based arena; quest controller and combat fixtures; entry renders | Individually inspect battle feedback, hero art, equipment UX and controller prompts. |
| Math Quest / `math` | K–8 curriculum, notebook, grade/skill progression; math expansion and quest tests | Active question variety/readability, handwriting space, touch/turn flow and educational pacing. |
| Bug Squash / `bugs` | Color/symbol reaction game; refined rules/controllers; inherited illustrated bug shading | Active difficulty progression, target contrast, expressive reactions and audio comfort. |
| Creative Studio / `paint` | Drawing, objects/layers, media/project persistence; studio tests and real browser controller drawing | Brush/sticker/art quality, collaboration, project/gallery UX; painting remains touch/mouse first. |
| Balloon Mayhem / `balloons` | Color/number reaction rounds; refinement tests; inherited balloon shading | Active target readability, variety, difficulty and effects/feedback. |
| Monster Café / `cafe` | Exact orders and ingredient controls, alternating competition; cafe/refinement tests | Customer expressions, ingredient artwork, order hierarchy, sequencing and turn UX. |
| Circuit Rush / `circuit` | Independent wire/path puzzles; circuit/controller fixtures | Active contrast, hints, progression, drag feedback and two-player screen layout. |
| Gravity Chaos / `gravity` | 30 courses, real Matter behavior, swipes/platform tools, independent worlds | Physical multi-finger feel, tool clarity, materials, impacts and level readability. |
| Two-Player Tap Battle / `battle` | Equal seeded challenges, series/exactly-once scoring; refined controller tests | Active prompts, split-area clarity, difficulty, audio and physical concurrency. |
| Build & Smash / `build` | Campaign, construction, saved structures, physics and competition; smash tests | Material art, destruction feedback, build tools, physics stability and device playthrough. |
| Beat Lab / `beat` | Pads/sequencer, samples, PCM/MP3, saved projects and backup tests | Music timing/visualization, project UX, Beat Battle and physical audio latency; no forced awkward freehand controller mapping. |
| Slime Lab / `slime` | Elastic pointer mechanics, split/merge courses; touch-world tests; inherited illustration shading | Physical two-pointer deformation, material personality, reactions and controller ergonomics. |
| Monster Dentist / `dentist` | Real tool-specific treatments and turn-based cases; touch-world tests | Patient animations, tool feedback, precise gesture reach and turn clarity. |
| Shadow Ninjas / `ninja` | Stealth, route/gesture mechanics, shields/wall jumps; touch-world tests | Native direct controller gameplay suitability, active scene readability and feedback. |
| Castle Creator / `castle` | Building/defense, upgrades, waves, original purchasing workflow; overhaul/combat/premium tests | Construction visuals, soldier/projectile feedback, physical tools and wave readability; preserve purchases. |
| Buddy Mayhem / `buddy` | Ragdoll/gadget challenge families; premium solutions/controllers | Articulated personality, gadget/impact feedback and physics feel. “Kick Me Buddy” in the plan maps to this existing game, not a duplicate registration. |
| Doodle Defenders / `doodle` | Real ink costs, defenses and authored level solutions; premium tests | Drawing feedback, notebook identity, tower/creature animation and active controller practicality. |
| Robot Repair Shop / `robot` | Diagnosis, repairs, assembly and career jobs; premium tests | Tool animation, fault cues, assembly feedback and patient difficulty progression. |
| Wobbly Wars / `wars` | Babylon/Havok 3D plus preserved classic edition, 21 classes, authored weapon poses, illustrated purchases; weapon/core/controller tests | Deeper model/material/animation and native camera/controller review; target-GPU performance; do not replace purchases with dropdowns. |
| Funny Face Studio / `funny` | Real camera/face-tracker media workflows and local saved media; media/circuit tests | Physical tracking stability, capture cleanup, editor UX and real-device media quality. |
| Monster Me! / `monster` | Avatar/expression/voice studio, composited media and challenges; media tests | Real face/voice behavior, individual creature personality and physical capture QA. |
| My Noisy Zoo / `zoo` | Animals, recorded custom voices, choir/layout creation and persisted media; media tests | Animal animation, record/playback UX, choir feedback and real microphone testing. |
| Air Slice / `air` | Real hand-only camera tracking plus explicit touch fallback; air/fixture tests | Physical camera/two-player reliability, silhouettes/artwork and safe background removal. No synthetic tracking in normal play. |
| Spelling Adventure / `spelling` | Word trails, board, speech/turn progression; spelling/voice fixtures | Physical browser voice choices/pronunciation, illustrated world and pacing; preserve automatic free voice choice and **Niko = NEE-koh**. |
| Project Limit Break / `limit` | Forest adventure, native input, real rigs/physics, co-op, monitoring and baseline; dedicated suites | New Milestone 2 foundation sign-off first, then the later four-zone/benchmark expansion. See the detailed inventory above. |
| Hidden game / `face` | Secret entry preserved, no public tile or ordinary trophy disclosure; circuit/face and launch tests | Private development QA only; do not reveal it in public game lists/release notes. |

Older `keeper`/`dig` result IDs and legacy/refined engine code exist outside the current public roster. Their records must remain compatible; this audit does not advertise them as extra working public games or remove their data.

## Full regression checklist for each future game batch

Record evidence separately for **automated fixtures**, **actual browser play**, and **physical hardware**. A passed entry screen is not a completed gameplay playthrough.

- [ ] Launch from the actual library; required instruction acknowledgement before simulation/capture.
- [ ] Start, restart/rematch, manual How to Play, pause/resume, exit, reopen; no repeated mandatory gate within one session, one gate after reopening.
- [ ] Controls at target resolution/fullscreen/resize: mouse, keyboard, real touch and advertised native/cursor controller modes.
- [ ] Real gameplay progression, meaningful choices, win/lose feedback and completion; investigate failures rather than hiding them.
- [ ] Solo and each advertised versus/co-op/alternating mode; independent input ownership and fair turns.
- [ ] Score/achievement/progress saving exactly once; backup/export/restore and older data compatibility.
- [ ] Active visual rendering, models/animations/feedback, readable UI and correctly loaded/licensed assets.
- [ ] Offline launch/play after the complete asset cache is installed; explicit update activation does not interrupt a game.
- [ ] Resource cleanup after exit/background/failure: pointers, controllers, camera/microphone, audio, RAF, meshes, physics and pending imports.
- [ ] Physical target-PC performance and device behavior; report unsupported/N/A measurements honestly.

## Architectural obstacles / risks established by inspection

1. **Only one Forest zone is implemented.** Do not relabel its five camera stages as four completed gameplay zones or stress scenarios.
2. **Native and cursor controllers differ.** The global adapter intentionally yields to Forest's native adapter. Preserve that ownership boundary; no second poller should move the same player.
3. **Touch ergonomics and optional UI hiding are unfinished.** The current Forest exposes touch sticks/actions on screen; configurable sensitivity and explicit hide/auto behavior need user-device feedback before changing the foundation.
4. **Shared camera, not split-screen.** Co-op is real shared-objective play with independent actors, not two independent views.
5. **Cloud graphics are not the arcade PC.** SwiftShader/compatibility measurements cannot promise 30/60 FPS on the intended integrated GPU. Formal runs must retain preset/resolution/workload and raw frames.
6. **Persistence has two stores.** Keep localStorage/IndexedDB restore rollback behavior. Raw benchmark history shares the local profile/settings storage budget; avoid unbounded history or sample growth.
7. **Asset/source provenance differs.** Original migration hashes protect assets today, but planned artwork replacement will require a new documented baseline; never “fix” hashes just to make verification pass.
8. **Tests include deliberate device/render fixtures.** They verify logic, not physical cameras, handwriting, microphones, Bluetooth, USB or GPU shader fidelity.
9. **UI modules are compact and some tests extract functions.** Prefer small tested changes. Avoid an engine-wide rewrite or incidental reformat/refactor during early milestones.
10. **Deployment/PR tools are restricted.** Git operations work; GitHub API and Sites access have been unavailable. Commit/push review branches without claiming PR publication or website deployment.

## Session record — Milestone 1 audit (2026-10-27, America/New_York)

### Inspected and inherited

Read the entire uploaded master specification, repository requirements, registry, existing 3D documentation, Forest scene/UI/assets/input/benchmark/records, asset licenses, save/backup code and existing acceptance/tests. Inspected the current 6.3.0 polish implementation rather than counting files as complete milestones.

### Changed in this session

- Preserved the entire plan in `docs/ARCADE_REVAMP_MASTER_PLAN.md`; only CRLF line endings were normalized to LF. Original upload SHA-256: `d5d43b2ad212d9c2cd95a3139e2b936c2f56130e7b868633f1cf418658ee7e67`. Normalized full-text equality was verified.
- Added this persistent milestone/game/QA/resume ledger.
- Added `scripts/audit-arcade.mjs`: read-only roster, duplicate registration, hidden entry/legacy hooks, version/hosting identity, offline asset/dependency closure, original asset checksums and save identity checks.
- Added `tests/audit-arcade.mjs`: isolated negative fixtures prove the audit fails for actual regressions such as removed games, duplicate IDs, missing/uncached imports, changed assets, save-key changes and mismatched versions.
- Added `tests/limit-browser.mjs`: actual browser-based Forest loading/gate, imported actor movement, pause, camera, co-op, cleanup and measured Forest baseline. This complements, rather than replaces, existing pure rules and device fixtures.
- Added npm commands `audit:arcade`, `test:audit`, `test:limit:browser`; the audit regression joins the default test chain. **No runtime game source, asset, save schema or live website is changed by this milestone.**

### Test results

| Command/check | Status and scope |
| --- | --- |
| Original `npm test` chain | **Passed: all 35 pre-existing programs**, including complete legal solo/co-op Forest route/combat simulations, independent toolkit/starter, actual Havok/rig/asset checks and save/media roundtrips. **Final updated `npm test` also passed all 36 programs** (the original 35 plus the new audit regression). |
| `npm run test:browser` | **Passed: 68 real browser shell/game-entry layout/accessibility checks**, plus search, profile/mute/restore, cursor fixtures, real Creative Studio drawing and real offline reload. Active gameplay/hardware accessibility is not implied. |
| `npm run audit:arcade` | **Passed:** 25 unique public worlds, one Limit Break entry, hidden entry retained, 243 distinct existing cache entries, 145 reachable application dependencies precached, 98 asset/vendor checksums, unchanged save identities and existing hosting target. Static evidence only. |
| `npm run test:audit` | **Passed:** isolated regression injection and recovery. |
| `npm run test:limit:browser` | **Passed:** real solo actor movement, pause, camera orbit/monitor, independent co-op movement, real engine disposal and actual five-stage benchmark persisted to browser storage. No browser exceptions or failed local asset responses. Initial test-harness loader/polling mistakes were corrected and the complete command rerun successfully; no game source was changed to force a pass. |
| `npm run build`, final diff and source preservation | **Passed:** build copied the source successfully; final diff/whitespace checks passed. Runtime `dist/`, original provenance, hosting configuration and lockfile remain identical to starting commit `2c31e13`. |
| Windows touch/controller/capture/GPU and real family backup | **Not performed.** No actual family browser data was accessed. |

### Measured cloud baseline and retained evidence

- [Actual Forest browser report, including all raw frame samples](docs/revamp/M1_FOREST_BROWSER.json).
- [Static roster/preservation audit report](docs/revamp/M1_STATIC_AUDIT.json).
- [Actual Forest screenshot with frame monitor](docs/revamp/M1_FOREST.png).
- Source under test: unchanged runtime from `2c31e13`; Low preset, 0.7 render scale, **896 × 579** effective pixels, 8 physics props; WebGL 2 via **ANGLE/SwiftShader** on headless Linux Chromium. Shadows/AO/reflections/postprocessing off.
- **166** recorded frames / **30.158 seconds**, after the five-second warm-up. Actual average **5.50 FPS**, 1% low **0.92 FPS**, median **159.8 ms**, p95 **273.9 ms**, worst **1838.3 ms**. These poor software-renderer figures are not a target-PC pass, fail or 30/60 FPS promise; stage samples are small.
- The five measured stages remain Forest canopy/water/ruins/wardens/physics, not unfinished zones. The benchmark stored real raw frames with fixed settings and no invented performance score.
- Visual audit: real textured geometry, imported animated hero and world load. On the inspected Low-preset view the canopy/foliage looks sparse, and opening the frame monitor covers much of the minimap. These are concrete candidates for the next foundation/UI review, not claims of a completed art upgrade. Touch controls occupy a fixed bottom panel and need a deliberate hide/auto policy.

### User trial at the milestone boundary

This milestone changes developer tooling and documentation, not gameplay. The user can try the **existing verified 6.3.0 foundation** from this branch before choosing Milestone 2 changes:

1. Use the checkpoint source archive or checkout `revamp/milestone-1-audit` in a local clone. With Node 22+ installed, run `npm ci` and `npm start` from the repository root; the terminal prints the local address.
2. Open **Project Limit Break → One Explorer → Low or Auto → Enter the Living Forest**, acknowledge the instructions, then try movement, camera, jump, strike, pulse, dodge, lanterns/sentinels and the lever/gate.
3. Try **Together · 2 Players**, physical controllers/touch if available, pause/reconnect and exit/reopen. Existing native controls are listed above and in the game's controller guide.
4. Try the **Forest Baseline**, review resolution/renderer/settings and export its JSON on the actual arcade PC. Export a family backup before switching browser/origin. Give feedback on visual density, camera feel, touch-panel reach and real frame pacing.
5. Return with feedback and explicitly ask to continue to Milestone 2. A website trial would require separate authorized deployment through the existing Sites workflow; no live-site change is included here.

### Next actions

1. **Wait for user trial/review.** The milestone implementation, 36-program aggregate run, 68-case browser suite, real Forest browser run, build and source-preservation checks are complete.
2. The checkpoint is on `revamp/milestone-1-audit`; identify its exact commit with `git log -1 --format=%H -- ARCADE_REVAMP_PROGRESS.md`. Provide the source trial package/instructions and stop. Do not deploy or implement Milestone 2 in the same session.
3. **Pause for the user to try it.** Ask for feedback on the current Forest, movement/camera, native controller controls, touch reach and visual quality on the real arcade PC.
4. After the user says continue, pick a focused Milestone 2 foundation improvement from verified gaps (input sensitivity, usable touch camera/hide controls, visual/performance problems observed on the target device). Reuse the existing Forest; do not create another registration or rebuild solved systems.
5. Update this document at the end of every coding session with exact changes, tests, failures, unfinished items, commit/branch and the next action. Never overwrite inherited evidence with new unverified completion claims.
