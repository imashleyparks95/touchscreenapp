# Gravity Chaos acceptance — 2026-10-24

## Scope
Replaces the active Treasure Diggers tile/launch path with a new independent physics game. Legacy digging scores and excavation media remain accepted by backup/restore; all eleven other ordinary games and the secret face architecture remain registered. No unrelated game model/render/controller was edited.

## Automated checks
- `npm test`: complete existing regression suites plus `tests/gravity.mjs`.
- All 30 authored geometries differ. All 150 level/difficulty combinations complete through game controls in `tests/gravity-solutions.mjs`, without setting ball positions/velocities or granting completion. Replays use gravity, switches, held safety and the collectible shield. Every route meets real timers and finite flip budgets with zero hazard mistakes; later courses collect both mandatory gold orbs.
- Genuine Matter momentum, deterministic identical reset/replay, wall/ramp collision, drag/two-pointer rotation, bridge expiry, switch/gate/falling-block chains, held shutdown, shield absorption, checkpoint resets and all requested object families.
- Survival waves actually threaten an idle ball; distinct race/orb/survival comparator checks.
- Shipped controller: best-of-five ends at three wins, commits once, no interim records; Orb Challenge waits for both players; pointer handlers isolate concurrent directional swipes and two-finger rotation; pause freezes both clocks and cancels holds/pointers.
- All 150 scenes, including drawn ramps, render with finite coordinates.
- New and legacy records coexist through export/import, with isolated keys and all other game registrations preserved.

## Browser checks
- Lobby replacement opens Gravity Chaos; Hard is the default.
- A real right/up swipe sequence cleared level 1, showed celebration, saved score/time/orbs/fewest flips, and unlocked real achievements. The same record survived browser reload.
- Two-player level 24 shows identical courses and separate controls; left RIGHT and right UP gravity indicators change independently. An actual drawn ramp builds and renders. Shared pause freezes both worlds.
- At 1366×768 and 1920×1080, the game fills the viewport without document overflow; both canvases, toolbar strips and feedback fit inside the viewport. Playfield uses aspect-correct letterboxing and actual rendered pointer coordinates.
- No application exception observed in inspected browser errors; extension metadata errors are external to this app.

## Remaining device-specific verification
A remote browser cannot certify the user's physical Windows USB touch digitizer, simultaneous physical fingers, audio output quality, offline reinstall behavior or sustained hardware frame rate. The actual handlers and independent physics are tested; these hardware checks should be done on the arcade cabinet.
