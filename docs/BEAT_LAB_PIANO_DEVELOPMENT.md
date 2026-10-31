# Beat Lab BL2 — Piano Roll, instruments and performance (v6.31.0)

## Delivered extension / preservation

Optional Piano Roll extends the existing Sequencer/Pads/Microphone/Playlist; original default screen, Edit/Transpose/Volume, sounds/projects/banks, recording/export and two-player Battle remain. No replacement or blank advanced tabs. `beat-instruments.js` supplies original synthesis/validation/cache; `beat-piano-ui.js` supplies note editing and live keys/drums. Existing Playlist compiler/transport/export and project media store are reused.

Note patterns contain `kind:notes`, musical `beats`, assigned `instrument`, optional envelope/filter/mix `voice` and notes with ID, MIDI pitch, beat start/length and normalized velocity. Existing drum patterns remain unchanged. Notes and drum clips share tracks, linking/Make unique, mix/pan/mute/solo, loop/seek/BPM, saves and WAV/MP3. Playlist previews display actual notes rather than fake waveforms. Explicit pattern preview uses an ephemeral arrangement so master Play in Piano Roll does not start the full song. Source editors route correctly between notes and original sequencer.

Piano Roll: piano labels, scrollable octaves/grid, vertical/horizontal zoom, bar timeline/playhead, snap from whole to 32nd notes, draw/select/erase/Pan tools, place/move/resize/delete, chords/sustains, pitch/start/length/velocity inspector, grouped copy/paste/duplicate, quantize timing/duration and 40-step undo/redo. Default note rows are 44 CSS pixels with adjustable height; Inspector and Pan are alternatives to fine finger dragging. Patterns create/rename/save/duplicate/delete/add to Playlist; deletion explicitly confirms linked-instance removal. At least one original drum pattern is protected for the familiar workflow.

## Original instrument synthesis and actual audio

Fifteen original voices: Piano, Electric piano, Organ; Electric-style/Synth/Sub/808-style bass; Lead/Pad/Pluck/Retro synth; Guitar-style, Strings, Bells and Flute-style. Different harmonic spectra, articulation/envelopes, pitched onset or vibrato distinguish them. These are synthesized styles, not recorded acoustic sample libraries. Optional attack/decay/sustain/release/cutoff/volume/pan affect actual generated PCM/routing. MIDI pitch changes frequency while musical note length follows BPM; this is not a claim of independent audio-file time stretching.

Original deterministic mono 22.05kHz note PCM is cached by instrument/pitch/duration/BPM/envelope/filter, then resampled by Web Audio and mixed/exported through the existing stereo 44.1kHz path. Velocity/instrument/track volume and combined pan are real Gain/StereoPanner parameters. Simultaneous note events are polyphonic. Full release tails can extend past the end of the musical pattern/song; explicit trims still bound held notes, and seek/split resumes at the correct sample phase. Track mix/solo and exact audio clock remain BL1 interfaces.

Limits: MIDI 24–108, 256 notes per pattern, patterns up to 128 beats, notes up to 32 beats; 128 seconds of unique instrument sample material per project preparation. Unreferenced live-key cache is bounded near 160 seconds; recorded and scheduled samples are retained. These are safety bounds, not a claim of target-PC capacity. Note preparation is bounded local CPU synthesis; heavy-song musical latency/rendering quality still needs physical trial. No new libraries/services, sample-pack licensing or imported art.

## Performance / lifecycle

Multitouch keyboard and original drums alongside it have independent pointer/voice ownership. Master Record Song captures the actual combined PCM events, pan and times. Optional Capture Live Notes records musical note timing/length/velocity into the current pattern; first key starts beat zero and Quantize is explicit. An AudioContext-based musical clock integrates master tempo changes. Live keys stop after eight seconds; long composed notes remain available. Native pointer/controller click echoes are suppressed so release does not create a phantom second note.

Keys close on release, capture stop, background, Save/Projects/Export/Exit. Captured held notes are finalized before saving/leaving rather than discarded; pending timers/captures/voices and looped drum holds release. Cancellation of a grid edit leaves authoritative notes unchanged. Loop pad take duration and completed-take boundaries reflect actual release/recording, not an indefinite source duration. Original instruction acknowledgement and permission-based microphone behavior remain.

## Compatible project adapter

New songs use optional `studioVersion:2` (version 1 and legacy absence still accepted). Optional note patterns and voice fields are stored with the same Playlist; generated source samples can be regenerated from note data/BPM. Actual recorded performances retain their original PCM in the existing samples map. Notes and referenced sound state are backed up through schema-3 binary media backups. No IndexedDB version/store or profile/score migration/reset. Optional versions, tempo, note bounds, instrument settings, IDs and Playlist references are validated; unknown future studio versions are rejected. Legacy sequencer/arrangement paths filter note patterns rather than trying to treat notes as step matrices.

## Actual checks / limits

Independent tests verify all fifteen finite distinct PCM voices, known-tone octave pitch, unchanged pitch under changed musical duration/BPM, envelope/release, cache/pre-allocation budgets, note validity, polyphonic timing/velocity and release tails. Original Playlist/legacy studio scheduler/load/PCM/MP3 tests remain. Browser assembles original drums + a four-bar sub-bass + polyphonic piano; actual pointer note move/resize, undo/redo, group copy, source duplicate/delete and unique clip paths, two keys plus drum capture, background/held-exit save and complete project/backup/reopen. Actual WAV/MP3 are decoded/probed; bass fundamental is measured in exported PCM and the complete mix differs from bass solo. Four new desktop/phone audits plus BL1/creative/shell/library regressions.

All browser/controller/visibility/microphone inputs are fixtures; these do not certify physical touchscreen reach, actual controller focus, audible timbre quality, speakers/microphone or musical latency. Original synthesized instrument labels are explicit. Playlist audio imports/waveforms, independent audio tempo/pitch processing, complete mixer/meters/effects and the remaining fourteen-step master workflow are BL3, not claimed here.
