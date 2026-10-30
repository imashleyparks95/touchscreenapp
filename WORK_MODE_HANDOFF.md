# Work Mode handoff — Milestone 7K

## Deploy v6.19.0 for live testing

Repository **imashleyparks95/touchscreenapp**, branch **revamp/milestone-7k-zoo-air**, based on published 7J `a25c0b2bf2f4bd6842f13e4fdcd2b56c585a8356`. Tested app commit **7cdd78cd9c751392e10d13327f43500902df4a0c**. App source is published to GitHub; remote branch verified. The documentation follow-up has the same runtime and may be pinned by the final handoff. Finish earlier deployments before this checkpoint.

Read `AGENTS.md`, `ARCADE_REVAMP_PROGRESS.md` and this file. **7K improves My Noisy Zoo / Air Slice; Milestone 7 remains in progress.** Runtime entry points: `dist/js/noisy-zoo.js`, `air-slice.js`, `air-slice-render.js`, new `zoo-air-polish.js`, scoped `dist/arcade-polish.css`. Authoritative source `dist/`; version **6.19.0**. Evidence: `docs/revamp/M7K_*`. Previous covers, sound library, choice-first Doodle, learning games and 27-filter/23-field media studios remain.

## Deploy and verify

Deployment is authorized. Serve **dist/** in existing Sites project **appgprj_6adab219a4788191952c4c83432002c5**. Preserve **https://little-big-arcade-parks.diladiop.chatgpt.site**, access policy, profiles, scores, achievements, learning, local voices/media, zoo animals/layouts, designs and sound library. Do not create a replacement site or clear browser data. Fetch the exact published source and use authenticated Sites source/save/deploy workflow. Git push/build alone is not deployment. Verify success, exact commit and live **6.19.0**, then return the URL. Use the normal lobby/Settings update flow; never force an update under active gameplay.

Checks: `npm test` (53 programs completed), final focused `node tests/zoo-air-polish.mjs` and `node tests/media-expansion.mjs` after late-audio refinements, `npm run audit:arcade`, `npm run build`, `npm run test:zoo-air:browser`, `npm run test:browser`, `npm run test:library:browser`. Four active + 72 shell + 75 preview audits/eight scenarios. Actual Zoo cancel/pause/save/backup/background-dialog closure and legal Air touch slice/pause; zero device requests in these flows. No physical camera/mic/audio/controller certification. 272 cached files, 174 reachable dependencies, all 98 original asset/vendor hashes retained. No new dependency/service or score edition.

## User trial

- Zoo: existing personal/family/Creative zoo loads unchanged. Try the new care/build cues, tap an animal, rename, record a real voice explicitly, feed/pet/play, adoption and upgrades. Voices remain local. Try choir, guessing, rhythm and talent show with actual saved recordings. Check family attribution.
- Build: drag a habitat/decoration and cancel via pause, help or tool change. Canceled drags must not commit. Tap-to-purchase still places immediately on pointer down. Try legal placement/undo/redo, pinch zoom, lift one finger and continue panning, FIT and phone scrolling. Backgrounding closes an active activity/voice dialog and stops its audio/mic; Resume returns to the zoo.
- Air: try all four modes; guide explains current input/team rules. Real webcam remains explicitly enabled, calibration requires arms, only tracked moving hands score. Try two-person identity, fast moves, temporary loss/recovery and optional cutout stability/toggle with real hardware. Touch fingers keep initial color across the screen. Mouse versus uses matching seeded turns; mouse co-op uses the teammate buttons. Try pause/help, restart, finish, exit and retained separate records.
- Shared controller cursor remains; no new native analog mappings are claimed. Physical touchscreen, Windows USB/Bluetooth pads, webcams/mic, audio/codec quality and target-PC performance still need trial.

Stop for the deployed user trial. Next proposed batch after continuation: **7L — Gladiator Arena**, reviewing battle feedback, equipment/hero art and turns while retaining tactics, purchases, tournaments and scores. Remaining game-ledger/hardware work plus M8–M10 are unfinished.

## Message to paste into Work Mode

Deploy Little Big Arcade Milestone 7K, version 6.19.0, from imashleyparks95/touchscreenapp, branch revamp/milestone-7k-zoo-air, commit 7cdd78cd9c751392e10d13327f43500902df4a0c. Read WORK_MODE_HANDOFF.md, AGENTS.md and ARCADE_REVAMP_PROGRESS.md. Deployment is authorized. Finish earlier deployments, serve dist/ in existing Sites project appgprj_6adab219a4788191952c4c83432002c5, preserve the existing URL/access policy and family data, and do not create a replacement site. Verify live 6.19.0 and return the URL for my Zoo/Air Slice trial. Pause further development for my trial.
