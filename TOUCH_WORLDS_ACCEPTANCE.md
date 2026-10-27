# Slime Lab, Monster Dentist and Shadow Ninjas

## Scope and implementation priorities

Add three normal lobby worlds while retaining all nine existing worlds, the hidden Feed the Face entry, previous layouts, media, player identities, scores and achievements.

1. Implement independent, testable game models and actual gesture controls.
2. Add 30 deterministic slime courses, 30 ninja missions and 30 dental cases.
3. Connect fair races, identical patient resets, turn handoffs and best-of-three/five matches.
4. Integrate profile records, separate level/difficulty/match leaderboards, badges and earned cosmetics.
5. Validate legal completion routes, physical interaction and UI sizing; package and publish the same Site.

## Slime Lab

- Sixteen perimeter particles form a closed elastic mesh, with perimeter/cross-body springs, pressure restoration, gravity and per-particle collision response. Rendered skin follows the live mesh.
- Each blob accepts two independently tracked pins. Spreading/pinching alters its shape; release applies force from the backward pull. Returning springs restore its resting shape.
- Advanced splitting divides mass in half. Two independently controlled blobs activate separate physical pads, then merge. Expert exits require both the pad latch and a merge.
- Spikes, rotating/moving bodies, timed lasers, fans, conveyors, sticky/ice surfaces, narrow passages, moving walls, bounce pads and paired teleporters affect the simulation.
- Required gold orbs, optional collectibles and near-revealed secrets; stars consider collection, time and retries. Four earned appearances include colors, freckles, a crown and a sparkle effect.
- Simultaneous split-screen races; each player can use two fingers without controlling the other side.

## Monster Dentist

- Seven original, friendly cartoon patients include buck teeth, three rows, floating teeth, fangs, a fluffy patient, dragon and cyclops.
- Brushing/polishing accumulate actual movement; spraying accumulates held contact; picking traces ten angular sectors; fillings require holding inside a small cavity. Extraction requires steady movement in the marked direction. Replacement teeth must start in the tray, land in a gap and match its orientation. Crooked teeth require an aligning drag.
- Difficulty changes teeth, target sizes, problem combinations, tooth motion, moving tongues and reaction windows. Sneeze warnings precede temporary closures.
- Turn-based play uses fresh identical patient data and zeroed active clocks for each player. The first player alternates between rounds and rematches. Completed treatments, accuracy and time decide results; idle incomplete play cannot beat a completed patient.

## Shadow Ninjas

- Draw/cancel/replace routes, swipe a dash once per gesture, hold a shield using another pointer, aim stars at switches/guards, slide with a smaller collision radius, wall-jump to a clear landing, and use short energy-limited blinks.
- Patrol cones and cameras use line-of-sight tests and an accumulating warning meter before detection. Cover hides the ninja and recharges energy. Lasers have visible safe/active phases; pressure plates, timed doors, moving walls/platforms, spring traps and collapsing platforms have gameplay consequences.
- Gold scrolls, switches and pressure pads gate exits where required. Optional scrolls and clean runs improve stars. Four earned costumes include scarf colors and trail effects.
- Simultaneous independent race controls and equivalent levels; completion time, collection and detections break ties.

## Verified automated acceptance

`npm test` runs the existing suites plus `tests/touch-worlds.mjs`; legal control-driven solutions are kept in `tests/touch-solutions.mjs`.

- All 30 slime courses complete with legal pointer input and zero resets, within their actual time budgets. Expert solutions activate both pads, merge and exit. Total slime mass remains constant.
- All 30 ninja missions complete through actual routes, shield controls and star actions, including required switches and pressure pads.
- All seven dental patient types at all five difficulties, and all 30 campaign cases, can be fully treated through the actual tool methods with 100% accuracy.
- Genuine stretching, pinching, natural contraction, fling direction, deterministic physics, finite state and every slime obstacle family are checked.
- Taps/idle holds cannot fake scrubbing; incorrect tools fail, held fillings work, and extraction requires a directional controlled pull.
- Star/switch collision, finite shielding with movement, warning-before-detection, wall jumps, short blinks, and one dash per swipe are checked.
- The shipped session controller is tested for untimed handoffs, equal fresh dental patients, first-player alternation, best-of-three scoring, exactly-once recording, explicit race winners, paused clocks, four independent slime touchpoints and concurrent ninja swipes.
- Ninety scene renders, profile/rivalry records, mode/level keys, backup compatibility and saved cosmetic selection pass.
- The full prior arcade suite passes, including both older studios, 30 demolition solutions and the Circuit/Face tests.

## Verified browser acceptance

- All 12 normal lobby tiles appear; each new world launches with Hard as default.
- A slime body drag collected an orb only for Kelly's side while Roxy's score remained unchanged.
- Holding the filling tool on a cavity completed a repair and updated the live checklist without a mistake.
- A complete ninja mission saved 1,546 points, two scrolls, two stars, 100% accuracy and zero detections; the same record and 63.4-second completion time remained after reload.
- Expert Dentist and both simultaneous race layouts fit genuine 1366×768 and 1920×1080 iframe viewports. Page height equals viewport height; the checklist, tools, shield, split/reset and feedback remain visible. Slime split/reset targets are 62 px high.

## Physical-device limit

Remote mouse input and simulated multi-pointer handlers cannot verify the Windows USB display's simultaneous-finger reporting, frame rate or audio latency. Those remain device checks. The games use local browser persistence and introduce no paid service or external API.
