# Work Mode handoff — Beat Lab BL1

## Deploy v6.30.0 for live testing

Repository **imashleyparks95/touchscreenapp**, branch **beatlab/bl1-playlist-foundation**, based on published final arcade `e6af71f2124bf58d20b932f16d9896c29c81d36a`. Tested app commit **`faeecaa96b459df65bb9a18722827a9971b0ddf9`** is published and verified against GitHub. This documentation-only follow-up preserves the runtime and may be pinned for deployment. Finish earlier deployments first.

Read AGENTS.md, ARCADE_REVAMP_PROGRESS.md, docs/BEAT_LAB_THREE_MILESTONES.md and docs/BEAT_LAB_PLAYLIST_DEVELOPMENT.md. Authoritative **dist/**. Source: **js/beat.js**, new **js/beat-playlist.js** / **js/beat-playlist-ui.js**, optional backup validation in **js/data.js**, scoped **arcade-polish.css**. Evidence: **docs/revamp/BL1_***. Original default Beat Lab screen/controls and all previous games remain. Only BL1 is implemented; Piano Roll/instruments and advanced audio/mixer remain BL2/BL3.

## Deploy and verify

Deployment is authorized. Serve **dist/** in existing Sites project **appgprj_6adab219a4788191952c4c83432002c5**. Preserve **https://little-big-arcade-parks.diladiop.chatgpt.site**, access policy, all profiles/scores/achievements, campaigns/armies/designs and local media/sound library/projects. Do not create a replacement site or clear browser data. Fetch exact published source and use authenticated Sites workflow. Git push/build alone is not deployment. Verify deployed commit and live **6.30.0**, return URL. Use normal lobby/Settings update flow; never force an update during active play.

## Checked result and trial

**62 test programs pass**, followed by focused final checks; **153 browser audits pass** (2 Playlist, 4 creative, 72 shell, 75 library/eight scenarios). Real eight-bar stereo WAV audio proves both tracks, solo/pan/gain isolation; ffprobe confirms PCM16 WAV/MP3; recorded Playlist pan, full saves/binary backup/reopen and original workflow retained. Final audit/build/syntax/diff checks pass: 25 public IDs, 278 cached files, 180 reachable dependencies and 98 original hashes. Device fixtures/controlled clocks/generated mic are not physical touch/controller/audio latency or target-PC capacity acceptance.

1. Open Beat Lab: familiar Sequencer/Pads/Edit/Transpose/Volume should remain. Load a preset, rename it Drums A and use **ADD TO PLAYLIST**. Set clip length to **32 beats (8 bars)**; it repeats the source.
2. Edit Source/duplicate to create Drums B without overwriting A, change its steps/sound and add it to a second track. Place both at beat 0. Use named/color tracks, actual volume/pan/mute/solo. Master Play/Pause/Stop/BPM/Loop/Record control active Playlist; original views retain pattern preview.
3. Try scrolling/zoom/snap/bar seek/loop region, body drags between tracks, right-edge resize, inspector start/length/source trim, multi-select/group copy/paste, split at position, unique copies, delete, undo/redo and two independent touches. Cancel/background/pause must not commit held previews. Source edits update linked clips; Make unique protects others.
4. Save/reopen the complete project and export actual Playlist WAV or MP3. Compare both track sound/timing, pan, solo and gain in the file. Original master Export follows active Playlist; original view export stays familiar. Check old projects, original arrangement, samples/microphone/recording/banks/shared sounds/Beat Battle/recovery and full backup.

Bounds: 24 tracks, 512 clips, 128 bars, 40k hits, 40 history steps; five-minute exports. These are safety limits, not hardware performance promises. Fine editing remains touch/mouse/keyboard first; shared controller cursor navigation is retained. No audio-waveform clips, independent time-stretch, Piano Roll, synth notes or full mixer/effects tab are claimed yet.

Stop for deployed user trial. Next after explicit continuation: **BL2 — Piano Roll, instruments and collaborative performance**; then **BL3 — advanced audio/mixer/export/final 14-step workflow**. Exactly three expansion milestones; preserve familiar interface and old data.

## Message to paste into Work Mode

Deploy Beat Lab BL1, Little Big Arcade version 6.30.0, from imashleyparks95/touchscreenapp, branch beatlab/bl1-playlist-foundation, tested app commit faeecaa96b459df65bb9a18722827a9971b0ddf9 (or its final documentation-only handoff commit). Read WORK_MODE_HANDOFF.md, AGENTS.md and ARCADE_REVAMP_PROGRESS.md. Deployment is authorized. Finish earlier deployments, serve dist/ in existing Sites project appgprj_6adab219a4788191952c4c83432002c5, preserve the existing URL/access policy and all family data, and do not create a replacement site. Verify live 6.30.0 and return the URL for my Playlist trial. BL2/BL3 are not implemented; pause development for my trial.
