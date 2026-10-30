# Work Mode handoff — Milestone 9C

## Deploy v6.28.0 for live testing

Repository **imashleyparks95/touchscreenapp**, branch **revamp/milestone-9c-beat-sessions**, based on published 9B `9a176ed2f5716c90c02d06a6aade44765d7ce0bb`. Exact checked publication recorded below. Finish earlier deployments first.

Read AGENTS.md and ARCADE_REVAMP_PROGRESS.md. Authoritative **dist/**. Entry point **dist/js/beat.js** startup/session preservation; **tests/beat-sessions.mjs** and expanded **tests/creative-browser.mjs**; evidence **docs/revamp/M9C_***. Existing projects/sounds/creative rules and competition comparators remain. No new service/store/schema/score edition. M9 remains in progress.

## Deploy and verify

Deployment is authorized. Serve **dist/** in existing Sites project **appgprj_6adab219a4788191952c4c83432002c5**. Preserve **https://little-big-arcade-parks.diladiop.chatgpt.site**, access policy, profiles, scores, achievements, campaigns, armies and all local media/sound library. Do not create a replacement site or clear browser data. Fetch exact published source and use authenticated Sites workflow. Git push/build alone is not deployment. Verify deployed source and live **6.28.0**, return URL. Normal lobby/Settings update flow; no forced update during active play.

## Checks / trial

Final checks: **61 test programs**, final focused startup checks and **four creative browser audits pass**, including actual original-project preservation. Audit/build/syntax/diff checks pass; 25 public IDs, 276 cache entries, 178 reachable dependencies, 98 original hashes retained. Logs/JSON/screenshots in docs/revamp/M9C_*. Actual startup-handler fixtures cover preservation, failed storage, busy guards, duplicate start, disposed late completion and later audio failure. Expanded creative browser checks real named project preservation, recovery draft gallery, short two-player battle and separate named save, original drawing/microphone/shared library and backup paths. Browser uses generated microphone/CDP touch/controller fixtures; audible audio, physical hardware and natural-time full takes remain user trials.

- Open a nonempty named music project, make an edit, switch to Pads and start Beat Battle. In Projects afterward, **Before Beat Battle · [name]** should contain the pre-battle edits. The original named project remains intact. Recovery drafts have unique IDs and remain until explicitly deleted in Projects.
- Finish both takes using the Ready handoff. Listen/save takes normally; save studio battle work under a new name. It must not overwrite the loaded original. Existing same-kit/BPM rules and audience choice remain; no automatic music score.
- Try starting while recording/exporting or with an unsaved mic sample: finish/save that operation first. If local storage is full, battle must refuse to clear the studio. Don't clear family data to simulate this on the live device.
- Recheck both players' sound-library access, Projects reload, microphone and backup/export, creative drawing/collaboration and original challenge rematches.

Stop for deployed trial. After explicit continuation, proposed **M9D — remaining multiplayer/replay acceptance review and prioritized fixes**. Broader M9, M7/M8 art/hardware acceptance and M10 remain unfinished.
