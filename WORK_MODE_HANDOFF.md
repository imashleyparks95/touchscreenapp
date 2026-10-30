# Work Mode handoff — Milestone 7J

## Deploy v6.18.0 for live testing

Repository **imashleyparks95/touchscreenapp**, branch **revamp/milestone-7j-media-studios**, based on published 7I `590aec7a29591f150d6cf3e29fcad5db81e59e3d`. Tested app commit **9fa1c53f64e9f5b579660928c6edf9eee499b485**; published to GitHub and verified against the remote branch. This documentation-only follow-up has the same runtime; the final handoff may pin its commit instead. Earlier deployment branches remain unchanged. Deployment is authorized; finish earlier deployments before deploying this checkpoint.

Read `AGENTS.md`, `ARCADE_REVAMP_PROGRESS.md` and this file. **7J improves Funny Face Studio / Monster Me!; Milestone 7 remains in progress.** User specifically requested more filters and monster customization. Runtime: `dist/js/media-core.js`, `media-art.js`, `media-studio.js`, `media-polish.js`, additive monster validation in `data.js`, scoped `dist/arcade-polish.css`. Authoritative source `dist/`; version **6.18.0**. Evidence: `docs/revamp/M7J_*`. All covers, shared local sounds, choice-first Doodle and previous changes remain.

## Deploy and verify

Serve **dist/** in existing Sites project **appgprj_6adab219a4788191952c4c83432002c5**. Preserve **https://little-big-arcade-parks.diladiop.chatgpt.site**, access policy, profiles/scores/learning, media/voices/monsters, designs and sound library. Do not create a replacement site or clear browser data. Fetch exact published source and use authenticated Sites source/save/deploy workflow. Git push/build alone is not deployment. Verify success, exact commit and live **6.18.0**, then return the existing URL. Use normal lobby/Settings update flow; never force an update under an active game.

Checks: `npm test` (52 programs), `npm run audit:arcade`, `npm run build`, `npm run test:media:browser`, `npm run test:browser`, `npm run test:library:browser`. Four active + 72 shell + 75 preview audits. All 26 non-original mesh distortions change geometry with preserved UVs. All new character details visibly render; old/new design backups pass. Actual local photo/filter/save/crop-cancel and monster save/reopen/backup with zero device requests. No physical camera/face tracking/mic/codec certification. 271 cached files, 173 reachable dependencies, all 98 original asset/vendor hashes retained. No new dependency/service or score change.

## User trial

- Funny Face: try new Button Nose, Cheek Puff, Pointy Chin, High Brows, Comic Grin, Tilted Smile, Wavy Mirror and Pinch Face. There are 27 choices total. Try up to three filters, intensity, random/roulette and saved presets with a real live face or imported photo. Camera/mic must stay off until explicitly enabled. Test physical tracking separately; automated test imagery is not tracked-face evidence.
- Import a photo/video, crop normally, cancel a crop, change tools during drawing/layer drags, undo/redo, capture/save/export and reopen. Canceled crops must not apply. Existing multi-touch layer transforms and video workflows remain.
- Monster: customize ACCENT, PATTERN, CHEEKS and BADGE alongside the existing 19 fields. Accent changes the new decorations. Save, reopen from My Gallery, use as a Funny Face lens, export and back up. Earlier 19-field monsters should look unchanged. Test explicit camera animation/calibration and microphone voice recording/attachments with real devices; preview pose buttons remain labeled previews and do not replace tracked challenge input.
- Check device stop/background/exit, two-person/alternating challenges, local media/voices and original profiles/records. No online uploads or synthetic tracking were added.

Stop for the user's deployed trial. Next proposed development after continuation: **7K — My Noisy Zoo / Air Slice**, preserving voices/animals/layout and real hand-only tracking. Other game-ledger and M8–M10 work remains.

## Message to paste into Work Mode

Deploy Little Big Arcade Milestone 7J, version 6.18.0, from imashleyparks95/touchscreenapp, branch revamp/milestone-7j-media-studios, commit 9fa1c53f64e9f5b579660928c6edf9eee499b485. Read WORK_MODE_HANDOFF.md, AGENTS.md and ARCADE_REVAMP_PROGRESS.md. Deployment is authorized. Finish earlier deployments, serve dist/ in existing Sites project appgprj_6adab219a4788191952c4c83432002c5, preserve the existing URL/access policy and family data, and do not create a replacement site. Verify live 6.18.0 and return the URL for my trial of the eight new face filters, expanded monster customization and media editing. Pause further development for my trial.
