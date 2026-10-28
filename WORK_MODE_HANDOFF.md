# Work Mode handoff — Milestone 2

## Source to review

- Repository: `imashleyparks95/touchscreenapp`.
- Branch: `revamp/milestone-2-foundation`.
- Tested app checkpoint: `e64a460b4d39f24569b2b407f4a096109c63a866`, version **6.4.0**. Later commits only document authorization/handoff; do not substitute the older Milestone 1 or main branch runtime.
- Publication: checkpoint is committed locally, **not pushed**. Environment GitHub authentication is unavailable. If the exact commit cannot be fetched, request the supplied `Little-Big-Arcade-Milestone-2-source.zip` archive; its `CHECKPOINT.txt` identifies this commit. Do not silently deploy an older revision.

## Repository map

1. Read `AGENTS.md` and `ARCADE_REVAMP_PROGRESS.md` for rules, actual completion, limitations and user trial gate.
2. Read this file and README's deployment section for the existing destination and source workflow.
3. `dist/` is authoritative runtime source; `.openai/hosting.json` identifies the existing project. `build/` is an ignored build copy. `package.json` and `dist/js/releases.js` identify version 6.4.0.
4. `docs/revamp/README.md`, `M2_FOREST_BROWSER.json`, `M2_STATIC_AUDIT.json`, `M2_LIBRARY.png` and `M2_FOREST.png` contain actual evidence.
5. `docs/ARCADE_REVAMP_MASTER_PLAN.md` is the complete future specification. It is not an instruction to implement later milestones during deployment.

## Deployment

The user explicitly authorized deploying this Milestone 2 checkpoint before testing. Use the Sites-enabled conversation's Sites skill and authenticated source workflow. Import the exact checkpoint, run `npm ci`, `npm test`, `npm run audit:arcade` and `npm run build`. Prior checkpoint verification also passed 72 shell browser checks and the native Forest browser check; rerun browser checks when the environment supports them. No code redesign is requested.

- Existing project: `appgprj_6adab219a4788191952c4c83432002c5`.
- Existing URL: https://little-big-arcade-parks.diladiop.chatgpt.site
- Serve **`dist/`**. Preserve the URL, access policy and browser save identities. Do not create a replacement site.
- Confirm successful deployment and live **6.4.0**, including the normal service-worker update/reload path. A GitHub push alone is not deployment. Report actual deployed source/version and live verification; do not claim success from a build alone.

## User trial after deployment

Check the darker library and profile themes. Open Project Limit Break and try Settings → Controls & Camera: sensitivity, deadzone, invert-Y, Auto/Show/Hide and SHOW TOUCH recovery. Try movement/look/actions together, solo and mixed controller/touch co-op, pause/reconnect, MONITOR/map placement, benchmark JSON/CSV exports and BACK TO ARCADE. Verify saved data survives reload. Physical Windows touch/controller and target GPU performance remain user checks; automated fixtures do not certify them.

Stop for user feedback before Milestone 3. Deployment authorization applies to this checkpoint only.

## Message to paste into Work Mode

Deploy Little Big Arcade Milestone 2 (v6.4.0) for my trial. Repository: imashleyparks95/touchscreenapp; branch: revamp/milestone-2-foundation; tested checkpoint: e64a460b4d39f24569b2b407f4a096109c63a866. Read WORK_MODE_HANDOFF.md, AGENTS.md and ARCADE_REVAMP_PROGRESS.md first. The checkpoint has not been pushed because Codex GitHub authentication is blocked; use the attached Little-Big-Arcade-Milestone-2-source.zip if the commit is unavailable, and verify CHECKPOINT.txt. Deploy dist/ to existing Sites project appgprj_6adab219a4788191952c4c83432002c5, preserving its URL and access policy. Deployment is authorized. Verify live version 6.4.0, report the live URL, and stop for my testing. Do not create a replacement site or start Milestone 3.

## Maintaining this handoff

At each completed milestone, update this file and the progress document with the exact tested source commit, version, branch, evidence, publication status and trial steps. Commit the app checkpoint before recording its hash; a later documentation-only commit can carry the handoff. Provide the message in the session's final response. For future milestones without deployment authorization, change the message to request review/preview and await explicit deployment authorization. Never reuse an old milestone's authorization.
