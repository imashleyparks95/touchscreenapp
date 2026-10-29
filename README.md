# Little Big Arcade

## Current development checkpoint — 6.5.0

Milestone 3 adds shared menu/input cleanup, quieter common audio scheduling and saved decorative particle controls. Read [WORK_MODE_HANDOFF.md](WORK_MODE_HANDOFF.md) for the exact checkpoint and deployment status.

### Retained Forest foundation — 6.4.0

The overall arcade uses muted dark colors, including the Aurora and Nebula profile themes. Project Limit Break retains its existing Forest adventure, graphics and multiplayer modes.

In the Forest's **Settings → Controls & Camera**, adjust controller camera speed, camera-stick deadzone, touch look speed, invert-Y and Auto/Show/Hide touch controls. These preferences are saved and included in backups; older backups without them still work. Auto keeps touch controls for a touch co-op partner while a controller is in use. **SHOW TOUCH** in the toolbar always restores hidden controls. The separate **DRAG TO LOOK** area can be used alongside movement and action buttons. Movement deadzones and combat rules are unchanged.

The monitor/minimap now have separate positions on supported wide screens; the camera drag area stays above the touch panels. Benchmark results include **BACK TO ARCADE**, without loading another Forest scene. Physical Windows controls, touchscreen reach and GPU performance still need testing on the arcade PC. Development is paused at each milestone for that user trial; nothing is automatically deployed.

## Revamp checkpoints

Read [ARCADE_REVAMP_PROGRESS.md](ARCADE_REVAMP_PROGRESS.md) for the current milestone, complete game inventory, tested capabilities, gaps and exact resume instructions. The [full master plan](docs/ARCADE_REVAMP_MASTER_PLAN.md) is retained in the repository. Development pauses for user testing after each milestone; there is no automatic deployment.

```sh
npm run audit:arcade
npm run test:audit
npm run test:limit:browser
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

## Shared systems checkpoint (Milestone 3)

Version **6.5.0** improves shared menu/input cleanup, common music scheduling and optional decorative particle intensity. See [SHARED_ARCADE_SYSTEMS.md](SHARED_ARCADE_SYSTEMS.md) for contracts, consumers, tests and limits. The existing Milestone 2 deployment remains pinned to its exact commit; development on `revamp/milestone-3-shared-systems` does not change that branch. Milestone 3 requires separate deployment authorization.

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
