# Work Mode handoff — Milestone 8E

## Deploy v6.25.0 for live testing

Repository **imashleyparks95/touchscreenapp**, branch **revamp/milestone-8e-wars-lighting**, based on published 8D `58cfd18d1e3497f45013d0c5f5bae1d6c4701616`. Exact checked publication recorded below. Finish earlier deployments first.

Read AGENTS.md, ARCADE_REVAMP_PROGRESS.md and 3D_GAME_DEVELOPMENT.md. Authoritative source **dist/**. Entry points: **dist/js/wars3d-environment.js** (existing-light biome tints), **dist/js/3d/effects.js** (pooled/live-quality fix), **tests/3d-effects.mjs**, expanded environment/browser tests. Evidence: **docs/revamp/M8E_***. API, models/rigs/weapon contact, AI, purchases, controls, saved armies and classic edition retained. Broader art/hardware acceptance remains unfinished.

## Deploy and verify

Deployment is authorized. Serve **dist/** in existing Sites project **appgprj_6adab219a4788191952c4c83432002c5**. Preserve **https://little-big-arcade-parks.diladiop.chatgpt.site**, access policy, profiles, scores, achievements, campaigns, armies, local media and sound library. Do not create a replacement site or clear browser data. Fetch exact published source and use authenticated Sites deployment workflow. Git push/build alone is not deployment. Verify exact deployed source and live **6.25.0**, then return the URL. Normal lobby/Settings update flow only; never force an update during active play.

## Checks / trial

Final checks: **59 test programs pass**, including toolkit/starter/Forest and all arcade regressions, 100 campaign/difficulty solutions and 630 weapon poses. **Eight browser audits pass**: four presentation/live graphics plus four native/mixed touch. Audit/build/syntax/diff checks pass: 25 public IDs, 276 cache entries, 178 reachable dependencies and 98 original hashes preserved. Logs/JSON/screenshots are in docs/revamp/M8E_*. Independent real Babylon effects checks cover reused spark scale, live quality/reduced/off caps while paused, callbacks and bounded lifecycle. Ten actual map scenes check existing two-light tint and unchanged terrain/collision plus software-renderer contrast. Browser presentation/native suites use actual Babylon/Havok with fixture inputs; physical Windows/pads/touch/audio/target GPU are user trials.

- Compare grassy, snowy and volcanic maps: readable troops/ground, restrained lighting, unchanged team contrast and ordinary weapon alignment. Software compatibility may retain material-only shading; tint is chiefly a WebGL change.
- During combat pause and change High/Medium/Low. Check resolution/shadows, then resume: troop positions/clock must stay paused until Resume. Existing lower-quality controls remain.
- In arcade Settings try effects Full/Reduced/Off and reduced motion. Active sparks should obey the choice even while paused; repeated impacts should not start as tiny dots from previous pool use. Audible audio remains governed by its own volume/mute settings.
- Recheck native two-controller/mixed touch, Ready/start, pause/help/disconnect/background/exit, Inspect/Reset, illustrated purchases, original saved armies/records, co-op/versus/campaign and classic. Keep family browser data.

Stop for deployed user trial. Next proposed batch after explicit continuation: **M9A — multiplayer/replayability audit and first fixes**. Broader M7/M8 acceptance, M9 and M10 remain unfinished; no physical hardware/FPS claim.
