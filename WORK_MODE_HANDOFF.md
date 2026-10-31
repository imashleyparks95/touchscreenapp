# Work Mode handoff — Sports Resort first playable Bowling · 6.34.0

Repository imashleyparks95/touchscreenapp, branch sports/resort-bowling-foundation, base 31eb2df1cd0c8a73a6919b64c5c7d4a79fa97d27. Exact tested application publication pin is recorded below after push verification.

Read AGENTS.md, ARCADE_REVAMP_PROGRESS.md, docs/SPORTS_RESORT_PROGRESS.md and docs/SPORTS_RESORT_BOWLING_DELIVERY.md. Original spec: docs/SPORTS_RESORT_MASTER_PLAN.md. Runtime source dist/; game modules dist/js/sports/; tests tests/sports-*.mjs; evidence docs/revamp/RESORT_*. Runtime 6.34.0. M1/M2 first checkpoint only: complete Bowling plus real local body/coarse-hand motion; Tennis/Boxing/Baseball/Golf are planned, full finger tracking not delivered.

## Existing deployment destination

Deployment authorized through the standing milestone handoff. Serve dist/ to existing Sites project appgprj_6adab219a4788191952c4c83432002c5. Preserve https://little-big-arcade-parks.diladiop.chatgpt.site, its access policy and every saved profile/score/achievement/design/song/media/sound. Do not create a replacement site, reset storage or force an update during active play. Fetch the exact published source, deploy with Sites tools, verify deployed commit and live 6.34.0, return the existing URL. Git push/build is not deployment; none was performed in the coding workspace.

## Verification

69 full test programs plus final focused checks; six browser suites and 170 responsive/accessibility audits. Complete mixed touch/controller two-player ten-frame real Havok Bowling, complete unranked practice, validated saves/backup, synthetic calibrated trajectory through actual motion/UI into real ball, camera denial/late result cleanup, actual bundled local blank-video inference and unmodified production offline reload/RAF/physics/model. Audit/build: 28 worlds, 299 cache entries, 200 dependencies, all 98 original hashes intact.

## User trial

1. Open Sports Resort; choose Bowling, solo or two named players, inputs per player, mode/difficulty/graphics and avatar/preferred hand. Acknowledge How to Play. Other four cards must say planned.
2. Camera requires explicit Enable. Stand alone in good light with shoulders/hips/hands visible. Complete neutral, reach, return calibration. Make a comfortable backswing then forward release. Test left/right hand, mirror, stillness, lost/extra people and recalibration. No ball should launch from stale/low-confidence poses. Check backend, frame age, inference and tracking FPS in diagnostics. A second person must step aside during the active bowler's turn.
3. Try touch/keyboard and native controller (stick aim, RT charge/release, A fixed release; Menu/View pause/help). Try one shared controller and mixed camera/controller/touch two-player turns. Play all ten frames including fills; verify scorecards, strikes/spares, ties, rematch and profile records. Practice must not award XP/records. Pause mid-ball and after resolution; Continue must preserve the correct rack.
4. Exit/background/reopen, deny camera and switch to an explicit fallback; verify camera capture releases and nothing scores across pause. Check sound, full-screen physical USB multitouch/controllers and real Windows frame pacing. Recheck old games, Beat Lab projects/exports and backup; never clear storage to update.

Cloud software GPU blank-video tracking measured about 442 ms inference, 443 ms frame age and 2.2 FPS; stale frames are blocked. Physical webcam accuracy and usable latency are not certified. A short software-WebGL Bowling sample reported 50 FPS/48.2 ms p95, not a sustained target-PC result. See delivery report for exact limitations.

Stop for the user's deployed trial before M3 Tennis. Do not infer physical acceptance from automated fixtures.
