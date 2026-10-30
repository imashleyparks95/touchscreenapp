# Work Mode handoff — Milestone 8D

## Deploy v6.24.0 for live testing

Repository **imashleyparks95/touchscreenapp**, branch **revamp/milestone-8d-wars-ai**, based on published 8C `7436ba24e3efa6e44c118fe74927e004489ba40f`. Tested app commit **`a49e5b5a9544c3c4ecc04a28cd24a5f231fbffdd`** is published and verified against the remote branch. This documentation-only follow-up preserves that runtime and may be pinned for deployment. Finish earlier deployments first.

Read AGENTS.md, ARCADE_REVAMP_PROGRESS.md and 3D_GAME_DEVELOPMENT.md. Authoritative source: **dist/**. Entry point: **dist/js/wars3d-core.js**; new regression **tests/wars3d-ai.mjs**; evidence **docs/revamp/M8D_***. Version/release: dist/js/releases.js. M8D fixes attack target consistency, stale stopped/stunned velocity and stale navigation paths, with per-step ID lookup. Models, rigs, weapon contact, purchases, native/mixed-touch controls, saved armies and classic edition remain. Broader Milestone 8 remains unfinished.

## Deploy and verify

Deployment is authorized. Serve **dist/** in existing Sites project **appgprj_6adab219a4788191952c4c83432002c5**. Preserve **https://little-big-arcade-parks.diladiop.chatgpt.site**, access policy and all profiles, scores, achievements, campaigns, armies and local media/sound library. Do not create a replacement site or clear browser data. Fetch the exact published commit; use authenticated Sites deployment workflow. Git push/build alone is not deployment. Verify deployed source and live **6.24.0**, then return the URL. Use normal lobby/Settings update flow; never force an update during play.

## Checks and trial

Final checks: **58 test programs pass**, including all 100 campaign/difficulty solutions and weapon/contact/toolkit regressions; **eight browser audits pass** (four presentation, four native/mixed touch). Audit/build/syntax/diff checks pass; 25 public IDs, 276 cache entries, 178 reachable dependencies and 98 original hashes preserved. See progress and evidence for details. Four legally deployed 96-unit mixed-army simulations check finite terrain-safe actors, projectile/split limits, completion/stalemate and terminal clock. CPU duration is not FPS/GPU performance. Actual Babylon/Havok desktop/phone presentation and native-controller browser checks use fixture inputs; battle layout audits pause legally started battles. Physical Windows/USB/Bluetooth/touch, audible audio and target-PC frame pacing remain trials.

- Try mixed melee/ranged/healer armies. Observe ranged windup aim/release staying with its living target and recovery when the target dies. Check stun/recovery and ordinary damage not interrupting normal attacks.
- Try the maximum 48 troops per side on open/obstacle maps. Check crowd movement, finite ground positions, completion and honest stalemate messages. Compare graphics presets on your PC; do not interpret automated simulation CPU timings as rendering speed.
- Recheck native two-controller and mixed-touch placement, held movement, Ready/start, camera/Inspect/Reset, pause/help/disconnect/background/exit and original illustrated troop prices.
- Check original saves/records, co-op/versus/campaign and classic edition. Keep browser family data.

Stop for deployed user trial. After explicit continuation, proposed **M8E — Wobbly Wars lighting/effects and graphics-quality acceptance review**, retaining AI fixes, rig/contact, purchasing and saves. M8 overall and M7/M9/M10 remain unfinished.

## Message to paste into Work Mode

Deploy Little Big Arcade Milestone 8D, version 6.24.0, from imashleyparks95/touchscreenapp, branch revamp/milestone-8d-wars-ai, tested app commit a49e5b5a9544c3c4ecc04a28cd24a5f231fbffdd (or its final documentation-only handoff commit). Read WORK_MODE_HANDOFF.md, AGENTS.md and ARCADE_REVAMP_PROGRESS.md. Deployment is authorized. Finish earlier deployments, serve dist/ in existing Sites project appgprj_6adab219a4788191952c4c83432002c5, preserve the existing URL/access policy and family data, and do not create a replacement site. Verify live 6.24.0 and return the URL for my trial. Pause further development for my trial.
