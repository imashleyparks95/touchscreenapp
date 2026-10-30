# Work Mode handoff — Milestone 7G

## Deploy v6.15.0 for live testing

Repository **imashleyparks95/touchscreenapp**, branch **revamp/milestone-7g-defense-games**, based on published 7F `64c2e6deb39c01dcd9cc7d00b5fcbdf337c46efd`. Tested app commit **APP_COMMIT_PENDING**; publication status will be recorded after push. Previous deployment branches are unchanged. Deployment is authorized; finish earlier deployments before deploying this checkpoint.

Read `AGENTS.md`, `ARCADE_REVAMP_PROGRESS.md` and this file. **7G improves Castle Creator and reworks Doodle Defenders per the user's explicit choice-first request. Milestone 7 remains in progress.** Runtime: `dist/js/doodle-core.js`, `premium.js`, `premium-render.js`, `defense-polish.js`, instructions and scoped `dist/arcade-polish.css`. Authoritative source is `dist/`; version **6.15.0**. Evidence: `docs/revamp/M7G_*`. All 25 refreshed covers and shared local Beat Lab sounds remain.

## Deploy and verify

Serve **dist/** in existing Sites project **appgprj_6adab219a4788191952c4c83432002c5**. Preserve **https://little-big-arcade-parks.diladiop.chatgpt.site**, access policy, profiles/scores/media and saved designs/sounds. Do not create a replacement site or clear browser data. Fetch the exact published commit and use authenticated Sites source/save/deploy workflow. Git push/build alone is not deployment. Verify success, exact commit and live **6.15.0**, then return the existing URL. Use normal lobby/Settings update flow; never force an update under active gameplay.

Checks: `npm test` (49 programs), `npm run audit:arcade`, `npm run build`, `npm run test:defense:browser`, `npm run test:browser`, `npm run test:library:browser`. Four active + 72 shell + 75 preview audits; real Castle save/backup and Doodle arbitrary freehand healer/cancel/placement/pause. Core regressions complete 20 Castle sieges and 100 Doodle configurations. Unit tests exercise actual mine damage/healing and old/new records backup. Browser tests are creative-mode/virtual-pointer fixtures, not physical hardware or full campaign certification. 268 cached files, 170 reachable dependencies, 98 original asset/vendor hashes retained. No new dependency/service.

## User trial

**Doodle:** choose Turret, Mine, Healer, Wall, Shield, Electric Trap, Slow Field or Power Aura; draw any outline. The raw sketch stays and takes that role, without a recognition requirement. Role is captured at pointer start. Turrets fire actual bullets; mines trigger once near enemies; healers send green pluses to damaged defenses or HOME within range, without over-healing. Larger drawings cost more ink. Try SELECT & PLACE, upgrade, undo, simultaneous versus/co-op and pause/help during strokes. New `doodle-v2` scores are separate; Records can show preserved earlier shape-recognition defenses. Try mine/healer balance and physical drawing feel.

**Castle:** try category pages, original visual purchases, materials and upgrades, starter/support status, More Build Tools → Save/Load Design, family copies, siege/repair/reinforcement/next assault and portrait layout. No price/unlock or score-edition changes.

Check original profiles, all games, artwork/music/designs and backup. Physically try touchscreen/controller cursors and audio/performance. No new native analog adapter is claimed.

Stop for the user's deployed trial. Next proposed development after continuation: **7H — Buddy Mayhem / Two-Player Tap Battle**. Milestone 7 remains in progress.

## Message to paste into Work Mode

Deploy Little Big Arcade Milestone 7G, version 6.15.0, from imashleyparks95/touchscreenapp, branch revamp/milestone-7g-defense-games, commit APP_COMMIT_PENDING. Read WORK_MODE_HANDOFF.md, AGENTS.md and ARCADE_REVAMP_PROGRESS.md. Deployment is authorized. Finish earlier deployments, serve dist/ in existing Sites project appgprj_6adab219a4788191952c4c83432002c5, preserve the existing URL/access policy and family data, and do not create a replacement site. Verify live 6.15.0 and return the URL for my trial of choice-first Doodle drawing, turrets/mines/healers and Castle Creator. Pause further development for my trial.
