# Air Slice — implementation and verification

Version 5.1.0 · 25 October 2026

## Delivered

Air Slice is integrated into Little Big Arcade as the 21st normal world, with its own illustrated fruit-market identity. The existing games, secret Feed the Face access, mandatory instruction gate, profile storage, media projects and legacy records remain in place. The existing storage key and backup version are preserved.

- Full-viewport, mirrored, uniformly scaled camera composition; no stretched camera image. Four independent arm paths are derived from real shoulder/elbow/wrist/hand landmarks for two people.
- Local MediaPipe Pose Landmarker Lite, with worker inference and a GPU main-thread compatibility path when worker graphics are unavailable. Model, runtime and WASM are served from the arcade, without camera uploads or a paid API.
- Deliberate webcam enable after instruction acknowledgment. Calibration requires lowering and raising both arms and holding a stable pose. Geometry and predicted motion maintain player colors; ambiguous overlap pauses play instead of assigning someone else's score. No face recognition or persistent body coordinates.
- Ten original fruit illustrations and species-specific interiors, gravity, rotation, independently separating halves, juice, sparks, trails and sound. Swept hand/forearm collision prevents fast input tunneling. Stationary hands and taps cannot score.
- Classic, Arcade, Zen and Fruit Frenzy; Easy, Normal and Hard, with Hard and large targets as defaults. Golden, rainbow, freeze, storm, three-strike giant watermelon and cooperative team fruit are functional.
- Solo, simultaneous versus and cooperative play. Touch pointer ownership remains independent across the screen; a single mouse gets equal seeded alternating versus turns or clearly labeled cooperative pass-and-play.
- Pause-safe timers, quick in-session restart, explicit finish for unlimited Zen, seven achievements, personal bests, lifetime statistics and records separated by mode, difficulty, input and gameplay settings. Cooperative team records do not fabricate rivalry wins or ties. Session records save exactly once; abandoned games do not save results.

## Background removal and saved toggle

The existing pose task produces per-person segmentation masks. Their maximum union preserves both people, including overlap. A 320-pixel-wide alpha mask is built from the same captured camera bitmap as the pose result, and composited onto a transparent foreground canvas. The animated Air Slice environment is rendered behind that canvas; fruit, bombs, cut halves, trails and scores are rendered in front. OFF uses the original live video through the exact same cover/mirror transform. Raw camera pixels are never placed as an opaque rectangle over the virtual environment when a usable cutout is active.

Background Removal defaults to ON. Its preference is saved to the selected Player 1 profile and applies to the entire camera scene. It is available in setup accessibility options, the pre-round camera calibration menu, the live BG button, pause, and settings. The live button changes only camera composition and mask production; it never reconstructs the world, resets scores, restarts calibration, changes score eligibility or pauses an active round. Turning ON shows normal video while the outline becomes stable. Settings itself intentionally pauses play.

Mask confidence has a soft edge, a conservative one-pixel expansion at reduced resolution and a small compositing blur. Temporal smoothing applies only to small alpha changes so newly moving arms are not delayed. Coverage is checked at visible head, shoulder, elbow, wrist and finger landmarks for both expected players. An outline that omits a detected hand/head is not used as if it were complete.

### Explicit fallback policy

| Condition | Implemented behavior |
| --- | --- |
| No detected player or first outline | Show original webcam until two valid outline samples arrive. |
| Temporary missing/partial/stale outline | Hold the last accepted matched foreground for at most 220 ms; then show live normal video. Two valid samples restore the cutout. A captured result older than 350 ms is rejected. |
| Unsupported masks, mask readback or compositing failure | Switch background removal OFF for this camera session and display the normal webcam. Pose tracking and the current game continue. The saved user preference is retained. |
| Sustained slow segmentation | After four warmup results, five slow samples (mask work above 42 ms or inference above 150 ms) disable removal for this session. Eight consecutive rendered frames above 45 ms also disable it while a cutout is active. These are adaptive safeguards, not a promise of any device's FPS. |
| Camera permission denied | Explain how to allow this site's camera in browser/address-bar settings and retry Enable Webcam; offer explicit touch/mouse play. No microphone is requested. |
| No camera / camera busy | Explain connection or competing-app recovery and retain retry and touch/mouse choices. Selected USB camera constraints are honored. |
| Pose model/graphics unavailable or unreliable player identity | Block calibration/start or pause the active round, preserving scores and clock. Offer recalibration or an explicit control-mode change; switching scoring inputs starts a fresh, separately ranked round. No simulated tracking is substituted. |
| Camera disconnect or hidden page | Pause active gameplay, stop capture when hidden, and require deliberate recovery. Dispose model workers, camera tracks, masks, captured frame ownership, canvases and audio on exit. |

Footage, landmarks and masks remain in ephemeral browser memory. Only game statistics and the ON/OFF preference are saved. There is no segmentation server, external runtime model request or footage recording in Air Slice.

## Automated verification

The complete 13-suite npm regression run passed, covering existing games, physical simulations, Buddy's torso-relative neck, Ladybug bounds/difficulty, all shared instruction gates, media projects, profiles, offline resources and backup compatibility. Subsequent Air Slice-specific changes were checked again by its suite; packaging runs the complete suite on the final source.

`tests/air-slice.mjs` exercises actual shipped core, pointer, tracking, record, scene and controller code, using controlled inputs where a camera is needed:

- All 36 game-mode/difficulty/player combinations, seeded fairness, finite and bounded physics/effects, power-ups, penalties, combo multipliers, giant/team participation and all fruit rendering paths.
- Fast continuous hand and moving forearm collisions, stationary-input rejection, exactly-once hits, deterministic near-simultaneous ownership and independent touch pointer capture/cancellation.
- Stable identities through reordered/crossing geometry, ambiguous overlap and recovery, arm movement calibration, bilateral swipes and no phantom stroke across tracking loss.
- No world, audio, device request or records before acknowledgment; no countdown time scored; pause holds clocks; alternating matches commit only after both equal turns.
- Live background changes preserve the same world object, score and advancing clock; profile preference survives reopening and validated backup/restore. The visual preference does not affect score keys.
- Both masks and overlapping masks remain in the union; empty/full-rectangle and missing limb/player masks are rejected; rapid alpha growth stays undelayed; brief hold, stale fallback, two-frame recovery and sustained slow processing work.
- The actual worker with a controlled model transfers matched captured frames, closes result/frame ownership once and disables masks without recreating the pose model. Pending initialization can be cancelled cleanly.
- Blocked, missing and busy selected-camera errors request audio:false and retain an inactive camera state.

## Browser verification

Temporary, explicitly labeled generated-camera/pose fixtures exercised the actual controller, renderer, physics, collision, records and compositor. They are removed from the shipped distribution.

- Actual compositor pixel proof: removed room pixel becomes RGBA [0,0,0,0], retained foreground is [0,255,0,255], raw room pixel remains [255,0,0,255], OFF returns the original-video route.
- Generated two-player ON view produced virtual-environment pixels [227,240,229,255] between the players; OFF and lost-outline fallback produced the original fixture-room pixels [84,127,145,255]. These verify composition, not the real model's segmentation quality.
- During the simultaneous generated-pose co-op round, OFF then ON retained individual scores 70 and 80 and the same active round at about 5.5 seconds. Camera requests and tracker instances remained one. Losing masks preserved arm tracking and continued the round; an unsupported-mask result automatically set OFF and retained the saved ON preference.
- Pause/settings included synchronized ON/OFF controls and explicit fallback status. Generated tracking loss paused and recovered without clearing scores. A prior generated-camera co-op finish saved 56 fruit and 2,955 team points, with individual and team records, and closed camera tracks.
- A generated two-touch Classic versus round completed, compared scores and saved one match. These are synthetic input tests, not physical USB multitouch certification.
- Actual app canvas filled 1366×768 and 1920×1080 without horizontal overflow. Cover/mirror mapping also has unit cases across four aspect ratios. Instruction and setup controls fit these landscape sizes. Native fullscreen is wired, with a browser/F11 fallback message; this cloud browser did not provide a usable OS fullscreen result.
- Generated fixture rendering had a median frame interval around 16.7 ms. This excludes real model inference and does not certify Windows hardware performance.

## Physical-device limits

No physical webcam or Windows touchscreen is attached to the test environment. The real model capability check reported unavailable WebGL 2/graphics acceleration in this cloud browser and exposed the intended honest touch/mouse fallback. Real hair/clothing edges, rapid fingers/arms, low light, overlapping children, body occlusion, physical camera permission prompts, sustained real inference performance, Windows fullscreen and simultaneous USB touches remain unverified. Complete occlusion cannot be recovered by inventing hidden body pixels; normal video and tracking pause are the defined recovery paths. A supported, graphics-accelerated Chrome or Edge on the target computer is needed for final hardware acceptance.

## Runtime provenance

- Official Pose Landmarker Web documentation: https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/web_js
- Official mask ownership/conversion API: https://developers.google.com/edge/api/mediapipe/js/tasks-vision.mpmask
- Local runtime: @mediapipe/tasks-vision 0.10.32; pose model SHA-256 `59929e1d1ee95287735ddd833b19cf4ac46d29bc7afddbbf6753c459690d574a`.
- `dist/vendor/vision/SOURCE.txt` and third-party credits retain asset/model provenance. No new paid service or dependency installation was introduced.
