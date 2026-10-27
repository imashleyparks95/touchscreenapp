# Little Big Arcade 6.0.3 — grips, defeat animation and floor layering

Date: 2026-10-26. Started from the published 6.0.2 source, commit `8ca1d3414eee0ee210cc8795d6ffe31b8c8a1f90`. This is the next patch in the existing release system; the restored purchasing UI and natural environment palettes are retained. Project Limit Break is deferred, per the user's explicit scope selection.

## Root causes and implemented corrections

The previous weapon meshes had independent world-space animation. They were not attached to either hand, and the skeleton's arm animation used a separate calculation. The soldier also lacked wrist joints, and its forearm pivots were below the actual elbows. The bow had a one-off geometry rotation, shield offsets were unverified, and projectile origins did not all correspond to actual equipment sockets.

The CC0 soldier now has fourteen joints, corrected elbow pivots and independently weighted palm/thumb meshes on new wrists. Inverse bind matrices preserve the original rest geometry. `scripts/upgrade-wars-hands.mjs` reproduces the asset upgrade from the original model and is idempotent on the upgraded model.

Equipment attaches to actual skeleton bones through the reusable `createBoneAttachments` helper. Weapon-local grip pivots, position/rotation offsets, primary hands, support grips and animation classes are centralized in `wars3d-weapons.js`. Deterministic IK poses in `wars3d-poses.js` drive the visible wrists, contact segments, shield normals and release sockets together. This replaces the independently positioned weapon line.

- **Large weapons:** Club Fighter clubs, Heavy Knight longswords, large axes, giant/golem hammers, banner poles and infantry spears use two hands with synchronized support grips. Handles are long enough for both fists. Shield swords, daggers and mounted lances keep their intended one-hand use; smaller slime clubs remain proportionate to their smaller character.
- **Bows:** Left-hand bow grip, turned shooting stance, synchronized draw hand/string, nocked arrow and arrow-head release point. The stance keeps the bow clear of the body rather than holding it against the face/chest. The shot follows the same ballistic aiming calculation.
- **Other ranged units:** Dedicated rifle geometry and support grip, staff/wand focus sockets, sling release tangent, cannon barrel elevation/yaw and muzzle position, and dragon-mouth flame emission. Flying arrows point along their velocity, with the arrow head at the swept collision point.
- **Shields:** Bone-mounted on the other hand, face outward during rest/block/hit movement; blocking uses the same facing normal as the rendered shield.
- **Living knockdowns:** Havok ragdolls remain functional. Bone-mounted equipment follows physical bones instead of being hidden or left floating beside animation nodes.

## Kneel and fade

Defeated troops lower onto their knees over approximately 1.1 seconds, bend/slump, and begin fading at 1.4 seconds. Fade completes and visual resources are released at 4.8 seconds. Bodies and equipment fade together, using per-instance visibility rather than changing shared materials. Mounted riders lower beside their mount; the mount fades with them.

This lifetime uses unpaused visual time, so the final casualty does not remain frozen when the battle's result clock stops. Pausing freezes the sequence. A retired-ID set prevents removed bodies from being recreated on the next scene frame. Dead troops do not deal damage or continue AI actions.

## Outlined floor defect

The supplied screenshot showed GPU z-fighting between overlapping, nearly coplanar terrain discs. Those discs and the redundant rendered collider top are removed. Four disjoint batches now cover the original 24 × 14 terrain exactly once (84 non-overlapping cells), with the existing palette. Paths/deployment decals use explicit depth bias; collision dimensions are unchanged.

The compatibility renderer's painter ordering also needed floor sides/bottom below the new top surface. That ordering was corrected and checked. Surface triangle winding/normals match Babylon's visible ground faces, preventing a backface-culling hole on GPU rendering.

## Development inspector

`/dev/weapon-inspector/index.html` is a runnable development-only page, absent from normal launcher tiles and profile records. It starts explicitly and supports:

- All 21 classes, three/four representative scales, either primary hand, and animation previews including attack, block, hit, knockdown, recovery and defeat.
- Front, side, rear, overhead, orbit and touch/mouse camera controls.
- Actual bone-local coordinate axes, contact segment and muzzle markers.
- Live positional/rotational/pivot offsets and JSON configuration export. Final values live in the central configuration; no silent browser-local production changes.
- Actual Battle3D combat encounters using the same meshes, bones, physics and rules.

The shared helper and its dependencies/configuration/example are documented in `3D_GAME_DEVELOPMENT.md`. Independent tests use the unrelated starter model with no Wobbly Wars imports before treating the component as reusable. Existing blend defaults remain unchanged; serialized quaternion and optional immediate pose targets are additive.

## Verification completed

| Check | Result |
| --- | --- |
| Full `npm test` | All 26 suites passed: other games, updates/offline installation, profiles/achievements/media backups, independent toolkit/starter, campaigns and actual purchasing controllers. |
| `tests/3d-attachments.mjs` | Independent starter-model sockets, custom names, offsets/pivots, world rotation/scaling, real Havok ragdoll attachment, disposal, unreachable IK and serialized pose targets. No Wobbly Wars imports. |
| `tests/wars3d-weapons.mjs` | 630 actual model/equipment poses across all 21 classes and three sizes, varying world directions; render/contact point agreement below 0.001 mm in the observed run. Maximum support-goal clamp error about 15 mm (inside the stylized hand volume). Mirrored/editable grips, bow nock, shield orientation, every ranged class's actual release and direction, kneel-before-fade, pause, final-result clock and retirement. |
| `tests/wars3d-core.mjs` | 100/100 campaign/difficulty combinations have legal winning formations after the grip/contact changes; normal combat, shield blocks, swept projectiles, budgets and saved formations remain valid. |
| `tests/wars3d-controller.mjs` | 133 real card-to-3D purchases across solo modes/versus/co-op, all 21 cards, costs, refunds, ownership/turn restrictions, gates, records and backup round trips. |
| `tests/wars3d-environment.mjs` | Ten real environments, exact single floor coverage, upward normals/Babylon winding, ordered top/sides, bounded meshes and unchanged rigid-body/collision-map counts. Repeated after final rendering corrections. Active-frame-only core pose evaluation avoids solving support-hand IK during inactive melee recovery or already-released shots. |
| Browser visual QA | Actual inspector sword/club grips, bow draw stance from side/rear/overhead, knee-fall/fade poses, ordinary v6.0.3 release notices/instructions, original cards, desert floor and a completed two-player longsword-versus-club battle (9.6 simulation seconds, Kelly victory), followed by rematch with both budgets/formations retained and no repeated instructions. |
| Source hygiene | Syntax checks for changed modules and `git diff --check`. Buildless project: no transpilation/build command is claimed. |

## Limits and practical follow-up

Cloud browser checks use the existing labeled software renderer because WebGL is unavailable there. The reference GPU z-fighting cause is removed structurally, with GPU face winding/depth settings checked against the pinned Babylon implementation, but physical Windows GPU/shadow/alpha appearance and NEC USB multitouch remain device verification. The software renderer retains painter-order/antialias limitations; it is not GPU image equivalence or a hardware FPS benchmark.

The deliberate stylized rig uses analytic two-bone arm IK and authored poses, not finger articulation, a full-body IK solver or per-triangle weapon collision. Combat uses the weapon's actual swept segment/body target volumes. Existing unit statistics, costs, materials in other games, AI policies, deployment workflows, records, profiles and shared data formats are preserved.
