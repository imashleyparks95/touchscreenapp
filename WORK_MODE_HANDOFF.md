# Work Mode handoff — Milestone 6

## Deploy v6.8.0 for live testing

Repository **imashleyparks95/touchscreenapp**, branch **revamp/milestone-6-benchmark**, based on published M5 `c342950`. Tested app commit **`11bc3b7c9f497ab2aa6a54f7b9fe66cdc563c983`** is published and verified on GitHub. This documentation-only follow-up has the same runtime; the final handoff may pin its commit instead. Earlier deployment branches are unchanged. The user authorized deployment of completed milestones and tests once deployed. Finish any earlier deployment before publishing this checkpoint.

Read `AGENTS.md`, `ARCADE_REVAMP_PROGRESS.md`, this file and `3D_GAME_DEVELOPMENT.md` → Five-world benchmarking. Source entry points: `dist/js/limit/benchmark-suite.js`, `ui.js`, `records.js`, original Forest and Journey scenes. `dist/` is authoritative; build/ is just a generated copy. Package/release/service-worker identify **6.8.0**. Evidence and exact fixture/hardware limits are in `docs/revamp/M6_*` and its README.

## Deployment destination

Deploy to existing Sites project **appgprj_6adab219a4788191952c4c83432002c5**, serving **dist/**. Preserve **https://little-big-arcade-parks.diladiop.chatgpt.site**, its access policy, profiles/scores/media storage and update flow. Do not create a replacement site or clear browser data. Use authenticated Sites source/save/deploy workflow with the exact Git commit; a Git push or build is not deployment. Deployment is authorized. Confirm terminal success, live **6.8.0**, deployed commit and the existing URL. Apply the normal service-worker update from lobby/Settings, never under an active game.

Checks: `npm ci`, `npm test` (42 programs), `npm run audit:arcade`, `npm run build`; browser-capable environments: `npm run test:benchmark:browser` and `npm run test:browser` (72 audits). Final source passed these runtime/regression checks with installed locked dependencies; no dependency changes. Original 98 asset/vendor hashes and hosting/save identities are preserved.

## Trial

Open Project Limit Break → **FIVE-SCENARIO BENCHMARK**. It runs actual Forest rendering, Castle interior lighting, Arena combat, Chamber physics/particles and combined Chamber load: 3-second warm-up + 8-second measurement per scene, roughly 55 seconds plus loading. Review per-scenario/overall results, export JSON/raw CSV, open Benchmark History and compare matching editions/settings. Original Forest baseline and four-area solo/co-op expedition remain separate.

In adventure Settings, choose target 30/60 FPS → **Find My Best Settings**. Each supported preset runs all five scenarios; allow about a minute per preset plus loading. Every scenario must meet frame-pacing thresholds, otherwise Low is recommended with a warning. Manual overrides remain. Pause/resize/focus loss cancels without partial history. Safe Graphics remains available. Check existing family data and normal offline/update behavior.

Cloud SwiftShader smoke results are slow/sample-limited and do not predict the intended Windows GPU. Five-preset tuning control flow uses fixtures; actual target-device tuning remains to test. Simulation uses seeded 60 Hz scripts capped at 100 ms catch-up per rendered frame; physics/browser scheduling may vary. Do not compare different editions/backends/settings as a controlled speed test. No M7 implementation during deployment.

## Message to paste into Work Mode

Deploy Little Big Arcade Milestone 6, version 6.8.0, from imashleyparks95/touchscreenapp, branch revamp/milestone-6-benchmark, commit 11bc3b7c9f497ab2aa6a54f7b9fe66cdc563c983. Read WORK_MODE_HANDOFF.md, AGENTS.md, ARCADE_REVAMP_PROGRESS.md and 3D_GAME_DEVELOPMENT.md. Deployment is authorized. Finish any earlier deployment, serve dist/ in existing Sites project appgprj_6adab219a4788191952c4c83432002c5, preserve its URL and access policy, and do not create a replacement site. Verify live version 6.8.0 and send me the existing URL so I can try the five-scenario benchmark and settings tuner. Stop before Milestone 7.
