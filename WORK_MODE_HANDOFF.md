# Work Mode handoff — Milestone 7L

## Deploy v6.20.0 for live testing

Repository **imashleyparks95/touchscreenapp**, branch **revamp/milestone-7l-gladiator**, based on published 7K `0f8af38261eaadc2b39df493e62bc4fda7633120`. Tested app commit **05e3435913a26055060ac3bb4eca2296fc47a945** is published to GitHub and verified against the remote branch. This documentation follow-up has identical runtime and may be pinned by the final deployment request. Earlier milestone branches remain unchanged. Finish earlier deployments before this checkpoint.

Read `AGENTS.md`, `ARCADE_REVAMP_PROGRESS.md` and this file. **7L improves Gladiator Arena; further M7 art/native-input/hardware QA and M8–M10 remain unfinished.** Runtime: `dist/js/gladiator.js`, `gladiator-art.js`, new `arena-polish.js`, scoped `dist/arcade-polish.css`. Authoritative source `dist/`; version **6.20.0**. Evidence: `docs/revamp/M7L_*`. Previous covers, choice-first Doodle, sound library, learning, studios and Zoo/Air changes remain.

## Deploy and verify

Deployment is authorized. Serve **dist/** in existing Sites project **appgprj_6adab219a4788191952c4c83432002c5**. Preserve **https://little-big-arcade-parks.diladiop.chatgpt.site**, access policy, profiles, scores, achievements, learning, local voices/media, zoo layouts, character careers, gear, designs and sound library. Do not create a replacement site or clear browser data. Fetch exact published source and use authenticated Sites source/save/deploy workflow. Git push/build alone is not deployment. Verify success, exact commit and live **6.20.0**, then return the URL. Use normal lobby/Settings update flow; never force an update during active play.

Checks: `npm test` (54 programs completed), final focused `node tests/arena-polish.mjs` and `node tests/quest-controllers.mjs`, `npm run audit:arcade`, `npm run build`, `npm run test:arena:browser`, `npm run test:browser`, `npm run test:library:browser`. Six active + 72 shell + 75 preview audits/eight scenarios. All 119 item comparisons match real stats; actual creator/purchase/re-equip/backup, legal career actions and AI response, help/pause/settings/background handling and two-profile explicit duel handoff checked. Node regressions legally complete all seven tournaments at each career difficulty. No physical touch/controller/audio or complete browser campaign certification. 273 cached files, 175 reachable dependencies, all 98 original asset/vendor hashes retained. No new dependency/service/schema/score edition.

## User trial

- Load an existing career and inspect names, level, gold, gear, wins, training and laurels. Try original character appearance/training, weaponsmith/armorer stock and animated previews. New stat comparisons show actual before/after values; browsing must not change your gear or gold. Buying changes only the selected slot. Equipping an owned item must not charge again. Try level/funds restrictions and charisma discounts.
- Fight: inspect why actions are unavailable, current range/energy/edge cues, original vector icons and floor distance markers. Try all 12 actions, hit chances, guard/rest/taunts, armor damage and ring outs. Expand Action Field Guide & Latest Move for descriptions and the actual last outcome. Combat rules and existing records remain unchanged.
- Try Stone/Dusk arenas through Custom Battle or the original champion tournaments; these now use intended Marble/Sunset palettes. Check engraved armor emblems at different tiers alongside existing equipment/fighter poses.
- Help during an action must pause it and disable actions; closing restores the prior state. Pause → Sound Settings → Done must retain Resume. Background while help/settings is open, return and close it: Resume must still be required. Try exit/cancel and normal victory/reward/report flow.
- Two-player Quick/Best of 3/Best of 5/Custom: balanced copies preserve career gear, alternating turn requires Ready, series rules and records remain. Use touch/mouse/shared controller cursor; no new native analog mapping is claimed. Physical Windows touch, Bluetooth/USB pads, audible original sound and target-PC performance remain user trials.

Stop for the deployed trial. Next proposed work after continuation: **Milestone 8A — Wobbly Wars 3D**. Read `3D_GAME_DEVELOPMENT.md`, inspect the existing rig/weapon/AI/camera/toolkit, preserve illustrated troop/material purchases and the classic edition. Do not treat scoped M7 reviews as complete hardware/art/native-input sign-off.

## Message to paste into Work Mode

Deploy Little Big Arcade Milestone 7L, version 6.20.0, from imashleyparks95/touchscreenapp, branch revamp/milestone-7l-gladiator, tested app commit 05e3435913a26055060ac3bb4eca2296fc47a945 (or its final documentation-only handoff commit). Read WORK_MODE_HANDOFF.md, AGENTS.md and ARCADE_REVAMP_PROGRESS.md. Deployment is authorized. Finish earlier deployments, serve dist/ in existing Sites project appgprj_6adab219a4788191952c4c83432002c5, preserve the existing URL/access policy and family data, and do not create a replacement site. Verify live 6.20.0 and return the URL for my Gladiator Arena trial. Pause further development for my trial.
