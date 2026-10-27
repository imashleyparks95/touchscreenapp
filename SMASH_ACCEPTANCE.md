# Build & Smash — Neon Demolition League

Upgrade of the existing Little Big Arcade, version 3.2. Published identity and browser database keys remain unchanged.

## Implementation priorities

1. Self-host Matter.js and poly-decomp; build deterministic fixed-step simulation, material properties, collision damage, real debris and slingshot projectiles.
2. Author 30 stable levels, validate placements and discover full-clear strategies with actual unlocked weapons and shot budgets.
3. Add single-player progression and fair alternating two-player matches, precise clocks, explicit rule-based winner comparisons and exactly-once result commits.
4. Build editable custom structures and touch-keyboard saves; show every saved structure in a shared family gallery for all arcade profiles on the device.
5. Preserve prior scores/media, add campaign records/achievements and complete browser/regression verification before publication.

## Acceptance and verification

| Area | Acceptance | Verified evidence |
| --- | --- | --- |
| Physics | Actual gravity, collision, rotation, mass/friction/durability; a moving piece alone earns no points | Matter.js simulation; physical compound arch opening; material mass/hp/friction checks; movement-without-destruction test |
| Stability | No unprovoked destruction; deterministic starting world and replay | 150 worlds: every level at all five difficulties stays stable for 10 seconds after setup; reset snapshots and identical shot replays match exactly |
| Campaign | 30 unique authored structures, five environments, progression, real difficulty and three stars | Unique blueprints; no initial overlapping blocks; all 30 fully clear on Hard using recorded valid strategies within their shot limits |
| Shots | Drag/release, trajectory, limited shots, six progressively unlocked types | Real browser launches and hits; engine checks shot/weapon limits; actual split and explosion behavior tested |
| Multiplayer | Identical world/choices/budget per turn; correct Blocks and Fastest rules | Actual handlers test no commit before turn 2, one commit only, rematch alternates first player; full comparator/tiebreaker tests; browser Kelly/Roxy handoff, winner, and Roxy-first rematch |
| Timing | GO starts clock; aim is timed; menus/pauses/handoff do not count | Actual clock function tests; browser pause remained fixed at 0.25s before resuming; HUD and result times shown |
| Builder | Nine shapes/six materials, touch placement, rotation/resize, undo/redo/delete/clear, test/reset | Real physics shapes; browser placed five shapes, undo/redo, tested, reset and saved/reopened; resize/rotate validates boundaries and overlap |
| Shared family levels | All profiles see every creator’s saved levels and can play directly | Actual shared-gallery tests for two owners/two viewers; browser Roxy and Niko both saw and launched Kelly’s MY FORT; Niko Remix saved separately with Kelly original intact |
| Ownership | Credit the creator; other players save edited copies | Original owner retained; media includes creator name/avatar for future attribution; save-copy handler tested |
| Persistence | Keep existing profiles/scores/art/music; save custom levels and campaign statistics | Existing suites pass; added structure and demolition-record backup validation/roundtrip; browser named structures reopen and records survive reload |
| Leaderboards | Separate level/difficulty/mode/rules; compare actual records and full-clear metrics | Isolation/tiebreaker tests; real browser campaign record and stars; old timed scores remain in original arcade board |
| Achievements | Genuine break/full clear/one-shot/chain/builder/wins/30-level events | Seven new badge definitions; actual completion triggers tested; no campaign points or XP from custom challenges |
| Regression/offline | Other games and studios work; new assets cached locally | Original 140 game combinations and studio/audio/MP3/storage suites pass; offline test verifies every new module, physics asset and license is present |

## Fairness and presentation details

- Three-star scale: 60% broken = 1 star and next-level access; 85% = 2; every block broken = 3. Movement alone never counts.
- Default difficulty Hard. Settings change durability and actual shot budgets; records remain separated. Special projectile unlocks: Heavy3, Bouncy6, Split11, Explosive16, Speed21.
- Each turn has a three-minute limit. Automatic shot settling waits up to nine seconds; players may choose Next Shot sooner. Finish Turn accepts the current actual destruction result.
- Mode A: broken blocks, fewer shots, faster elapsed time. Mode B: a full clear beats a partial; two full clears compare elapsed time then shots. If neither clears: broken blocks, shots, time. Exact ties remain draws.
- Restart abandons the entire unfinished match, including the first player’s result. Rematch/Next Level rotates the first player.
- Custom challenges retain separate content-hash records and friendly wins but award no arcade points or XP. Opening another creator’s structure and saving makes a copy.
- Family sharing means every Little Big Arcade profile in the same browser on the device. Separate computers or browser/Windows profiles still use the existing full backup/restore flow; no cloud synchronization or public sharing is introduced.
- All sounds, physics libraries, fonts and assets are local. No paid service or external runtime game API.

## Verification limits

Browser checks used controlled Chrome and mouse-driven Pointer Events. Physical Windows USB multitouch reporting, perceived hardware audio latency and final HTTPS offline behavior require checking on the actual display. Offline resource installation/fetch behavior was tested in the isolated service-worker suite. No unplayed profile records, fake scores or test media are shipped.
