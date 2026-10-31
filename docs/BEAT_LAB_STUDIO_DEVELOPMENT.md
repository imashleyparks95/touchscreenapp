# Beat Lab BL3 — complete-song integration (v6.32.0)

BL3 completes the third and final software milestone in the saved three-stage expansion. It extends the same Beat Lab; original Sequencer, Pads, Edit/Transpose/Volume, microphone consent/trim, local sounds, banks, projects, shared recording and Beat Battle remain. New workspaces are optional Audio clips and Mixer. This checkpoint still requires the user's deployed physical/listening trial.

## Audio sources, real waveforms and nondestructive edits

`beat-audio-core.js` validates source parameters/assets, computes musical duration/cache keys, generates decoded min/max waveform bins and implements original PCM processing. `beat-audio-worker.js` runs waveform analysis and DSP away from the main UI. `beat-audio-ui.js` supplies file import, selected pad/mic PCM and recorded shared performance sources; name/source selection, trim seconds, independent speed, semitone/fine pitch, source BPM/sync, preview/reset/undo/redo, confirmed source+linked-clip deletion and Add to Playlist. Existing Edit includes a link to this optional extension; original pad Transpose retains its coupled playback-rate behavior.

Imported browser-decodable WAV/MP3/OGG/M4A and other supported formats preserve decoded original PCM and the original file's name/type/ArrayBuffer bytes. No upload/service is used. Microphone remains optional through the existing permission/trim/save-to-pad workflow, then Use selected pad/mic. Original pads are not modified by the new edits. Use recorded performance renders actual event PCM into a source; keyboard/drum timing is retained. Derived audio is regenerated from original PCM and saved parameters.

Waveforms are actual 512-bin decoded min/max envelopes, not decorative waves or instrument fake waves. The source canvas highlights trim; Playlist previews map source trim, tempo-derived cycle, offset and repetition through the clip. Timeline zoom redraws the source envelope at the visible clip scale, bounded to 1024 display columns; this is an aggregate overview, not sample-level waveform editing. Drum hits and note rectangles remain distinct previews.

Audio patterns (`kind:audio`) reference original `sampleId`, duration, musical beats, waveform and `audio` parameters. The existing compiler schedules prepared PCM alongside drums/notes on one immutable event clock. Source trim, instance offset, repeat/resize/split/seek, track gain/pan/mute/solo and source linking/Make unique all use this same path. Clip placement uses current-tempo source duration, not a stale cached length. Audio tempo sync uses speed × songBPM/sourceBPM; unsynced source duration stays in seconds. Changing tempo during audio playback pauses for worker preparation and resumes at the musical position; it does not play stale-rate audio. Stop, source/view change, background and disposal cancel worker preparation and stop previews.

## Independent speed/pitch investigation and quality

Native AudioBufferSource playbackRate couples duration and pitch, so it cannot implement the required independent controls. The existing voice-pitch AudioWorklet is a live vocal/granular effect, not a saved-song offline time-stretch pipeline. BL3 therefore uses an original bounded **waveform-similarity overlap-add (WSOLA)** implementation plus linear resampling, with matching segment offsets across stereo channels. No third-party DSP library, sample pack, license obligation, external worker URL or service was added. Existing LAME's original licenses and genuine MP3 worker remain unchanged apart from selectable bitrate.

For pitch ratio r and effective speed s, resample by r, then stretch by r/s. Output length is source-trim length/s. Speed therefore does not change the musical frequency, and semitone/fine pitch does not change output duration. Stereo correlation is preserved. Independent known-tone tests measure speed .5/.75/1.5/2, octave and seven-semitone shifts, combined speed/pitch, finite PCM and original-source preservation. The browser verifies an actual imported 440 Hz tone becomes 880 Hz in the exported song at its scheduled position. The same prepared PCM feeds live Web Audio and OfflineAudioContext: no separate incompatible offline processor or AudioWorklet dependency.

This is a practical original algorithm, **not studio-grade or formant-preserving processing**. Speech, dense mixes, extremes and sharp transients can become grainy; linear resampling can alias high frequencies. The UI names WSOLA and asks users to preview. Quality/timbre/latency require physical listening; known-tone tests do not certify arbitrary music quality.

Safety limits: 16 audio sources, five minutes total original PCM (unique assets on validation), mono/stereo up to 96 kHz; file under 40 MB; two minutes per prepared edited source and five minutes total prepared audio. Speed .5–2, ±12 semitones, ±100 cents; source/song BPM 60–200. Import initially selects at most 120 seconds, visibly in the trim inspector. Browser decoding is an async native operation that cannot be interrupted by this code; canceled/late results are discarded. PCM copies/transfer and decode still consume memory; these bounds are not target-PC performance guarantees. Existing 24-track/512-clip/128-bar/40k-event/five-minute export and BL2 note-cache bounds remain.

## Mixer and export

`beat-mixer.js` builds the same channel graph for live and offline rendering: original track event gain/pan feeds three-band ±12 dB EQ (low shelf/peaking/high shelf), dry output plus optional two-tap delay and deterministic original stereo convolution reverb. Track event gain/pan/mute/solo is applied once. Live channel graphs are reused per track and released/rebuilt on transport edits/stop; offline graphs are disposed after render. Effect tails extend export length. No decorative meters: an actual AnalyserNode measures post-EQ/effect channel PCM; the master analyser reads after master gain. Peak/RMS dBFS update at most ~12.5 Hz, and sampled peaks ≥1 show CLIP. These are not true-peak/LUFS/loudness or hardware-speaker measurements.

Optional Mixer exposes gain/pan/mute/solo and EQ/delay/reverb per track, master volume and levels. Switching Playlist↔Mixer keeps song playback. Real impulse and known-tone OfflineAudioContext tests independently prove delay, reverb and +6 dB low EQ. Existing Playlist controls remain available and affect the same state.

WAV remains genuine stereo PCM16 at 44.1 kHz; MP3 remains actual LAME encoding with selectable 128/192/256/320 kbps. Advanced quality controls appear only with Playlist/Mixer. Actual exported audio includes all track positions and mix, instrument release and effect tails. Offline suspend/resume checkpoints show rendering progress; the encoder reports progress. Cancel suppresses download, terminates the encoder/rejects its task or lets the native offline render finish without download. Native OfflineAudioContext has no stop/close API; cancellation does not claim immediate CPU termination. Owned graphs/workers/listeners are released on disposal; no forced update during play.

## Compatible projects and family data

Studio version 3 adds original audio files/PCM, edits, track fx, section markers and explicit `[4,4]` time signature. The timeline currently supports **4/4 only**, clearly labeled; other time signatures are rejected rather than misplayed. Existing absent/v1/v2 projects still load; default fx are dry. Audio asset validation happens before replacing the active project; reference/duration/PCM/channel/rate/file/budget/time-signature checks are also used in binary backup parsing. No global localStorage schema 3 or IndexedDB `lba-universe-media` v1/items identity changed. Derived renders are pruned except recorded-event dependencies; original/recorded PCM persists. All 25 public games and 98 original migrated art/vendor hashes remain.

## Acceptance and evidence

`tests/beat-audio.mjs`: independent DSP/frequency/duration/stereo/source preservation, waveform bins, audio scheduling/trim/repeats/sync/effect tails and invalid source/fx/assets/signature guards. Existing instrument/Playlist/legacy-studio tests remain.

`tests/beat-studio-browser.mjs` performs all master §16 steps through the real app:

1. Use original sequencer/preset and save Drums A.
2. Named reusable original pattern retains its own sounds.
3. Place Drums A on Track 1 for eight bars.
4. Compose a four-bar sub-bass source in Piano Roll.
5. Save Bass A and repeat on Track 2.
6. Add a polyphonic piano source on Track 3.
7. Import real WAV to Track 4; check decoded waveform pixels and amplitude differences.
8. Adjust independent .75× speed/+12 pitch; preview, undo and redo.
9. Copy/edit independent chorus drum pattern.
10. Arrange and save Intro/Verse/Chorus/Outro sections through beat 64.
11. Play actual song from beginning to end, including measured channel audio.
12. Render full/solo/zero-volume arrangements and independently compare PCM.
13. Save/exit/reopen all tracks/sources/notes/edits/fx/markers and binary backup/original bytes.
14. Export/ffprobe genuine PCM WAV and 192kbps MP3; verify scheduled shifted 880Hz source, earlier silence and audible beginning/outro.

Additional browser checks cover source pad/mic PCM and actual keyboard-take conversion, confirmed deletion, tempo-sync re-preparation/resume/seek, worker cancellation, real offline effect impulse/EQ proof, export cancellation and four phone/desktop layout/accessibility audits. Saved artifacts/results are in `docs/revamp/BL3_*` after final verification. Original BL1/BL2 browser suites, original generated-device creative/mic/shared-sound flow and shell/library offline/controller tests regress earlier functionality. Standard-controller/generated-microphone fixtures are not physical device claims.

Final exact counts, failures, publication and deployment trial are recorded in ARCADE_REVAMP_PROGRESS.md and WORK_MODE_HANDOFF.md. No fourth Beat Lab milestone is introduced. Next work is user-reported live issues after the existing-Sites deployed trial.
