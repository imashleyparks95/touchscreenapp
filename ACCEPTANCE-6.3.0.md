# Little Big Arcade 6.3.0 — polish and controller access

## Implemented

- A warmer arcade shell with readable game cards, responsive layouts, searchable worlds, live result counts, clear empty results, three daily local suggestions and a last-opened-world shortcut. Suggestions and the shortcut do not change scores or create remote tracking.
- All six main destinations retain profiles, records, trophies, rivalries, settings and backup workflows. Profile changes now refresh the trophy/records page, mute and navigation controls expose their state, keyboard users have a skip link and heading focus, dialogs have accessible names, and a canceled restore can select the same file again.
- Standard controllers use D-pad navigation, A selection, left-stick labeled cursors, A/RT drag, LB precision, right-stick scrolling (including nested panels), B cancel, Menu pause/resume and View help. Two controller pointers have separate identities and capture. Blur, disconnect and context changes cancel held input. Disconnect requests Pause without ever automatically resuming. Living Forest's existing dedicated adapter takes over while its game owns the screen.
- Games retain their own visual identity. Contrast corrections address Math Quest, Castle Creator, Air Slice, Wobbly Wars and Living Forest. Creative launch screens have a main heading; Build & Smash and Living Forest no longer nest main landmarks.
- Bug, balloon, slime and monster illustration families have richer directional shading. Wobbly Wars has spine-attached class capes, refined metallic surfaces, scale-aware ownership rings and backed health bars. Capes use the existing real bone attachment API, freeze with paused time, fade with defeat and dispose with the actor. The development inspector hides the complete health indicator in animation-preview mode.
- Version, release notes and the service-worker cache advance together. New runtime files are cached for offline use. Existing explicit update activation remains in place.

## Validation

- `npm ci --cache /tmp/little-big-arcade-npm-cache --no-audit --no-fund`: passed with the lockfile; runtime dependencies unchanged. Playwright and axe-core are pinned development dependencies.
- `npm test`: all 35 existing test programs completed successfully, covering gameplay simulations, solo/co-op/versus behavior, instructions, scores, achievements, media backups, offline updates, the independent 3D toolkit/starter, model/weapon alignment and Living Forest. The changed Wobbly Wars presentation test also verifies costume attachment, paused cloth, health-bar framing and cleanup.
- `npm run test:browser`: 68 successful layout/accessibility audits. Six shell destinations at 1440/768/390 px and all 25 game-entry screens at 1280/390 px. No reported WCAG A/AA or included best-practice violations, document overflow or browser exceptions on those inspected screens.
- Browser behavior checks: search/filter/empty recovery; mute state; profile switching; same-file restore retry after cancel; controller menu activation and disabled options; nested-panel scrolling; two independent captured pointers; disconnect cancellation and once-only pause; real undoable Creative Studio drawing after instruction acknowledgement; actual service-worker installation and offline reload of the new discovery UI.
- Browser visual inspection: revised lobby, phone layout, live Bug Squash and the actual Wobbly Wars knight/duel inspector from front and rear. The Chromium 3D run used ANGLE/SwiftShader; its measured frame rate is not a hardware GPU benchmark.
- All 98 original files under `dist/assets/` and `dist/vendor/` still match `SOURCE_SHA256.json`. That file and `EXPORT_TREE.txt` remain the migration's original provenance, not a checksum/inventory of this intentional post-migration update.
- `npm run build` and `git diff --check`: passed. No deployment performed.

## Remaining physical checks and scope

Entry-screen accessibility audits do not establish that every active gameplay state is accessible. Game rules are covered by the existing automated suites; not every campaign was manually played in a browser. The art refinements cover the listed illustration families and Wobbly Wars presentation, rather than replacing every model or game.

The new controller coverage is cursor/menu based in pointer-driven games. It is not a new direct-action mapping for every game. Each controller supplies one pointer; two-finger actions need touch or another controller, and each game's multiplayer mode/play areas still apply. Camera, microphone and speech activities require real devices. Browser permission dialogs, file pickers and audio unlocking can require a touch/mouse gesture.

Physical Windows Bluetooth/USB controllers, real concurrent touchscreen contacts, camera/microphone capture, GPU lighting, model silhouettes and sustained frame rates at arcade resolution remain target-device checks before deployment. No physical hardware results are claimed by fixtures or the cloud renderer.
