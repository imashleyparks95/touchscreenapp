# Beat Lab BL1 — Playlist foundation (v6.30.0)

## Starting architecture / preserved features

`beat.js` owns existing 4×4 pads, three generated kits/80-sound catalogue, per-pad trim/transpose/gain/loop/mute/solo, WAV/MP3 sample decoding, optional microphone trim/save/shared local sounds, 16/32-step editable patterns, four presets, sequential arrangement, audio-clock transport (25ms timer/80ms lookahead), BPM/metronome/tap tempo, live/take recording, original offline render/genuine MP3 worker, Projects/banks/autosave and two-player same-kit Beat Battle. These remain in their familiar default Sequencer/Pads/Edit screens. No replacement app or advanced blank tabs. Controller cursor navigation remains; fine editing is touch/mouse/keyboard first.

## New optional Playlist

`beat-playlist.js` owns validation, immutable event compilation, live voice routing and PCM16 WAV encoding. `beat-playlist-ui.js` owns optional timeline/editing with per-pointer captures, cancel previews, undo/redo and explicit multi-selection. Scoped CSS leaves original screens intact. An Add to Playlist button and optional Playlist tab connect the original pattern editor.

Positions/durations/offsets are quarter-note beats (four beats per bar, 4/4 foundation). Snap choices: bar, beat, eighth, sixteenth, 32nd. Timeline zoom/scroll/bar ruler/position input/playhead/duration, loop region and shared master Play/Pause/Stop/BPM/Loop/metronome work. Crossing between Playlist and original workspaces stops playback so pattern preview cannot accidentally trigger the full song. Loop master checkbox follows the active context; original pattern loop value remains.

Tracks: names/colors, actual volume 0–2, pan −1–1, mute and solo. Clip source assignment, place/move between tracks, resize/trim/repeat through a longer duration, duplicate/delete, split at musical position, multi-select/copy/paste groups, explicit Make unique and 40-step undo/redo. Inspector inputs provide alternatives to precise drag handles. Independent touch owners can move different clips without stealing each other's holds; canceled moves never mutate authoritative clips. Clips show actual programmed step density, not fake audio waveforms.

Existing new/rename/duplicate/delete/source editor controls remain; Save Pattern stores its sound assignment in the current project/autosave, with named project persistence through familiar Save. Deleting a source explicitly warns that linked Playlist instances are removed. Linked source edits affect intended instances; Make unique deep-copies its source first. Undo of uniqueness restores original sources as well as clips. Source sound ownership prevents switching/deleting/restoring a pattern from overwriting another pattern's sounds.

## Audio and clock

`compilePlaylist` supplies one sorted event plan to both live scheduling and existing offline WAV/MP3 render. Source hit time/trim/rate/volume and track gain/pan/mute/solo are real audio parameters. Natural hit duration is bounded by clip end; longer clips repeat source phase; splitting retains musical phase. Voices route Source → Gain → StereoPanner → existing master mix. Existing recording captures Playlist event timing/pan/seek offsets, while physical pad play and old recording remain.

The existing scheduler dispatches Playlist audio on the AudioContext clock. Separate display and audio anchors permit loop events to be queued across exact musical boundaries before the UI reaches them. Pause/seek chase only still-active sample tails. BPM/mix edits rebase at current musical position; stalled UI skips missed loops rather than burst-playing old hits. Export uses the exact same compiled event timing and the original offline renderer/MP3 encoder, with genuine stereo 44.1kHz PCM16 WAV added. The master export button follows the Playlist when active; old views keep their original export choices.

Limits: 24 tracks, 512 clips, 128 bars/512 beats, 40,000 compiled hits, 40 undo snapshots; exports within five minutes, as before. Limits are safety bounds, not target-PC capacity claims. Higher-complexity live compile errors pause with guidance; edits/projects remain. No peak meter/EQ, note synthesis, independent audio time stretching or Playlist audio clips are claimed in BL1; BL2/BL3 introduce them only when functional.

## Compatible project adapter

Old fields retain meaning and old sequential arrangements keep playing. Optional `studioVersion:1` and `playlist:{version:1,tracks,clips,snap,zoom,loop,loopStart,loopEnd}` are included in projectData; absent fields map to an empty optional Playlist, not a replacement for the old arrangement. Unknown studio versions are rejected. Source patterns gain optional `playlistPads` snapshots when used in Playlist, retaining independent source sample IDs/mixer/trim. PCM serialization includes every referenced source sample once; original buffers are unchanged. Opening old songs remains valid. No IndexedDB store/version or global schema migration/reset.

`data.js` validates optional Playlist references/bounds/source sounds during backup validation; old projects without it retain old validation. Project load validates Playlist before replacing pattern/pad state. Autosave, named save, recovery/Beat Battle and binary media backup carry the complete new data. No family data was used for tests.

## Actual evidence / trial limits

`tests/beat-playlist.mjs`: independent overlapping/tempo/split/mute/solo/gain/pan/source-isolation/legacy-invalid cases, real production clock handler under a controlled clock, exact loop scheduling, lag recovery, pause and PCM WAV layout. `tests/studios.mjs` retains original scheduler/save/load/render tests with explicit legacy-only context adapters. `tests/beat-playlist-browser.mjs`: real UI plus Web Audio, eight-bar A/B song, actual pointers/editing/undo/uniqueness/group copy/touch resize/cancel, live clock/pause/loop, real WAV channel energy including solo and volume isolation, ffprobe-confirmed stereo WAV and MP3, full save/backup/close/reopen and responsive accessibility checks. This is audio-file proof, not a claim of physical speakers/microphone/touch/controller latency quality. User must test the deployed version on the Windows touchscreen.
