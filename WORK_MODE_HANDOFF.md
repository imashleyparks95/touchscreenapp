# Work Mode handoff — Milestone 5

## Deploy the four-area expedition for live testing

The user explicitly requested M5 and has standing authorization for deployment of completed verified milestones to the existing site, then live testing. App version: **6.7.0**. Repository: **`imashleyparks95/touchscreenapp`**. Branch: **`revamp/milestone-5-expedition`**. The exact tested source/publication is recorded in the session's final handoff after committing. Use that exact commit, not main or the older deployment branch.

M4's `revamp/milestone-4-launcher` and earlier deployment branches are unchanged. Finish any earlier in-progress deployment before deliberately publishing M5; avoid racing production versions.

## Start in the repository

1. Read `AGENTS.md`, `ARCADE_REVAMP_PROGRESS.md`, and this file for current authorization, completion, tests/limits and next steps.
2. Read `3D_GAME_DEVELOPMENT.md` → Connected expedition — 6.7.0 for model/scene/input/records/lifecycle contracts and what remains M6.
3. `dist/` is authoritative. M5 code lives in `dist/js/limit/journey-worlds.js`, `journey.js`, `journey-scene.js`, `adventure-actors.js`, and the existing core/UI/scene/records. The original Forest defaults and formal baseline are retained. `package.json` and `dist/js/releases.js` identify **6.7.0**; all four new runtime modules are precached.
4. `docs/revamp/README.md` and `M5_*` logs/reports/screenshots show actual verification. `M5_ASSET_PROVENANCE.md` identifies reuse/original geometry. Original asset/vendor/provenance/hosting files remain unchanged.
5. The full master plan remains `docs/ARCADE_REVAMP_MASTER_PLAN.md`. M6's controlled multi-zone benchmark is still future work; do not reinterpret interactive snapshots as formal results or implement the next milestone during deployment.

## Existing destination and deployment

- Existing project: **`appgprj_6adab219a4788191952c4c83432002c5`**.
- Existing URL: **https://little-big-arcade-parks.diladiop.chatgpt.site**.
- Serve **`dist/`**, preserve current URL, access policy, profiles/scores/media storage identities and instruction gates. Do not create a replacement site or clear browser data.
- Use the Sites-enabled conversation's authenticated Sites skill/source workflow: fetch the exact reviewed Git commit, synchronize/save its matching source version and deploy. Git push/build alone is not deployment.
- Run `npm ci`, `npm test`, `npm run audit:arcade`, `npm run build`. Browser checks when supported: `npm run test:browser`, `npm run test:library:browser`, `npm run test:limit:browser`, `npm run test:expedition:browser`.
- Recorded verification: **41** regression programs; legal complete solo/co-op four-area simulations; actual Babylon/Havok new areas, boss weapon alignment and repeated reset cleanup; UI persistence/hidden-start/cancel fixtures; **72 + 75** responsive/accessibility audits; **8** library scenarios; **7** real expedition browser scenarios; original Forest browser/baseline; preservation audit and build. Forced objective state in browser/UI fixtures is solely for transition coverage; legal routes are independently tested. No physical Windows/GPU pass is claimed.
- Confirm terminal deployment success and actual live **6.7.0**. Verify the normal service-worker update/reload flow from the lobby/Settings; do not force updates under an active game. Report deployed commit, live version and existing URL.

## What to try once deployed

Open **Project Limit Break → FULL EXPEDITION → one/two explorers → Begin**. Finish Forest objectives, Continue into Castle, open the side chamber doors with Interact, recover both seals and reach the keep exit together. Face the Arena's Crown Warden and arcanists, then stabilize both Chamber reactors and return home. Confirm old Forest mode and baseline remain separate choices.

Try Chamber Load in small increments, turn on Monitor, capture/export measured windows and Reset Load Now. Use Settings for distance/resolution/effects. Optional test enemies never lock the objective gate. Check native controllers/touch/mixed co-op, doorway camera behavior, pause/disconnect/focus handling and scene transitions. Unfinished expeditions restart from Forest; only whole completions save the new edition. Adventure Records separates expedition/old Forest editions and solo/co-op; benchmark history is separate. Check existing family data remains and export a backup before changing browser/origin.

## Message to paste into Work Mode

Deploy Little Big Arcade Milestone 5, version 6.7.0, from imashleyparks95/touchscreenapp, branch revamp/milestone-5-expedition, using the exact commit in my handoff message. Read WORK_MODE_HANDOFF.md, AGENTS.md, ARCADE_REVAMP_PROGRESS.md and 3D_GAME_DEVELOPMENT.md first. Deployment is authorized. Serve dist/ in existing Sites project appgprj_6adab219a4788191952c4c83432002c5, preserving its current URL and access policy. Do not create a replacement site. Finish any earlier deployment, deploy this checkpoint, verify live version 6.7.0 and send me the URL so I can test Full Expedition. Stop before Milestone 6.

## Maintaining this handoff

At each milestone, record tested source/version/branch, actual checks/limits, publication and deployment directions. Give the user a direct Work Mode deployment message under standing authorization, then stop for testing/continuation unless another milestone is explicitly requested. Never claim a local commit is published or that local build/test output proves the site is deployed.
