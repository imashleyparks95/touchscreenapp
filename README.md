# Little Big Arcade

## Current development checkpoint — 6.18.0

Milestone **7J** adds **eight face filters (27 total choices)** and Monster Me's **accent colors, body patterns, cheek details and chest badges (23 fields total)**. Choices visibly render and survive save/reopen/backups; older designs keep their appearance. Media studios gain source-aware guidance and safe crop/gesture cancellation, while camera/mic stay explicit and local media workflows remain. Read `WORK_MODE_HANDOFF.md` for deployment/trial directions. Milestone 7 remains in progress.

### Retained learning checkpoint — 6.17.0

Milestone **7I** clarifies Math answer formats and Spelling's five mode workflows. Math notebook strokes now survive empty motion-sample batches, canceled gestures stay discarded, captures release safely and paused workspaces block input while preserving completed writing. Existing learning pools, handwriting, adaptive questions, scores, multiplayer and free speech—including Niko's pronunciation—remain. Read `WORK_MODE_HANDOFF.md` for deployment/trial directions. Milestone 7 remains in progress.

### Retained play checkpoint — 6.16.0

Milestone **7H** gives Buddy Mayhem original padded-room detail, live gadget/objective guidance and safe grab-to-gadget changes. Tap Battle gains readable per-player prompts, original arena detail and pause-safe captures. Both improve portrait layouts while retaining physics, challenge rules, unlocks, scoring and multiplayer. All earlier covers, shared local sounds and choice-first Doodle defenses remain. Read `WORK_MODE_HANDOFF.md` for deployment/trial directions. Milestone 7 remains in progress.

### Retained defense checkpoint — 6.15.0

Milestone **7G** reworks Doodle Defenders around **choose an ability, then draw it your way**. Your sketch stays on-screen: turrets shoot bullets, single-use mines explode, and healers send green pluses to injured defenses or nearby HOME. All eight roles, placement, upgrades and multiplayer remain. New defense records are separate from preserved earlier results. Castle Creator gains support/assault guidance, original fortress detail and clearer build controls while retaining visual purchases and saved designs. Read `WORK_MODE_HANDOFF.md` for deployment/trial directions. Milestone 7 remains in progress.

### Retained physics checkpoint — 6.14.0

Milestone **7F** improves Gravity Chaos and Build & Smash. Gravity has original orbital-workshop/energy-ball detail, per-player direction buttons beside swipes, live mission guidance and safer capture cleanup. Smash gains construction detail, actual sling-power/projectile guidance and canceled-drag recovery. Portrait fields/build controls improve readability. Existing physics, campaigns, saves, scores, multiplayer, all 25 public covers and shared Beat Lab sounds remain. Read `WORK_MODE_HANDOFF.md` for deployment/trial directions; Milestone 7 remains in progress.

### Retained creative/music checkpoint — 6.13.0

Milestone **7E** adds Creative Studio drawing sparks and per-artist tool guidance. Beat Lab has **80 original offline sounds** with search, previews and individual track assignment. Record and trim a mic sample, save it to a track, then add it to the shared library for all profiles on the **same device**. Sounds are included in backups; no online publishing is involved. Captured touch step painting, keyboard toggles and pattern counts improve editing. Existing art/music projects, exports, multiplayer and all 25 refreshed covers remain. Read `WORK_MODE_HANDOFF.md` for the deployable checkpoint; Milestone 7 remains in progress.

### Retained puzzle-workshop checkpoint — 6.12.0

Milestone **7D** refreshes **all 25 public game covers** with original offline illustrations. Circuit Rush gains PCB detail, live connection status and safe canceled-wire rollback. Robot Repair Shop gains workbench detail, scanned-only repair steps, tool hints and gesture cleanup. Both retain existing rules, scores and multiplayer, with portrait layouts and manual help. See `WORK_MODE_HANDOFF.md` for deployment and trial directions. Milestone 7 remains in progress.

### Retained motion-game checkpoint — 6.11.0

Milestone **7C** adds original motion-world artwork, objective tracking and native two-controller actions to Slime Lab and Shadow Ninjas. Slime aims/charges a real sling and has split/select/anchor tools; Ninjas move/aim with mapped abilities and shields. Touch remains available. Global controller navigation yields during native play and returns in menus; disconnect pauses safely. Portrait multiplayer uses full-width stacked fields. Existing courses, missions, cosmetic skins, scores and physics remain. Read `WORK_MODE_HANDOFF.md` for the exact deployment checkpoint. Milestone 7 is still in progress; physical controllers and advanced native-course workflows remain to try.

### Retained care-game checkpoint — 6.10.0

Milestone **7B** polishes Monster Café and Monster Dentist: original kitchen/clinic/enamel artwork, named guest moods, live recipe/quantity status and patience bars, selectable treatment guidance, matching-tooth outlines, persistent focus and cleaner gesture ownership. Manual dental help now pauses the real clock. Scoring, patient/recipe rules, alternating play and old records remain. See `WORK_MODE_HANDOFF.md` for the exact deployable checkpoint. Milestone 7 is still in progress; physical precision gestures/audio remain to try.

### Retained reaction-game checkpoint — 6.9.0

Milestone **7A** begins the progressive 2D upgrade with **Bug Squash** and **Balloon Mayhem**: original illustrated worlds/characters, individual readable player prompts and feedback, reduced-effects support, soft hit sounds and responsive solo/two-player fields. Balloon learning answers stay visible on special types, mystery breezes expire after three seconds, and corrected scores use a separate edition with earlier records still selectable. Touch/mouse and existing controller cursors remain supported; physical input/audio checks are still needed. Other 2D game batches remain unfinished.

### Retained connected expedition — 6.7.0

Milestone 5 adds Project Limit Break’s **Full Expedition**: Living Forest → Ancient Castle → Crown Arena → Chaos Chamber. Recover Castle seals behind interactive doors, face the two-phase Crown Warden, stabilize the Chamber and finish together in solo/co-op. Open the game and choose **FULL EXPEDITION**. The original Forest chapter and measured Forest Baseline remain separate choices.

The Chamber offers bounded load controls, actual performance counters, reset and measured-window JSON exports; the separate five-scenario benchmark now measures all four areas. Only complete expeditions save their new score edition. Unfinished expeditions restart from the Forest. **Adventure Records** separates expeditions, older Forest editions and solo/co-op results; existing backups and saved data remain supported. Read [WORK_MODE_HANDOFF.md](WORK_MODE_HANDOFF.md) for the exact source and deployment directions.

### Retained Forest foundation — 6.4.0

The overall arcade uses muted dark colors, including the Aurora and Nebula profile themes. Project Limit Break retains its existing Forest adventure, graphics and multiplayer modes.

In the Forest's **Settings → Controls & Camera**, adjust controller camera speed, camera-stick deadzone, touch look speed, invert-Y and Auto/Show/Hide touch controls. These preferences are saved and included in backups; older backups without them still work. Auto keeps touch controls for a touch co-op partner while a controller is in use. **SHOW TOUCH** in the toolbar always restores hidden controls. The separate **DRAG TO LOOK** area can be used alongside movement and action buttons. Movement deadzones and combat rules are unchanged.

The monitor/minimap now have separate positions on supported wide screens; the camera drag area stays above the touch panels. Benchmark results include **BACK TO ARCADE**, without loading another Forest scene. Physical Windows controls, touchscreen reach and GPU performance still need testing on the arcade PC. Development is paused at each milestone for that user trial; nothing is automatically deployed.

## Revamp checkpoints

Read [ARCADE_REVAMP_PROGRESS.md](ARCADE_REVAMP_PROGRESS.md) for the current milestone, complete game inventory, tested capabilities, gaps and exact resume instructions. The [full master plan](docs/ARCADE_REVAMP_MASTER_PLAN.md) is retained in the repository. Development pauses for user testing after each milestone; there is no automatic deployment.

```sh
npm run audit:arcade
npm run test:audit
npm run test:library:browser
npm run test:limit:browser
npm run test:expedition:browser
```

The read-only audit guards the original roster, save identities, assets and offline dependency closure. The new Forest browser test exercises the actual imported scene and a measured five-stage Forest run in an isolated browser; it takes at least the warm-up plus 30 measured seconds, apart from loading. Cloud software-rendered results are not target-PC benchmarks. `npm test` now includes the audit regression alongside the original 35 test programs.

This repository began as a migration of the existing working application, version 6.2.0. The current version is declared in package.json and the release notes. Original source: `/workspace/sites/little-big-arcade/`, commit `d646050` (full SHA in MIGRATION.json). No games or interfaces have been rebuilt.

## Install and run

Install Node.js 22 or newer (npm included), then:

```sh
npm ci
npm start
```

Open http://localhost:8080. `npm run dev` uses the same local static server. On Windows use a terminal in the project folder. No environment variables or credentials are needed for local gameplay. PORT optionally changes the local port.

## Source and build

**dist/ is the authoritative editable source**, not disposable generated output. It contains HTML, CSS, JavaScript modules, workers, service worker, models, animations, textures, fonts, vendored engines and tracking models. Keep it tracked in Git.

```sh
npm run build
```

The migration build copies the complete static application into `build/`; no compilation was required by the original project. `build/` is ignored. Existing Sites hosting continues to serve `dist/`, as declared by `.openai/hosting.json`. Pinned dependencies and local vendor files are preserved. `scripts/vendor-3d.mjs` refreshes pinned 3D vendor assets only when intentionally needed; it is not required on each build. Asset authoring scripts may require Python, Blender or their separately documented tooling; these are not needed to run the shipped application.

## Test

```sh
npm test
npm run test:3d
npm run test:limit
```

The full suite covers the existing game systems, persistence, offline behavior, media and 3D functionality. Consult AGENTS.md and 3D_GAME_DEVELOPMENT.md before changes. Automated fixtures do not establish real Windows multitouch, physical cameras/microphones, gamepad or GPU compatibility. Smoke-test those devices on the actual arcade PC.

Version 6.3.0 adds a browser regression suite:

```sh
npm run test:browser
```

It uses an installed `/usr/bin/chromium`, `CHROMIUM_PATH` when supplied, or Playwright's Chromium (install that with `npx playwright install chromium`). The test starts its own local server, checks all main pages and all 25 world entry screens at several widths, exercises controller fixtures and real canvas drawing, and verifies a real service-worker offline reload. Reports and screenshots go to `/tmp/`. It does not substitute for physical controller, microphone, camera, touch or GPU testing.

## Find a world and play with controllers

The lobby has searchable worlds, rotating local daily suggestions and a shortcut to the last world opened. Suggestions do not change scores or track activity remotely. The last-world shortcut stays in this browser and is separate from exported progress.

Pair a standard-mapping controller through your device's Bluetooth settings or connect it over USB, then press and release a button. D-pad moves between controls; left/right adjusts options. A selects. Left stick moves a labeled controller cursor; hold A or RT to drag, draw or aim in pointer-driven games. LB slows the cursor for precise work, right stick scrolls, B cancels a drag or dismissible dialog, Menu pauses/resumes when the game offers it, and View opens the guide. The first press discovers the controller; held buttons never accept instructions automatically.

Two controllers get independent P1/P2 cursors. Choose a two-player mode first and use the game's assigned play areas. Each controller supplies one pointer, so two-finger gestures require touch or another controller. Living Forest keeps its dedicated controller movement, camera and combat adapter, which takes over automatically. Wobbly Wars uses controller cursors for deployment and menus; its battles remain automatic. Camera, microphone and speech activities still need their real devices. A disconnect cancels held input and pauses games that expose a Pause control; intentionally resume after reconnecting. Browser permission prompts, file pickers and audio unlock may still require a touchscreen or mouse tap. Use **Controller Guide** in the lobby or Settings for pairing and control details.

## Shared systems foundation (Milestone 3, retained)

Version **6.5.0** improves shared menu/input cleanup, common music scheduling and optional decorative particle intensity. See [SHARED_ARCADE_SYSTEMS.md](SHARED_ARCADE_SYSTEMS.md) for contracts, consumers, tests and limits. The existing Milestone 2 deployment remains pinned to its exact commit; development on `revamp/milestone-3-shared-systems` does not change that branch. The user’s standing workflow is to deploy completed, verified milestone checkpoints through Work Mode to the existing site, then test live.

## Deploy to the existing website

Start with [WORK_MODE_HANDOFF.md](WORK_MODE_HANDOFF.md) for the latest milestone checkpoint, exact source identity, deployment instructions and user trial checklist.

Current website: https://little-big-arcade-parks.diladiop.chatgpt.site

Existing Sites project ID: `appgprj_6adab219a4788191952c4c83432002c5`. Preserve `.openai/hosting.json` and its `static.directory: dist`. A GitHub push alone does **not** publish to this Sites website, and this export contains no deployment credentials or GitHub Actions deployment integration.

For future Codex updates, commit and push changes to GitHub, then use a ChatGPT/Codex environment with the Sites connector and Sites skill. Select this exact existing project, get fresh source repository access, open its existing source checkout with the Sites source workflow helper, import the reviewed GitHub changes, run tests and build/package the static dist directory, synchronize that exact source commit to the Sites source repository, save a matching version and deploy it using the site's existing access policy. Verify the terminal deployment result. Do not create a replacement Site. The Sites skill supplies the authenticated helper and exact current API workflow; credentials are session-only and are deliberately absent here.

An independent static host can also serve `build/` over HTTPS, but that creates a different hosting destination and does not update the current Sites URL. Serve `.wasm` with application/wasm. Camera/microphone features require HTTPS or localhost.

## Data and preservation

Profiles, scores, settings, drawings and imported audio stored in the browser are not repository files. Use the application's backup/export feature on the original browser and restore on a new device/origin. Keep the original browser data until restore is verified. Service-worker caching may require the normal application update flow/reload after publication.

The initial migration preserved runtime source and assets byte-for-byte and added migration tooling, documentation and start/dev/build scripts. Subsequent version 6.3.0 changes are documented in ACCEPTANCE-6.3.0.md; SOURCE_SHA256.json remains the original migration baseline. Existing asset licenses and source notices remain included. The upstream application's overall license is not newly granted by this migration.

Excluded: .git internals, node_modules, generated verification screenshots/logs and temporary build/cache output. No secrets were intentionally exported. See EXPORT_TREE.txt, SOURCE_SHA256.json and MIGRATION.json for the complete inventory and provenance.

## Push this export manually if needed

The requested destination is https://github.com/imashleyparks95/touchscreenapp on main. Inspect the remote before pushing; never force-push or replace unrelated work. This migration includes a downloadable source ZIP without Git internals.

### Milestone 6 — v6.8.0 benchmark checkpoint

Project Limit Break → **FIVE-SCENARIO BENCHMARK** runs Forest, Castle, Arena and two Chamber workloads (55 seconds plus loading). Export measured raw-frame JSON/CSV, compare matching editions/settings in Benchmark History, or use Settings → Find My Best Settings for a 30/60 FPS recommendation across all scenarios. The original Forest baseline and solo/co-op expedition remain available. Pause/resize/focus loss cancels a formal run. Target-PC hardware results remain unverified; cloud rendering is not a performance promise. Run `npm run test:benchmark:browser` for the actual browser flow. Deployment directions are in `WORK_MODE_HANDOFF.md`.
