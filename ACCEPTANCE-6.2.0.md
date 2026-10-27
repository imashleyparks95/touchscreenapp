# Little Big Arcade 6.2.0 — Living Forest / Xbox controls

Date: 2026-10-27. Existing Site and application; no separate game app. Base: 6.1.0 (`67250a5d7803fe494fa0216978db90a938332db4`). Babylon.js 9.32.0 / Havok 1.3.14 unchanged. Buildless static application: there is no production bundler command. Packaging validates the static manifest and produces the deployable archive from the pushed commit.

## Delivered scope

The Living Forest is now the Milestone 2 adventure: restore three lanterns, defeat three distinct sentinel encounters, interact with the gate lever, wait for the physical door to rise and bring every explorer through. Melee strikes, aimed pulses, dodge windows, health, checkpoint recovery, unlimited retries and separate combat-edition scores are functional. Solo and simultaneous two-player co-op share objectives and retain separate health/cooldowns. Castle interiors are Milestone 3; Chaos Chamber remains future work.

Xbox-compatible standard controllers support movement, combat, camera, menus, mandatory instructions, pause and two-controller co-op. Pair in Windows Bluetooth settings or use USB, focus the browser and press/release a controller button. The initial activation press does not confirm a menu. Non-standard mappings use the existing keyboard/touch fallback. No software installation, account, game-specific Bluetooth API or paid service is added.

| Xbox input | Function |
| --- | --- |
| Left / right stick | Move relative to camera / orbit camera |
| A / X / B / Y | Jump / strike / dodge / interact |
| RT / RB / LB | Energy pulse / held run / recenter camera |
| Menu / View | Pause-resume / How to Play |
| D-pad or left stick in menus | Choose controls; left/right adjusts options |
| A / B in menus | Confirm / back |

Controller ownership stays with P1/P2 across sparse browser indices and a partner's disconnect. Disconnect, focus loss and hidden tabs pause an active adventure. Reconnecting does not resume automatically. Two players share one camera; either active controller can orbit it. The Xbox logo button belongs to Windows. Rumble is not implemented.

## Underlying fixes

1. The former camera-to-world basis mirrored horizontal input for the right-handed camera. A shared `cameraRelativeMovement` helper now agrees with projected screen-right at seven tested camera angles for keyboard, touch and pad input.
2. NPC movement had been render-time sine/cosine circles. Wardens now follow authored obstacle-aware routes, wait/watch and offer guidance. Sentinels acquire targets through line of sight, pursue, hold/retreat, telegraph attacks and return to patrol.
3. Static collisions covered only part of the scenery and used undersized tree approximations. A deterministic local GLB bake measures lower trunks, rocks and the fallen log. The navigation world and Havok proxy bodies share transformed extents. Rails, pillars, lantern/lever bases, people, the opening door and real dynamic crates have contact. Leaves and grass are deliberately passable. The player remains a controlled kinematic character; Havok handles loose props, not a falsely claimed fully dynamic character solver.
4. Runtime clip blending initially displaced sampled weapon paths. Explicit authoritative clip sampling now restarts the source animation without blending, while idle/walk/run retain ordinary transitions. Actual source blade/casting-palm positions agree with the game contacts within 0.001292 m in the scene test.
5. Actual crate pushes initially lost against static friction. Bounded fixed-step impulses with a 3 m/s force cutoff now move the Havok crate; measured scene-test displacement is 0.720 m.
6. Palette-cloned materials had suffixed names which bypassed software texture lookup. Prefix-aware matching restores the actual imported character textures in the compatibility renderer. Live preview inspection confirmed colored characters.

Normal damage does not cancel attacks. Contacts collect before health resolution, allowing legitimate simultaneous trades. Pulses use earliest swept solid/target contact. Zero health triggers the imported defeat animation and checkpoint recovery. No artificial enemy kills, unlocks or teleports are used by the complete-adventure solver.

## Files and shared interfaces

- `dist/js/3d/third-person.js`, `projectiles.js`, `animation.js`, `actors.js`, `action-input.js`, `gamepads.js`, `index.js`: camera-relative direction, absolute-height contact, earliest swept hits, authoritative clip samples, configurable combat buttons and stable controller ownership. Independent tests cover these outside both games.
- `dist/js/limit/core.js`, `world.js`, `combat.js`, `geometry-data.js`, `scene.js`, `assets.js`: forest rules, encounters, geometry/contact bake, actual imports, Havok bindings and rendering.
- `dist/js/limit/ui.js`, `controller-ui.js`, `dist/limit-break.css`: controller/touch/keyboard actions, guide, menu input, pause, health, objective and HUD fit.
- `dist/js/game-instructions.js`, `releases.js`, `visuals.js`, `data.js`, `dist/sw.js`, package version files: existing integration, notes, new badge, separate score edition and coherent offline assets.
- `scripts/limit/bake-gameplay.mjs`, its README and `3D_GAME_DEVELOPMENT.md`: reproducible bundled-asset measurement and documented reusable interfaces.
- `tests/3d-gamepads.mjs`, `3d-adventure.mjs`, `limit-gameplay.mjs`, `limit-core.mjs`, `limit-controller.mjs`, `limit-scene.mjs`, `offline.mjs`: independent and integration coverage.

Wobbly Wars game-specific source, purchasing, costs and combat were not edited. Existing profiles, games, saves, scores, badges and backup schema remain compatible. Old `limit-forest-v1` records and prior benchmark history remain saved. New scores use `limit-forest-v2` / `forest-2`; traversal measurements identify `living-forest-v2-navigation` and should be compared within the same workload edition.

## Verification results

`npm test` passed all 35 test programs, including the independent 3D starter/toolkit, Wobbly Wars weapon/arm/combat/controller regressions, all other arcade game suites, profile/backup tests, offline precache and session instructions. Full output: `verification/6.2.0/npm-test.log`. The final controller/guide/instruction/release/offline edits were checked again with their affected test programs. `git diff --check` passed.

- Legal complete solo adventure: **46.5 simulated seconds**, zero recoveries. Legal complete co-op adventure: **53.1 simulated seconds**, zero recoveries. These are deterministic simulation times, not wall-clock play times or FPS.
- NPC route/watch/solid-contact tests ran 2400 simulation ticks. All 26 tree trunks, every rock, moving crates and NPC bodies are included.
- Actual Babylon/Havok scene test loaded bundled 41-joint characters, checked selected equipment, source clip palm/blade agreement, actual crate displacement, terrain settling, settings/reset and zero remaining physics bodies after cleanup. Node image objects are fixtures; browser rendering was checked separately.
- Independent standard-controller fixtures check sparse indices, stable two-player ownership, disconnect/replacement, unsupported mapping, deadzones, analog RT, one-shot action consumption and separate player actions.
- Independent DOM/device fixtures check menus/options, A/B confirmation/back, held-button instruction gating, camera/help/pause callbacks, background input blocking and input RAF disposal. The actual adventure disconnect callback freezes its clock until intentional resume.
- Mandatory instructions still defer actual model/scene creation until acknowledgement. Pause freezes the model; restarts remain within the acknowledged session. Benchmarks never award points, and aborted runs do not save measurements.
- Live managed browser preview: final setup and Xbox guide, mandatory solo/co-op instructions, actual colored imported models, separate health/action panels, keyboard movement, action buttons, pause and in-game guide were inspected. Screenshots in this folder show the real preview, not a rendered concept.

## Verification limits

No physical Xbox controller, Windows Bluetooth pairing, USB controller, GPU-equipped Windows PC or physical multitouch touchscreen is available in this environment. Physical pairing/reconnection, stick feel/latency, simultaneous real pads, OS button interception, controller firmware compatibility and real hardware audio activation remain unverified. Controller fixtures are explicitly not hardware tests. Browser autoplay may require an initial screen tap for audio.

The cloud preview uses the labeled software compatibility renderer. It confirms functional rendering and layout but does not validate GPU shaders, high-preset appearance, Windows frame rate or sustained combat performance. No new hardware FPS claim is made. The earlier 6.1.0 software baseline is not presented as a 6.2.0 measurement. The revised automatic baseline is a traversal workload with moving wardens, not a combat stress benchmark; users can run it on their actual device.
