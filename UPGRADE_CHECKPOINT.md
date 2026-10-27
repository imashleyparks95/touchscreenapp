# Little Big Arcade — Neon Arcade Universe release handoff

Implementation and validation completed on 2026-10-23. This continues the existing project; it is not a replacement Site.

Project: appgprj_6adab219a4788191952c4c83432002c5
URL: https://little-big-arcade-parks.diladiop.chatgpt.site
Source: /workspace/sites/little-big-arcade
Hosting: buildless static dist/; preserve owner-private access.

## Delivered

All original games retained, Creative Studio expanded from Wall Canvas, Beat Lab added. Shared five-level difficulty defaults to Hard; eligible games support fair simultaneous touch zones or identical seeded alternating turns. Real target reaction measurements exclude pause. Completed results alone enter separate per-player/per-game/per-difficulty/per-mode boards. Profiles, real achievements, XP/levels/cosmetics/themes, rivalry records, and original unassigned scores persist. No seeded scores or fabricated competition results.

Creative Studio supports painting/shapes/fill/spray/undo/redo, categorized editable stickers, JPG/PNG photos, size/rotation/two-finger transforms/crop/layer ordering, collaborative colors, editable saves and gallery, real PNG/JPG exports. Blank canvases do not earn achievements.

Beat Lab supports 16 real synthesized sounds, multi-pointer pads, imported audio and actual trimming, per-pad resampled transpose/volume/mute/solo/gated loops, 60–200 BPM, tap tempo/click/play/pause/stop/loop, 16/32-step patterns and song arrangements, live+sequenced recording and replay, projects/autosaves/custom banks, and real offline-rendered MP3 export in a worker. Pitch resampling changes sample speed/length while BPM stays independent; this is explained in the UI. Beat Battle is an optional unranked creative activity with equal starting banks and tempo, not a fabricated music-quality scoring system.

The neon lobby, all modules, gestures, volume controls, fullscreen and reduce-motion controls are implemented. Required fonts and MP3 encoder are self-hosted. Offline cache handlers and complete backup/restore including binary samples are included. Restore validates the full backup before writing and rolls profiles back if media restoration fails. Licenses/MP3 encoder corresponding source and credits are included in dist/vendor.

## Verification

- npm test passes: default empty records, old-score migration, profile and difficulty/mode isolation, ties/wins/streaks/rivalries/achievements, no idle XP, genuine sound buffers and independently verified worker MP3 output.
- Game harness passes 140 game/difficulty/mode combinations and targeted tests of actual difficulty changes, simultaneous independent pointer IDs, seeded fairness, precise stimulus timing excluding pause, abandoned-round exclusion, alternating turns, discovery completion, and scored physics collisions.
- Binary backup round-trip, invalid-file rejection/no mutation, successful restore, failure rollback and prior-media preservation pass.
- Offline tests verify every required file exists, cache installation/activation, offline HTML/modules/font/MP3 worker/encoder and navigation fallback.
- Browser: every original scored game launches/counts down/exits cleanly; Creative Studio and Beat Lab launch; no application runtime errors in inspected logs.
- Browser: actual drawing, sticker placement, photo import, crop, undo/redo, editable gallery save/reopen, collaboration toggle, PNG and JPG downloads. Independent image inspection confirms both 1440x900 and correct file formats.
- Browser: actual MP3 import 2.638s -> trim to 1.319s; +2-semitone transpose preserves BPM100; bank save/load/cancellation; 512 working cells for 16x32 sequencer, patterns/arrangement; live+sequence recording and project reopen.
- Browser MP3 exports independently checked with ffprobe: codec mp3, stereo,44100Hz. Recorded take:12 hits/9.6s, MP3 duration9.87425s including tail/padding. No WAV relabeling.
- Browser: real two-player touches produce separate scores and measured reactions; completed records persist across reloads; matching leaderboard rows and profile statistics verified.
- Browser: full backup exported, parsed/validated independently, restored, and saved art/music/custom samples reopened afterward.
- Browser: fullscreenchange updates visible Exit Fullscreen button and aria-pressed=true. Arbitrary P1/P2 pairing and saved-bank switching/cancellation verified.

## Limits to communicate honestly

Browser QA used controlled Chrome, not the user's physical Windows USB display. Real hardware simultaneous touch reporting and audio latency remain to be checked on that display. The built-in touch test supports that check. Offline handlers/resources were tested in isolation; the HTTP preview cannot register a service worker, so final HTTPS/Windows offline behavior was not directly exercised here. Initial access to the owner-private URL may require online sign-in in a new browser.

## Maintenance

Read Sites skill before further changes. Use native get_site and a fresh source credential, preserve project ID and audience, synchronize/package exact source before deployment. No extra Library copy of this git-backed project is needed. Final publication state is owned by Sites native deployment results, not this document. Do not ship browser QA profiles/media as application seed data; they live only in preview browser storage. New users start with Kelly/Roxy/Niko and zero records.


# Studio improvements — version 3.1, 2026-10-23

Beat Lab now opens on a large sequencer with 16/32 steps, named/colorful rows, per-track clear, four editable presets, sound bank/individual sound picker on the side, animated playback with horizontal following, arrangements, and sticky bottom Play/Pause/Stop/Record Song/BPM/Save controls. Original 16 pads are a separate Drum Pads tab; advanced import/waveform/trim/transpose/mixer functions remain in a nonoverlapping expandable panel. Audio-clock tempo changes take effect at the next unscheduled step, no double timers, lag recovery avoids burst notes, pause resumes next step. Long sample endings are fully included in song export.

New microphone.js records via getUserMedia + MediaRecorder only after Start; timer and actual RMS level, final-chunk decode, waveform with genuine trim, preview, re-record and touch-named save to any track. No monitoring feedback. Guards prevent duplicate or competing recorder/playback sessions. Denied/missing/busy/unsupported/disconnected input has actionable messages. Tracks are stopped on completion/hide/exit, including late permission resolutions. Saved microphone PCM uses the existing project/bank/backup and OfflineAudioContext -> MP3 paths. Max microphone take60s; song recorder remains separate at5min. Microphone APIs/controller and full panel flow were exercised with simulated devices; physical microphone testing was unavailable in HTTP preview.

Creative Studio now has named/avatar P1 left and P2 right toolbars, independent tools/color/palette/size/fill. Pointer settings are captured on touch-down by starting half and retained across the canvas. Preferences save with art and old artwork gets defaults. Shared stickers/photos/layers moved to explicit controls while canvas stays large. Existing gallery/layers/import/export/undo are preserved.

Shared keyboard.js serves both Save Project flows plus renaming/sample/bank names. Large letters/numbers/Space/Backspace/Clear/Cancel/Save, physical input support, save-error retention. Explicit rename in both shelves. Active-profile saves and editable project IDs persist; opening another player's music creates a copy on Save. No DB key/store/version changes, no profile/leaderboard resets. New modules are in the updated offline cache.

See IMPLEMENTATION_ACCEPTANCE.md and tests/studios.mjs for priorities, acceptance and evidence. npm test includes four suites. Browser QA confirmed saves/reopen/rename, imported samples/trim/pitch, arrangements/recording and MP3 export (independent ffprobe), drawing controls/photo/stickers and1440x900 PNG export. Browser QA storage is test-only and is not shipped. Site owner/audience unchanged.

# Build & Smash — version 3.2, 2026-10-23

Existing build game now launches independent smash.js via shell.setupGame('build'); original other games and legacy engine behavior/data remain. New modules: smash-levels.js (30 authored blueprints/materials/shapes/projectiles/themes), smash-physics.js (Matter fixed120Hz engine, concave arch via poly-decomp, collision-energy damage, fragments, blasts, six projectiles, stable deterministic resets), smash-records.js (real result comparison, stars/progression, isolated campaign boards), smash.js (campaign, touch canvas, alternating matches, builder, shared family gallery and records).

Matter.js0.20.0 and poly-decomp0.3.0 are pinned npm dependencies, copied into dist/vendor with MIT licenses. Classic scripts load before shell; physics module reads those globals. Required modules/vendor assets enter the new offline cache. Node_modules ignored; production archives contain dist assets only.

Profile/database keys and IndexedDB store/version stay unchanged. commitRound accepts optional explicit winner and demolition metadata; default behavior for old games is preserved. New ruleset demolition-v1 records separate level/difficulty/mode/competition/content key, with valid stars/shots/time/full-clear data. Generic Hall of Fame keeps old timed Build scores and links to the new campaign records. Seven genuine achievements added. Custom matches store separate records/friendly wins without arcade points/XP. Backup recognizes and validates structure items and new record fields.

30 levels all have verified full-clear strategies on Hard using their actual available shots and unlocked projectiles; tests/smash-solutions.json stores replay fixtures. Finale uses six Hard shots for its30 blocks, earlier expert levels generallyfour/five; Expert difficulty reduces shots and raises durability. 150 idle level/difficulty worlds remain stable. Exact reset/identical-input simulations match. Actual UI match completion, winner/tiebreaker, no premature/double commit, clock pause, first-player alternation, record/progression/backup and shared-gallery handlers tested.

Every saved custom structure is listed for every local arcade profile in Family-built levels, with creator credit and direct Play. Other profiles save copies when editing. Browser verified Roxy and Niko playing Kelly’s MY FORT, and Niko Remix preserved Kelly’s original. Shared levels are local to the browser/device, not synchronized between computers. Existing backup/restore remains available.

Browser QA: real slingshot hits, counted breaks, paused clock, solo completion/leaderboard, Kelly/Roxy alternating match result, Roxy-first rematch, five-shape builder placement/undo/redo/test/reset/touch-named save/reopen and custom challenge loading. No application errors in inspected logs. Physical Windows touchscreen/audio/offline limits are stated in SMASH_ACCEPTANCE.md. Browser QA media/results stay in preview browser storage and are never shipped as seed data.

## v3.3 Gameplay refinement

- Uploaded six-game brief implemented in `refine-core.js` (deterministic models), `refine-render.js` (canvas graphics) and `refined.js` (touch UI, match host, records and persistence).
- Existing six game tiles route to the upgrade; the earlier engine and its records stay intact. Build & Smash, family levels, Beat Lab and Creative Studio are preserved.
- New records use `refinement-v1`, mode/series level IDs and explicit match winners. Scores remain separate from legacy versions, learning, solo/VS, difficulty and variants. Battle series use average points per round; shootouts use success-rate points.
- Excavation uses media type `excavation` in the same IndexedDB store. Profiles can also contain real treasure collections. Backup validator supports the new type and preserves orphaned media when an old owner profile has been removed.
- Full priorities and acceptance criteria are in GAMEPLAY_ACCEPTANCE.md. The new tests are included in `npm test` after the existing regression suites.

## v3.3.1 Fullscreen correction

- Replaced the narrow, aspect-capped minigame canvases with full-width fields that flex into the space left by their real headers and controls.
- Added a canvas-only container and ResizeObserver; pointer mapping still uses the actual rendered rectangle. Touch targets use the smaller live axis as their minimum scale.
- Build & Smash campaign/builder canvases also use all available content width. Beat Lab and Creative Studio keep their existing full-viewport workspaces.
- Browser measurements and a real resized slingshot launch passed. Regression coverage includes right-edge targets at the user's 1911-pixel width and split-zone coordinates.

## v3.4 Monster Café plate restoration

- Restored immediate ingredient-on-plate assembly for every recipe; removed cooking sessions, burn states and prep validation. All 45 ingredient IDs, seven categories and 20 recipes remain.
- New `cafe-controls.js` renders the categorized pantry and accessible removable plate chips. The plate/Serve controls stay visible independently of the pantry and order list.
- Difficulty still changes ingredient pools, recipes, concurrent customers, patience, helpful highlights and explicitly marked stack preferences. Learning quantities and stack order agree. Real consecutive perfect orders raise score multipliers.
- `plate-1` records are separate from earlier `classic-1` cooking scores, which remain viewable. Profiles and existing other-game data are untouched.
- Browser checks at both requested resolutions passed; all 45 ingredients are accessible at 1366 × 768, and real drag, remove and direct Serve interactions passed.

## 2026-10-24 Circuit / secret face update

- Source includes the three new gameplay modules, supplied PNGs and shell integration. Penalty remains only as legacy implementation/data support and is no longer launchable or shown in game menus.
- Existing sizing CSS restored; Café retains scoped fit rules. Text selection and native image drag suppressed outside editable fields.
- New acceptance suite: tests/circuit-face.mjs; implementation notes: CIRCUIT_FACE_ACCEPTANCE.md.
- Browser checks complete: Café and Expert Circuit Battle fit both requested resolutions, drag connections work, logo reveal repeats, a Survival result persists after reload, and secret badges are absent from ordinary trophies. Temporary layout harness removed. Final publication uses the existing owner-private Site. Physical USB multitouch remains a local device check.

## 2026-10-24 Three additional touch worlds

Slime Lab, Monster Dentist and Shadow Ninjas are implemented in independent model/render/controller modules. All 60 race levels and 30 clinic cases have control-driven completion checks. Full old/new test suite and browser layout/save checks pass. New documentation: TOUCH_WORLDS_ACCEPTANCE.md. Existing game implementations and secret activation are retained; only common registration, metadata, badges, sounds, cache entries and new scoped styles were added. Temporary browser layout harness removed before packaging.

## 2026-10-24 Gravity Chaos replacement

Treasure Diggers is retired from all active lobby, launch, quick-play and record selectors. The stored dig results, collections and excavation media validator remain for backup compatibility. No unrelated game implementation or saved project schema was changed.

Gravity Chaos runs independent Matter.js fixed 120Hz worlds, with swipe gravity preserving momentum, touch platform drag/two-finger rotation, switch/door/falling-block chains, tap bumpers, held safety, finite shields and drawn temporary physical ramps. It has 30 geometrically distinct authored courses across all five difficulties (Hard default), plus independent simultaneous two-player race, orb and survival modes and best-of-five. Later routes require two gold orbs and a switch; some higher difficulties limit flips. Checkpoints retain collected orbs.

New gravity-v1 records separate level, difficulty, mode, player count and series length. Six badges, family progress and exact match winners use existing profiles/rivalries. A completed best-of-five stores one result per player with its round details. No in-progress match is committed. New assets enter the versioned offline cache.

All 150 level/difficulty combinations have legal control-driven zero-mistake completion replays within actual budgets. Full npm regression suite passes. Browser QA covers swipes, a solo clear and persisted record after reload, two-board independent gravity, actual ramp drawing, pause and both 1366×768/1920×1080 control layouts. See GRAVITY_ACCEPTANCE.md. Temporary viewport harness removed before packaging.

## v4.0 Premium expansion

Five new games are implemented: Castle Creator, Buddy Mayhem, Doodle Defenders, Robot Repair Shop and Wobbly Wars. Independent models implement real physics, support/damage, drawings, repair gestures and combat AI; shared session controls provide the appropriate simultaneous, cooperative or alternating competition, completed-match recording, saved creations and earned unlocks. There are 17 ordinary lobby worlds, and Feed the Face remains hidden.

Slime now requires anchored pull/release slings. Feed the Face uses tap aiming, independent food choices and launch-time request fairness. Dentist has clearer original patient silhouettes, mouth and tooth treatment targets. Original illustration assets are integrated across lobby/game covers, characters, scenery, objects, foods, tools and instruments. Existing database/schema and legacy record support are retained, with new scoring rules isolated. Hard remains default.

See PREMIUM_ACCEPTANCE.md for exact gameplay scope, automated completion coverage, browser checks and hardware verification limits. All 150 Slime difficulty/course variants and 100 authored Doodle difficulty/level variants were verified, alongside 20 Hard Castle and 20 Hard Wobbly campaign victories, 235 full repair jobs and all Buddy challenge/difficulty variants. Temporary browser sizing harness removed before packaging.

## v4.0.1 Buddy neck / Ladybug fit / game instructions

Buddy's head now follows the torso with damped motion, ±29° neck limits and stable attachment; the rest of the ragdoll remains free. Ladybug alone uses a properly bounded flex/grid playfield, proportional render/input transform and full-illustration movement bounds, without changing its difficulty or scoring mechanics.

A shared mandatory How to Play dialog now gates all 17 normal games and the hidden face game before gameplay creation. It has dedicated rules, gestures and multiplayer explanations; focus is contained, Escape/backdrop cannot skip, starts are delayed until the acknowledgement click finishes, and disposal cancels pending starts. New sessions/rematches show it; in-session Restart does not. Art/music studios now have an explicit Play entry.

All existing automated suites plus tests/launch-fixes.mjs passed. Browser checks covered 36 instruction windows across both requested sizes, no startup behind them, secret two-player access, visible Expert Ladybug split fields, solo/fullscreen, and restart behavior. See INSTRUCTIONS_NECK_SIZING_ACCEPTANCE.md for exact scope and verification limits. Existing storage, saved projects and ruleset identities remain unchanged.
