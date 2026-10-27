# Little Big Arcade 5.2.0 — Spelling Adventure and Castle Creator

Release date: 25 October 2026. Updates the existing private Little Big Arcade project.

## Spelling Adventure

A new twenty-second arcade world with a soft illustrated storybook identity, five playable modes, persistent profile progress and no displayed school grades.

| Named pool | Distinct local words |
| --- | ---: |
| Niko | 550 |
| Roxy | 1,050 |
| Kelly | 1,750 |
| Total, globally distinct | 3,350 |

The local vocabulary includes definitions, contextual sentences, hints, categories, spelling patterns, lengths and within-pool complexity tiers. Unbiased Fisher–Yates selection uses crypto random values, favors unseen/older words, varies category ordering and does not repeat a word within an adventure. Separate missed-word review intentionally revisits mistakes. Progress never switches a player to another named pool.

Spelling Bee accepts a complete typed answer. Letter Builder supports tapped, dragged and reordered tiles with distractors. Missing Letters accepts only the missing letters. Sprint defaults to 60 seconds, with adjustable duration and an untimed option. Survival starts with three hearts and advances complexity within the selected pool.

Solo, alternating competition, simultaneous split-screen and cooperative play are available. Each player can select a different pool. Split mode has separate answers, scores, histories and writing canvases. Co-op alternates prompts, combines points and streaks, and carries shared writing between teammates. Physical-keyboard input follows the focused answer; touchscreen keys belong to their own side.

### Real whiteboards and official answers

The whiteboards use continuous smoothed Pointer Events strokes, pointer capture, concurrent contacts, normalized coordinates and operation-based redraw. Pen, eraser, undo, clear, ink color, thickness and optional lines work independently of spelling validation. Resizing preserves writing. Auto-Clear defaults to OFF and writing remains across words. Drawing never submits, types or scores an answer. An intentional Submit action evaluates the official typed or assembled answer.

### Mastery, corrections and scoring

A word becomes mastered after **three correct, unhinted answers in three separate adventures**. Repeating it in the same adventure cannot manufacture mastery. A later error marks it for review while preserving earned mastery history.

An incorrect submission shows the entered answer, the correct word, aligned letter differences, a spelling pattern, a context sentence and Hear Again. Matching letters, changed/missing letters and extra letters have a visible legend. Feedback remains until the player deliberately chooses Next Word; Survival also removes one heart. Missing Letters feedback distinguishes the expected missing letters from the complete word.

Correct answers earn 100 points, with 25 more for no hint. Streaks of 3, 5 and 10 award 50, 100 and 250 bonus points. Sprint awards up to 20 speed points per correct word. Equal base scoring applies across the named pools. Records separate mode, pool and multiplayer layout; hints, review and round settings are included in the comparison rules. Co-op records identify the team. Completed rounds commit once; abandoning a round saves word practice without creating a high score.

Profiles track attempts, accuracy, streaks, categories, missed words, mastery and completed games. Added achievements include First 10 Words, Perfect Round, Spelling Superstar, 100/500 Words Mastered, Speed Speller, Ten-Word Streak, Comeback Champion, cooperation and each named trail.

### Speech and offline operation

Speech uses queued installed local English voices, preferring en-US; players never speak over each other. Hear Word, Hear Sentence, Definition and Hint are available. Example sentences do not visually expose the answer before submission. Speech, music and effects have persistent settings, and pause/exit release audio work. The word bank and new modules are included in the offline cache.

If no suitable local voice is ready, the game gives an explicit retry/install-English-voice message and permits quiet play from definitions and patterns. It does not require a remote pronunciation service. Browser voice availability depends on the user's Windows installation.

Vocabulary provenance: selected WordNet 3.0 definitions/examples under its included Princeton license, plus original editorial definitions and contexts. All 550 Niko entries have original elementary definitions and contexts; 955 entries in total use editorial definitions. Some advanced entries retain dictionary terminology or explanatory rather than narrative contexts. This is a substantial spelling-practice bank, not a claim of formal curriculum certification or an exhaustive human classroom audit of all 3,350 entries. Full provenance and license ship under `dist/vendor/spelling/`.

## Castle Creator

### Compact inventory and cumulative unlocks

Five category tabs replace the long equipment strip. Structures use seven-item pages. Illustrated item buttons show cost, selection, locks and the required profile defeat count. Essential build actions stay visible; less-used editing, materials, save/load and camera controls are in More Build Tools. Empty combat inventory collapses to preserve battlefield space. There are 25 deployable pieces and a free automatic banner.

| Cumulative enemy defeats | Permanent equipment unlocks |
| ---: | --- |
| 0 | Wood wall, foundation, beam, stairs, platform, battlement, barricade, spring trap, foot soldier |
| 5 | Stone wall, gate, roof, window wall |
| 8 | Arch |
| 12 | Archer tower, tower |
| 18 | Drawbridge |
| 25 | Cannon |
| 30 | Barrier; iron material |
| 40 | Reinforced gate |
| 50 | Repair station |
| 60 | Ballista |
| 70 | Gargoyle |
| 85 | Catapult |
| 90 | Star crystal material |
| 120 | Frost rune |

Each real defeated enemy increments progress exactly once and immediately saves to the applicable profile; co-op credits both selected profiles. Creative/sandbox and player-vs-player attacks do not farm progression. Prior earned kills are migrated once from preserved results. Locked equipment stays blocked in ranked deployments; Creative Build remains available for unrestricted experimentation.

### Prices and economy

| Item | Standard cost | Standard health |
| --- | ---: | ---: |
| Wood wall | 40 | 70 |
| Stone wall | 80 | 160 |
| Foundation | 70 | 130 |
| Beam / stairs / platform / battlement | 30 / 45 / 35 / 35 | 75 / 85 / 65 / 65 |
| Gate / drawbridge / arch / tower | 85 / 65 / 60 / 150 | 180 / 90 / 100 / 260 |
| Roof / window wall / reinforced gate | 25 / 55 / 140 | 50 / 105 / 330 |
| Foot soldier | 95 | 75 |
| Archer tower | 140 | 120 |
| Cannon | 200 | 125 |
| Ballista / catapult | 170 / 180 | 115 / 100 |
| Barricade / spring trap / barrier | 35 / 80 / 60 | 60 / 100 / 125 |
| Repair station / frost rune / gargoyle | 160 / 220 / 20 | 100 / 120 / 45 |

The first Hard siege has 1,500 construction coins. Its legal starter costs 390: three wood walls, one spring trap and two foot soldiers. A soldier costs more than twice a basic wall and less than an archer or cannon. Unit health and melee output keep mass deployment from replacing every other defense. The 80-piece cap and budget remain enforced. Oak is cheaper/lighter with lower durability; iron and crystal trade greater cost/weight for durability.

Foot soldiers deal 9 damage per 900 ms in melee. Archers provide 13 damage per 800 ms at range 340. Cannons retain 28 direct damage per 1,900 ms at range 420, now with small 42-unit splash. Ballista bolts deal 32 and catapult stones 40; their longer cycles and siege range retain distinct roles. Manual trap triggers have a three-second recharge instead of unlimited tap damage.

### Advancing troops and royal objective

Foot soldiers actually march toward the incoming enemy side, retain a living ground target, close to melee range, attack on cooldown, reacquire after defeat and react to damage/death. Collision-aware motion allows open gates and low-wall vaults. Feet track ground/support surfaces and physical bodies follow their visible position. Fully sealed tall walls produce guard/rally movement and an explicit request to open a route; this is deliberately straightforward 2D navigation, not arbitrary maze pathfinding. Troops do not walk through solid blocks or teleport over sealed walls.

The crowned, expressive king replaces the beacon as the 800-health objective. Enemy targeting, damage, repairs, placement clearance, challenge thresholds and defeat checks use that royal objective. The HUD says King's Health and losses say THE KING HAS FALLEN. The old `beacon` summary field remains only as stored-data compatibility alongside `king`.

### Waves and preparation

Each wave schedules `6 + 2 × wave + floor(level / 3)` enemies. Remaining counts include living enemies plus the scheduled enemies not yet spawned. Before an assault, the exact incoming count is shown. Variable intervals, speed variation and occasional 230 ms pairs replace groups of three with long idle gaps. Bosses are capped at one and enemy catapults at two per wave; remaining slots use ordinary enemies, preserving the exact quota.

After the entire quota spawns and every enemy is resolved, the next wave enters a real construction phase. Its battle clock stops, surviving structures retain damage, troops regroup safely, new unlocks can be built, and the player receives `90 + 15 × cleared wave` more deployment budget plus one repair supply (maximum eight). Start Assault N resumes combat intentionally without another tutorial. Finite siege clocks count active battle time only. Final victory waits for the complete final quota to resolve.

### Art, projectiles, flags and alignment

Castle-only illustrated hills, stone/wood details, medieval item icons, animated armored soldiers and a distinctive crown/cape/face give the game its own identity. Walking, strikes, hurt reactions and defeat poses use code-native artwork. Character feet meet supporting surfaces; friendly health bars sit above heads. Unwanted blue structural underlays are removed while selections, support warnings, collisions and debris remain.

Archers fire recognizable velocity-oriented arrows with shafts, heads and fletching. Cannons fire cannonballs; ballistas use bolts, catapults use stones, and frost runes use distinct frost ammunition. Existing swept collision checks still evaluate the actual projectiles.

The profile-colored banner is separate from the king. It selects the highest clear structural surface consistently, avoids characters/weapons, and moves when its support is destroyed. With no suitable structure it uses the second-last available player-side ground space. Obsolete manually placed flags are ignored only in runtime copies; original stored designs are retained, and no invisible flag body remains.

Current Castle results use the new `castle-v2` ruleset. Earlier `premium-v1` results remain available under Earlier Sieges in the Record Edition selector instead of being mixed into the new balance.

## Shared instructions and preserved data

All 22 normal worlds and hidden Feed the Face share the same instruction gate. Acknowledgment occurs once per open game session, after selecting Play and before gameplay/device capture starts. Rounds, waves, restarts, rematches, stages and controller remounts inside that session skip automatic repetition. Returning to the arcade ends the session; reopening asks again. Manual How to Play remains available and pauses relevant simulation/clocks while reviewing.

The existing local storage key, profile database version, media formats, saved designs, achievements, rivalries, prior results and backups remain. Other games receive instruction-lifecycle changes only. Feed the Face remains absent from the normal menu and retains its secret access.

## Verification and limits

The release uses the full 15-suite `npm test` regression command. Coverage includes the original arcade, physics, offline assets, studios/media, Build & Smash, refined classics, Circuit/Face, touch worlds, Gravity Chaos, premium games, shared launch fixes, Air Slice, Castle overhaul and Spelling Adventure.

Focused automated checks exercise all 15 spelling pool/mode combinations, RNG variety/history/no-repeat behavior, exact scoring, typed/tile/missing-letter answers, hearts and clocks, three-adventure mastery, corrections, profile isolation and backup round-trips. Actual controller fixtures verify no model/audio start before acknowledgment, two-player isolation, cooperative writing, retained ink, alternating clock handoff, pause and exactly-once records. Real drawing handlers are tested with generated simultaneous contacts, continuous strokes, resizing, erasing, undo and cleanup. Speech fixtures test local voices, FIFO, cancellation and absent-voice fallback.

Castle checks cover unlock thresholds and saved kills, offensive movement/melee/targeting, collision-safe vaults, sealed-wall behavior, king loss/placement, projectile types, flag relocation/fallback, exact continuous wave quotas, stopped preparation clocks, immediate build unlocks, real controller Start Assault transitions, manual trap limits, valid reinforcement and legacy-flag normalization. The campaign solution checks clear all 20 Hard Castle levels with legal budgets and earned progression; they do not establish every possible player design or every difficulty/level combination.

Browser QA used the actual served application and explicitly labeled generated-input fixtures. A complete simultaneous ten-word spelling round per player produced 1,650 points each, separate saved records and unchanged writing. Drawing alone scored zero. Manual Help, reopening instructions, wrong-answer feedback and safe exit were exercised. Layouts were measured at 1366×768 and 1920×1080 using actual-size app frames; split boards, keys, answers and instructions stayed within the viewport without horizontal overflow. The actual Castle inventory, legal starter, king, automatic banner, pause and play controls were also inspected. Temporary generated-input/size QA pages are removed from the shipped bundle.

Physical Windows speech playback, USB multitouch/stylus behavior and native Windows fullscreen transitions were not available in this cloud environment. The browser had no installed local English voice and displayed the intended fallback. Pointer-handler/speech fixtures are not claims of physical hardware testing. No new webcam claims are made by this release. Profiles and scores remain device-local, as before; a backup is still the way to move them between devices.
