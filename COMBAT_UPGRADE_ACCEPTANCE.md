# Little Big Arcade 5.3.0 — Air Slice, Wobbly Wars and Castle Creator

Updates the existing private project. Existing profiles, results, achievements, saved media/armies/designs and the once-per-open-session instruction gate remain. No Spelling Adventure or unrelated gameplay changes are included.

## Air Slice — hand-only controls

The active collision pipeline uses the swept path of the palm/finger center derived from wrist, index and pinky pose landmarks. Both hands of both tracked people have independent owner/stroke histories. Wrist confidence plus at least one visible finger is required. Elbows, shoulders, forearms, torso and segmentation silhouettes do not contribute collision geometry or movement speed. The retired arm-sweep export is retained only as a compatibility wrapper around the hand path.

A hand must move at least 6 logical pixels and exceed the selected speed threshold (Easy 135, Normal 180, Hard 225 pixels/second, divided by the sensitivity setting). Samples older than 240 ms, gaps longer than 240 ms, nonfinite coordinates, implausible jumps, low-confidence hands and stationary hands are rejected. Tracking loss clears the hand history so recovery cannot bridge a phantom swipe. Relative swept collisions account for fruit movement; ownership and once-per-fruit scoring are unchanged. Trails use hand endpoints only. Touch/mouse dragging remains an explicit fallback. New comparison keys include hands-v2 so changed collision rules are identifiable; prior scores remain stored.

## Air Slice — stable compositing and measurable fallback

Root cause: an expired/invalid mask caused the renderer to choose the raw video on that frame. The old reliability callback also silently changed the ON preference to OFF. Both paths have been removed. While ON, rendering always draws the virtual environment, then an available transparent foreground, then fruit and effects. It never substitutes the opaque raw camera rectangle. Every accepted mask is paired with the exact captured frame used for that inference; all transferred frame resources close once. Both model masks are merged, and temporary pose-count loss no longer invalidates an otherwise valid union. A camera silhouette never affects slicing.

| Condition | Exact behavior |
| --- | --- |
| Initial detection | Two valid outline results activate the cutout. The virtual scene is visible while waiting. |
| Brief missing/invalid mask | Hold the last complete foreground for 250 ms, then fade it over 180 ms into the virtual scene. No raw-room flash. |
| Captured result older than 300 ms | Reject the stale scene and continue the bounded recovery path. |
| Outline not recovered for 8 seconds | Latch a failure for this attempt, stop requesting segmentation and show a clear status. Do not silently turn the preference OFF. |
| Inference/compositing budget | Over a rolling 2.5-second window spanning at least 1.8 seconds and 8 results, stop outline work if more than 35% exceed 130 ms total processing or 35 ms mask processing. |
| Rendering budget | Over a rolling 2.5-second window spanning at least 1.8 seconds and 3 frames, stop outline work if more than 50% of frame intervals exceed 40 ms (below 25 FPS). Unclamped elapsed render intervals are measured, so very slow devices also trip the guard. |
| Unsupported mask/compositor | Latch the failure immediately. Pose tracking remains available if the device supports it. |
| Sustained failure during play | Pause with scores and clocks preserved. The player deliberately selects OFF for the original webcam or toggles OFF/ON to retry. |
| OFF | Draw the original mirrored webcam with the same fruit, scores and tracking. No restart or record reset. |

The ON/OFF choice is still available in camera setup, the HUD, Pause and Settings, and saves to the selected Player 1 profile. OFF/ON resets scene reliability and explicitly retries mask options without recreating player identity or the world. A failure disables segmentation work for that attempt; it never repeatedly alternates raw/segmented rendering or retries itself. Exit/backgrounding releases camera and model resources. Permission/security errors keep Start disabled and offer explicit touch/mouse play.

**Fallback/removal decision:** the automatic raw-frame switching defect is corrected and covered by actual compositor/renderer tests, so background removal is retained. Its outline quality and speed are not certified on the physical Windows PC. If a physical test still shows repeated missing limbs/transparency or trips these budgets under ordinary play, use OFF for stable webcam play; a further release should withdraw segmentation on that target configuration rather than claim a successful quality fix. Unsupported hardware is not presented as successfully segmented. No paid service, API key, account or camera upload was added.

## Wobbly Wars — movement and synchronized combat

All 21 existing units and six factions keep their prices, base health, damage, cadence, reach and special roles. The same feet-anchored, articulated artwork is used in deployment and normal combat. Walking phase advances from actual traveled distance; heavy/light steps, mounted horse legs, armored giants, stone golems, robes, slime and the flying dragon are distinct. Battlefield floor art now clearly occupies the play plane, rather than placing standing units against a sky/castle-wall illustration. Ground shadows and alternating planted/lifted feet make contact readable.

Normal movement drives the existing Matter torso and a controlled limb pose. A heavy hit releases the existing jointed rig into a recoverable knockdown; after its bounded recovery interval the pose blends back. Defeated units remain defeated, their articulated bodies tumble, and old bodies are removed after seven seconds. Per-unit targets persist briefly, friendly spacing steers crowded formations, ranged units reposition, and the original obstacle routing and flying collision exception remain. This is the existing overhead 2D battlefield; it does not add an unrequested 3D slope system.

Attacks now have windup, active and recovery phases. A strike or projectile release occurs at 40% of the bounded animation cycle; one attack state can release only once. Melee damage requires intersection between the displayed weapon root/tip and the opponent's body during that active pose. Damage never occurs on merely starting the animation. Shared pure weapon geometry drives the renderer, collision check and projectile muzzle. A moved/dead/out-of-reach opponent can cause a miss.

| Existing unit | Ammunition/attack |
| --- | --- |
| Club, guard, spear, knight, giant, scout, lancer, banner, golem, slime, axe | Club swing, shield bash, thrust, sword strike, hammer blow, dagger slash, mounted thrust, banner/staff strike, heavy fist, slime punch, axe chop |
| Archer | Narrow arrow with a gravity arc |
| Slinger | Spinning stone with a stronger curved trajectory |
| Cannon Crew | Heavy cannonball, recoil/smoke and area impact |
| Wizard / Trickster | Distinct magical bolts and charging staff effects |
| Ice Mage | Crystalline shard; existing slowing effect |
| Fire Mage | Animated fireball and area effect |
| Dragon Rider | Mouth-origin directional flame burst |
| Pulse Ranger | Fast futuristic energy pulse |
| Healer | Friendly healing spell; a modest staff defense when no ally needs healing |

The game has no existing crossbow/catapult/rocket-launcher unit, so those were not invented merely to fill an example table. Projectiles use distinct speed, gravity, size, swept collision and impact visuals, with a reusable pool capped at 160. Effects cap at 140. Footstep dust, swings, smoke, spell particles, block sparks and impact rings remain bounded. Weapon-specific synthesized sounds use a shared 85 ms rate limit and modest gains; they do not start one full-volume sound per soldier per frame. Existing large-army limits and saved-army formats remain. Current battle results use wars-v2; earlier premium-v1 results are still selectable.

## Castle Creator — health, purchases and upgrades

Every damageable placed object has current/max health, stable identity, owner, original deployment coordinates, level, material and derived stats. Its health bar appears when damage arrives, smooths the visible reduction, stays fully visible for 2.5 seconds and fades over the next 0.5 seconds. Further damage resets the timer immediately. Troop/archer bars sit above heads, structural/weapon bars above their bounds; the king keeps his HUD health and a temporary overhead indicator. Full-health objects do not start with cluttering permanent bars.

Selecting an inventory item opens a compact purchase preview without spending anything. It shows a live shared artwork preview, cost, health, level/tier, actual damage/cycle/reach, relevant projectile/splash, movement speed, repair output or damage resistance. Locked requirements and insufficient funds are explicit. Tapping a deployed object inspects it instead of purchasing/firing through it. Upgrades require a separate button during construction, display the next real improvements and cost, enforce funds/max level and update the same underlying stats used by combat.

Five tiers apply: Basic, Improved, Reinforced, Advanced and Elite. For a material-adjusted base price C, the four upgrade charges are C × 0.65, 1.03, 1.41 and 1.79, each rounded up to a multiple of five. Costs are tracked as paid investment; dead equipment is not refunded. Upgrades preserve missing health rather than being an unlimited free in-combat heal. Stone/structural tiers emphasize durability and up to 12% damage resistance; soldiers increase melee output, durability and movement; archers improve output/reach/cycle; artillery improves durability/output/splash; repair stations improve heal output.

### Actual standard-material prices and tier statistics

Numbers below are generated directly from the game's shared upgrade calculations. Costs in the L2–L5 column are incremental purchases, not cumulative totals. HP/damage/cycle/reach sequences are levels 1 through 5. Materials retain their established price/health/weight modifiers.

| Object | Base gold | L2 / L3 / L4 / L5 gold | HP L1 → L5 | Damage L1 → L5 | Cycle ms L1 → L5 | Reach L1 → L5 |
| --- | ---: | --- | --- | --- | --- | --- |
| Stone wall | 80 | 55 / 85 / 115 / 145 | 160 → 232 → 320 → 424 → 544 | — | — | — |
| Wood wall | 40 | 30 / 45 / 60 / 75 | 70 → 102 → 140 → 186 → 238 | — | — | — |
| Tower | 150 | 100 / 155 / 215 / 270 | 260 → 377 → 520 → 689 → 884 | — | — | — |
| Foundation | 70 | 50 / 75 / 100 / 130 | 130 → 189 → 260 → 345 → 442 | — | — | — |
| Battlement | 35 | 25 / 40 / 50 / 65 | 65 → 94 → 130 → 172 → 221 | — | — | — |
| Gate | 85 | 60 / 90 / 120 / 155 | 180 → 261 → 360 → 477 → 612 | — | — | — |
| Drawbridge | 65 | 45 / 70 / 95 / 120 | 90 → 131 → 180 → 239 → 306 | — | — | — |
| Arch | 60 | 40 / 65 / 85 / 110 | 100 → 145 → 200 → 265 → 340 | — | — | — |
| Support beam | 30 | 20 / 35 / 45 / 55 | 75 → 109 → 150 → 199 → 255 | — | — | — |
| Stairs | 45 | 30 / 50 / 65 / 85 | 85 → 123 → 170 → 225 → 289 | — | — | — |
| Platform | 35 | 25 / 40 / 50 / 65 | 65 → 94 → 130 → 172 → 221 | — | — | — |
| Roof | 25 | 20 / 30 / 40 / 45 | 50 → 73 → 100 → 133 → 170 | — | — | — |
| Window wall | 55 | 40 / 60 / 80 / 100 | 105 → 152 → 210 → 278 → 357 | — | — | — |
| Barrier | 60 | 40 / 65 / 85 / 110 | 125 → 181 → 250 → 331 → 425 | — | — | — |
| Gargoyle | 20 | 15 / 25 / 30 / 40 | 45 → 65 → 90 → 119 → 153 | — | — | — |
| Cannon | 200 | 130 / 210 / 285 / 360 | 125 → 160 → 195 → 230 → 265 | 28 → 36 → 44 → 52 → 59 | 1900 → 1815 → 1729 → 1644 → 1558 | 420 → 435 → 450 → 465 → 480 |
| Catapult | 180 | 120 / 190 / 255 / 325 | 100 → 128 → 156 → 184 → 212 | 40 → 51 → 62 → 74 → 85 | 2800 → 2674 → 2548 → 2422 → 2296 | 540 → 555 → 570 → 585 → 600 |
| Archer tower | 140 | 95 / 145 / 200 / 255 | 120 → 144 → 174 → 210 → 252 | 13 → 17 → 21 → 25 → 29 | 800 → 752 → 704 → 656 → 608 | 340 → 360 → 380 → 400 → 420 |
| Ballista | 170 | 115 / 180 / 240 / 305 | 115 → 147 → 179 → 212 → 244 | 32 → 41 → 50 → 59 → 68 | 1700 → 1624 → 1547 → 1471 → 1394 | 480 → 495 → 510 → 525 → 540 |
| Reinforced gate | 140 | 95 / 145 / 200 / 255 | 330 → 479 → 660 → 875 → 1122 | — | — | — |
| Spring trap | 80 | 55 / 85 / 115 / 145 | 100 → 145 → 200 → 265 → 340 | 40 → 50 → 60 → 70 → 80 | 2000 → 1910 → 1820 → 1730 → 1640 | 90 → 98 → 106 → 114 → 122 |
| Repair station | 160 | 105 / 165 / 230 / 290 | 100 → 145 → 200 → 265 → 340 | — | 1300 → 1242 → 1183 → 1125 → 1066 | 175 → 183 → 191 → 199 → 207 |
| Barricade | 35 | 25 / 40 / 50 / 65 | 60 → 87 → 120 → 159 → 204 | — | — | — |
| Frost rune | 220 | 145 / 230 / 315 / 395 | 120 → 154 → 187 → 221 → 254 | 20 → 26 → 31 → 37 → 42 | 2100 → 2006 → 1911 → 1817 → 1722 | 260 → 275 → 290 → 305 → 320 |
| Foot soldier | 95 | 65 / 100 / 135 / 175 | 75 → 94 → 116 → 143 → 173 | 9 → 12 → 16 → 21 → 27 | 900 → 870 → 820 → 760 → 700 | 47 → 47 → 47 → 47 → 47 |

### Visible appearance and restoration

Each tier adds hardware rather than only recoloring: breastplates, pauldrons, helmet crests and heraldic trim for people; iron straps, diagonal braces, studs and heraldic plates for structures/weapons. These details fit the existing collision footprints. Construction, inspector and battle call the same object artwork function, so upgrades do not revert on entering combat. An overlapping armor overlay discovered during browser QA was corrected so faces stay visible.

At a successful wave clear, only surviving objects are retained. The same IDs, owner, material and levels move back to their recorded original positions and recover to current upgraded maximum health. Temporary physics, hurt indicators and target state reset. Airborne soldiers are not treated as unsupported structures when an unrelated wall collapses. Troops do not remain scattered on the enemy side; dead objects are not recreated or duplicated. The living king also heals to 800. Zero king health ends the game and cannot be bypassed by regeneration. Newly placed reinforcements get the same identity/home data and reserve the return positions of living marching troops, preventing end-of-wave overlap. Saved designs and backups retain levels/home/IDs, and saved king levels are included. Old designs get safe level-one/default identity data in runtime copies.

Clears remain an untimed preparation phase with explicit Start Assault. Each actual defeat adds 8 gold; each cleared wave adds 90 + 15 × wave gold and one repair supply (maximum eight). The first Hard siege still starts with 1,500 gold and the basic starter still costs 390. Destroyed investment remains charged to the deployment ledger; removing a living object during construction frees its investment for a different build. This makes keeping upgraded equipment alive materially useful.

### King balance and related siege changes

The old unlimited-range 45-damage cannon-like shot every 650 ms is removed from normal defense. The basic royal star deals 3 damage every 1,400 ms, has range 240, and no splash. It fires from the king's staff area automatically at nearby enemies; taps can aim only within the same range/cooldown. Player-vs-castle siege attacks retain their separate 12-shot rules.

| King level | Damage | Cycle ms | Range | Next upgrade gold |
| ---: | ---: | ---: | ---: | ---: |
| 1 | 3 | 1400 | 240 | 110 |
| 2 | 5 | 1350 | 260 | 180 |
| 3 | 8 | 1250 | 280 | 280 |
| 4 | 12 | 1150 | 300 | 420 |
| 5 | 18 | 1050 | 320 | MAX |

The king's five attack tiers cost 990 gold in total. He remains the protected objective; even his elite damage is modest relative to upgraded troops/artillery. Royal-star artwork is distinct from arrows/cannonballs. To offset removing the old king's map-wide damage, automatic defenses prioritize flying/siege threats appropriately, enemy catapults use a 2.6-second firing cycle, rams use 200 base health/38 damage, and bosses 500/38. Varied spawn timing, exact quotas, capped siege engines, permanent kill unlocks and the separate automatic banner remain. Flying enemy motion now has a stable unit-based phase, and weapon aim accounts for observed target movement. New Castle scores use castle-v3; castle-v2 and premium-v1 records remain selectable.

## Verification and remaining limits

The release runs the full 16-suite npm test command. The original 15 suites remain, plus combat-upgrades covering these new contracts. Targeted tests cover four independently owned hand sweeps; elbow-only/stationary/stale rejection; the actual compositor and renderer never drawing raw video while ON through good/missing/expired/fatal states; OFF restoring raw video; mask/frame ownership; explicit model retry; persistent preferences; all 25 upgrade paths, exact costs, caps and shared previews; original-coordinate survivor restoration with full upgraded health and stable IDs; no resurrection; health fade/reset; destruction investment; and king damage/range.

Wars tests exercise all 21 unit artwork/weapon poses, melee contact, no windup damage, proper muzzle releases, normal gait, knockdown recovery, permanent defeat, deterministic replay, all 20 Hard campaign wins and bounded 48-unit/288-body simulations. Castle solution checks clear all 20 Hard campaigns with legal purchases, earned progression and between-wave actions, including the challenge resource restrictions. These are genuine model/control simulations rather than decorative output. They are not proof of every formation or every difficulty/level combination. Other arcade/media/spelling/instruction/backup regressions remain included.

Browser QA exercised the actual purchase panel and two upgrades (95-gold soldier, then 65- and 100-gold upgrades), the actual shared preview and live mixed-army Sandbox battle. Measured Castle instruction bounds at 1366×768 were 1120×729.84 with no internal scrolling. The inspector was 400×207.78 at both 1366×768 and 1920×1080, inside the gameplay viewport; the 1366-wide game had no horizontal overflow. Air Slice's two-player hand instructions, immediate ON/OFF controls and explicit HTTPS camera error were checked in the real UI. No camera request occurred before acknowledgment and Enable Webcam. Temporary layout QA files are removed before shipping.

**Hardware verification limit:** the preview origin is HTTP and correctly refuses camera access. No physical webcam, rapid real-hand slicing, hair/finger edge quality, overlapping real children, GPU inference speed or Windows touchscreen/USB multitouch test was available. No generated imagery or pointer fixture is represented as a live webcam test. The code prevents raw-room flashing while ON, but smooth real-person segmentation and 60 FPS on the target PC still require that physical test. Use OFF if that device cannot meet the stated thresholds. Native Windows fullscreen and actual speaker playback were also not verified here.
