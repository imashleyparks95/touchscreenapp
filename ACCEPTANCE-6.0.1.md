# Little Big Arcade 6.0.1 — original Wobbly Wars purchasing restoration

Date: 2026-10-26

## Recovered reference and scope

The pre-3D implementation was recovered from Git commit `fedbb1e2dc44a1b1cc9a0b48370d784009ef0d8f`, specifically `dist/js/premium.js::tools()` and the `.premium-tools`, `.premium-tool` and `.premium-part-art` rules in `dist/style.css`. Other available historical revisions (`ea18344`, `64a4ae6`, `e85809d`, `d912168`) were inspected for purchasing controls.

The original interface is a horizontally swipeable illustrated troop-card row: original unit art, names, coin prices, purple selected card, budget/unit indicators, and select-card-then-tap-deployment workflow. These controls now connect to the existing 3D placement/purchase implementation. The 3D purchasing dropdown and proxy drag button have been removed. Each player has a separate roster in multiplayer; the existing alternating/simultaneous input rules remain authoritative.

Every recovered version restricts material purchasing to Castle Creator (`game === 'castle'`). Wobbly Wars has no material inventory or material purchases to restore. No fictional material system was added, and Castle Creator was not changed.

## Exact completion requirements and evidence

| Requirement | Evidence / result |
| --- | --- |
| Recover the original instead of inventing a replacement | Git reference above compared with the restored card markup, art helper, ordering, widths, palette, prices and selected state. The preserved classic implementation remains unchanged. |
| Every original troop remains purchasable | All 21 original unit definitions/cards verified by actual-controller tests; 133 valid card-to-3D purchases across campaign, challenge, endless, random, sandbox, versus and co-op. Faction/challenge restrictions still apply. |
| Correct resources and deployment | Selecting a card costs nothing. Valid world placement deducts the unit's actual cost exactly once; invalid/unaffordable placements are rejected. Actual browser: Hammer Giant 330 coins changes 370 to 40; removal returns 370. |
| Immediate, understandable availability | Tests cover insufficient funds, unit cap, pause, ready armies, challenge restrictions and waiting deployment turns. Refunds immediately re-enable cards without rebuilding/resetting the roster. |
| Mouse and touch-oriented controls | Browser mouse card selection and world placement passed. Pointer-handler tests cover vertical card drag deployment and independent player ownership. Native horizontal roster scrolling is retained. Physical Windows USB multitouch remains unverified. |
| Single player and both multiplayer layouts | Automated purchases cover all solo modes, versus and co-op, including simultaneous owner budgets and alternating deployment. Browser versus: Player 1 buys giant for 330/800, Player 2 buys club for 60/800; ready/turn locks remain independent. |
| Preserve the improved 3D game | No changes to `wars3d-core.js`, scene/rig modules, models, physics, AI, weapons or shared toolkit. Browser purchased units appear in the 3D battlefield and start animated combat. Independent toolkit and combat regression suites pass. |
| Fit the screen | Browser at 1363 × 936: page scroll width equals viewport width (1363); both 618px multiplayer rosters contain 21 cards each and scroll within their own boundaries. All 21 cards remain reachable without whole-page horizontal scrolling. Compact height rules retain a usable battlefield. Other resolutions/physical fullscreen need device verification. |
| Preserve unrelated games and data | Full 23-suite `npm test` passed, including classic games, real profile/achievement/backup round trips and separate classic/3D records. No schema migration or deletion, no other game implementation edits. |
| Version and notices | Package/lock version 6.0.1; cache key advanced. Browser verified home version description, app update notification and Wobbly Wars-specific update notification. Both acknowledge through the existing persistent release system. |
| Preserve interfaces in future 3D upgrades | Explicit project rule added to `AGENTS.md` and `3D_GAME_DEVELOPMENT.md`. Shared toolkit interface remains version 1.0. |

## Safer fallback for missing originals

For future restorations, inspect source, Git history and backups first. Preserve verified controls and game systems. Reconstruct only unrecovered pieces from identified screenshots/source references, recording exactly which pieces are approximate and what evidence is missing. Do not invent purchasing categories, change costs/rules, delete progress, silently downgrade 3D, or describe an approximation as an exact recovery. If evidence is insufficient to establish a missing interaction, retain the working implementation for that part and disclose the gap. This release recovered the actual troop interface; that fallback was not needed.

## Commands and verification limits

```bash
node tests/wars3d-controller.mjs
npm test
git diff --check
```

All completed successfully. The full suite includes independent toolkit/starter tests, real Havok settling/ragdoll disposal tests, all 100 campaign difficulty solutions, actual controller/profile integration and the purchasing checks described above.

The cloud browser reports WebGL unavailable and uses the existing explicitly labeled software 3D renderer. Its rendered models, camera and combat were checked, but this is not a Windows GPU, 60 FPS or physical touchscreen certification. Final device checks should cover 1920 × 1080, 1366 × 768, fullscreen, simultaneous USB touch ownership, fast roster swipes and optional vertical card drags. These limitations do not represent observed regressions; the engine and hardware support paths were not changed by this UI restoration.
