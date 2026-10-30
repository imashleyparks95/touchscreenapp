# Work Mode handoff — Milestone 7E

## Deploy v6.13.0 for live testing

Repository **imashleyparks95/touchscreenapp**, branch **revamp/milestone-7e-creative-music**, based on published 7D `05de7bb4f669f8782432d15f6c166d3d91c985e2`. Tested app commit **APP_COMMIT_PENDING**; publication status will be recorded after push. Previous deployment branches remain unchanged. Deployment is authorized; finish earlier deployments before deploying this checkpoint.

Read `AGENTS.md`, `ARCADE_REVAMP_PROGRESS.md` and this file. **7E improves Creative Studio/Beat Lab; Milestone 7 remains in progress.** New sound library: 80 original offline sounds, individual assignment and saved mic samples shared across profiles **on the same device**, per user clarification. There is no online publishing/database requirement. All 25 refreshed public covers remain.

Runtime entry points: `dist/js/studio.js`, `beat.js`, `creative-guide.js`, `sequence-input.js`, `sound-library.js`, `shared-sounds.js`, additive sound validation in `data.js`, scoped `dist/arcade-polish.css`. `dist/` is authoritative. Package/release/cache agree on **6.13.0**. Evidence: `docs/revamp/M7E_*`.

## Deploy and verify

Serve **dist/** in existing Sites project **appgprj_6adab219a4788191952c4c83432002c5**. Preserve **https://little-big-arcade-parks.diladiop.chatgpt.site**, access policy, profiles/scores/media, shared local sounds and saved projects. Do not create a replacement site or clear browser data. Fetch the exact published Git commit and use authenticated Sites source/save/deploy workflow. Git push/build alone is not deployment. Verify success, exact commit and live **6.13.0**, then return the existing URL. Use normal lobby/Settings update flow; never force an update under an active game.

Checks: `npm test` (47 programs), `npm run audit:arcade`, `npm run build`, `npm run test:creative:browser`, `npm run test:browser`, `npm run test:library:browser`. Four active desktop/phone + 72 shell + 75 preview audits, eight library scenarios; actual saved art/music/shared-sound backup, production touch painting and generated-device microphone roundtrip across two profiles. No physical hardware/audio-latency certification. 266 cache entries, 168 reachable dependencies, all 98 original imported asset/vendor hashes and hosting/save identities retained. No added dependency or remote service.

## User trial

- Creative Studio: optional drawing ideas, each artist's tool hints, simultaneous crossing strokes, background/return, undo, save/reopen, stickers/photo layers and export. Prompts do not mark or modify saved art.
- Beat Lab: search 80 sounds, filter melodic/effect/kit groups, preview and USE a different sound on each selected track or pad. Existing imported sounds/banks remain. Paint steps with touch/mouse/controller cursors; Enter/Space toggles focused steps; use numbered ruler/gaps to scroll. Check pattern note/track totals, 16/32 steps, presets, pause and arrangement. On phones, the full-width sound shelf stacks below the sequencer.
- RECORD AUDIO → explicitly enable mic → record/stop → trim → SAVE SAMPLE TO TRACK → name it → ADD SELECTED TRACK SOUND TO SHARED LIBRARY → name the library item. Every profile in this browser/device can then choose Shared on this device, preview and USE it. The same save action is available on the sound shelf for the selected track's trimmed sound. Refresh loads sounds saved in another window. Nothing uploads online.
- Switch profile and reuse the recorded sound, save/reopen a music project, export real MP3, back up and restore in a separate test browser. Existing banks/projects embed their own used PCM. Try actual mic quality, speakers/latency, USB multitouch and controller cursor feel; automated tests use a generated mic device and CDP touch.

Stop for the user's deployed trial. Next proposed development after continuation is **7F — Gravity Chaos/Build & Smash**, preserving saved structures and all modes/records. Do not declare Milestone 7 complete.

## Message to paste into Work Mode

Deploy Little Big Arcade Milestone 7E, version 6.13.0, from imashleyparks95/touchscreenapp, branch revamp/milestone-7e-creative-music, commit APP_COMMIT_PENDING. Read WORK_MODE_HANDOFF.md, AGENTS.md and ARCADE_REVAMP_PROGRESS.md. Deployment is authorized. Finish earlier deployments, serve dist/ in existing Sites project appgprj_6adab219a4788191952c4c83432002c5, preserve the existing URL/access policy and family data, and do not create a replacement site. Verify live 6.13.0 and return the existing URL so I can test Creative Studio and Beat Lab's 80-sound library, per-track choices and mic sounds shared across profiles on this device. Pause further development for my trial.
