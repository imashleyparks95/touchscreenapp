# Work Mode handoff — Milestone 3

## Exact source and authorization

- Repository: `imashleyparks95/touchscreenapp`.
- Branch: `revamp/milestone-3-shared-systems`.
- Tested app checkpoint: **`1035ccf3fc5b30b11cf914f77a5f2e464456461b`**, version **6.5.0**. It has been pushed successfully to GitHub. Later documentation-only commits may record this handoff; verify the requested source rather than silently choosing main.
- **Milestone 3 production deployment is not yet authorized.** The user authorized M3 development while Work Mode handles the separate M2 deployment. Review/prepare a preview where supported; do not publish this checkpoint to production until the user explicitly authorizes it.
- The authorized Milestone 2 deployment remains pinned to **`f3f1764f2744701b47e031f129a7b2f202014d78`** on `revamp/milestone-2-foundation`, version **6.4.0**. That branch is unchanged. Do not silently swap v6.5.0 into an in-progress v6.4.0 deployment.

## Repository map

1. Read `AGENTS.md` and `ARCADE_REVAMP_PROGRESS.md` for requirements, milestone ledger, actual verification, hardware limits and the review/continuation gate.
2. Read `SHARED_ARCADE_SYSTEMS.md` for the new lightweight input/lifetime/menu/music/presentation contracts and actual consumers. `3D_GAME_DEVELOPMENT.md` describes existing shared 3D APIs and additive input/effect changes.
3. `dist/` is authoritative runtime source. `.openai/hosting.json` identifies the existing destination. `build/` is an ignored copy. `package.json` and `dist/js/releases.js` agree on v6.5.0; the service worker caches the five new shared modules.
4. `docs/revamp/README.md` and the `M3_*` reports/screenshots contain real evidence. Read actual scope: CDP touch/controller/visibility fixtures are not physical Windows hardware, and SwiftShader samples are not target-GPU results.
5. `docs/ARCADE_REVAMP_MASTER_PLAN.md` contains future milestones; do not implement M4 or later work during this handoff.

## Checks and deployment destination

Before packaging a preview, use `npm ci`, `npm test`, `npm run audit:arcade`, `npm run build`. Browser commands: `npm run test:browser`, `npm run test:shared:browser`, `npm run test:limit:browser`. Recorded results: 38 regression programs, 72 responsive/accessibility audits, five focused shared browser scenarios, actual Forest solo/co-op/input/benchmark/export/disposal checks, preservation audit and build passed. No models/art assets were replaced in this milestone.

Use the Sites-enabled conversation's Sites skill/authenticated source workflow for an existing-project preview, if supported. Keep the production version unchanged until authorized. A successful GitHub push/build does not prove deployment.

- Existing project: `appgprj_6adab219a4788191952c4c83432002c5`.
- Existing URL: https://little-big-arcade-parks.diladiop.chatgpt.site
- Serve **`dist/`**. Preserve URL, access policy, browser save identities and mandatory game instructions. Never create a replacement site.
- When production deployment is explicitly authorized, synchronize this exact source, confirm the terminal deployment result and verify live **6.5.0** through the normal service-worker update/reload flow. Report actual source/version and URL.

## Suggested review

Try Settings → Decorative particles (Full/Reduced/Off) and reload; original backups without this option must still restore. Check controller menu navigation, disabled choices, two-controller confirmation boundaries and touch-test close/reopen with independent contacts. Check common music mute, hide/return and Beat Lab background suspension. Review Wobbly Wars effects and retained troop purchasing, and Forest LOOK/camera, mixed co-op, disconnect pause, monitor and benchmark exports. Saved scores/profiles/media and all 25 public worlds remain. Actual audible quality, Windows/USB/Bluetooth input, wall-display ergonomics and target GPU remain hardware checks. The user waived M2 manual testing; that is not a physical-device pass.

## Message to paste into Work Mode

Review Little Big Arcade Milestone 3 (v6.5.0) from imashleyparks95/touchscreenapp, branch revamp/milestone-3-shared-systems, commit 1035ccf3fc5b30b11cf914f77a5f2e464456461b. Read WORK_MODE_HANDOFF.md, AGENTS.md, ARCADE_REVAMP_PROGRESS.md and SHARED_ARCADE_SYSTEMS.md. Prepare an existing-project preview if supported, serving dist/ in Sites project appgprj_6adab219a4788191952c4c83432002c5. Preserve the existing production URL/access policy. Do not replace the site or change the separately pinned M2 deployment. Verify preview version 6.5.0; do not deploy M3 to production until I authorize it. Do not begin Milestone 4.

## Maintaining this handoff

At every completed milestone, update this file and the progress document with the tested source commit, branch, version, evidence, publication status, authorization and next steps. Commit the app checkpoint before recording its hash; a later documentation-only commit can carry the handoff. Include a ready-to-paste Work Mode message in the session's final response. Never reuse an earlier milestone's deployment authorization or claim an unpushed commit is on GitHub. Provide a source archive only when publication is blocked.
