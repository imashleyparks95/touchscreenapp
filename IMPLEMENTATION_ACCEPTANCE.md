# Studio improvements: priorities and acceptance

Existing Site and browser databases remain in place. No profile, score, media store, or game is replaced.

## Priority 1 — Sequencer and stable transport
- Beat Lab opens on the sequencer. All 16 instruments remain available; 16 and 32 steps work, including simultaneous track playback and multi-pointer editing.
- Instrument colors/names, current step animation, per-track clear, replace-confirmed presets, and confirmed whole-pattern clear work.
- Play/Pause/Stop/Song Record/Save and 60–200 BPM are obvious. An audio-clock scheduler changes tempo at a step boundary without duplicate scheduled notes; pause resumes the next step. Drum Pads, arrangements, advanced mixer/import/trim and MP3 export remain available.

## Priority 2 — Microphone samples and persistence
- Record Audio offers Start, timer, actual input level, Stop, waveform, Preview, Re-record and Save to a named track. Request access only on Start.
- Duplicate Start does not open duplicate streams. Stop waits for final encoded data; decoded samples can be genuinely trimmed before assignment.
- Permission denied, missing/disconnected input and unsupported/insecure browser errors are actionable. Streams and previews stop on exit/hide. No live mic monitoring/feedback.
- Assigned PCM remains in editable project/bank saves and backups; reopening retains selected sample, trim, pitch and volume. Offline song rendering includes that audio, and MP3 is independently decodable.

## Priority 3 — Independent collaborative drawing
- Left P1 and right P2 toolbars display correct profiles and independently own tool, color, size and shape fill.
- Each pointer keeps settings from the side where it starts, even across the canvas midpoint. Two simultaneous pointers can use different tools and sizes.
- Stickers, photos, transforms, undo/redo, editable gallery, and PNG/JPG export remain working. Older art opens without migration loss.

## Priority 4 — Shared touch naming and regression
- Both Save Project flows open the same large keyboard with letters/numbers, Space, Backspace, Clear, Cancel and Save. Physical keyboard still works.
- Saving confirms success and keeps active player ownership. Saved entries can reopen, rename and edit; failed saves keep the naming dialog available.
- Existing profiles, all games/leaderboards, pre-upgrade projects and sound banks load. Required new resources enter offline cache.

## Evidence and limits
Run existing automated suites plus focused state-machine, scheduler, persistence and independent-pointer tests. Exercise both interfaces and keyboard in browser. Verify a rendered MP3 with ffprobe. The managed HTTP preview cannot request a real microphone; use a mocked browser API harness to verify microphone lifecycle and decoding. Final physical microphone permission/audio level/latency and simultaneous USB touches need a check on the Windows display at the HTTPS production URL.

## Completed verification — 2026-10-23

- All four automated suites pass, including 140 original game/difficulty/mode combinations.
- Focused tests exercise shipped scheduler and pointer handlers, microphone request/record/decode lifecycle and panel controls using simulated devices, PCM trimming/assignment, old-project loading, sample backup roundtrip, and full sample tails in export.
- Browser: 16/32-step editing, preset load, independent track clear, confirmed pattern clear, actual playback indicator, numeric BPM/slider agreement, pause/resume, song recording, arrangements and preserved 16-pad tab.
- Browser: shared keyboard used via touch keys including Space/Backspace/Clear to save music and art; gallery/project rename and reopen confirmed. Drawing tool/color settings remain different after reopen.
- Browser: actual MP3 import, trim 14.811s to 7.406s, +1 semitone; custom sample retained after project reopen and included in an exported two-clip arrangement.
- Browser-rendered recorded song: 55 hits / 14.6 seconds; ffprobe confirms MP3, stereo, 44100 Hz, 14.811375s including encoder padding/tail. Custom-sample arrangement MP3: stereo,44100Hz,8.933875s.
- Browser: two named drawing toolbars, strokes from each side, stickers, undo/redo, image upload, rotate/crop, editable gallery save/reopen, genuine 1440x900 PNG export, no application errors in inspected logs.
- Browser HTTP preview correctly explains why mic capture is unavailable there. Real Windows microphone permission/level/latency, physical USB simultaneous touches, and final HTTPS offline use remain hardware checks; no claim of those checks is made.

## Build & Smash follow-up

The version3.2 overhaul and shared family-created levels have their own priorities, acceptance criteria and verification evidence in SMASH_ACCEPTANCE.md. All prior studio acceptance checks remain applicable.

### Gameplay refinement 3.3

See GAMEPLAY_ACCEPTANCE.md for the six-world implementation priorities, feature-specific acceptance tests, record fairness, persistence and hardware verification boundaries.
