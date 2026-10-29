# Work Mode handoff — Milestone 7A

## Deploy v6.9.0 for live testing

Repository **imashleyparks95/touchscreenapp**, branch **revamp/milestone-7a-reaction-games**, based on published M6 `94933243b42d372867881be9019c44ca3bbf081a`. Tested app commit **`8c8766dd22400c5811e74184c5fbdf834df1318b`** is published and verified on GitHub. This documentation-only follow-up has the same runtime; the final handoff may pin its commit instead. Previous milestone/deployment branches remain unchanged. Deployment is authorized under the user's standing instruction; they test once deployed. Finish any earlier deployment before publishing this checkpoint.

**7A is the first two-game batch of Milestone 7. Do not call all 2D games complete or advance to Milestone 8.** Read `AGENTS.md`, `ARCADE_REVAMP_PROGRESS.md` and this file. Runtime: `dist/js/reaction-art.js`, `refine-core.js`, `refine-render.js`, `refined.js`, soft cues in `audio.js` and scoped `arcade-polish.css`. Both games' notices/instructions and the service-worker cache are updated. `dist/` is authoritative; package/release/cache agree on **6.9.0**. Evidence and exact fixture/hardware limits are in `docs/revamp/M7A_*` and its README.

## Deployment destination

Use existing Sites project **appgprj_6adab219a4788191952c4c83432002c5**, serving **dist/**. Preserve **https://little-big-arcade-parks.diladiop.chatgpt.site**, its existing access policy and all profile/score/media identities. Do not create a replacement site or clear browser data. Fetch the exact published commit, synchronize/save its matching source using the authenticated Sites workflow and deploy. Git push/build alone is not deployment. Confirm deployment success, exact commit and live **6.9.0**, then return the existing URL. Use the normal service-worker lobby/Settings update flow, never force it under an active game.

Checks: `npm ci`, `npm test` (43 programs), `npm run audit:arcade`, `npm run build`; browser-capable environments: `npm run test:reaction:browser` (4 actual sessions, 8 active audits) and `npm run test:browser` (72 shell/entry audits). Current locked dependencies were reused; no dependency changes. All 98 original asset/vendor hashes, 25 public game IDs and hosting/save identities are preserved.

## What to try

- **Bug Squash:** solo and two-player play; moonlit garden/beetles; color AND symbol targets; each player's visible cue/feedback; correct/wrong taps; pause/How to Play; replay and records. Difficulty/modes/scoring edition remain.
- **Balloon Mayhem:** solo and two-player play, then Learning on easy/color and harder/math settings. Central answers remain visible on gold/time/armored balloons; smaller badges/dots identify their special behavior. Mystery breeze ends after three seconds; new spawns slow only during the active window. Spikes remain avoid targets. Prompt-band touches do not count as mistakes.
- Balloon records use **balloon-breeze-v2** so old permanent-breeze scores cannot dominate corrected runs. Records → Edition retains earlier `refinement-v1` records; all old data remains backed up. Do not reset family storage.
- Wide screens place independent panels side by side; narrow screens stack them with scrolling. Touch/mouse and controller cursors share the same target conversion. This is cursor support, not a newly claimed native character mapping. Test actual Windows multi-contact/USB/Bluetooth reach, sound comfort and reduced-motion/effects settings.
- All other games and v6.8.0 Limit Break expedition/benchmarks remain. No 3D asset upgrade is claimed in 7A. Remaining 2D batches continue as 7B after trial/continuation.

## Message to paste into Work Mode

Deploy Little Big Arcade Milestone 7A, version 6.9.0, from imashleyparks95/touchscreenapp, branch revamp/milestone-7a-reaction-games, commit 8c8766dd22400c5811e74184c5fbdf834df1318b. Read WORK_MODE_HANDOFF.md, AGENTS.md and ARCADE_REVAMP_PROGRESS.md. Deployment is authorized. Finish any earlier deployment, serve dist/ in existing Sites project appgprj_6adab219a4788191952c4c83432002c5, preserve its URL/access policy and do not create a replacement site. Verify live 6.9.0 and send me the existing URL so I can test Bug Squash and Balloon Mayhem. Milestone 7 remains in progress; pause before further development for my trial.
