# Work Mode handoff — Milestone 7B

## Deploy v6.10.0 for live testing

Repository **imashleyparks95/touchscreenapp**, branch **revamp/milestone-7b-care-games**, based on published 7A `10f1638abaf871e7a85471cae8a9c2a28af3537a`. Exact tested app commit is recorded after publication. Prior deployment branches are unchanged. Deployment is authorized; the user tests once deployed. Finish any earlier deployment before publishing this checkpoint.

Read `AGENTS.md`, `ARCADE_REVAMP_PROGRESS.md` and this file. **7B improves Monster Café and Monster Dentist; Milestone 7 is still in progress.** Source: `dist/js/care-art.js`, `cafe-controls.js`, `refine-render.js`, `refined.js`, `touch-render.js`, `touch-worlds.js` and scoped `arcade-polish.css`. `dist/` is authoritative; package/release/cache identify **6.10.0**. Tests, exact fixture limits and original-art provenance are in `docs/revamp/M7B_*`.

## Deployment destination / verification

Serve **dist/** in existing Sites project **appgprj_6adab219a4788191952c4c83432002c5**, preserving **https://little-big-arcade-parks.diladiop.chatgpt.site**, access policy and all family profile/score/media storage. Do not create a replacement site or clear browser data. Fetch the exact reviewed Git commit and use the authenticated Sites source/save/deploy workflow. Git push/build alone is not deployment. Confirm deployment success, exact commit and live **6.10.0**, then return the existing URL. Use normal service-worker lobby/Settings update flow; never force it under an active game.

Checks: `npm ci`, `npm test` (44 programs), `npm run audit:arcade`, `npm run build`; browser-capable environments: `npm run test:care:browser` (two real alternating-player sessions/four active audits) and `npm run test:browser` (72 shell/entry audits). Locked installed dependencies were reused; no new dependency. All 98 original asset/vendor hashes, 25 public IDs and save/site identities are preserved.

## What to try

**Monster Café:** select a guest, add exact quantities, try an extra ingredient and a numbered stack, remove an ingredient, then Serve. Watch named guest mood/patience and plate status. Category/ingredient focus should survive updates. Try Learning counts and alternating two-player play. Original recipes/scoring/records remain; there is no cooking stage or automatic serving.

**Monster Dentist:** select a named checklist task or tool; matching teeth get mint outlines and the tool hint stays visible. Scrub, spray, fill, trace, extract and place/rotate teeth with the existing real gestures. Switch tools during a held gesture and verify capture stops. Pause/How to Play must stop the clock; intentional help close restores the previous pause state. Try equal fresh patients in two-player alternating mode. Shaped enamel changes art, not hitboxes or rules.

Test actual touchscreen reach/precision, mouse/controller cursor and reduced-motion/effect settings on the Windows PC. These games retain cursor-based controller support; no new native character control claim. Core recipes/treatments and score editions remain, so keep all original browser data. Existing M7A/Limit Break games remain unchanged in capability. Remaining 2D upgrades continue as 7C after trial/continuation, not Milestone 8.

## Message to paste into Work Mode

Deploy Little Big Arcade Milestone 7B, version 6.10.0, from imashleyparks95/touchscreenapp, branch revamp/milestone-7b-care-games, using the exact published commit in my handoff. Read WORK_MODE_HANDOFF.md, AGENTS.md and ARCADE_REVAMP_PROGRESS.md. Deployment is authorized. Finish any earlier deployment, serve dist/ in existing Sites project appgprj_6adab219a4788191952c4c83432002c5, preserve its URL/access policy and do not create a replacement site. Verify live 6.10.0 and send me the existing URL so I can test Monster Café and Monster Dentist. Milestone 7 remains in progress; pause further development for my trial.
