# Circuit Rush, Feed the Face and layout restoration

## Implementation priorities

1. Restore the previous playfield sizing without reverting gameplay, projects, profiles or expanded Café content. Keep Café's viewport fit scoped to Café. Reclaim empty header space instead of changing object scaling.
2. Disable selection, image dragging and gameplay scrolling; preserve native editable inputs and the existing project keyboard.
3. Replace the selectable penalty world with Circuit Rush: 30 deterministic puzzles with solution certificates, integer-cell validation, Undo/Reset, staged circuits, boosters, bridges, switches, rotators, moving gates and timed connections.
4. Add Feed the Face only through five primary-pointer logo taps in three seconds, immediately available without progress. Preload both supplied transparent PNGs. Render with a fixed height and preserve each image's aspect ratio.
5. Integrate solo/multiplayer results, difficulty/mode/level/match-length separation, backup/restore compatibility and secret-only badges/records. Cache new modules and images offline.

## Verified automated acceptance

`npm test` includes `tests/circuit-face.mjs` plus the existing arcade suites.

- All 30 unique circuit solution certificates complete through the shipped validation logic. Includes gate operation, timed failures, straight perpendicular bridge crossings, stage order, undo/reset, no wall or endpoint skipping, pointer ownership and idle-player fairness.
- The shipped session controller records each complete match exactly once, uses round wins for best-of-five and best-of-three, averages scores across rounds, advances marathon boards independently, and excludes paused time.
- Two independent face pointer handlers create correctly owned left/right projectiles; canceled or paused pointers cannot launch.
- A projectile scores once, mouth collisions use swept relative motion, and non-mouth hits do not feed or chew.
- Each successful bite plays three or four complete open/closed cycles at 170 ms per expression change. Additional hits queue another sequence. Tests observe four full cycles and draining of rapid-hit queues.
- Paired simulations across every difficulty produce identical head positions and velocities with and without feeding/chewing. Cosmetic RNG is independent of movement.
- All 20 face mode/difficulty combinations finish safely. Every difficulty has a verified successful moving-mouth shot inside the actual slingshot pull limit, including obstacles.
- New results and secret badges round-trip through the existing backup validator; profiles and rivalries update. Normal games do not include a penalty or face tile; secret badges are filtered from ordinary trophy cards.
- Existing game, Beat Lab PCM/MP3/microphone, Creative Studio, shared builder gallery, 30 demolition levels and prior data regression suites pass.

## Browser acceptance

- Logo taps reveal and open the hidden game on an empty-progress profile. The visible logo remains ordinary before activation.
- Circuit source-to-receiver dragging completes a wire; board, Undo/Reset, timer and profile HUD render.
- Feed the Face loads the actual supplied transparent image, all 12 foods, independent left/right launchers and profile scores. Food dragging launches; six misses finish Survival and produce a record that remains after reload and repeated Easter-egg activation. Secret badges are absent from the ordinary trophy room.
- Café is tested in true 1366×768 and 1920×1080 iframe viewports. Plate, Serve, customers, categories and pantry remain in view without page scrolling. Expert's ten vegetable buttons remain accessible (minimum observed height 90 px at 1366×768).
- Expert two-player Circuit Battle fits both resolutions, including both boards, Undo/Reset controls and feedback, with no page overflow.
- Earlier Bug Squash canvas sizing is restored: 1366×478 at 1366×768 and 1920×780 at 1920×1080. Empty chrome spacing is reduced to preserve those dimensions while retaining visible bottom controls.

## Hardware verification limit

Remote browser input and simulated independent pointer events cannot prove how the physical Windows USB touchscreen reports simultaneous fingers or its sound latency. Check those on the user's display. No paid service or external game API is introduced.
