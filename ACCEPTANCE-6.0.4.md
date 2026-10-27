# Wobbly Wars combat and arm correction — 6.0.4

Verified October 26, 2026 (America/New_York). Targeted patch on the existing Little Big Arcade project; no separate app or engine/UI redesign.

## Causes and corrections

1. `Battle3D.hit` unconditionally set a stagger deadline and cleared `u.attack` for every hit. Routine damage now updates health, statistics and a bounded visual reaction without changing the attack object, timeline, cooldown, release flag, previous tip or hit history. Only death and explicit statuses cancel attacks.
2. Immediate damage during sequential unit updates let an earlier unit cancel or kill a later unit before an already-due counter-hit. The fixed step now collects melee/projectile contacts first and resolves their damage afterward, then evaluates victory. Nonlethal and lethal simultaneous trades work in either iteration order.
3. The broad original soldier had only .204 m upper arms and .21 m forearms. Several centerline two-handed poses could not provide anatomical reach plus body clearance. The CC0 model's existing sleeve/forearm geometry, normals, elbow/wrist rest translations and inverse bind matrices were refitted to .283 m upper arms and .29 m forearms. Shoulder positions remain unchanged; no runtime bone stretching is used.
4. The IK elbow pole depended on the weapon's rotation, allowing the elbow to fold inward as a weapon turned. Both elbows now use outward guidance in the torso frame. Carrying, striking, shield, spear, rifle and bow targets fit the corrected model. Heavy/spear torso stances retain forward walking leg motion. The bow's draw hand raises/returns around the chest, with an appropriate cheek-height aim and reach-compatible draw length.
5. Normal hit feedback is an additive torso/head recoil over the same attack phase and hand IK. The shared pure `combatAction` priority is death → knockdown → recovery → stun → stagger → attack. `applyStatus` provides deliberate interruption/recovery; `WAR_IMPACTS` centralizes the existing heavy-ability thresholds rather than making ordinary damage a stun.

## Changed files

| Files | Purpose |
|---|---|
| `dist/js/wars3d-core.js` | Non-interrupting routine damage, deferred same-step contact resolution, explicit statuses/heavy abilities. |
| `dist/js/3d/combat.js`, `dist/js/3d/index.js` | Additive, independently tested action-priority and hit-envelope interfaces. Existing APIs remain compatible. |
| `dist/js/wars3d-poses.js`, `dist/js/wars3d-weapons.js` | Corrected bind dimensions, outward elbow guidance, natural carrying/combat/bow paths, mirrored support grips, normal-hit overlay and unarmed inspection pose. |
| `dist/assets/wars3d/soldier.glb`, `scripts/fit-wars-arm-reach.mjs`, asset README | Actual model/bind correction and an idempotent reproduction script. Face, costume, colors, wrist weights and triangle count preserved. |
| `dist/dev/weapon-inspector/index.html`, `inspector.js` | Unarmed preview, simultaneous normal-hit overlay, explicit status previews and health diagnostics. No player-record writes or launcher tile. |
| `tests/wars3d-exchanges.mjs`, `wars3d-arm-clearance.mjs` | Five requested combat scenarios and dense actual-skin checks. |
| `tests/3d-toolkit.mjs`, `wars3d-weapons.mjs`, `wars3d-core.mjs` | Independent shared-function tests, actual WARS Havok recovery/attachment tests, and a legal forward counter-formation for campaign verification. |
| `package.json`, lockfile, `dist/js/releases.js`, `dist/sw.js`, `tests/offline.mjs` | Existing patch version advances 6.0.3 → 6.0.4, existing first-launch app/game notes, coherent offline cache and test scripts. |
| `3D_GAME_DEVELOPMENT.md`, this report, `verification/6.0.4/` | Interfaces, reproduction/testing instructions, results and visual evidence. |

No changes to troop costs, unit stats, level definitions, purchasing UI/controller, placement, profiles, saved-data schema, other games, battlefield environments, physics engine or launcher implementation. Wrist attachments, shield normals, projectile origins, natural colors, floor fix and kneel-and-fade defeats remain.

## Automated verification

`npm test` completed with exit 0: **28 suites**, including unrelated games, profile/media backup roundtrips, achievements/records, input ownership, instruction gating and offline/update activation. JavaScript syntax checks and `git diff --check` passed. Running `fit-wars-arm-reach.mjs` again is a no-op.

- **Scenario A:** actual swords connect simultaneously, nonlethally and lethally, in both unit iteration orders. Both swings register; lethal trade is a draw.
- **Scenario B:** mid-swing damage retains the same attack object, progress, hit Set, previous tip and cooldown; the preserved swing later damages its target.
- **Scenario C:** continuous ordinary hits from multiple sources cannot lock a unit out; it completes repeated attacks.
- **Scenario D:** a real swept arrow damages an attacking swordsman while its swing and the archer's shot cycle continue.
- **Scenario E:** explicit heavy knockdown cancels the action, enters recovery and resumes combat. Explicit stun/stagger work; death stays terminal.
- **4,902 poses / 970,596 actual skinned-vertex checks:** all 21 classes, full swings with/without damage overlay, movement phases, both hands, supported high/low pitch, explicit statuses, kneeling death and unarmed stance. Forearm/wrist joints and tested arm vertices stay outside the torso core. Maximum IK target error rounds to **0.000000 m**.
- **630 real Babylon model/equipment poses**, 21 classes and .5×/1×/1.4× scales: rendered grip/tip versus contact geometry error rounds to **0.000000 m**; support gap **0.0000 m**. Bow nock, shield orientation, ranged release alignment and mirrored attachments pass.
- Actual corrected WARS sword, spear, bow, shield and rifle rigs undergo Havok ragdoll, recover, resume aligned attacks and release all physics bodies. Independent starter-model socket/IK tests remain separate.
- **100/100** campaign/difficulty combinations have legal winning formations; no unresolved levels or stalemates in the final solution run. Expert level 19 is countered by a forward Pulse Ranger/Shield Guard formation. No level/stat/budget nerf was introduced.
- **133 legal purchases**, every class, all solo modes, versus and co-op: costs, refunds, budgets, readiness/turn restrictions and card dragging pass. Multiplayer match/series and independent co-op records pass.
- Independent toolkit tests complete one- and two-player starter games, with real Havok, asset disposal, camera/input and local audio checks.

Final full-suite CPU simulation samples: 16 units 205 ms total for 25.3 simulation seconds; 48 units 1,777 ms for 25.4 seconds; 96 units 2,149 ms for 21.2 seconds. These are CPU simulation measurements under test load, **not rendering FPS or Windows hardware benchmarks**.

## Browser verification

- Actual model inspector: longsword attack plus normal-hit overlay from side/rear/overhead, spear thrust, raised bow/draw hand, shield facing forward and unarmed walking. Visible hands/forearms clear the torso; equipment stays attached.
- Both existing **6.0.4** update notices displayed their new app/game-specific changes. Default Hard remains selected.
- Full game: acknowledged instructions, purchased/deployed a knight (180), spear (85) and archer (95), total **360/370**, leaving **10 coins**. Unaffordable cards disabled correctly.
- Actual Hard campaign battle completed with **Blue victory at 15.5 game seconds**, two survivors, three defeated enemies, 513 damage and ten projectiles. Result saved automatically.
- Edit & Rematch restored all three units and the 360/370 budget without repeating mandatory instructions.
- Browser input delivery occasionally timed out while compatibility rendering was busy. Fresh UI reads confirmed purchases/start completed, so no action was blindly repeated or charged twice.

![Side view: attack with normal-hit overlay, visible two-handed grip](verification/6.0.4/arms.jpg)

![Actual full-game victory report](verification/6.0.4/victory.jpg)

## Limits

This cloud browser has no WebGL context and used the explicitly labeled software renderer. Windows GPU lighting/depth/shadows, target-machine FPS and physical NEC/USB multitouch remain unverified. Software painter ordering is not an exact GPU-depth preview.

The mesh guard checks torso-core penetration, all forearm/cuff/palm/thumb vertices and distal sleeves, with dense sampled poses. The proximal sleeve intentionally joins beneath shoulder armor; small costume/shoulder seams are not a promise of zero intersection for every triangle. Recovery uses the established blend, and knockdown uses the existing quality-capped Havok rig.

The project is buildless HTML/ES modules: there is no production transpiler/build command. Runtime syntax, actual GLB/WASM imports, offline assets and the full test suite were verified; the Sites workflow packages the exact tracked source/static output.

## Source provenance

Existing Site: `appgprj_6adab219a4788191952c4c83432002c5`. Opened existing source via the supported workflow at base commit `16a920ca52cb9d21e823211926e55772349e3dd7`; existing owner-private access retained. Final helper/package/deployment results identify the exact resulting commit and archive.
