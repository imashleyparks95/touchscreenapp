# Little Big Arcade revamp — persistent progress

## Resume here

- **Work Mode entry point:** read [WORK_MODE_HANDOFF.md](WORK_MODE_HANDOFF.md) for the exact deployable checkpoint, publication status, existing Sites destination and ready-to-paste trial handoff. Update it after every milestone.

- **Current checkpoint: Milestone 7B — care games; v6.10.0 ready for deployment handoff.** The user requested “continue.” Monster Café and Monster Dentist are the second verified 2D batch; Milestone 7 remains in progress. Branch `revamp/milestone-7b-care-games`, based on published 7A `10f1638abaf871e7a85471cae8a9c2a28af3537a`; prior deployment branches are unchanged.
- **Deployment workflow (standing user instruction):** after each completed and checked milestone, supply Work Mode a request to deploy the exact commit to the existing site; the user tests once deployed. Do not add a preview-only/no-deploy restriction. Pause before the next milestone unless explicitly authorized to continue. This session has no Sites deployment tools and does not claim another conversation's deployment completed.
- Keep muted dark colors, every game, profiles, scores, saved media, existing access policy and site identity. No physical-device test success is implied by continuation or waived manual checkpoints.
- Master specification: [complete original plan](docs/ARCADE_REVAMP_MASTER_PLAN.md), retained in full from the uploaded text. Read it and `AGENTS.md` before continuing; read `3D_GAME_DEVELOPMENT.md` before 3D changes.
- Starting source: **`2c31e13c0fc06519e5d845241feb2d5299bb4958`**, version **6.3.0**. Milestone 1 checkpoint is **`7cde351`**. Current branch: **`revamp/milestone-7b-care-games`**, based on 7A `10f1638`. Do not reset to a different `main` and lose that work.
- `dist/` is authoritative editable runtime source. `build/` is an ignored static copy. Use the existing checkout; no worktree is needed.

## Milestone ledger

These are the **new master plan's** milestones. Old “Milestone 2” labels inside the game describe the earlier Forest release and do not establish completion of this new plan.

| Milestone | Status | Evidence / remaining work |
| --- | --- | --- |
| 1 — Audit and existing-state recovery | **Complete; user authorized continuation** | Complete inventory and preservation audit; original baseline plus actual solo/co-op Forest movement/cleanup and a real five-stage Forest benchmark verified. |
| 2 — Limit Break foundation | **Foundation checkpoint complete; user waived manual trial** | Existing real Forest reused. Added saved camera preferences, independent touch LOOK region, adaptive touch visibility and restore control, mixed-input safeguards, separate monitor/map and benchmark exit. User requested a darker overall shell; applied muted dark palette. Physical target-PC sign-off remains. |
| 3 — Shared systems | **Shared foundation checkpoint complete — 6.5.0** | Tested lightweight touch/lifetime/menu/music/presentation helpers integrated into real consumers; existing GamepadHub and capability-gated 3D graphics retained. Five browser integration scenarios plus full regressions pass. Per-game native mappings remain later work. |
| 4 — Launcher redesign | **Launcher checkpoint complete — 6.6.0** | New dark illustrated spotlight/library, profile-specific favorites/recent shelves, search/filter/sort, 25 substantive previews, accurate native/cursor/device/multiplayer labels and responsive navigation. Existing profiles/records/media/instruction gates retained. |
| 5 — Gameplay expansion | **Four-area checkpoint complete — 6.7.0** | New four-area expedition, Castle doors/seals, two-phase Crown Arena boss, interactive bounded Chamber workload with measured snapshots and separate whole-expedition scores. Legal solo/co-op completion, actual Babylon/Havok areas, real browser input/transitions/load/export/records and preservation checks pass. |
| 6 — Scientific benchmarking | **Checkpoint complete — 6.8.0** | Separate five-scenario suite across actual Forest/Castle/Arena/Chamber scenes, per-scene warm-up, fixed paths/seed/settings, actual raw-frame history/JSON/CSV, comparisons and all-scenario 30/60 FPS tuning. Hardware results remain target-PC work. |
| 7 — Every 2D game | **In progress — 7A and 7B verified, 6.10.0** | Bug Squash and Balloon Mayhem receive individual original art, animation, per-player readable cues/feedback, responsive layouts, soft hit sounds, actual bug fixes and targeted solo/versus verification. 7B adds Monster Café/Monster Dentist art, recipe/tool guidance, focus and input-lifecycle improvements. Remaining game rows below still require individual upgrades; no claim that all 2D games are complete. |
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
| Living Forest | Seeded terrain, bridge/stream, trees/rocks/foliage, ruins, gate, lanterns, wardens and sentinels | The original Forest chapter remains separate; the new expedition continues through Castle, Arena and Chamber. Wildlife showcase remains unimplemented. |
| Connected expedition | Serial Forest → Ancient Castle rooms/doors/seals → Crown Arena/two-phase Warden → Chaos Chamber/reactors/return gate; both explorers finish together | No streaming/free backtracking or saved mid-expedition resume. Only completed expeditions write the new edition. |
| Movement/camera | Acceleration, gravity, terrain/obstacle collision, camera-relative movement, following shared camera and wall recovery | Co-op uses one shared camera, not split-screen. Saved camera sensitivity/deadzone and Auto/Show/Hide touch UI are implemented in 6.4.0; target-device feel still needs review. |
| Actions/combat | Jump/run/interact, melee strike, pulse, dodge, health/recovery; obstacle-aware NPC navigation and swept contacts | Normal damage preserves attacks. The larger Crown Warden adds ranged casts below half health; imported-hero ragdolls/destructible architecture are not claimed. |
| Objectives | Forest chapter: three lanterns/three sentinels/lever/gate. Expedition: eight total lights/seals, eleven objective guardians, all four exits, separate complete-run records | Unfinished adventures restart; no mid-chapter save/checkpoint resume across sessions is claimed. Existing completed scores remain. |
| Keyboard/touch | P1 WASD/Space/E/F/R/C; P2 arrows/Numpad actions; independent on-screen sticks/actions; right-drag orbit and independent touch LOOK region | Physical USB multitouch, large-display reach, simultaneous stick/action/camera ergonomics not verified here. |
| Controllers | Stable two-player Gamepad API hub, neutral-button protection, disconnect pause; A jump, X strike, Y interact, RT pulse, B dodge, RB run, LB recenter, right stick camera | Actual Windows Bluetooth/USB pairing, physical connection reliability remain unverified; configurable camera speeds/deadzone are now implemented. Do not confuse recommended mappings in the plan with implemented mappings. |
| Graphics | Auto/Low/Medium/High/Ultra/Experimental Maximum; bounded resolution/shadows/surfaces/foliage/particles/physics/effects; day/dusk/night/rain demos | Unsupported effects are gated. GPU shaders and sustained speed on the intended PC still need testing. |
| Monitoring | Real frame samples, average/1% low/percentiles/spikes; scene counts and available engine data; missing metrics N/A | JS heap is not RAM/VRAM. Do not invent GPU timing or memory figures. |
| Benchmark | Original Forest baseline plus new separate five-world suite; 3 s warm-up + 8 s recording per scene, fixed settings, local history capped at 20, raw JSON/CSV, comparable-run labels/differences and all-scenario tuning | Forest rendering, Castle lighting, Arena combat, Chamber physics/particles and combined Chamber load. Seeded 60 Hz scripts cap catch-up at 100 ms/rendered frame. Physics/scheduling are not bit-for-bit deterministic across devices. |
| Chamber workload | Bounded animated guides/optional AI/real physics/demo pulses/motes/lights/complexity, settings-driven distance/effects, immediate reset and up to eight measured-window exports | Optional AI never locks objectives; windows are interactive measurements, not controlled formal multi-zone benchmarks. |
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

**M1 added no game artwork or rule changes.** “Inherited” means present at starting commit `2c31e13`. Newly completed game work is explicitly marked in the final column; other rows retain their baseline inventory. Shared controller navigation/cursor support is available across pointer-driven games, with real camera/microphone/speech requirements preserved. Native direct movement/action mappings are established for Forest, not every 2D game.

| Game / stable ID | Existing implementation and baseline evidence | Unfinished revamp / next review |
| --- | --- | --- |
| Gladiator Arena / `gladiator` | Tactical equipment/turn-based arena; quest controller and combat fixtures; entry renders | Individually inspect battle feedback, hero art, equipment UX and controller prompts. |
| Math Quest / `math` | K–8 curriculum, notebook, grade/skill progression; math expansion and quest tests | Active question variety/readability, handwriting space, touch/turn flow and educational pacing. |
| Bug Squash / `bugs` | Color/symbol reaction game; refined rules/controllers; inherited illustrated bug shading | **7A:** moonlit illustrated garden, articulated beetles, clear color/symbol marks, personal cue/feedback, full-field touch geometry and soft hit cues. All five difficulties/learning options complete legally in Node; actual browser solo/versus/layout/input verified. Physical touch/controller/audio feel remains. |
| Creative Studio / `paint` | Drawing, objects/layers, media/project persistence; studio tests and real browser controller drawing | Brush/sticker/art quality, collaboration, project/gallery UX; painting remains touch/mouse first. |
| Balloon Mayhem / `balloons` | Color/number reaction rounds; refinement tests; inherited balloon shading | **7A:** twilight fairground, paneled balloon art, persistent learning answers plus separate type/armor badges, temporary breeze fix, no hidden targets behind prompt band. Current `balloon-breeze-v2` records remain separate from selectable earlier records. All five difficulties/learning options and actual browser solo/versus checked; physical input/audio remains. |
| Monster Café / `cafe` | Exact orders and ingredient controls, alternating competition; cafe/refinement tests | **7B:** original kitchen backdrop, named guests/patience expressions, exact plate/quantity/sequence guidance, accessible patience bars, retained pantry focus and unchanged recipes/turns/records. Real browser serving and alternating handoff checked. Physical input/audio still requires trial. |
| Circuit Rush / `circuit` | Independent wire/path puzzles; circuit/controller fixtures | Active contrast, hints, progression, drag feedback and two-player screen layout. |
| Gravity Chaos / `gravity` | 30 courses, real Matter behavior, swipes/platform tools, independent worlds | Physical multi-finger feel, tool clarity, materials, impacts and level readability. |
| Two-Player Tap Battle / `battle` | Equal seeded challenges, series/exactly-once scoring; refined controller tests | Active prompts, split-area clarity, difficulty, audio and physical concurrency. |
| Build & Smash / `build` | Campaign, construction, saved structures, physics and competition; smash tests | Material art, destruction feedback, build tools, physics stability and device playthrough. |
| Beat Lab / `beat` | Pads/sequencer, samples, PCM/MP3, saved projects and backup tests | Music timing/visualization, project UX, Beat Battle and physical audio latency; no forced awkward freehand controller mapping. |
| Slime Lab / `slime` | Elastic pointer mechanics, split/merge courses; touch-world tests; inherited illustration shading | Physical two-pointer deformation, material personality, reactions and controller ergonomics. |
| Monster Dentist / `dentist` | Real tool-specific treatments and turn-based cases; touch-world tests | **7B:** original shaped enamel and clinic backdrop, matching-tool outlines, selectable named treatment checklist, persistent hints/focus, capture cancellation on tool/pause/exit and stopped review clock. All 35 patient/difficulty configurations and real held plaque treatment verified. Physical precise gestures remain a trial item. |
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
| Project Limit Break / `limit` | Forest adventure, native input, real rigs/physics, co-op, monitoring and baseline; dedicated suites | Four-area gameplay checkpoint now implemented in M5; formal repeatable multi-zone benchmarking is M6. Physical controls/GPU/audio and later artwork/gameplay polish remain. See detailed inventory above. |
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

1. **Benchmark editions remain separate.** M6 adds `four-worlds-v1` across actual scenes. Original Forest stages and interactive Chamber snapshots remain distinct. Compare matching settings/backend/resolution, and inspect sample limits and capped simulation times before drawing conclusions.
2. **Native and cursor controllers differ.** The global adapter intentionally yields to Forest's native adapter. Preserve that ownership boundary; no second poller should move the same player.
3. **Touch ergonomics still need hardware review.** Version 6.4.0 adds camera preferences, an independent LOOK area and Auto/Show/Hide controls with mixed-input safeguards. Real wall-display reach and physical device feel remain user checks.
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

### Milestone 1 handoff (historical; continuation was subsequently authorized)

1. **Wait for user trial/review.** The milestone implementation, 36-program aggregate run, 68-case browser suite, real Forest browser run, build and source-preservation checks are complete.
2. The checkpoint is on `revamp/milestone-1-audit`; its exact milestone-1 commit is `7cde35184b0fecf80c1a2c31aa15168daec13de3`. Provide the source trial package/instructions and stop. Do not deploy or implement Milestone 2 in the same session.
3. **Pause for the user to try it.** Ask for feedback on the current Forest, movement/camera, native controller controls, touch reach and visual quality on the real arcade PC.
4. After the user says continue, pick a focused Milestone 2 foundation improvement from verified gaps (input sensitivity, usable touch camera/hide controls, visual/performance problems observed on the target device). Reuse the existing Forest; do not create another registration or rebuild solved systems.
5. Update this document at the end of every coding session with exact changes, tests, failures, unfinished items, commit/branch and the next action. Never overwrite inherited evidence with new unverified completion claims.


## Session record — Milestone 2 foundation (2026-10-27, America/New_York)

### Authorization and scope

The user said **“continue”**, authorizing the next milestone, then requested **“the overall UI is too bright, i prefer darker colors.”** Continue only this foundation checkpoint and the requested dark shell. No deployment authorization was given. Do not infer physical trial success from the continuation message.

### Implemented

- Retained the existing registered Forest, imported rigs/assets, physics, collision, combat, objectives, co-op and benchmark. No duplicate game, engine migration, model replacement, scoring change or new zone.
- Added saved, bounded controller camera speed, camera-stick deadzone, touch look speed and invert-Y; optional fields remain compatible with old backups, while invalid new preferences are rejected. Movement mapping/physics remain unchanged.
- Added Auto/Show/Hide touch controls, an independent drag-to-look area and a persistent restore button. Auto does not hide a mixed-input co-op partner or an active touch gesture. Pause/hide/disposal release captures and touch-run state.
- Native Forest menus skip disabled graphics choices. Activity/deadzone callbacks remain game-owned extensions; the global cursor adapter still yields to Forest.
- Separated minimap and monitor at supported wide sizes; bounded narrow layouts and a flexible active header/stage. Added a direct result-to-arcade exit without loading another scene.
- Replaced bright shell surfaces with muted charcoal/plum, softer accents and readable text. Profile theme variants also remain dark. Individual game palettes retain their identity; this is not a claim that every game's art was redrawn.
- Version/release notes/offline cache updated coherently to **6.4.0**, with the new local input module precached. No new runtime services/dependencies or credentials.

### Verification results

- `npm test`: **37 programs passed**, including the new input-settings/pointer tests, independent toolkit/starter, Wobbly Wars, older backups/new preference roundtrip and existing solo/co-op completions. After the darker palette changes, the relevant browser, release, offline and audit checks were rerun successfully.
- The initial dark-palette check caught remaining low-contrast legacy text declarations; corrected the palette and reran. Do not record the failed palette run as a pass.
- `npm run test:browser`: **72 checks passed**, including all 25 game entries, six shell pages, dark Aurora/Nebula variants, search/profile/restore/controller fixtures and real offline reload.
- `npm run test:limit:browser`: **passed** in the real imported scene: saved settings, independent look, injected simultaneous movement/look/jump, mixed-input co-op, disconnect pause, overlay separation, active 800/390 px layout, real benchmark exports, direct exit and engine cleanup. Injected touch/controllers are not physical hardware evidence.
- Final `audit:arcade`, build and diff/whitespace checks **passed**. All 25 public games and the hidden entry remain, all original 98 asset/vendor hashes match, and save identities/hosting target remain intact. No deployment performed.
- The workspace disconnected during final verification. It was reconnected with the edits intact; the final smaller-screen/native-scene checks and build were then completed. No checkpoint was claimed committed during the outage.

### Not finished / next milestone boundary

Physical Windows controller sensitivity, touch reach, GPU appearance/performance and real devices remain user checks. Castle, separate Combat Arena, Chaos Chamber, four-zone progression, later benchmark workloads and the remaining game-by-game revamp are still future work. Stop for the user to try this checkpoint; do not automatically begin Milestone 3.


### Checkpoint evidence and next steps

- [Dark library screenshot](docs/revamp/M2_LIBRARY.png), [Forest controls/monitor screenshot](docs/revamp/M2_FOREST.png), [real browser raw report](docs/revamp/M2_FOREST_BROWSER.json), [static preservation audit](docs/revamp/M2_STATIC_AUDIT.json). M1 evidence remains historical and unchanged.
- Final software-rendered smoke benchmark: **156 frames**, **5.18 average FPS**, **0.92 1% low**, at Low preset in ANGLE/SwiftShader. This verifies measurement/export operation; it is not a performance improvement claim, a controlled comparison with M1, or a prediction for the arcade PC.

- Review branch: **`revamp/milestone-2-foundation`**, based on `7cde351`; current app version **6.4.0**. The milestone checkpoint is the tip of this review branch; resolve it with `git rev-parse revamp/milestone-2-foundation`. Next action is the user trial. No production publish or Milestone 3 implementation is authorized.
- **User trial:** run `npm ci` then `npm start` from the checkpoint source. Check the darker library; open Project Limit Break → Settings → Controls & Camera; try speed/deadzone/invert, Auto/Show/Hide, SHOW TOUCH recovery, simultaneous movement/look/actions and mixed controller/touch co-op. Try MONITOR, the benchmark JSON/CSV exports and BACK TO ARCADE.
- Return with feedback before beginning Milestone 3. Physical sensitivity, touch reach, Bluetooth/USB reliability, capture devices and GPU performance remain unverified. Keep all later game/zone/artwork work pending rather than marking it done.

### Publication handoff (2026-10-28 UTC)

- Implementation checkpoint committed locally as `cae1b4fe5042e2413b0d4c0fc9bb8c04c893b5ff`. Native Git fetch/push cannot authenticate in the reconnected environment, and `gh auth status` reports an invalid injected token. The branch has **not** been published; restore GitHub authentication before pushing `revamp/milestone-2-foundation`. No credential changes or deployment were attempted.
- A source archive is provided for the user trial. Resume with that trial and remote publication, not Milestone 3.

### Deployment request (2026-10-28 UTC)

The user explicitly requested deployment before testing. Tool discovery confirmed that this session has no Sites/deployment capability. Deployment remains unperformed, and GitHub publication remains blocked by environment authentication. The deployable app checkpoint is `e64a460b4d39f24569b2b407f4a096109c63a866` (v6.4.0); later documentation-only changes record this authorization. Use the provided source archive in the existing Sites-enabled conversation if GitHub access is still unavailable. Serve `dist/` in project `appgprj_6adab219a4788191952c4c83432002c5`, preserve URL/access policy, and verify live version 6.4.0 before the user trial. Do not create a replacement site or begin Milestone 3.

### Recurring milestone handoff

User requested a Work Mode message after every milestone and clear repository directions. Added `WORK_MODE_HANDOFF.md`, linked it from README/progress, and persisted the requirement in AGENTS.md. Documentation only; no runtime changes or deployment performed. Current app archive still identifies tested checkpoint `e64a460`.

### GitHub publication restored (2026-10-29, America/New_York)

Native Git authentication now works. Successfully pushed `revamp/milestone-2-foundation` to `imashleyparks95/touchscreenapp` and configured its upstream. The tested v6.4.0 app checkpoint `e64a460b4d39f24569b2b407f4a096109c63a866` is now available on GitHub. Earlier authentication/publication blockers above are historical and resolved. Updated `WORK_MODE_HANDOFF.md` accordingly. No deployment performed; Work Mode should deploy this authorized checkpoint to the existing Sites project, then stop for user testing before Milestone 3.

## Session record — Milestone 3 shared systems (2026-10-29, America/New_York)

### Authorization, inheritance and branch isolation

The user said **“no need to test”** at the Milestone 2 manual boundary and then explicitly requested starting Milestone 3 while Work Mode deploys Milestone 2. Development is on `revamp/milestone-3-shared-systems`, based on `f3f1764`; the M2 branch and deployment commit remain unchanged. M3 deployment is not authorized. Do not start M4 automatically.

Existing independent 3D controller/animation/physics/combat/AI/toolkit, GamepadHub, native Forest bindings, global controller cursor, graphics presets/capability negotiation and game-owned lifecycles were retained rather than recreated.

### Completed and actual consumers

- Added `dist/js/shared/lifetime.js`: reverse-order, idempotent cleanup/listener ownership and late-registration disposal with error isolation. Shared modal, pointer binder, music clock and 3D binder use it. Async scene session tokens remain necessary.
- Added shared current-rectangle coordinate conversion and independent captured pointer contacts. Forest LOOK and the multi-contact diagnostic use the binder; the 3D ground-input binder reuses coordinates/lifetime ownership. Cancellation/blur/hide/pagehide/disposal release contacts. Corrected 3D pointercancel/lost-capture treating an aborted gesture as a successful action.
- Consolidated actual global/Forest menu geometry and disabled-option/optgroup selection in `shared/menu.js`. Native/cursor ownership is unchanged. A confirming controller ends the current global input frame, preventing a second controller from immediately acknowledging the new dialog.
- Common modal setup can return a disposer; close/replacement/navigation release it, ordinary close restores initiating focus, and a queued prior close event cannot dispose the new dialog owner.
- Common synth music owns at most one clock, stops scheduling while hidden/muted/zero-volume/disabled/background-suspended, and preserves phase on unrelated settings changes. Queued common voices stop on mute, hiding and pagehide. No automatic creation/resumption/closing of the shared recording context by lifecycle hooks.
- Optional validated `DB.settings.presentation.effects` offers Full/Reduced/Off decorative particles. Actual Wobbly Wars shared effects and the retained classic canvas engine consume it; event/audio routing and game rules remain intact. Defaults and old backups work without the field. Existing shared renderer capability negotiation/presets remain the 3D configuration foundation. No global setting overrides formal Forest workloads.
- Added `SHARED_ARCADE_SYSTEMS.md` contracts, consumers, usage/limitations and test commands; updated 3D docs, README, v6.5.0 release notes and cache coherently. All five new runtime modules are precached.

### Game-by-game impact

- **Project Limit Break:** native menu helpers and LOOK-pointer lifecycle shared; existing camera preferences, movement/combat, real Forest assets, solo/co-op and benchmark remain. Actual browser movement, pause, mixed input and exports pass. No new zone/model/animation/artwork claimed.
- **Wobbly Wars:** shared particles honor decorative intensity/reduced motion; callbacks still route with particles Off. 3D input capture/cancel handling improved. Independent actual rig/physics/effects plus game rules/controller/purchases regressions pass. No troop/card/pricing/model replacement.
- **Classic canvas engine:** decorative counts use the same safe preference; 140 legacy game/difficulty/mode launch fixtures and gameplay regressions pass. Existing public refined games are not falsely claimed to all consume this path.
- **All public entries:** shared menu/dialog/audio infrastructure and offline code benefit the shell; all 25 public game entries retain passing responsive/accessibility checks. Creative Studio's actual undoable controller drawing remains verified. Native direct-action support has not been added to every game in this milestone. Other game-by-game art/gameplay work remains as recorded above.

### Verification and evidence

- `npm test`: **38 programs passed**, including independent shared modules/actual common audio fixture, older/new backups, independent 3D toolkit/starter, actual captured-contact cancellation, actual particle counts/event routing, Wobbly Wars and complete Forest rules/scene suites.
- `npm run test:browser`: **72 responsive layout/accessibility audits passed**, plus existing controller/drawing/persistence/offline scenarios.
- `npm run test:shared:browser`: **5 integration scenarios passed**: real reload preference, actual common music clock, CDP two-contact close cleanup/focus, queued dialog replacement and simultaneous two-controller confirmation boundary. No page exceptions. Visibility/controllers are injected fixtures, and CDP touch is not physical touchscreen QA.
- `npm run test:limit:browser`: **passed** actual imported solo/co-op scene, keyboard/right-drag/LOOK, mixed input, disconnect pause, monitor/map, benchmark JSON/CSV, result exit and zero retained engine instances. No browser exceptions or failed local assets. Software smoke benchmark: **124 frames**, **4.04 average FPS**, **0.67 1% low** on ANGLE/SwiftShader at Low. This is functional measurement evidence, not a controlled comparison, speed-up claim or target-PC performance result.
- `npm run audit:arcade`: 25 original public IDs, hidden/legacy hooks, **249** local cache entries, **151** reachable precached dependencies, all **98** original asset/vendor hashes, save identities and hosting target preserved. Build and whitespace checks pass. Runtime assets/vendor, migration provenance and hosting config match M2 exactly.
- Initial runs caught a stripped-import VM fixture and a minimal-document audio fixture; supplied the real validator to the harness and made optional music event hooks capability-safe. The first focused browser test used a fixed 30ms delay for dialog close and failed under renderer load; replaced it with the actual close event and reran successfully. No failed run is recorded as a pass.
- Evidence: `docs/revamp/M3_SHARED_BROWSER.json`, `M3_SHELL_BROWSER.json`, `M3_FOREST_BROWSER.json`, `M3_STATIC_AUDIT.json`, `M3_SETTINGS.png`, `M3_FOREST.png`. The focused settings harness blocks service workers; its offline-update status is not a production deployment check. M1/M2 evidence is historical and unchanged.

### Handoff and next steps

Commit/push the v6.5.0 checkpoint on `revamp/milestone-3-shared-systems`, then record its exact tested source commit in `WORK_MODE_HANDOFF.md` with the ready-to-paste Work Mode review/preview message. A later documentation-only commit may identify the app checkpoint. No production deployment performed or authorized for M3. Wait for review/continuation before M4. Physical Windows/USB/Bluetooth input, real wall-display reach, audible output and target GPU remain unverified; later native game bindings/art/zones remain future milestones.

### Milestone 3 published checkpoint

Successfully pushed tested app commit **`1035ccf3fc5b30b11cf914f77a5f2e464456461b`** to **`revamp/milestone-3-shared-systems`**. Updated `WORK_MODE_HANDOFF.md` with exact source, v6.5.0, actual evidence, preview/review directions and the explicit separation from M2's authorized v6.4.0 deployment. This handoff commit changes documentation only. No M3 production deployment or M4 implementation is authorized/performed.

## Session record — Milestone 4 launcher redesign (2026-10-29, America/New_York)

### Authorization and preserved deployment workflow

The user instructed that future milestone handoffs should request deployment to the existing site and that they will test **after deployment**, then explicitly authorized M4 while Work Mode deploys M3. Persisted this standing instruction in `AGENTS.md`. Work is isolated on `revamp/milestone-4-launcher`, based on M3's pushed documentation tip `0cb4d95`; the M3 branch/commit being deployed is unchanged. This session does not claim or perform a Sites deployment. Stop at this M4 handoff unless the user authorizes M5.

### Implemented launcher behavior

- Replaced the old cabinet/hero and promotional layout with a muted dark library, clearer welcome/profile ribbon, three manually selected illustrated spotlight worlds, personal shelves, refreshed daily recommendations, library navigation and records/trophy links. No automatic carousel or remote services. Aurora/Nebula remain dark; reduced-motion policy is preserved.
- Reframed existing individual game illustrations in distinct cover panels, with clearer titles/descriptions, large open/preview/favorite controls and explicit mode/device chips. Vector arrows avoid missing-font glyphs. No game model or original art asset was replaced; this is the launcher presentation milestone, not M7/M8 game artwork completion.
- Added per-profile **Favorites** and bounded **Recently opened** history, not invented completed-play data. Favorites/recent filters, composed text search, alphabetical/recent sorting, useful empty states and quick-return shelves are functional. Together includes Beat Lab's actual alternating rhythm challenges. The old browser-global last-world key remains stored.
- Added substantive previews for all 25 public games using the actual game instruction objectives, control and multiplayer descriptions. Labels distinguish native Forest controllers from virtual controller cursors; camera/microphone/speech/freehand needs are explained. Forest-only scope remains honest. Previewing starts no simulation, capture or score; Open Game closes preview before the existing setup/update/instruction flow.
- Favorite buttons are siblings of open-game buttons, not nested interactive controls. Mutating favorites from a preview retains the correct close-to-card focus. Phone profiles scroll horizontally rather than clipping names; compact version badge and larger sound/fullscreen touch targets preserve navigation.
- Optional `profile.library={favorites,recent}` is validated in the existing schema-3 backup path. Old profiles/backups without it work; invalid/duplicate/hidden/unknown IDs and malformed/unbounded lists are rejected. No score/progression/multimedia/reset migration was introduced. New library runtime module and stylesheet are precached; release/cache/package agree on **6.6.0**.

### Game-by-game impact and remaining work

All 25 existing public games receive launcher cards, previews and accurate mode/controller/device information. Every launch route, mandatory instruction gate, profile, record, achievement and saved creation is retained. **Beat Lab** is corrected into Together because its alternating rhythm battle already exists; no new rhythm mechanics are claimed. **Forest** is labeled native controller/shared co-op and its future zones are not advertised as complete. **Creative Studio/Math Quest** retain touch/mouse handwriting guidance. **Air Slice/face/voice studios/zoo/spelling** keep honest device requirements. The hidden game remains absent from all public metadata/shelves/previews. No individual game's models, combat, difficulty, artwork assets or multiplayer rules were changed in M4; the existing game-by-game backlog above still applies.

### Verification and evidence

- `npm test`: **39 programs passed**, including the new library policy/persistence tests plus all 38 inherited suites. Tests prove exact 25-ID capability coverage, profile-isolated favorites, bounded/deduplicated recent history, search/filter/sort, old/new backup compatibility, invalid data rejection and unchanged scores/progression.
- `npm run test:browser`: **72 responsive shell/game-entry accessibility/layout audits passed**, with existing search/profile/mute/restore, controller navigation/dragging/drawing, disconnect and actual offline reload scenarios. Dark profile themes remain covered.
- `npm run test:library:browser`: **8 behavioral scenarios and 75 preview accessibility/layout audits passed** (25 games × 1440/768/390 px): manual spotlight; preview favorite/focus return; touch favorite/profile isolation/reload; search/filter/sort; every preview; real preview-to-setup/instruction boundary and personal recent history; controller favorite/preview; unchanged scores; actual service-worker offline favorites/previews. The eight named scenarios group these related checks; controller input is a fixture, touchscreen taps are browser injected. No page exceptions.
- `npm run test:shared:browser`: **5 scenarios passed**, preserving common settings/audio scheduling, two-contact cleanup/focus, dialog replacement and two-controller handoff behavior after launcher integration.
- `npm run audit:arcade`: **25** original public IDs, hidden/legacy hooks, **251** existing precached entries, **153** reachable precached application dependencies, **98** original asset/vendor SHA matches, unchanged save/hosting identities. `npm run build`, syntax/whitespace and original asset/provenance/hosting diff checks pass.
- Early browser startup caught the profile-picker helper removed along with the old hero block; restored that helper exactly from Git history before rerunning. The first new preview audit lost its injected axe helper after reload; made the harness initialize it on subsequent pages. Visual inspection caught squeezed mobile profile labels and missing arrow glyphs; corrected layout/vector icons. Failed attempts are not counted as passing verification.
- The shared-browser reporter now reads the actual running release version and accepts `ARCADE_SHARED_EVIDENCE_PREFIX`, avoiding stale milestone/version labels in future evidence.
- Evidence: `docs/revamp/M4_LIBRARY_BROWSER.json`, `M4_SHELL_BROWSER.json`, `M4_SHARED_BROWSER.json`, `M4_STATIC_AUDIT.json`, `M4_DESKTOP.png`, `M4_PHONE.png`, `M4_CARDS.png`, `M4_PREVIEW.png`. Earlier milestone artifacts remain historical and unchanged.

### Next steps and limits

Push the tested M4 checkpoint and update `WORK_MODE_HANDOFF.md` with its exact commit. Give the user a direct request for Work Mode to deploy v6.6.0 `dist/` to existing Sites project `appgprj_6adab219a4788191952c4c83432002c5`, preserving its URL/access policy; verify the live version and use the normal service-worker update/reload path. The user tests after deployment. No archive or PR is required for this branch-based handoff. No M5 implementation in this session. Physical Windows/USB/Bluetooth input, large-wall-display reach and actual audible/GPU appearance remain target-device checks. No live-site result is claimed from local builds or another chat's status.

### Milestone 4 published checkpoint

Successfully pushed tested v6.6.0 app commit **`46f2fd89334f14128d8974f349c2558cd87e5ee2`** on **`revamp/milestone-4-launcher`**. `WORK_MODE_HANDOFF.md` now records exact source/publication and a direct deployment request under the user’s standing authorization. This follow-up changes documentation only; runtime matches the tested commit. M3's deployment branch remains unchanged. Next action: Work Mode deploys the existing site and verifies live **6.6.0**, then the user tests. No Sites deployment or M5 work was performed here.

## Session record — Milestone 5 connected expedition (2026-10-29, America/New_York)

### Authorization and implementation scope

The user explicitly requested **“onto milestone 5.”** Continued on `revamp/milestone-5-expedition`, based on M4 `3d3b7c7`; prior deployment branches are unchanged. Standing authorization is to give Work Mode a direct deployment request for the checked checkpoint, then the user tests live. No Sites deployment was performed by this session. Stop before M6 unless explicitly authorized.

Inspected the full specification/current progress, 3D toolkit contracts, Forest core/render/input/audio/controller/records, actual asset geometry/contact data, lifecycle and tests. Reused the existing Babylon **9.32.0** / Havok **1.3.14**, imported **41-joint** rigs/clips, measured weapon/palm paths, fixed-step combat, navigation, camera/input and graphics/monitoring. No duplicate public game or engine migration.

### Completed gameplay and presentation

- **Full Expedition:** added serial Living Forest → Ancient Castle → Crown Arena → Chaos Chamber progression. Every area requires its lights/seals, objective guardians, exit lever and all living explorers at the exit. Explicit Continue loads the next area, releasing prior resources without repeating the open-session instructions. No intermediate points or partial completion record. Switching an unfinished expedition to benchmark/tuning asks before discarding it; cancellation preserves the current adventure.
- **Ancient Castle:** original authored courtyard, side chambers, hall/keep, windows/beams/banners, columns/battlements, raised dais/stairs, two seals, three guardians, torch/interior-exterior lighting and real physics crates. Interact opens the wooden side doors. Visible main extents and actual rule/Havok collision share definitions; imported seal/lever/gateway supports get invisible proxies. Original deterministic masonry is generated locally; existing local surfaces/models remain unchanged.
- **Crown Arena:** authored cover/gallery tiers/columns/banners/fighting ring and a scaled imported Crown Warden, supported by two arcanists. Below half health the Warden adds ranged casts using the actual imported casting clip/palm path. Wind-up/health cues and all inherited strike/pulse/dodge/recovery behavior remain.
- **Chaos Chamber:** two reactors, objective guardians, return gate and authored ribs/crystal/supports. Safe bounded controls create actual animated guides, optional AI, Havok crates, non-damaging demo pulses, motes, extra lights and complexity; renderer-specific lower caps apply to Canvas compatibility. Draw distance/resolution/supported effects remain in Settings. Reset removes optional workload and restores defaults immediately; optional enemies do not lock the objective gate.
- **Actual measurement:** existing monitor reports real frame windows/counters with honest unavailable GPU/RAM/VRAM values. Changing Chamber load resets the monitor window. Up to eight transient measured snapshots include actual counts, renderer/resolution and frame statistics; actual JSON download works. These are interactive observations, not formal controlled M6 benchmark scenarios.
- **Controls and lifecycle:** native controller/keyboard/touch/co-op bindings extend across the expedition; live camera collision walls include doors/props. New entrances leave sufficient third-person camera clearance. Focus loss/disconnect during asset loading stays paused after startup; no automatic adventure/benchmark resume. Chapter transitions and final exit dispose captures/input/audio/graphics/physics/engine.
- **Persistence and records:** original Forest chapter/baseline remain separate choices. New completion-only `limit-expedition-v1` / `four-paths-1` records store four chapter summaries; solo/co-op remain separate. Adventure Records offers expedition, Forest v1/v2 and team filters, plus benchmark history. Schema-3 backups preserve old results and reject malformed/partial new expedition records. Unfinished expeditions explicitly restart from the Forest; there is no claimed mid-run save.
- Updated actual launcher description/preview/instructions to explain four areas, while preserving all 25 public IDs and existing games/profiles/media/achievements. Coherent app/package/lock/release/cache version **6.7.0**; four new runtime modules precached.

### Verification and evidence

- `npm test`: **41 programs passed**, including new complete-route and actual-area suites plus all existing independent toolkit/starter, Wobbly Wars, original Forest and every arcade regression. After final collision-proxy refinements, the focused legal routes/real areas/browser checks were rerun successfully.
- `tests/limit-expedition.mjs`: actual legal full solo and co-op routes through all four areas, real door interactions, attacks/pulses/cooldowns/recovery, two-phase boss, gates, no partial points, complete summaries, workload caps/reset, actual data-layer records, edition/team separation, old/new backups and malformed completion rejection. No teleports, forced health, kills or unlocks in the complete-route simulation. Final solo active simulation times: Forest **46.4 s**, Castle **44.9 s**, Arena **50.9 s** (one recovery), Chamber **39.0 s**. Co-op: **43.9 / 52.3 / 47.2 / 37.8 s** (two Arena recoveries). These are deterministic simulation times, not wall-time/FPS benchmarks.
- `tests/limit-journey-scene.mjs`: actual local GLBs/textured geometry and real Havok in Castle/Arena/Chamber; matched architecture/support proxies, animated doors, settling crates, actual large-boss blade/palm max error **0.001930 m**, repeated workload reset with stable warmed body/mesh/material counts, honest monitor fields, complete disposal. Node texture image objects are fixtures. Original Forest scene alignment/crate tests still pass.
- `tests/limit-controller.mjs`: existing original chapter/baseline fixtures plus new four-area transitions, no partial writes, one completed result per solo/co-op profile, no repeated instructions, exact old-runtime disposal, late-hidden startup remaining paused and cancellation preserving an unfinished expedition when switching to measurements. Forced objective state is used **only** to isolate UI persistence/transition behavior; the separate route test proves legal gameplay.
- `npm run test:expedition:browser`: **7 actual browser scenarios passed** across all four real scene loads. Real Castle keyboard blocking/interaction/passage, pause, entrance camera clearance, bounded Chamber scene counts/effects, actual measured-window download/reset, 800/390 px load access, separate records UI, backup validation and zero remaining engines. Objective completion is forced solely for transition coverage; controlled actor placement is used for collision/screenshot inspection. This is not an end-to-end physical story playthrough. No page exceptions or failed local assets.
- `npm run test:limit:browser`: **passed** original real Forest solo/co-op movement, camera, controls/mixed input, disconnect pause, monitor/map, real five-stage raw benchmark, JSON/CSV and cleanup. Software smoke run: **113 frames**, **3.76 average FPS**, **0.48 1% low**, Low in ANGLE/SwiftShader. Not a comparison, speed-up claim or target-PC result.
- `npm run test:browser`: **72** responsive shell/game-entry accessibility/layout audits passed. `npm run test:library:browser`: **75** preview audits and **8** library scenarios passed, including current expedition instructions/metadata and actual offline reload. Browser reporters read the current release identity rather than stamping an older milestone. These audits do not certify every active game/hardware interaction.
- Final `audit:arcade`, syntax/whitespace/preservation and build checks pass: **25** public IDs, hidden/legacy hooks, **255** precached entries, **157** reachable precached dependencies, all **98** original asset/vendor SHA matches, unchanged schema/local media/hosting identities. No original GLB/license/checksum/hosting file changed.
- Inspection caught interaction-distance assumptions in the new co-op test; adjusted the legal navigation harness for independent body separation. Browser visual review caught new-area spawns too close to the back wall; moved those entrances and added a camera-distance assertion. Added complete support collision proxies rather than permitting physics props through imported seals/gateway supports. Checked final screenshots after correction. Failed attempts are not counted as passes.
- Evidence: `docs/revamp/M5_GAMEPLAY.txt`, `M5_SCENES.txt`, `M5_CONTROLLER.txt`, `M5_EXPEDITION_BROWSER.json`, `M5_FOREST_BROWSER.json`, `M5_SHELL_BROWSER.json`, `M5_LIBRARY_BROWSER.json`, `M5_STATIC_AUDIT.json`, `M5_CASTLE.png`, `M5_ARENA.png`, `M5_CHAMBER.png`, and `M5_ASSET_PROVENANCE.md`. Earlier milestone artifacts remain unchanged.

### Game-by-game impact / remaining work

**Project Limit Break** receives the four-area expedition, authored area architecture/boss/workload, native input extension, lifecycle safeguards and separate validated records. Its original imported models, Forest chapter, historical scores, controllers and formal Forest workload are retained. Other public games only receive the already-shipped launcher infrastructure; no M5 changes to their gameplay/model/purchase flows. All prior game-by-game artwork/hardware backlogs remain.

**M6 next:** formal repeatable Forest/interior/combat/physics/combined workloads with fixed paths/seeds/config/warm-up, actual raw frame data, comparable local history, JSON/CSV and tuning across the new zones. Do not rename current Forest stages or interactive Chamber snapshots to claim this is finished. New imported-hero ragdolls/destructible architecture, free streaming/backtracking, saved mid-expedition resume, new model/animation asset production and physical Windows/USB/Bluetooth/audio/GPU certification are not claimed.

Next action is to push this tested checkpoint and record its exact commit in `WORK_MODE_HANDOFF.md`. Work Mode should deploy **6.7.0** `dist/` to existing project `appgprj_6adab219a4788191952c4c83432002c5`, preserving URL/access policy, then verify live version and return the link for the user's trial. No M6 development or live deployment in this session.

### Milestone 5 published checkpoint

Successfully pushed tested v6.7.0 app commit **`8d71d93dba8089f5d5a0064a70e15842076dfd74`** on **`revamp/milestone-5-expedition`** and verified the GitHub branch matches. This follow-up updates documentation only; runtime matches the tested app commit. `WORK_MODE_HANDOFF.md` records exact source, checks, limitations and authorized deployment directions. Next action: Work Mode finishes any earlier deployment, deploys this checkpoint to the existing site, verifies live **6.7.0** and returns the URL for the user to test. No Sites deployment or M6 development was performed here.

## Session record — Milestone 6 benchmarking (2026-10-29, America/New_York)

The user requested **“next milestone”** after the published M5 checkpoint. Implemented on `revamp/milestone-6-benchmark`, based on `c342950e274642b132afba5adf9f3682b4abf7fa`. Prior milestone branches are unchanged. Standing workflow remains deployment through Work Mode to the existing project, then user testing. No Sites deployment or M7 work was performed here.

### Implementation and game-by-game impact

Project Limit Break now offers a separately labeled **FIVE-SCENARIO BENCHMARK** from setup and Settings. Actual Forest environment, Castle interior lighting, Arena combat/animation, Chamber physics/particles and combined Chamber load are freshly loaded, warmed 3 seconds and recorded 8 seconds each (55 seconds plus loading). The original Forest baseline, interactive Chamber snapshots and all adventure modes remain separate. No models/art assets or other games' gameplay changed. Existing Low/Medium/High/Ultra/Experimental Maximum/Auto presets and honest measured telemetry are reused; no shared toolkit API change or new dependencies.

New game-owned `limit/benchmark-suite.js` builds seeded scenarios with fixed camera sweeps and scripted 60 Hz movement/actions. Benchmark actors are invulnerable to preserve active workload; this does not change adventure rules. Chamber objects receive periodic actual Havok impulses. Physics/AI/render counts are bounded and Canvas compatibility uses its existing lower caps. Settings stay fixed per run. Catch-up is capped at 100 ms per rendered frame; very slow renderers advance less simulation time, reported per scenario. These are repeatable configured workloads, not bit-for-bit cross-device physics or a guarantee of identical OS/GPU scheduling. Audio cues are disabled during formal suite scenes.

Results have aggregate/per-scenario actual frame arrays and average/1% low FPS, percentiles, spikes, effective resolution, settings/browser/GL backend and scene counters. GPU timing is available only when measured; heap is not RAM/VRAM. Only a whole suite saves to existing bounded 20-run local history. JSON includes all metadata/raw arrays; CSV includes identity, scenario summaries and raw frames. History separates editions and labels matching seed/backend/browser/resolution/settings, with average-FPS differences against the latest other matching run. This is not a controlled hardware comparison. Schema-3 backup validates each scenario's sample count and exact aggregate concatenation. Old backups/Forest histories remain valid; no profile/media/save-key migration.

Find My Best Settings now runs all five scenarios at each supported preset (five GPU presets; Low only for Canvas). Every scenario must pass average ≥ target, 1% low ≥ 75% of target, p95 ≤ 1.35 × frame budget for 30/60 FPS. Highest passing tested preset is recommended; otherwise Low plus an explicit warning. Manual override remains. Tuning reports are transient and do not pollute formal history. Allow about a minute per preset plus loading. Pause/help/settings/focus loss/resize abort without partial results; existing safe graphics recovery remains available. Scene changes retain session acknowledgment and dispose replaced engines/resources.

### Actual verification

- **`npm test`: 42 programs passed**, including independent toolkit/starter, Wobbly Wars, all inherited arcade suites, legal full solo/co-op expedition and actual Forest/Journey scenes. New benchmark tests exercise seeded repeatability, safe caps, warm-up exclusion, aggregate formulas, incomplete rejection, comparison keys, CSV and real backup roundtrip/corrupted per-scenario sample rejection. Explicit 10 FPS fixture measurements are not hardware results.
- Extended actual UI fixtures verify a complete five-scene result, no arcade points/repeated instructions, complete-only persistence, software single-preset tuning, all **25 GPU-capability preset/scenario samples**, safe target fallback and disposal of every replaced runtime. GPU capability/timing are fixtures here, not a physical rendering claim.
- **`npm run test:benchmark:browser` passed** on final source: correct suite instructions before startup; five actual Babylon/Havok scenes; genuine measured samples; JSON/raw CSV downloads; actual backup validation; history edition; results fitting 800/390 px; engine disposal; canceled rerun saving no partial result and safe graphics recovery. No page exceptions. Screenshot inspected for readable results and reachable controls.
- Final browser smoke: **203 frames**, **4.901 average FPS**, **0.715 1% low**, **461.4 ms p95** at Low, effective **770×508**, ANGLE/Vulkan **SwiftShader**, WebGL 2. Scenario frame counts **8 / 27 / 28 / 72 / 68**; each is sample-limited. An earlier successful run captured 209 frames / 5.165 average FPS. These are separate cloud smoke runs under changing host load, **not** a speed comparison or Windows performance result. No 30/60 FPS target hardware pass is claimed. Five-preset control flow is fixture-tested; no claim of a completed real-device five-preset tuning experiment.
- **`npm run test:browser`: 72 responsive shell/game-entry audits passed**, including controller fixtures, acknowledged drawing, device cleanup and actual offline reload. No physical Windows/USB/Bluetooth/multitouch/audio verification is implied.
- After final optional-enemy/monitor refinements, focused UI/benchmark tests and the actual five-scene browser flow were rerun. Final audit/build/syntax/whitespace/preservation checks passed: **25** original public IDs, **256** cached entries, **158** reachable precached dependencies, all **98** original asset/vendor SHA matches, unchanged hosting/provenance/save identities. `npm run build` copies authoritative `dist/`; no deployment/transpilation. No dependency changes.
- Browser validation caught missing preset persistence from the new direct suite button; fixed before final rerun. Controller regression initially lacked the newly imported suite edition in its VM fixture; added actual bindings and extended suite/tuning checks. Returning from a completed suite now resets setup to adventure so the normal Play button cannot reuse an exhausted suite index. Final review also preserved benchmark invulnerability when applying Canvas caps and restored the live monitor refresh/spacing in the suite frame path. Failed attempts are not counted as passes.

### Evidence and next steps

`docs/revamp/M6_REGRESSION.txt`, `M6_CONTROLLER.txt`, `M6_UNIT.txt`, `M6_BROWSER.txt`, `M6_BROWSER.json`, `M6_FIRST_BROWSER.json`, `M6_RESULTS.png`, `M6_SHELL.txt`, `M6_STATIC_AUDIT.json`; older evidence remains unchanged. `3D_GAME_DEVELOPMENT.md` documents the game-owned benchmark contract and limitations.

Publish this checked v6.8.0 checkpoint, record its exact commit in `WORK_MODE_HANDOFF.md`, and give Work Mode the authorized deployment request for existing Sites project `appgprj_6adab219a4788191952c4c83432002c5`, serving `dist/`, preserving URL/access. Work Mode should finish any earlier deployment, verify live **6.8.0**, then return the URL for the user's trial. No archive/PR required for this branch handoff. Stop before M7. Future M7 work must progressively review each actual 2D game; target-PC timing/tuning and physical input/GPU/audio remain hardware verification items.

### Milestone 6 published checkpoint

Successfully pushed tested **v6.8.0** app commit **`11bc3b7c9f497ab2aa6a54f7b9fe66cdc563c983`** to **`revamp/milestone-6-benchmark`** and verified the GitHub branch matches. This follow-up records publication/deployment directions only; runtime is unchanged. M5 remains at `c342950e274642b132afba5adf9f3682b4abf7fa`. Work Mode should deploy the exact checkpoint to the existing Sites project and verify live **6.8.0**, then return the URL for user testing. No Sites deployment or M7 work was performed here.

## Session record — Milestone 7A reaction games (2026-10-29, America/New_York)

### Authorization and scope

The user requested **“continue”** after the published M6 checkpoint. Started the master plan's **Milestone 7 — progressively upgrade all 2D games**, with a bounded first batch: Bug Squash and Balloon Mayhem. Branch `revamp/milestone-7a-reaction-games` is based on M6 `94933243b42d372867881be9019c44ca3bbf081a`; earlier branches are unchanged. App/package/lock/release/cache agree on **6.9.0**. This is **7A complete, M7 still in progress**. No M8 work or Sites deployment was performed here. Standing user workflow is Work Mode deployment of this exact checkpoint, then live testing.

### Game-by-game implementation

- **Bug Squash:** replaced only its active Canvas illustration path with an original moonlit garden: layered hills, timber edging, flowers/stems/leaves, dew and moon. New beetles have articulated alternating legs/antennae, shaded split shells, spots, eyes and a central high-contrast symbol. Shell hit extents remain the actual existing ellipse; decorative legs/antennae are not new hit targets. Per-player DOM cues display the exact target color/symbol and remain readable when the canvas scales down; personal hit/error messages no longer depend solely on the shared message line. Prompt-band touches do not count as mistakes.
- **Balloon Mayhem:** original twilight fairground with distant striped tents, bunting, clouds, layered hills and stars. New paneled balloon surfaces/string/knot/expressions, contrasting danger spikes and remaining-hit armor dots. Learning answers remain central on **every** non-danger type, including armor; a smaller badge carries special-type information. Learning-color balloons keep their actual model color instead of gold/time art overriding the answer. Setup includes an expandable plain-language special-balloon guide.
- **Actual gameplay fixes:** mystery breeze now applies a temporary factor to all balloons during the three-second window, including new spawns, and never permanently mutates base speed. Balloons exit when fully above the visible play area rather than lingering behind the prompt. Prompt-band taps are ignored. Scoring formulas, combo multipliers, time-bonus cap, difficulty presets, existing modes, seeded challenge fairness and round duration are retained.
- **Fair records:** because the permanent-breeze bug could make earlier Balloon scores easier, new complete Balloon runs use **`balloon-breeze-v2`** with the existing mode/difficulty/learning keys. Current and earlier `refinement-v1` records are selectable in the game records UI, never compared. Original results and all unrelated scores remain stored and backed up. Bug Squash keeps its existing edition. No save-schema/storage/media migration.
- **Controls/presentation/audio:** full aspect-preserving rendering and matching pointer conversion for both games; independent simultaneous two-player panels side by side on wide screens, stacked/scrollable on narrow screens. Portrait fields use their actual aspect ratio instead of an empty letterbox. Active cues/feedback remain outside the scene. Native touch capture is released on pause/exit; existing controller cursors use the same handlers and remain honestly labeled cursor support, not direct character controls. Decorative particles/motion honor effects/reduced-motion settings without changing rules. Soft distinct garden-hit/sky-pop tones reuse the global mute/SFX volume and rate limiting; physical audibility remains unverified.
- The existing shared refined host also gets an explicit toolbar How to Play entry, accurate initial mute labels and neutral Little Big Arcade wordmark. Reaction games hide the duplicate floating help button during play and retain it with readable dark styling in setup. Other refined games keep their artwork, gameplay and records. No 3D models, purchases, imported assets, original licenses or vendor binaries changed.

### Actual checks, failures and limitations

- **`npm test`: 43 programs passed**, including the independent 3D toolkit/starter, all M6 benchmark/expedition suites, original Forest/Journey/Wobbly Wars, and inherited arcade/audio/backup/controller tests. These regressions do not certify every unchanged active game's artwork or physical input.
- `tests/reaction-revamp.mjs`: **20 complete legal rounds** through both games × five difficulties × both learning choices, with real elapsed clocks/taps/scoring and seeded twins; no forced scores/completion in those routes. Focused fixtures separately exercise every special learning label/color, real mystery branch, expiry/new-spawn behavior, hidden-target removal, prompt protection, finite reduced-effects drawing and actual data-layer current/legacy leaderboard separation plus schema-3 backup roundtrip. Test records are isolated synthetic data, never family browser saves.
- `tests/refinement.mjs` still passes the existing six-game launch/render/mechanics matrix, real host transitions, pointer ownership and exactly-once scoring. Updated its VM imports for the actual new cue helper. Update-notice regression now derives Bug Squash's actual release backlog rather than permanently assuming that game never receives release notes; fresh-install/backlog/acknowledgment preservation checks still pass.
- **`npm run test:reaction:browser` passed: 4 actual sessions, 8 active layout/accessibility audits** (two games × solo/versus × 1440/390 px). Real Canvas scenes and browser-injected touches; existing controller-pointer adapter fixtures with independent capture/cancel; pause/manual help freeze clocks; forced-clock completion isolates complete-only/exactly-once per-profile saving; acknowledged rematch/replay, Balloon edition selector, exit and actual backup validation. No page exceptions. Forced completion here is not claimed as a legal full browser playthrough; legal full rounds are independently simulated above. No physical Windows/USB/Bluetooth/multitouch test is implied.
- **`npm run test:browser`: 72 shell/game-entry responsive/accessibility audits passed**, with existing controller menu/drag/drawing/disconnect and actual offline reload checks. These include the new static dependency in cache; physical hardware/offline installation in the user's existing browser remains their trial.
- Audit/build/syntax/whitespace/preservation pass: **25** original public IDs, **257** cached entries, **159** reachable precached dependencies, all **98** original asset/vendor SHA matches, unchanged hosting/save/media identities. No new dependency or external asset/service. Authoritative source remains `dist/`.
- Browser review caught portrait letterboxing and then a zero-height field from intrinsic/absolute Canvas layout. Corrected shared reaction container/track stretching and portrait static sizing, then strengthened tests to require actual containing-field height. A stale test selector initially requested `data-mode` instead of the existing `data-players`; corrected the fixture. Active axe checks caught the old floating help contrast; the toolbar now owns help during these games, with a dark readable setup fallback. Initial full regression stopped on an outdated zero Bug Squash release-backlog assumption; corrected it and reran all 43 programs. Failed attempts are not counted as passes.

### Evidence / resume instructions

Evidence is in `docs/revamp/M7A_*`: legal unit/record tests, inherited refined-host regression, full suite, shell and active-game browser reports/logs, static audit, and actual desktop/phone/versus screenshots. `M7A_ART_PROVENANCE.md` identifies the new original Canvas illustration source. Screenshots show test profiles and real scenes; they are not physical-display certification. Audible comfort, target-PC motion/cursor feel, multi-contact hardware reach and performance remain user checks.

Publish this checked checkpoint and record its exact source in `WORK_MODE_HANDOFF.md`. Work Mode should finish any earlier deployment, deploy **6.9.0** `dist/` to existing Sites project `appgprj_6adab219a4788191952c4c83432002c5`, preserve URL/access, verify live version and return the URL for the user's trial. Stop at 7A unless continuation is explicitly requested.

**Next development: Milestone 7B, not M8.** Continue the remaining 2D game ledger progressively; proposed next batch is Monster Café and Monster Dentist (customer/patient expressions, ingredient/tool clarity, gestures, feedback and fair turns). Inspect actual active gameplay first, retain their existing modes/purchases/records and write game-specific verification. Creative Studio, Beat Lab, Circuit Rush, Gravity Chaos, Tap Battle, Build & Smash, Slime Lab, Shadow Ninjas, Castle Creator, Buddy Mayhem, Doodle Defenders, Robot Repair, media studios/zoo/Air Slice, Spelling and Math/Gladiator still need their own remaining reviews/upgrades. Preserve automatic free speech and Niko = NEE-koh when reaching Spelling. Do not declare all 2D artwork, all native controllers or the overall master plan complete from this two-game batch.

### Milestone 7A published checkpoint

Successfully pushed tested **v6.9.0** app commit **`8c8766dd22400c5811e74184c5fbdf834df1318b`** to **`revamp/milestone-7a-reaction-games`** and verified the GitHub branch matches. This follow-up changes deployment/progress documentation only; runtime is unchanged. M6 remains at `94933243b42d372867881be9019c44ca3bbf081a`. Work Mode should deploy the exact checkpoint to the existing Sites project, verify live **6.9.0** and return its URL for the user to try Bug Squash/Balloon Mayhem. **Milestone 7 remains in progress; next is 7B after user continuation.** No Sites deployment or M8 work was performed here.

## Session record — Milestone 7B care games (2026-10-29, America/New_York)

### Authorization / scope

The user requested **“continue”** after 7A. Continued the progressively implemented Milestone 7 on `revamp/milestone-7b-care-games`, based on published `10f1638abaf871e7a85471cae8a9c2a28af3537a`. Verified checkpoint **6.10.0** covers Monster Café and Monster Dentist. Prior branches and M6/M7A runtime capabilities are preserved. **7B complete; Milestone 7 still in progress.** No Sites deployment or M8 development here. Standing workflow is Work Mode deployment of the exact pushed checkpoint to the existing project, then the user tests.

### Implemented game-by-game work

- **Monster Café:** original tiled kitchen/shelves/jars/pendant lighting in `care-art.js`; existing illustrated monster bodies retained, now named consistently on cards/stage and visibly surprised when patience runs low. Live semantic patience bars, exact plate status for missing ingredients/extras/sequence/ready state, and checkmarks for complete recipe quantities. Empty plates cannot accidentally Serve. Actual incorrect nonempty recipes still use the original error/scoring rules; no auto-assembly, auto-serve or new cooking step. Pantry category/ingredient/order focus survives live rerenders; patience-only changes update values without replacing controls. Simplified category buttons use honest pressed states rather than incomplete ARIA tab semantics. Existing 20 recipes, 45 ingredient catalog, counted Learning recipes, ordering/turns/streaks and `refinement-v1` scores remain.
- **Monster Dentist:** original clinic shelves/tiles and shaded anatomical crown/root enamel paths replace plain rounded tooth blocks while retaining actual positions/rotation/gesture hit regions. Existing seven distinct patient silhouettes remain. Matching-tool teeth have restrained mint outlines. Named task checklist buttons select the relevant tool, with current-tool hints always visible and aria-pressed selection/focus retained. No canned treatment on checklist click. Existing real scrub/hold/trace/extract/replace/rotate gestures, moving teeth, tongue behavior, scoring and `touch-v1` records remain. Cosmetic motion/sparkles honor reduced-motion/effect settings while meaningful tooth motion remains a game rule.
- **Input / help fixes:** changing a dental tool cancels the prior treatment and releases its actual capture; pause, scene replacement and exit release owned Canvas captures. The shared Slime/Ninja host benefits from Canvas cleanup without rule/art changes. Manual help had no review-pause callback in this host, allowing its clock to keep running under instructions: added pause-on-review and restoration of the prior pause state on intentional close. Clinic gets toolbar help; Café retains its toolbar entry. Duplicate floating help is hidden during these games and uses readable dark styling in setup. Sneeze guidance now accurately says to keep steady; reactions never block treatment.
- No core gameplay model, scoring formula, competitive edition, profile/media schema, import/purchase flow, 3D asset, external dependency or original vendor/license binary changed. `care-art.js` is game-owned, not advertised as a generic toolkit. Package/lock/release/service-worker agree on **6.10.0**; helper is precached.

### Actual verification / failures / limits

- **`npm test`: 44 programs passed**, including independent toolkit/starter, M6 benchmark/expedition, M7A reaction, all inherited arcade/controller/audio/backup regressions. After final review/focus UI refinements, targeted touch-host and actual care browser checks were rerun. No claim of physical input, GPU or audible quality certification.
- `tests/care-revamp.mjs`: every unlocked recipe plus actual generated counted recipes across five difficulties × both Learning choices, real serving with exact extra/quantity/sequence status and semantic patience/status markup; all **seven patients × five difficulties** complete using the existing legal pointer/tool solution harness with **zero mistakes**. No forced scores/completion in those legal cases. Existing touch-world tests also complete all 30 campaign clinic cases and verify actual treatment gestures, equal fresh turns, best-of-three/exactly-once persistence and unchanged Slime/Ninja behavior. Existing refinement tests retain the six-game host, counted recipes, legal controls/turn fairness and prior records.
- **`npm run test:care:browser`: two actual alternating-player sessions, four active responsive/accessibility audits** at 1440/390 px. Café legally assembles/serves an actual recipe via category clicks and browser-injected ingredient taps; category focus remains and empty Serve is disabled. Dentist checklist selects the actual tool with retained focus/pressed state; real controller-pointer fixture releases a held capture on tool change. A real mouse-held Water gesture completes a plaque task. Manual help freezes the actual clock. Pause and fresh player handoff work; explicit forced-clock timeout fixtures isolate full-match persistence and backup validity. These timeout fixtures are not complete legal full browser treatments/shifts; legal full treatments are independently tested above. No page exceptions.
- **`npm run test:browser`: 72 shell/game-entry responsive/accessibility audits passed**, retaining controller menu/drag/drawing/disconnect and actual offline reload. Together with the four active audits, **76 unique audits**. This is not an active-game/hardware certification for every game.
- Final audit/build/syntax/whitespace/preservation checks pass: **25** public IDs, **258** cache entries, **160** reachable precached dependencies, all **98** original asset/vendor SHA matches, unchanged hosting/save/media identities. `dist/` remains authoritative. No new dependency or mandatory service.
- Initial touch-host VM regression needed the actual newly imported task metadata in its fixture; corrected fixture bindings. Browser axe caught inherited floating-help contrast; fixed dark styling/duplicate active help. The first manual-help test exposed the actual missing pause callback; fixed the host and reran real freeze/resume. Failed attempts are not counted as passes.
- Patient silhouettes and many ingredient/tool icons remain their earlier original art; this batch improves specific artwork and usability, not every character/asset. Native direct controller mapping is not newly claimed: these games retain controller cursors, and precision gestures still need real device testing. Small-screen clinic geometry uses the existing aspect-preserving treatment view; large-touchscreen reach, sustained performance and audio remain user-trial items. Existing achievement notifications can appear in screenshots from earlier synthetic matches; no family data was read.

### Evidence / next steps

`docs/revamp/M7B_UNIT.txt`, `M7B_TOUCH_HOST.txt`, `M7B_REFINED_HOST.txt`, `M7B_REGRESSION.txt`, `M7B_BROWSER.json` / `.txt`, `M7B_SHELL.txt`, `M7B_STATIC_AUDIT.json`, desktop/phone Café/Dentist screenshots and `M7B_ART_PROVENANCE.md`. Prior milestone evidence is unchanged.

Push this verified checkpoint, record its exact app commit in `WORK_MODE_HANDOFF.md` and provide an authorized deployment request for existing Sites project `appgprj_6adab219a4788191952c4c83432002c5`, serve `dist/`, preserve URL/access policy and family storage, verify live **6.10.0**, then return its URL for the user trial. No archive/PR required for this branch handoff. Stop before further development unless explicitly continued.

**Next is Milestone 7C, not M8.** Proposed next batch: Slime Lab and Shadow Ninjas, reviewing real active artwork, character motion, game feel, native-controller suitability and existing simultaneous multiplayer first. All other pending game-ledger reviews remain; preserve all profiles, saved creations, pronunciation and original gameplay modes. Do not call Milestone 7 complete from these four improved games.

### Milestone 7B published checkpoint

Successfully pushed tested **v6.10.0** app commit **`c5c686d71f828edaa062e5d4f33b35f733e3f3f0`** to **`revamp/milestone-7b-care-games`** and verified the GitHub branch matches. This follow-up changes handoff/progress documentation only; runtime is unchanged. 7A remains at `10f1638abaf871e7a85471cae8a9c2a28af3537a`. Work Mode should deploy the exact checkpoint to the existing Sites project, verify live **6.10.0** and return its URL for the user to try Monster Café/Monster Dentist. **Milestone 7 remains in progress; next is 7C after user continuation.** No Sites deployment or M8 development was performed here.
