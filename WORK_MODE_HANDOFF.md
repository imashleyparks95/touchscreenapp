# Work Mode handoff — Milestone 7F

## Deploy v6.14.0 for live testing

Repository **imashleyparks95/touchscreenapp**, branch **revamp/milestone-7f-physics-games**, based on published 7E `564bf6f92f9d29f71c81d310ae25288e92eae109`. Tested app commit **APP_COMMIT_PENDING**; publication status will be recorded after push. Previous deployment branches remain unchanged. Deployment is authorized; finish earlier deployments before deploying this checkpoint.

Read `AGENTS.md`, `ARCADE_REVAMP_PROGRESS.md` and this file. **7F improves Gravity Chaos/Build & Smash; Milestone 7 remains in progress.** All 25 refreshed public covers and Beat Lab's 80 sounds/shared device recordings remain. Runtime source: `dist/js/gravity.js`, `smash.js`, new `physics-polish.js` and scoped `dist/arcade-polish.css`. Existing core physics/rules, campaign layouts and score editions remain. `dist/` is authoritative; package/release/cache version **6.14.0**. Evidence: `docs/revamp/M7F_*`.

## Deploy and verify

Serve **dist/** in existing Sites project **appgprj_6adab219a4788191952c4c83432002c5**. Preserve **https://little-big-arcade-parks.diladiop.chatgpt.site**, access policy, family profiles/scores/media, saved structures and local sound library. Do not create a replacement site or clear browser data. Fetch the exact published Git commit and use authenticated Sites source/save/deploy workflow. Git push/build alone is not deployment. Confirm success, exact commit and live **6.14.0**, then return the existing URL. Use normal lobby/Settings update flow; never force an update under an active game.

Checks: `npm test` (48 programs), `npm run audit:arcade`, `npm run build`, `npm run test:physics:browser`, `npm run test:browser`, `npm run test:library:browser`. Six active + 72 shell + 75 preview audits; eight library scenarios. Actual Gravity/Sling/cancel/pause/turns/builder save in browser; all 150 legal Gravity configurations and full 30 Hard Smash demolitions in existing core regressions. No physical hardware/campaign-browser certification. Static audit: 267 cache entries, 169 reachable dependencies, all 98 original imported art/vendor hashes and site/save identities retained. No new dependency or service.

## User trial

- Gravity: try each player's direction buttons and original swipes. Momentum/budgets remain. Move platforms, rotate with two fingers, draw marked ramps, tap switches and hold/release safety on later levels. Direction changes must not cancel the other player's gesture. Try pause/help/exit while holding a board or safety, then resume deliberately. Check mission text, charged goal, energy-ball detail and portrait stacked boards.
- Smash: pull the sling, check live power, cancel without spending a shot, then release legally. Choose available projectiles; use special abilities, next shot, paused clocks and fair fresh second turns. No changed shot budgets/scoring. Inspect themed construction detail and saved records.
- Build Mode: place different shapes/materials, drag a piece and cancel or background the game; it should return to its original position. Save/reopen/test/reset/challenge a structure, switch profile and open it in Family-built levels. Existing copy protection/credit and backups remain.
- Physically test wall touchscreen, multitouch precision, standard controller cursors and audio/performance. This batch does not introduce a native analog adapter. All earlier modes, covers and Beat Lab shared sounds remain.

Stop for the user's deployed trial. Next proposed development after continuation: **7G — Castle Creator and Doodle Defenders**, preserving visual purchases, drawings, campaigns and records. Milestone 7 is still in progress.

## Message to paste into Work Mode

Deploy Little Big Arcade Milestone 7F, version 6.14.0, from imashleyparks95/touchscreenapp, branch revamp/milestone-7f-physics-games, commit APP_COMMIT_PENDING. Read WORK_MODE_HANDOFF.md, AGENTS.md and ARCADE_REVAMP_PROGRESS.md. Deployment is authorized. Finish earlier deployments, serve dist/ in existing Sites project appgprj_6adab219a4788191952c4c83432002c5, preserve the existing URL/access policy and family data, and do not create a replacement site. Verify live 6.14.0 and return the existing URL for me to test Gravity Chaos and Build & Smash, including the builder. Pause further development for my trial.
