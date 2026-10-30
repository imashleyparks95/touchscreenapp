# Work Mode handoff — Milestone 7C

## Deploy v6.11.0 for live testing

Repository **imashleyparks95/touchscreenapp**, branch **revamp/milestone-7c-motion-games**, based on published 7B `69920961a4effd2db61d8fa2456172f8caa9ae87`. Tested app commit **`8b3c9c0253dfdfda4622f8bb482c0daa262ba4eb`** is published and verified on GitHub. This documentation-only follow-up has the same runtime; the final handoff may pin its commit instead. Earlier deployment branches are unchanged. Deployment is authorized; the user tests once deployed. Finish earlier deployments before publishing this checkpoint.

Read `AGENTS.md`, `ARCADE_REVAMP_PROGRESS.md` and this file. **7C improves Slime Lab/Shadow Ninjas; Milestone 7 is still in progress.** Runtime entry points: `dist/js/touch-native.js`, `motion-art.js`, `touch-worlds.js`, `touch-render.js`, global ownership in `arcade-controller.js`, capability/instruction metadata and scoped `arcade-polish.css`. `dist/` is authoritative; app/package/cache agree on **6.11.0**. Actual evidence and precise fixture/hardware limits are in `docs/revamp/M7C_*`.

## Deployment and verification

Serve **dist/** in existing Sites project **appgprj_6adab219a4788191952c4c83432002c5**. Preserve **https://little-big-arcade-parks.diladiop.chatgpt.site**, access policy and family profiles/scores/media. Do not create a replacement site or clear browser data. Fetch the exact published Git commit and use authenticated Sites source/save/deploy workflow. Git push/build alone is not deployment. Confirm deployment success, exact commit and live **6.11.0**, then return the existing URL. Use normal lobby/Settings service-worker update flow, never force an update under an active game.

Checks: `npm ci`, `npm test` (45 programs), `npm run audit:arcade`, `npm run build`; browser-capable environments: `npm run test:motion:browser`, `npm run test:browser`, `npm run test:library:browser`. Recorded: two real motion sessions/four active audits, 72 shell/entry audits, 75 previews/eight library scenarios, actual Gamepad API fixture sling/star-switch/cursor ownership and safe pause/disconnect. No new dependency; all 98 original asset/vendor hashes, 25 public IDs and site/save identities retained.

## What to try

Pair standard Xbox-style USB/Bluetooth pads in Windows; press and release a button to join. Native controls take over only in active Slime/Ninja play; menus/paused screens keep global navigation. Existing touch/mouse gestures remain, including mixed-input play.

**Slime Lab:** left stick aims; hold/release RT or A charges/slings; X splits where allowed; Y resets; RB selects a split blob (AIM marker); LB toggles an anchor pin; B cancels native pins/charge. Try real touch stretch/pinch too. Later pad puzzles require split, both pads and merging; full advanced native-campaign completion is not hardware-certified. Existing courses, physics, palettes and scores remain.

**Shadow Ninjas:** left stick moves, right stick aims; A dashes, B slides, X throws, Y blinks, RB wall-jumps, hold LB shields. Actual walls, cooldowns and energy still apply. Try aimed stars at switches, cover, warning gauges and scroll/switch/pad objectives. Both controllers independently own their player.

Menu pauses; View opens manual help. Disconnect must pause and clear held gestures; intentionally resume after reconnecting or switching to touch. Check native play shows no duplicate arcade cursor. Wide screens use independent side-by-side fields; portrait screens stack full-width fields with scrolling. Check reduced effects and actual physical controller/touch/audio feel. Existing M7A/M7B/Limit Break remain. Continue development as 7D after user continuation, not M8.

## Message to paste into Work Mode

Deploy Little Big Arcade Milestone 7C, version 6.11.0, from imashleyparks95/touchscreenapp, branch revamp/milestone-7c-motion-games, commit 8b3c9c0253dfdfda4622f8bb482c0daa262ba4eb. Read WORK_MODE_HANDOFF.md, AGENTS.md and ARCADE_REVAMP_PROGRESS.md. Deployment is authorized. Finish earlier deployments, serve dist/ in existing Sites project appgprj_6adab219a4788191952c4c83432002c5, preserve its URL/access policy and do not create a replacement site. Verify live 6.11.0 and send me the existing URL to test Slime Lab/Shadow Ninjas and their native controllers. Milestone 7 remains in progress; pause further development for my trial.
