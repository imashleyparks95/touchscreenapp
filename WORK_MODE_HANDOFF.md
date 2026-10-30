# Work Mode handoff — Milestone 9A

## Deploy v6.26.0 for live testing

Repository **imashleyparks95/touchscreenapp**, branch **revamp/milestone-9a-match-records**, based on published 8E `6d444eaddad7d7f3a9e06478c59851832560822f`. Exact checked publication recorded below. Finish earlier deployments first.

Read AGENTS.md, ARCADE_REVAMP_PROGRESS.md and docs/revamp/M9A_MULTIPLAYER_AUDIT.md. Authoritative **dist/**. Entry points: **dist/js/data.js** shared ranked preflight/unranked identity, **dist/js/refined.js** alternating rematch copy; **tests/match-records.mjs** and expanded **tests/care-browser.mjs**. Evidence **docs/revamp/M9A_***. Existing game rules, multiplayer/input, art/models and persistence retained. M9 is in progress.

## Deploy and verify

Deployment is authorized. Serve **dist/** in existing Sites project **appgprj_6adab219a4788191952c4c83432002c5**. Preserve **https://little-big-arcade-parks.diladiop.chatgpt.site**, access policy, profiles, scores, achievements, campaigns, armies and all local media/sound library. Do not create a replacement site or clear browser data. Fetch exact published source and use authenticated Sites deployment workflow. Git push/build alone is not deployment. Verify deployed source and live **6.26.0**, return URL. Normal lobby/Settings update flow; no forced update during active play.

## Checks / trial

Final checks: **60 test programs and 76 browser audits pass** (four care + 72 shell); audit/build/syntax/diff checks pass. 25 public IDs, 276 cache entries, 178 reachable dependencies and 98 original hashes retained. See progress/evidence. Recorder checks use isolated profile/storage fixtures; real-host regressions cover equal fresh turns, sudden death, rotated first player, explicit winner and exactly-once completion. Four care browser audits use accelerated-clock fixtures plus real touch/tool input; 72 shell audits retain offline/navigation/controller checks. Physical hardware and natural-time full playthroughs remain trials.

- Finish versus café and penalty matches with two distinct profiles. Results should name the next starter; rematch should actually start with that player, keep settings and provide fresh challenges. Check tie/sudden-death behavior and original controls.
- Finish/tie/rematch other versus games; check each profile and pair rivalry records once per completed match. Incomplete exits must not add a match.
- Complete co-op Wobbly/Spelling/Math/Air sessions; partners keep existing individual records without adding head-to-head rivalry. Old achievements and scores remain.
- Try unranked practice: no new competitive records/points; original feedback and player identity remain. Keep family browser data and test normal backup/export.

Stop for deployed trial. After explicit continuation, proposed **M9B — learning/co-op progression and replay choices review**. Broader M9, remaining M7/M8 acceptance and M10 remain unfinished.
