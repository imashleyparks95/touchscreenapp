# Milestone 1 evidence

These reports describe runtime source commit `2c31e13c0fc06519e5d845241feb2d5299bb4958`, version 6.3.0. Milestone 1 adds audit tooling and documentation; it does not modify that runtime.

- `M1_STATIC_AUDIT.json`: seven read-only audit checks and the actual 25-world public registry.
- `M1_FOREST_BROWSER.json`: actual solo/co-op positions, scene information, errors/asset responses and a completed real Forest baseline with every recorded frame sample. No family browser data was used.
- `M1_FOREST.png`: actual imported scene, hero, touch controls and performance monitor at Low settings in headless Chromium/SwiftShader.

Reproduce with `npm ci`, `npm run audit:arcade`, `npm test`, `npm run test:browser`, `npm run test:limit:browser`, and `npm run build`. Browser tests use an installed Chromium, `CHROMIUM_PATH`, or Playwright's installed Chromium (see the main README). Real-benchmark results vary with the environment; do not assert an FPS threshold against this cloud measurement or describe it as Windows/integrated-GPU evidence.

See `ARCADE_REVAMP_PROGRESS.md` at the repository root for the milestone ledger, limitations, full game checklist and mandatory user trial gate before Milestone 2.


## Milestone 2 evidence — 6.4.0

`M2_LIBRARY.png` shows the requested darker shell. `M2_FOREST.png` and `M2_FOREST_BROWSER.json` cover saved camera preferences, mixed-input controls, injected simultaneous touch, responsive active controls, the real scene and its benchmark/export/exit path. `M2_STATIC_AUDIT.json` verifies the preserved roster, assets, save identities and offline dependency closure. The raw cloud benchmark is a functional smoke check, not a controlled comparison against M1 or a hardware FPS claim. M1 reports remain unmodified historical evidence.

## Milestone 3 evidence — 6.5.0

`M3_SHARED_BROWSER.json` records five actual browser integration scenarios with CDP touch and explicit gamepad/visibility fixtures; `M3_SHELL_BROWSER.json` records 72 responsive/accessibility audits with no page exceptions. `M3_SETTINGS.png` shows the dark settings and decorative particle control; that focused browser harness blocks service workers, so its offline-update status is not a production check. Real offline reload is separately covered by the shell suite. `M3_FOREST_BROWSER.json` contains real imported-scene solo/co-op checks and all raw benchmark frames, with `M3_FOREST.png` as visual evidence. `M3_STATIC_AUDIT.json` preserves roster/asset/save/cache/hosting verification. None constitutes physical Windows/input/audio/GPU certification, and the software benchmark is not a controlled performance comparison.

See `SHARED_ARCADE_SYSTEMS.md`, `ARCADE_REVAMP_PROGRESS.md` and `WORK_MODE_HANDOFF.md` for contracts, limitations and the current review/deployment authorization status. M1/M2 files remain unchanged.

## Milestone 4 evidence — 6.6.0

`M4_LIBRARY_BROWSER.json` records eight launcher scenarios, actual profile persistence/offline behavior and 75 preview layout/accessibility audits. `M4_SHELL_BROWSER.json` records the 72 existing responsive shell/game-entry audits. `M4_SHARED_BROWSER.json` records the successful five-scenario shared-system browser run and actual v6.6.0 release identity. `M4_STATIC_AUDIT.json` checks all 25 public IDs, original asset integrity, offline closure, save identities and existing hosting target. `M4_DESKTOP.png`, `M4_PHONE.png`, `M4_CARDS.png` and `M4_PREVIEW.png` show the actual redesigned launcher, responsive profile strip, illustrated collection and substantive preview.

No game model/art asset was replaced and no new zone/gameplay work is claimed. Touchscreen taps and controller/visibility inputs are browser fixtures, not physical Windows/USB/Bluetooth verification. The standing workflow is Work Mode deployment to the existing site followed by the user's live trial; a build or Git push is not a live deployment result. Older milestone evidence is unchanged.
