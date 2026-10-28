# Milestone 1 evidence

These reports describe runtime source commit `2c31e13c0fc06519e5d845241feb2d5299bb4958`, version 6.3.0. Milestone 1 adds audit tooling and documentation; it does not modify that runtime.

- `M1_STATIC_AUDIT.json`: seven read-only audit checks and the actual 25-world public registry.
- `M1_FOREST_BROWSER.json`: actual solo/co-op positions, scene information, errors/asset responses and a completed real Forest baseline with every recorded frame sample. No family browser data was used.
- `M1_FOREST.png`: actual imported scene, hero, touch controls and performance monitor at Low settings in headless Chromium/SwiftShader.

Reproduce with `npm ci`, `npm run audit:arcade`, `npm test`, `npm run test:browser`, `npm run test:limit:browser`, and `npm run build`. Browser tests use an installed Chromium, `CHROMIUM_PATH`, or Playwright's installed Chromium (see the main README). Real-benchmark results vary with the environment; do not assert an FPS threshold against this cloud measurement or describe it as Windows/integrated-GPU evidence.

See `ARCADE_REVAMP_PROGRESS.md` at the repository root for the milestone ledger, limitations, full game checklist and mandatory user trial gate before Milestone 2.
