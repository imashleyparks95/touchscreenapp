# Work Mode handoff — Milestone 7I

## Deploy v6.17.0 for live testing

Repository **imashleyparks95/touchscreenapp**, branch **revamp/milestone-7i-learning-games**, based on published 7H `718833e1e9f2e5e539ee1a457c67bb9dcf4b32dd`. Tested app commit **59662a0ab1588c036da0d06cfe2e9b6fdc930570**; published to GitHub and verified against the remote branch. This documentation-only follow-up has the same runtime; the final handoff may pin its commit instead. Earlier deployment branches remain unchanged. Deployment is authorized; finish earlier deployments before deploying this checkpoint.

Read `AGENTS.md`, `ARCADE_REVAMP_PROGRESS.md` and this file. **7I improves Math Quest / Spelling Adventure; Milestone 7 remains in progress.** Runtime: `dist/js/math-board.js`, `math-quest.js`, `spelling.js`, `learning-polish.js`, scoped `dist/arcade-polish.css`. Authoritative source is `dist/`; version **6.17.0**. Evidence: `docs/revamp/M7I_*`. All 25 covers, shared local sounds, choice-first Doodle/mines/healers and earlier changes remain.

## Deploy and verify

Serve **dist/** in existing Sites project **appgprj_6adab219a4788191952c4c83432002c5**. Preserve **https://little-big-arcade-parks.diladiop.chatgpt.site**, access policy, family profiles/scores, learning history, media/designs and shared local sound library. Do not create a replacement site or clear browser data. Fetch the exact published commit and use authenticated Sites source/save/deploy workflow. Git push/build alone is not deployment. Verify success, exact commit and live **6.17.0**, then return the existing URL. Use normal lobby/Settings update flow; never force an update under active gameplay.

Checks: `npm test` (51 programs), `npm run audit:arcade`, `npm run build`, `npm run test:learning:browser`, `npm run test:browser`, `npm run test:library:browser`. Four active + 72 shell + 75 preview audits. Actual Math line/cancel/pause/inert workspace/legal answer/hidden fair handoff and Spelling simultaneous guidance/writing/legal isolated answer/backup. Unit verifies empty coalesced-event fallback and no official-answer access by guides. Existing curriculum/word/voice/turn regressions pass. No physical handwriting/controller/audible voice certification. 270 cache entries, 172 reachable dependencies, all 98 imported art/vendor hashes and hosting/save identities preserved. No new dependency/service/score edition.

## User trial

- Math: draw with mouse/touch/controller cursor and confirm real continuous ink. Cancel a held gesture, pause/help while drawing, undo/redo/clear and change zoom or notebook location. Completed ink must remain; unfinished canceled strokes must not reappear. Paused workspace must block input. Try pen/shapes/ruler/fraction paper, answer-format guides, choices/pairs/fractions/clocks, hints/Show Me How and final answer submission. Handwriting never submits or grades an answer.
- Try independent grade-specific turns/Ready handoffs and shared co-op paper; keep-writing preferences and progress must remain.
- Spelling: try Bee, Letter Builder, Missing Letters, Sprint and Survival; guides explain each workflow without exposing the word. Check word/slow/sentence replays, automatic free female US voice selection, Niko = NEE-koh and Niko's mixed 3–6-letter deck. Test handwriting, separate typed answer, split/turn/co-op modes, hints, mastery/history and backups.
- Physically try touchscreen precision, local installed voices, keyboard and controller navigation. Automated browser submissions use authored test answers; they do not certify learning effectiveness or physical audio.

Stop for the user's deployed trial. Next proposed development after continuation: **7J — Funny Face Studio / Monster Me!**, preserving explicit camera/mic permission, local media and export workflows. Other game-ledger and M8–M10 work remains.

## Message to paste into Work Mode

Deploy Little Big Arcade Milestone 7I, version 6.17.0, from imashleyparks95/touchscreenapp, branch revamp/milestone-7i-learning-games, commit 59662a0ab1588c036da0d06cfe2e9b6fdc930570. Read WORK_MODE_HANDOFF.md, AGENTS.md and ARCADE_REVAMP_PROGRESS.md. Deployment is authorized. Finish earlier deployments, serve dist/ in existing Sites project appgprj_6adab219a4788191952c4c83432002c5, preserve the existing URL/access policy and family data, and do not create a replacement site. Verify live 6.17.0 and return the existing URL for my Math/Spelling trial. Pause further development for my trial.
