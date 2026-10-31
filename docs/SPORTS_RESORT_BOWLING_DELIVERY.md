# Sports Resort — first playable checkpoint · 6.34.0

## Delivered scope

Milestones 1/2 are combined for the first deployed trial as requested by the specification's final directive. Bowling is playable; Tennis, Boxing, Baseball and Golf are explicitly planned. Pause before Milestone 3. The original specification is retained verbatim in SPORTS_RESORT_MASTER_PLAN.md.

The local motion foundation reuses the existing bundled MediaPipe PoseTracker, PoseIdentities and LocalMediaSession. It tracks body joints and coarse wrist/thumb/index/pinky landmarks, not a separate 21-point finger model. Body-relative neutral/reach/return calibration, confidence and identity checks, smoothing, temporal backswing/forward extension, neutral rearming and cooldown drive actual Bowling throws. Mirroring and preferred hand are configurable. Missing, overlapping, jumped or stale poses cannot score. Total frame age of 250 ms or greater blocks readiness even if reported inference time is short. Two-person diagnostics are available; Bowling uses one active camera bowler with conservative recalibration between players.

Camera permission requires acknowledgement plus explicit Enable. Processing is local, without microphone, recording, uploads or face recognition. Startup timeout, denial, late permission/model results, backgrounding and exit release resources safely. Diagnostics expose backend, confidence, calibration, inference time, total frame age, delivered tracking rate and coarse-hand status. Generated fixtures are never normal gameplay input.

Bowling uses actual Babylon/Havok sphere/pin contacts, ten-pin geometry, friction/spin, gutters, settled-pin detection and spare survivors respotted upright at their actual planar positions. Complete ten-frame rules include deferred strike/spare bonuses and tenth-frame fill racks. Solo and alternating two-player mixed inputs, quick/practice/challenge modes, scorecards, pause/help, per-ball source provenance, validated compatible records/backups and original avatar/alley/cover artwork are implemented. Practice does not award ranked scores or XP. Controller stick aims, RT charges/releases and A provides a fixed-power release; touch/keyboard remain explicitly distinct sources. Input changes cannot bypass an in-flight ball. Pausing after resolution preserves the next rack correctly.

## Implementation entry points

Authoritative source is dist/. Game-owned dist/js/sports/: resort.js (UI/lifecycle), bowling-core.js (rules), bowling-scene.js (Havok/art/avatar/IK), motion-core.js (calibration/gestures), motion-camera.js (actual local tracking), input.js and art.js. Existing shared 3D and Air Slice runtime interfaces are reused unchanged. Shell, registry, instructions, covers, library, data and service-worker integration are additive. Original 27 public worlds remain; Sports Resort makes 28. No new dependencies or external assets/licenses were introduced.

## Verification and limits

The full 69-program npm test suite passed, followed by final focused motion/rules/actual-physics checks after refinements. Six browser suites passed: Resort gameplay, camera, offline, shell, library and Beat Lab. Their layout/accessibility checks total 170 (4 + 78 + 84 + 4). Tests cover complete mixed touch/controller two-player ten-frame play, complete unranked practice, compatible backups, pause/help and input ownership, a synthetic calibrated landmark trajectory through the actual motion/UI pipeline into a real Havok ball, denial/late-result cleanup and blank generated-video inference using the actual bundled model. These are software fixtures, not physical-camera certification.

An unmodified production-module browser run verified service-worker offline reload, real RAF/Havok Bowling and cached local pose inference. Audit/build passed with 28 worlds, 299 cache entries, 200 dependencies and all 98 original vendor/art checksums unchanged. Actual physics test scene: 81 meshes and 17 bodies during a ball. A short offline software-WebGL observation reported 50 FPS, 79 active meshes, 17 bodies and 48.2 ms p95 frame time; this is not a sustained target-PC benchmark.

The cloud software GPU measured about 442 ms inference, 443 ms total frame age and 2.2 tracking FPS on blank generated video. Such delayed input is deliberately blocked from throwing. Offline first inference took 3354 ms. Real Windows webcam accuracy, comfortable motion thresholds, lighting/occlusion/mirroring, controller pairing, USB multitouch, sound and sustained GPU performance require the user's deployed trial. No claim of usable cloud-camera latency or complete five-sport collection is made.

Evidence is retained under docs/revamp/RESORT_*. Failed intermediate checks found and fixed static-child batching disposal, unbounded pit fall, table readability, pause/result rack transitions, async camera cleanup, stale transport age, controller handoff and synthetic-fixture timing races. Only passing final logs are retained as acceptance evidence.

## Next checkpoint

Deploy this Bowling checkpoint to the existing site for user trial. Gather diagnostics and physical motion feedback before Tennis. M3 Tennis, M4 Boxing, M5 Baseball/Golf, M6 championships and M7 full physical/presentation acceptance remain unfinished. Full 21-point finger tracking is not delivered; assess its need and device cost before any future finger-specific mechanic.
