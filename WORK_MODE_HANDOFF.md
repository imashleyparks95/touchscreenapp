# Work Mode handoff — Milestone 4

## Deploy this checkpoint for live testing

The user explicitly instructed that completed milestones should be deployed to the existing site, then tested live. Milestone 4 is ready as **v6.6.0** in `imashleyparks95/touchscreenapp`, branch **`revamp/milestone-4-launcher`**. The tested app checkpoint **`46f2fd89334f14128d8974f349c2558cd87e5ee2`** has been pushed to GitHub. Later handoff commits change documentation only; the runtime is identical. Deploy the exact commit supplied in the user’s message. Do not accidentally deploy main or an older milestone.

The M3 deployment branch `revamp/milestone-3-shared-systems` is unchanged. Once any in-progress earlier deployment finishes, deploy this newer M4 checkpoint deliberately; avoid racing two production deployments.

## Repository directions

1. Read `AGENTS.md`, `ARCADE_REVAMP_PROGRESS.md` and this file for current instructions, completed work, tests and next steps.
2. Read `SHARED_ARCADE_SYSTEMS.md` → Launcher library for capability metadata, profile-local persistence, preview behavior and limits.
3. `dist/` is authoritative. `dist/js/library.js`, the launcher functions in `dist/js/shell.js`, and `dist/library.css` implement M4. `package.json` and `dist/js/releases.js` identify **6.6.0**. `.openai/hosting.json` identifies the existing project. `build/` is an ignored static copy, not the configured serving directory.
4. `docs/revamp/README.md`, `M4_*` JSON reports and screenshots contain actual verification. `docs/ARCADE_REVAMP_MASTER_PLAN.md` remains the full future specification; do not start M5 during a deployment handoff.

## Existing destination and release procedure

- Project: **`appgprj_6adab219a4788191952c4c83432002c5`**.
- URL: **https://little-big-arcade-parks.diladiop.chatgpt.site**.
- Serve **`dist/`**, preserve existing URL/access policy and browser save identities. Do not create a replacement site.
- Use Work Mode's authenticated Sites skill/source workflow to fetch the exact requested commit, synchronize/save its matching source version and deploy it. GitHub pushes and builds alone do not publish the site.
- Run `npm ci`, `npm test`, `npm run audit:arcade`, `npm run build` before packaging. Browser checks where supported: `npm run test:browser`, `npm run test:library:browser`, `npm run test:shared:browser`.
- Recorded checks passed: **39** regression programs, **72** shell/game-entry plus **75** preview layout/accessibility audits, **8** library scenarios, **5** shared-system scenarios, static preservation audit and build. No unrelated runtime dependencies or original asset/vendor changes.
- Confirm successful terminal deployment and live **6.6.0** through the normal service-worker update/reload flow. Report deployed commit, live version and URL. Do not force-update an active game or clear user data to refresh a stale cache.

## What the user will try live

Dark welcome/profile strip; manual spotlight selection; personal favorites and recently opened shelves; search, filters, sorting and all game previews. Try switching profiles, touch hearts, controller favorite/preview actions, opening from a preview, closing/focus return and an offline reload after caching. Check records/profiles/creations remain. Capture activities still need real camera/microphone/speakers; freehand activities retain touch/mouse guidance. Native Forest controls are distinct from controller cursor support. Physical wall-display/Windows/Bluetooth reliability remains unverified locally.

## Message to paste into Work Mode

Deploy Little Big Arcade Milestone 4, version 6.6.0, from imashleyparks95/touchscreenapp, branch revamp/milestone-4-launcher, commit 46f2fd89334f14128d8974f349c2558cd87e5ee2. Read WORK_MODE_HANDOFF.md, AGENTS.md, ARCADE_REVAMP_PROGRESS.md and SHARED_ARCADE_SYSTEMS.md first. Deployment is authorized. Serve dist/ in existing Sites project appgprj_6adab219a4788191952c4c83432002c5, preserving its current URL and access policy. Do not create a replacement site. Finish any earlier deployment first, deploy this checkpoint, verify live version 6.6.0 and send me the URL so I can test. Stop before Milestone 5.

## Maintaining this handoff

Update this file and progress after each milestone with exact source commit, branch, version, tests, publication status and live trial steps. Include a direct deployment request in the final message under the user's standing authorization. Never claim a local-only commit is on GitHub or a build is deployed. Pause for feedback/continuation before another milestone unless the user explicitly authorizes it.
