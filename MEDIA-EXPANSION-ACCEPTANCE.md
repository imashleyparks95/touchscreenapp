# Little Big Arcade 5.0 — media expansion implementation and verification

Date: 25 October 2026

The implementation adds Funny Face Studio, Monster Me! and My Noisy Zoo. Existing games, profiles, score keys, the hidden Feed the Face route, Gravity Chaos, Buddy’s torso-relative neck fix and Ladybug sizing remain in place. Hard remains the default. Existing localStorage and IndexedDB database identities are preserved; new creation types extend the existing media store and backup format.

## Implemented

| Experience | Behavior |
| --- | --- |
| Shared media | Explicit selected-device requests, camera/mic indicators, single-session recording guards, late-permission cancellation, decoded original PCM, normalization/limiting, waveform and trimming, effects, previews, actual WAV/video exports, storage errors that retain drafts, cleanup and visibility pause. Recordings stay local. |
| Funny Face Studio | Local MediaPipe model and worker, 18 real image-mesh distortions plus Original, 16 expression-reactive lenses, combinations/intensity/random/roulette/presets/favorites, 48 original stickers (36 initially available; 12 creation unlocks), per-layer touch ownership, pinch/rotation, captions/drawing/crop/rotation/flip/color/frames/history, instant/timed/burst/strip photos, composited video/audio, local photo/video imports and actual edited-video rendering. |
| Monster Me! | Nineteen customization fields, original illustrated characters, blendshape/mic expression mapping, smoothing/calibration/sensitivity, multiple saved voices, animated video performances, expression/mimic/voice challenges and equivalent alternating Face-Off turns. Funny Face Studio resolves the same monster and voice IDs. |
| My Noisy Zoo | Forty-three original species; recorded voices tied to individual animals; bounded call earnings; a maximum of two audible calls; individual and master volume; living habitats/traits/visitors; pet/feed/toy interactions; adoption, upgrades, 16 building tools, habitat reassignment, undo/redo, pan/zoom; eight regions and optional procedural ambience; capped offline earnings; one-time discoveries; choir/WAV export; Sound Guessing, objective rhythm battle and animated talent-show videos. Creative and family zoos have separate storage identities and contributor IDs. |
| Arcade integration | Dedicated mandatory instruction content before each new session, activity-specific instructions, no simulation or device request behind acknowledgement, game/mode/difficulty records, six new achievements, local galleries, touchscreen naming, favorites/rename/duplicate/delete/export, adult media clearing and complete backup/restore support. |

## Verification performed

Automated checks use actual shipped models/controllers and controlled inputs. The complete `npm test` command includes the pre-existing eleven suites and a new media suite.

- All 18 distortion functions change finite mesh geometry, preserve source UVs, and accept two rotated face fixtures. In the browser, every distortion changed actual composited image pixels using explicitly synthetic landmark positions. This proves rendering, not face detection.
- Expression mapping, damping/calibration, repeatable challenges at all five difficulties, editor history and concurrent layer drag/pinch/rotation handlers pass.
- Eleven audio processing choices preserve the original PCM; outputs are finite and peak-limited. Pitch analysis and the actual granular worklet processor pass generated-tone tests at 0.72×, 1× and 1.5×.
- The actual three new entry controllers make no device requests, media reads/writes or zoo models during thirty seconds of frame callbacks before acknowledgement. Acknowledgement still does not silently request devices.
- Camera denial/selection, late permission cleanup, recorder state guards, real chunk assembly and track cleanup pass controlled tests.
- The cow core loop was exercised through the browser UI with generated microphone audio: record approximately five seconds, preview, select Robot, trim to two seconds, export WAV, accept, earn call coins, save, exit and reopen. The cow retained its exact voice ID and PCM checksum, effect, name and upgrades. A pig was adopted and given a separate recording.
- Sound Guessing completed five actual UI answers and stored 600 points / 3 correct / 60% in the Hard single-player activity board. This was a mechanics test, not an assessment of listening ability.
- A customized monster was saved with an attached voice, appeared in Funny Face Studio through its saved ID, and produced an animated recording with audible nonzero encoded audio.
- A photo exported from the composited canvas retained its visible illustrated sticker. The saved gallery entry reopened successfully.
- Independent `ffprobe`/`ffmpeg` inspection validated real files: camera video = VP8 1280×720 + Opus; edited video = VP8 1280×720 + Opus; monster performance = VP8 + Opus; animal talent show = VP8 960×540 + Opus; voice and choir exports = actual PCM WAV. No extension was relabeled.
- A two-second video selection at 1.5× rendered approximately 1.3 seconds. Its audio/video endpoint difference was about 30 ms. Monster performance endpoints were within about 5 ms. These are generated-stream checks, not physical-device latency measurements.
- All 43 species adopt into suitable habitats. A 44-animal controlled simulation remains bounded over 3,000 updates. Names/voices/upgrades, rehoming, layout history, independent Creative economy, first-voice reward protection, one-time discoveries and offline cap/zero/future/idempotence checks pass.
- Original PCM, monster references, zoo data and actual video MIME strings round-trip through the arcade backup format. Invalid sources and malformed creation data are rejected before restoration.
- Browser layout measurements at 1366×768 and 1920×1080 show no horizontal overflow in the new workspaces. Capture bars remain within the viewport. All three instruction windows fit without scrolling. Toolboxes scroll independently.

## Verification limits and remaining acceptance

**The live face-tracking centerpiece is implemented but has not passed a live-input acceptance test in this environment.** The cloud browser exposes no WebGL 2. Model inference therefore cannot run here. The app displays a support message and keeps ordinary capture, editing and custom monster creation available. Locally hosted MediaPipe assets perform no network upload; Windows Chrome/Edge with graphics acceleration must still be used to verify actual landmark inference, face following, lost-face recovery, lighting changes and two physical faces.

The HTTP test preview also lacks AudioWorklet. Its actual DSP processor passed generated-sample tests, but live pitch-shifted video audio on HTTPS remains a browser/device acceptance item. Unsupported contexts receive an explicit error with supported alternatives. Other offline voice effects, recorded PCM, original video audio, animal playback and encoded exports were tested.

No physical webcam, microphone, speakers, Windows PC, USB multitouch display or modest-PC benchmark hardware was available. Generated video/audio streams were clearly labeled in a temporary QA harness. The harness is removed from the shipped application. The report does not claim hardware testing, measured Windows frame rates or a long-duration memory-leak soak. MP4 is offered only if the browser provides a real encoder; WebM is the validated path.

Videos are deliberately short: new captures up to 60 seconds, animal talent shows eight seconds, imported editor sources up to three minutes with edited selections up to 60 seconds. Reprocessing runs in real time and must remain open. Galleries and progress live in the current browser; export a backup before clearing browser data or moving devices. Large videos and backups are subject to browser memory and quota; storage errors do not silently delete older items.

No requested feature is intentionally represented by a decorative control or canned media. The unverified live tracking, HTTPS worklet integration and physical-device/performance acceptance items above remain open; this report does not certify those experiences as fully hardware-verified.
