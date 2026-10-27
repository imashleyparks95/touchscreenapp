# Little Big Arcade 3.4 — Gameplay refinement and plate-based Café

Upgrades the existing six worlds in place. Build & Smash, its shared family level gallery, Beat Lab, Creative Studio and their stored media retain their existing modules and storage identities.

## Implementation priorities

1. Keep existing profiles, results, rivalries, achievements and media intact. Store the new rules as `refinement-v1`, separated from earlier rules and from each mode, difficulty, learning setting and match length.
2. Make the five difficulties change actual counts, sizes, motion, reaction windows, ingredients, cooking capacity, material resistance and AI behavior. Hard remains the launch default.
3. Implement and test deterministic gameplay independently of rendering. Then connect the real pointer handlers, audio and persistence.
4. Verify touch coordinate scaling, simultaneous player ownership, timed turns, plate assembly, save/resume and exactly-once completion.
5. Run the whole arcade regression suite and package the checked source for the existing Site.

## Feature acceptance tests

| Feature | Acceptance and evidence |
| --- | --- |
| Ladybug populations | Easy 12, Normal 24, Hard 42, Very Hard 60, Expert 80 initially; progress caps 18/36/60/88/112. Tests verify increasing counts and decreasing radii across every difficulty. |
| Ladybug sizing and movement | Base radius 44 scaled 100/80/65/50/38%, with a 24 CSS-pixel minimum target diameter. Curves, group motion, turns and bounded movement are simulated in one canvas. Test runs verify no boundary escape. Rotated wing ellipses determine hits. |
| Ladybug target cues | Every change selects a different color, refreshes valid stimulus timestamps, emits a distinct two-note color cue, pulses the border and updates the large color/name/symbol prompt. At least 18% of bugs match. Correct taps, errors, streaks, fast reactions and accurate completed rounds affect scores. |
| Penalty goalkeeper | Five shot types emerge from varied corner/low/central placement, flight speed, curl and delays. The keeper moves at limited speed instead of teleporting; collision at the goal line determines the save. Real deflected-ball motion bounces after a save. Tests check movement limits, valid targets and stimulus-to-first-movement timing on saved shots. |
| Penalty taker | Drag aiming and release-to-kick, a power meter and fader, individual curl fader and Shoot button work against an AI with actual reaction delay, imperfect observation, mistakes and history-based anticipation. Tests verify anticipation uses earlier shots even when the current shot goes to the opposite side. Aiming time is never recorded as reaction time. |
| Penalty competition | Each player receives a fresh five-shot world with equivalent seeded shots/AI. Ties enter one-shot-per-player sudden death; first player rotates. Winner uses total saves/goals, while leaderboard points use 250 × success rate to avoid extra-shot score inflation. Shipped host tests verify handoff, tie extension, aggregate winner and exactly one commit. |
| Balloons | Normal, golden, speed, tiny, armor, time, danger and mystery balloons have real effects. Armor has a per-ball tap cooldown and multiple HP. Time adds up to ten total seconds. Movement includes drift, zigzag and acceleration; four timed waves add pressure. Tests exercise each type, accurate ellipse hits and guaranteed correct learning targets. |
| Monster Café | 45 named ingredients include the original carrot, cheese, broccoli, strawberry, mushroom and grape favorites. 20 recipes span snacks, burgers, wraps, pizza, frozen desserts and fantasy food. All serve directly from the plate. Recipe length is bounded; harder play adds ingredient choices, concurrent customers, optional ordered stacks and stricter patience. |
| Café preparation | Tap or drag ingredients onto the visible plate; tap a placed ingredient to remove it. Exact ingredients and quantities are required, with clearly indicated stack order for some harder customers. There are no cooking stations or prep stages. Expert has three customers. Tests serve every recipe, check wrong ingredients, quantities, stack ordering and streak multipliers. Browser QA dragged, removed and served a complete plate with zero errors. |
| Recipe book | Difficulty unlocks recipes; recipes successfully served during completed shifts are marked Mastered in that profile's recipe book. Learning recipes include counted quantities. |
| Treasure excavation | Three deterministic layers of 80 connected sections each; eight materials have actual HP. Sections show cracks, progress bars, debris and scanner glows. Tests legally finish all 240 sections on every difficulty, requiring hundreds of actions rather than a few swipes. |
| Tools and discoveries | Shovel, large shovel, pickaxe, drill, power drill and scanner unlock at real excavation milestones. Rock needs a suitable tool; per-cell and global cooldowns prevent extra fingers accelerating digging. Eight treasure types have values, rarity and learning facts. Collections belong to each profile. |
| Excavation persistence | Solo autosaves every five seconds and supports manual Save, saved-site listing and Resume. Full cell HP, layers, tools, finds, score and active elapsed time survive. Completed or explicitly finished sites close; ending a partial site does not count as a completion victory. Saved sites participate in binary-safe arcade backup/restore. Browser QA cleared a section, saved it, then reopened the saved journal. |
| Two-player excavation | Separate simultaneous touch zones receive identical seeded ground. Treasure value, sections, discoveries and active completion time determine the winner in that order. Collection finds persist for both profiles only after a completed match. |
| Tap Battle | Speed, Reaction, Target, Accuracy, Combo and Survival plus a medley work at all five difficulties. Early reaction taps are penalized; target modes move; accuracy uses matching colored symbols; combo previews then hides a sequence; survival accelerates and uses three lives. Tests exercise all modes and no same-frame extra-finger scoring. |
| Battle matches | Single round, best of three and best of five; two simultaneous zones, independent names/avatars, scores, rounds and pointer IDs. Round wins determine the match. Series leaderboard score is average points per round so a longer match does not gain an unfair scoring advantage. |
| Timing and fairness | Active time comes from `performance.now()`. Pointer reactions include time since the last animation frame without changing the stimulus that was visibly tapped. Pause, hidden tabs, count-ins and handoffs do not advance game clocks. Unfinished matches never create game records. |
| Records and old progress | New boards have mode, difficulty, player count, learning, series length, all-time/daily/personal filters and real podiums. Old records remain available in the existing Hall of Fame. Profile points, genuine achievements, streaks and rivalry wins use the existing commit path with an explicit match winner. |
| Offline and regressions | All three new modules are self-hosted and precached. Existing regression suites cover old record migration, original engine modes, MP3 encoding, microphone/project roundtrips, independent drawing tools, 150 stable demolition worlds and full-clear strategies for all 30 campaign levels. |

## Verification boundaries

Automated model and shipped-host tests exercise all five difficulties and all gameplay variants. Cloud browser checks verify the rendered interfaces, actual clicks/drags, records, plate assembly, save/resume and navigation. No physical Windows USB touchscreen is attached to the test environment; hardware multitouch calibration, sound audibility and performance on the family's exact PC still need a local check. Created level sharing remains among arcade profiles in the same browser/device.

## Fullscreen layout correction 3.3.1

Removed the fixed aspect-ratio width caps that caused large empty side columns. The six game playfields now fill their available width and remaining height using a shared flex layout, with independent canvas containers and reserved toolbar space. A ResizeObserver updates canvas resolution and the minimum touch target scale when fullscreen, window dimensions or control layout changes. Build & Smash's campaign and builder width caps are removed too. The scene coordinates still map through the actual canvas rectangle; no scoring or saved data schema changes are needed.

Browser checks at a 1363 × 936 viewport verified: Bug Squash and Balloon Mayhem canvases span all 1363 pixels; Penalty Taker and Treasure Diggers reserve visible control decks beneath full-width canvases; Monster Café uses the entire width between its scene and interactive cooking panel; two-player battle divides the full width into two independent zones; Build & Smash uses the full content width and a real slingshot drag launches a projectile. Pointer tests additionally cover the 1911-pixel width in the reported screenshot and right-edge targets in split mode.

## Monster Café plate restoration 3.4

The Café now uses a dedicated two-column, viewport-fitted layout. The left holds the animated monster scene and a fixed, visible plate/Undo/Clear/Serve area. The right holds up to three customer cards with patience meters, the selected illustrated recipe, seven category tabs and a pantry grid. The whole page does not need scrolling. Food categories keep all 45 ingredients available at Expert; lower difficulties retain smaller ingredient pools. There are no cooking or sample prep controls.

Browser acceptance verified the actual application in 1366 × 768 and 1920 × 1080 viewports. At 1366 × 768, all seven categories were browsed and all 45 ingredient buttons were visible within the viewport with at least 48px height; the Serve button ended at y=678. At 1920 × 1080, the plate, orders, recipe, tabs, pantry, timer, score and Serve control were all inside the viewport, with no document overflow. A real drag placed white bread, a tap removed it, and a complete Garden Sandwich served directly for 54 points with zero errors.

New Café records use the `plate-1` level key and `plate` competition. Earlier cooking records retain `classic-1` and are viewable in the game’s record selector; opening Setup always selects Plate Assembly, so a new score cannot accidentally overwrite the old mode. Existing profile totals, mastery, achievements and rivalry records remain in the existing storage.
