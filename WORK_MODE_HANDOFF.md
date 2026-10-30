# Work Mode handoff — Milestone 7D

## Deploy v6.12.0 for live testing

Repository **imashleyparks95/touchscreenapp**, branch **revamp/milestone-7d-puzzle-workshops**, based on published 7C `b78514156dacacd88525941814faf40c1b9759d8`. Tested app commit **APP_COMMIT_PENDING**. Publication status will be recorded after push. Prior deployment branches remain unchanged. Deployment is authorized; finish earlier deployments before deploying this checkpoint.

Read `AGENTS.md`, `ARCADE_REVAMP_PROGRESS.md` and this file. **7D improves Circuit Rush/Robot Repair Shop and refreshes all 25 public game covers. Milestone 7 remains in progress.** Runtime source: `dist/js/cover-art.js`, `workshop-ui.js`, `arcade-new.js`, `premium.js`, `premium-render.js`, `visuals.js`, `premium-art.js`, common instruction artwork and scoped `dist/arcade-polish.css`. `dist/` is authoritative; package/release/cache version is **6.12.0**. Evidence: `docs/revamp/M7D_*`.

## Deployment and verification

Serve **dist/** in existing Sites project **appgprj_6adab219a4788191952c4c83432002c5**. Preserve **https://little-big-arcade-parks.diladiop.chatgpt.site**, its access policy, family profiles/scores/media and saved projects. Do not create a replacement site or clear browser data. Fetch the exact published commit and use authenticated Sites source/save/deploy workflow. Git push/build alone is not deployment. Verify success, exact commit and live **6.12.0**, then return the existing URL. Use the normal lobby/Settings update flow; never force an update under active gameplay.

Checks: `npm test` (46 programs), `npm run audit:arcade`, `npm run build`, `npm run test:workshop:browser`, `npm run test:browser`, `npm run test:library:browser`. Four active desktop/phone, 72 shell and 75 preview audits; eight library scenarios; all 25 production cover renders; all 30 legal Circuit solutions; 135 career + 100 randomized full Robot repairs in existing core regressions. Workshop browser legally completes both diagnosis turns, not a full physical repair playthrough. Controller-pointer fixtures are not physical hardware certification. All 98 original imported asset/vendor hashes and site/save identity remain. No dependency additions.

## User trial

- Browse all 25 games and their previews: new distinct covers, dark shell, readable text, favorites/recent/search intact.
- Circuit: connect matching letters, try components and undo/reset, cancel a held wire or pause, check no cancellation mistake. Try two independent boards and portrait stacking. Existing controller cursors remain; native action mapping is not claimed.
- Robot: unknown parts must remain unknown until scanned. Follow component/tool hints through diagnosis, loosen case screws, open, repair, close, tighten and interactive Test 1–2–3. Try tool changes/cancel/pause during a gesture and manual help. Nine visual tools remain. Test alternating two-player turns and portrait tool scrolling.
- Verify existing profiles, scores, projects, sounds and backup; physically try touchscreen, mouse and standard controller cursors. Earlier native Slime/Ninja and Limit Break controls remain.

Stop for the user's deployed trial. Next development after continuation: **7E, proposed Creative Studio/Beat Lab**, preserving saved art, audio and exports. Do not declare all 2D games or the overall master plan complete.

## Message to paste into Work Mode

Deploy Little Big Arcade Milestone 7D, version 6.12.0, from imashleyparks95/touchscreenapp, branch revamp/milestone-7d-puzzle-workshops, commit APP_COMMIT_PENDING. Read WORK_MODE_HANDOFF.md, AGENTS.md and ARCADE_REVAMP_PROGRESS.md. Deployment is authorized. Finish earlier deployments, serve dist/ in existing Sites project appgprj_6adab219a4788191952c4c83432002c5, preserve the existing URL/access policy and family data, and do not create a replacement site. Verify live 6.12.0 and send me the existing URL to test all 25 updated game covers plus Circuit Rush and Robot Repair Shop. Pause further development for my trial.
