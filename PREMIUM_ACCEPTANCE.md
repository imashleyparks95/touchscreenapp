# Premium expansion acceptance

This release extends the existing owner-private Little Big Arcade, retaining the original Site identity and browser-local database keys/schema. It adds five registered games (17 ordinary lobby worlds total), repairs Slime Lab and Feed the Face, clarifies Monster Dentist, and adds original illustrated covers, characters, tools, food, units and environments throughout the arcade. The supplied face PNGs are unchanged. Hard remains the default, with five gameplay difficulties.

## Implemented gameplay

- Castle Creator: 25 grid pieces; material cost/durability/weight; undo/redo, selection, move/rotate/duplicate, camera pan/zoom; support validation and physical falling debris; eight enemy classes, ballistic/manual and automatic defenses, repairs, gates and traps; 20 sieges, creative/challenge/endless/sandbox modes. Equal-budget Castle Clash exchanges the actual prepared designs, gives equivalent attacks, and records one match. Cooperative defense shares a castle.
- Buddy Mayhem: original articulated six-body/five-joint Pogo, independent limb grabs, physical release momentum; 14 gadgets plus grab, eight rooms; five scored challenge modes and unranked sandbox. Earned coins unlock equipment, rooms and costumes. Alternating identical challenges support single/best-of-three/best-of-five matches.
- Doodle Defenders: imperfect line/circle/triangle/zigzag/spiral/star recognition, cost-aware ink, functional blocking/damage/slow/buff objects, undo and accessible select/place, upgrades, eight enemy classes and 20 authored entry-lane/wave plans. Story, puzzle, boss, endless and creative modes; shared cooperative and independent simultaneous competitive boards.
- Robot Repair Shop: nine robot types, 27 career jobs and seeded valid fault combinations; real screw/wrench rotation, part and battery drag, terminal wiring, ordered circuit tracing and scrubbing. Repair order, panel closure, fastening and three interactive tests evaluate actual state. Diagnosis results explicitly differ from full repair/test completion. Quick, assembly and sandbox modes and identical alternating competition are implemented.
- Wobbly Wars: 21 units across six factions, 20 authored campaign battles and ten fields; budget/placement/unit-limit enforcement; saved formations; real articulated bodies, navigation/line of sight, melee/ranged and distinct abilities. Sandbox, random, challenge and reinforced endless waves; pause and speed controls; separate equal-budget two-player preparation and automatic combat with actual winners or explicit stalemates.

All five integrate existing profiles, XP, difficulty/mode/challenge records, achievements and rivalries. Creative sessions are unranked. Match results commit once, after completion. Castle/army gallery entries retain ownership; another player's design loads as an editable copy. Touchscreen naming, favorites, duplicate, backup and restore use existing storage. Premium ruleset records remain separate from earlier scores; Slime uses slime-sling-v2 and Face feeding-v2, preserving their older records.

## Repairs and visual work

Slime's center anchors during a pull; only release supplies opposite elastic impulse. Routes, updraft and pressure-pad layouts were corrected for actual slings. Mesh interior detects collected orbs, and later puzzles use genuine split-pad-merge actions. Feed the Face uses tap aiming with independent player food trays, moving requests judged at launch, queued chewing and moving angry eyebrows; proportional image rendering and five-logo-tap activation remain. Dentist uses seven distinct patients, a large readable mouth, individual teeth and visible tool markers; sneeze reactions remain cosmetic.

Original vector/canvas assets are used in covers, characters, materials, gadgets, factions, recipes, tools, stickers, instruments and backgrounds. Existing gameplay hitboxes remain model-driven. Offline cache includes the new modules. No generated or test records are shipped.

## Verification and limits

Automated suites exercise actual model controls and shipped session/pointer handlers. Control-driven solution fixtures do not grant completion, teleport physics objects or bypass budgets:

- All 20 Castle sieges and 20 Wobbly campaign battles won on Hard.
- All 100 Doodle level/difficulty combinations completed.
- All 135 robot career/difficulty combinations and 100 additional random fault seeds fully repaired, reassembled and tested.
- All 25 Buddy scored mode/difficulty combinations completed; all eight rooms and gadgets remain finite with body/joint cleanup.
- All 150 Slime level/difficulty combinations completed through legal slings.
- Existing Gravity 150 course/difficulty completions, dental/ninja solutions, audio/studio serialization, offline assets, profile migration, backups and existing-game regressions retained.
- Multiplayer controller checks cover equal fresh turns, first-player rotation, independent simultaneous drawing, pause, tiebreakers, explicit winners and exactly-once completed-match commits. Shape, repair-order, budget, damage and physics checks include failure paths.
- A 48-unit/288-body battle remains numerically finite under automated simulation; this is a stability check, not a cabinet frame-rate measurement.

Browser review covered all five new games and the three repaired games at 1366×768 and 1920×1080; canvases, controls and feedback fit without document overflow. Native browser interactions verified castle saving/reopening under another profile as a copy, an actual campaign victory, diagnosis results, Buddy limb fling/target hit and Doodle line-to-wall recognition. Reload persistence and the immediate hidden face activation were checked. Final review corrected a text-node selection event error. Temporary sizing pages are removed before packaging.

Testing used automated simulation and the cloud browser with mouse/native pointer input and simulated multiple pointers. Actual Windows USB multitouch hardware, physical audio output and sustained full-cabinet frame rates have not been tested. Optional cosmetic collections are deliberately smaller than the brief's broad wishlist; no online family synchronization or external purchases are introduced.
