# LITTLE BIG ARCADE — BEAT LAB COMPLETE MUSIC STUDIO EXPANSION

## Master Codex Implementation Prompt

### PRIMARY OBJECTIVE

Expand the existing **Beat Lab** game in Little Big Arcade into a complete, functional music production studio inspired by the workflow of FL Studio (Fruity Loops).

The main objective is to let users create an entire song from beginning to end using multiple instruments, drum beats, basslines, melodies, samples, and audio recordings.

**THIS IS AN EXPANSION OF THE CURRENT BUILD, NOT A REDESIGN OR REPLACEMENT.**

My children already understand and enjoy the existing Beat Lab interface. Preserve its appearance, navigation, controls, and familiar functionality.

Add advanced features as optional tabs and extensions to the existing interface.

The existing Beat Lab should remain immediately accessible and work exactly as users expect.

Do not remove games, reset saved projects, or break existing Little Big Arcade features.

---

# 1. COMPLETE SONG CREATION — THE MAIN GOAL

Users must be able to build complete musical compositions using different sounds and instruments on separate tracks.

### Example workflow

A user should be able to:

1. Open the existing Beat Lab.
2. Create a drum beat using the current Step Sequencer.
3. Save that beat as a reusable pattern.
4. Press **Add to Playlist**.
5. See the drum pattern appear on a Playlist track.
6. Open the new Piano Roll.
7. Select a bass instrument.
8. Compose a bassline using musical notes.
9. Save that bassline as a pattern.
10. Add the bassline to a second Playlist track.
11. Select a piano instrument.
12. Create a melody or chord progression.
13. Add the piano pattern to a third track.
14. Add more instruments, drum variations, vocals, or imported audio.
15. Arrange the sections into an intro, verse, chorus, bridge, and outro.
16. Play all tracks simultaneously.
17. Adjust instruments, notes, volume, tempo, and pitch.
18. Save the complete project.
19. Export the finished song as a playable audio file.

The resulting song must contain genuinely mixed and synchronized audio from all included tracks.

Do not build a Playlist that only displays patterns visually.

**Every pattern placed on the Playlist must actually play at its scheduled position.**

---

# 2. PRESERVE THE EXISTING BEAT LAB

Before implementation, inspect the current Beat Lab code and identify every existing feature.

Preserve:

- The current 4×4 beat-pad interface.
- Existing pad sounds and imported samples.
- Current Step Sequencer.
- Existing tempo and playback functionality.
- Current Edit section.
- Transpose control.
- Volume control.
- Existing pattern editing.
- Recording features.
- Export functionality.
- Saved projects.
- Two-player functionality.
- Current touchscreen controls.
- Familiar layout, buttons, and navigation.

Avoid unnecessary changes to existing controls or visual design.

New capabilities should be accessible through additional tabs or unobtrusive buttons.

The default screen must remain the familiar Beat Lab interface.

---

# 3. ADD A PLAYLIST TAB — THE HEART OF SONG CREATION

Create a new **Playlist** tab inspired by the arrangement capabilities of FL Studio.

This will become the main workspace for assembling complete songs.

### Timeline

Implement a horizontal musical timeline containing:

- Bars and beats.
- Adjustable zoom.
- Current playback position.
- Playhead.
- Snap-to-grid.
- Adjustable snap resolution.
- Loop regions.
- Song duration.
- Horizontal scrolling.

### Multiple tracks

Allow users to add as many practical tracks as the browser and hardware can handle.

Tracks may contain:

- Drum patterns.
- Bass patterns.
- Piano patterns.
- Synthesizer patterns.
- Instrument melodies.
- Audio samples.
- Imported MP3/WAV audio.
- Recorded performances.
- Vocal recordings where supported.

Each track should have:

- Editable name.
- Track color.
- Volume.
- Mute.
- Solo.
- Pan.
- Instrument or channel assignment where applicable.

### Playlist clips

Users must be able to:

- Add patterns from the existing sequencer.
- Add patterns from the Piano Roll.
- Add imported audio.
- Drag clips to different positions.
- Move clips between compatible tracks.
- Duplicate clips.
- Split clips.
- Delete clips.
- Resize or trim clips.
- Loop clips.
- Create repeated sections.
- Select multiple clips.
- Copy and paste arrangements.

Clip placement must be accurate to the timeline.

### Actual audio waveforms

Imported and recorded audio clips must display their actual decoded waveforms.

Do not use generic decorative waves.

Render efficient waveform previews that remain accurate when zooming.

For MIDI/instrument patterns, display useful note or step previews rather than falsely displaying them as recorded audio.

### Song arrangement

Users should be able to construct arrangements such as:

- Intro: 4 bars.
- Verse: 8 bars.
- Chorus: 8 bars.
- Verse: 8 bars.
- Chorus: 8 bars.
- Outro: 4 bars.

These are examples, not fixed restrictions.

Users should be free to create their own song structures.

---

# 4. PATTERN CREATION AND MANAGEMENT

Add a reusable pattern system connecting the existing Step Sequencer, new Piano Roll, and Playlist.

### Drum patterns

Users should be able to make several independent drum patterns:

- Pattern A: Basic beat.
- Pattern B: Beat with extra hi-hats.
- Pattern C: Drum fill.
- Pattern D: Chorus beat.

These can be placed anywhere in the Playlist.

Creating Pattern B must not overwrite Pattern A.

### Instrument patterns

Support separate melodic patterns for:

- Basslines.
- Piano.
- Guitar.
- Synthesizer.
- Strings.
- Other instruments.

Each pattern must store its notes, timings, durations, velocities, and assigned instrument.

### Pattern actions

Add:

- New Pattern.
- Save Pattern.
- Rename Pattern.
- Duplicate Pattern.
- Edit Pattern.
- Delete Pattern.
- Add to Playlist.
- Loop Pattern.

Make it easy to return from a Playlist clip to the editor that created it.

Editing a reusable source pattern should update linked instances when appropriate, with an option to make a unique copy before editing.

Do not unexpectedly change unrelated clips.

---

# 5. ADD A COMPLETE PIANO ROLL

Create a new optional **Piano Roll** tab.

This should function like a simplified version of FL Studio's Piano Roll.

### Interface

Include:

- Vertical piano keyboard.
- Note grid.
- Horizontal bar/beat timeline.
- Adjustable grid resolution.
- Zoom controls.
- Scrollable octaves.
- Instrument selection.
- Playback cursor.
- Pattern selector.

### Note creation and editing

Allow users to:

- Tap to place musical notes.
- Drag notes up or down to change pitch.
- Drag notes horizontally to change timing.
- Resize notes to change duration.
- Delete individual notes.
- Duplicate notes.
- Select multiple notes.
- Create chords.
- Create basslines.
- Create long sustained notes.
- Adjust note velocity.
- Quantize notes.
- Copy and paste note groups.
- Undo and redo.

Support simultaneous notes so chords can play.

### Musical timing

Allow users to select note divisions such as:

- Whole notes.
- Half notes.
- Quarter notes.
- Eighth notes.
- Sixteenth notes.
- Thirty-second notes where practical.

Provide snap and quantization options.

The Piano Roll must remain synchronized with the project BPM and Playlist.

### Pattern integration

A user should be able to compose a bassline in the Piano Roll, save it, and add it to the Playlist immediately.

Piano Roll patterns must be reusable and independently editable.

---

# 6. INSTRUMENT LIBRARY

Add a selection of instruments that users can play through the Piano Roll and touchscreen keyboard.

### Initial instruments

**Pianos and Keys**
- Piano.
- Electric piano.
- Organ.

**Bass**
- Electric-style bass.
- Synth bass.
- Sub bass.
- 808-style bass.

**Synthesizers**
- Lead synth.
- Pad synth.
- Pluck synth.
- Retro synth.

**Melodic Instruments**
- Guitar-style sound.
- Strings.
- Bells.
- Flute-style sound.

**Percussion**
- Kick.
- Snare.
- Clap.
- Hi-hat.
- Cymbals.
- Toms.

Use high-quality free, redistributable sound samples where possible, or appropriate Web Audio synthesis.

Do not create an instrument library where every instrument sounds almost identical.

### Instrument controls

Where practical, allow:

- Instrument selection.
- Octave selection.
- Attack.
- Decay.
- Sustain.
- Release.
- Basic filtering.
- Instrument volume.
- Instrument panning.

Keep advanced settings optional.

Users should be able to preview instruments by tapping a playable keyboard.

---

# 7. EXPAND THE EXISTING EDIT SECTION

Do not remove Transpose or Volume.

Add independent controls for **Tempo / Speed** and **Pitch**.

### Tempo and speed

Allow imported audio and samples to be played slower or faster.

Include:

- Speed percentage.
- Playback speed multiplier.
- Source BPM where known.
- Tempo synchronization.
- Preview.
- Reset.

When possible, use pitch-preserving time stretching so changing audio speed does not change musical pitch.

### Pitch

Add actual audio pitch shifting.

Include:

- Semitone adjustment.
- Fine tuning where supported.
- Higher and lower pitch.
- Preview.
- Reset.

Where technically practical, changing pitch should not change audio duration.

### Transpose

Keep the current Transpose control and preserve its behavior.

Clearly distinguish MIDI note transposition from audio pitch shifting.

### Volume

Keep the existing Volume control.

Optionally expand it with fades and clip gain.

### Nondestructive editing

Do not permanently modify source audio when making tempo or pitch changes.

Store editing parameters and preserve the original file.

Provide undo and reset functionality.

### Independent tempo and pitch

This is important.

A user should be able to:

- Slow an audio sample without lowering its pitch.
- Raise its pitch without making it faster.
- Adjust both together if desired.
- Reset both to original.

If a high-quality independent time-stretch/pitch-shift implementation is not available, investigate suitable free and compatible processing libraries or algorithms.

Do not disguise ordinary playback-rate changes as independent pitch shifting.

---

# 8. SHARED MASTER TRANSPORT

All parts of Beat Lab must work on the same musical clock.

Include or preserve:

- Play.
- Pause.
- Stop.
- Record.
- Master BPM.
- Metronome.
- Tap tempo.
- Loop.
- Current bar/beat.
- Song position.

### Synchronization

Changing the master BPM should affect drum patterns and Piano Roll notes correctly.

Audio clips should follow their selected tempo-sync settings.

All tracks must remain aligned during playback.

Use accurate audio scheduling based on the audio engine's clock rather than relying only on UI timers.

Support starting playback from different positions within the Playlist.

When the user presses Play in the Playlist, the full arrangement should play together.

When the user edits an individual pattern, provide appropriate pattern preview playback without unintentionally starting the whole song.

---

# 9. COMPLETE MIXER

Add a new optional **Mixer** tab or panel.

Allow users to mix their full song.

Include:

- Individual track volume.
- Pan left/right.
- Mute.
- Solo.
- Level meters.
- Master volume.
- Basic EQ where feasible.
- Reverb where feasible.
- Delay where feasible.
- Audio clipping indication.

Every active Playlist track should route through the appropriate mixer channel.

Mixing controls must affect actual audio, not just displayed values.

Maintain separate settings for individual tracks.

---

# 10. AUDIO IMPORT, RECORDING AND VOCALS

Preserve the existing audio import functionality.

Support common browser-compatible audio formats.

### Audio import

Users should be able to:

- Import a song or sample.
- Preview it.
- View its waveform.
- Trim it.
- Change its tempo.
- Change its pitch.
- Add it to the Playlist.
- Move or loop it.
- Combine it with other tracks.

### Recording

Preserve existing Beat Lab recording capabilities and extend them where practical.

Allow recording of:

- Beat-pad performances.
- Piano Roll keyboard performances.
- Instrument performances.
- Microphone audio where permission is granted.
- Complete song playback.

Microphone access must be optional and permission-based.

Recorded material should be usable in the Playlist.

Recordings should retain their actual timing.

---

# 11. TOUCHSCREEN-FIRST DESIGN

Little Big Arcade operates on a Windows PC connected to a large touchscreen.

All new Beat Lab functionality should be comfortable to use with fingers.

### Requirements

- Large, clear buttons.
- Responsive touch dragging.
- Finger-friendly note resizing.
- Multi-touch piano keyboard.
- Easy Playlist scrolling.
- Dedicated editing tools where necessary.
- No unwanted browser gestures.
- No accidental text selection.
- Accurate touch coordinates.
- Smooth fullscreen behavior.

Keep the existing familiar UI sizes and layout unless a specific issue requires adjustment.

Do not redesign existing Beat Lab screens simply to make the new screens look different.

---

# 12. CONTROLLER AND TWO-PLAYER SUPPORT

Preserve existing two-player features.

Add practical controller navigation for:

- Switching tabs.
- Selecting instruments.
- Playing and stopping.
- Triggering pads.
- Navigating menus.

Do not force complex note editing or waveform editing onto controllers when touch is more intuitive.

### Two-player music creation

Where practical, allow:

- Player 1 on drums while Player 2 plays piano.
- Two players triggering different instruments.
- Collaborative beat creation.
- Shared recording of live performances.
- Independent simultaneous touch interactions.

The shared song arrangement should preserve both players' contributions.

---

# 13. SONG SAVING AND EXPORTING

Users must be able to save and reopen complete songs.

### Save project data

Include:

- Song name.
- Master BPM.
- Time signature.
- Playlist tracks.
- Clip positions.
- Clip lengths.
- Drum patterns.
- Piano Roll patterns.
- Instrument selections.
- Audio samples.
- Imported files or managed local audio assets.
- Audio tempo/pitch settings.
- Mixer settings.
- Track names and colors.
- Recording data.
- Loop settings.

Preserve compatibility with existing Beat Lab projects.

Implement necessary data migrations without deleting older projects.

### Exporting

Add complete song export.

Users should be able to export the actual combined audio of all Playlist tracks.

Support WAV and, where a compatible encoder is available, MP3.

The output must contain the synchronized drum patterns, instruments, audio samples, and recordings.

Provide appropriate audio quality settings.

Where practical, provide project backup and restoration.

Do not label WAV audio as MP3 or claim an export works without validating the resulting file.

---

# 14. KEEP THE EXPERIENCE SIMPLE FOR CHILDREN

This expansion must not make existing Beat Lab confusing.

### Default behavior

Opening Beat Lab should show the current familiar interface.

The children should still be able to:

- Tap pads.
- Build beats.
- Adjust familiar settings.
- Play their creations.
- Use the current sequencer.
- Record or save as before.

The new professional features should be optional.

### Navigation

Add simple tabs such as:

- Beat Lab (existing view).
- Playlist.
- Piano Roll.
- Mixer.

Keep existing editing tools in their familiar locations.

Use plain-language labels and short explanations for new functions.

Do not overwhelm the existing interface with dozens of new buttons.

Provide optional instructions when someone first opens an advanced tab.

---

# 15. TECHNICAL IMPLEMENTATION

Inspect the existing audio architecture and reuse working functionality wherever practical.

Investigate appropriate Web Audio APIs and suitable free libraries for:

- Accurate musical scheduling.
- Instrument synthesis.
- Sample playback.
- Audio decoding.
- Waveform visualization.
- Independent pitch shifting.
- Time stretching.
- Audio mixing.
- Recording.
- Exporting.

Use efficient processing and prevent audio glitches.

Do not allow waveform rendering or large imports to freeze the interface unnecessarily.

Ensure the audio scheduler can handle multiple synchronized tracks and overlapping notes.

Use proper resource cleanup when changing projects or closing Beat Lab.

---

# 16. REQUIRED REAL-WORLD WORKFLOW TEST

Before considering the upgrade complete, demonstrate this entire workflow:

**Step 1:** Open the existing Beat Lab and create a drum pattern using the original Step Sequencer.

**Step 2:** Save the drum pattern as "Drums A."

**Step 3:** Add "Drums A" to Playlist Track 1 and repeat it for eight bars.

**Step 4:** Open Piano Roll, select a bass instrument, and compose a four-bar bassline.

**Step 5:** Save it as "Bass A" and add it to Playlist Track 2, repeating it as needed.

**Step 6:** Create a piano melody on Track 3.

**Step 7:** Import an audio sample onto Track 4 and verify its actual waveform appears.

**Step 8:** Adjust the sample's tempo and pitch independently where supported.

**Step 9:** Add a second drum pattern for a chorus section.

**Step 10:** Arrange the patterns to make a song containing an intro, verse, chorus, and outro.

**Step 11:** Play the entire song from beginning to end and verify all tracks are synchronized.

**Step 12:** Adjust individual track volumes and verify the resulting mix changes.

**Step 13:** Save the song, close Beat Lab, reopen it, and confirm the complete arrangement is restored.

**Step 14:** Export the finished song and verify that the exported file contains all of the audible tracks in the correct positions.

Also test that existing Beat Lab projects and the original pad/sequencer workflow continue to function.

Do not claim success if the Playlist only renders visually or if exported audio omits instruments.

---

# 17. IMPLEMENTATION MILESTONES

Work incrementally and preserve a functioning application.

### Phase A — Pattern and Playlist Foundation

Build the reusable pattern system, Playlist timeline, tracks, clip arrangement, and pattern placement.

Connect the existing Step Sequencer to Playlist playback.

### Phase B — Piano Roll and Instruments

Implement note editing, instrument selection, polyphonic playback, pattern saving, and Playlist integration.

### Phase C — Advanced Audio Editing

Add dedicated tempo/speed and pitch controls to the existing Edit section.

Implement reliable time stretching and pitch shifting where technically possible.

### Phase D — Mixer and Recording

Implement synchronized multitrack playback, mixer routing, audio recording, and audio imports.

### Phase E — Export and Final Integration

Implement complete song export, compatible project saving, touchscreen testing, and comprehensive regression checks.

Update ARCADE_REVAMP_PROGRESS.md and WORK_MODE_HANDOFF.md if they exist.

Integrate this expansion into the current Little Big Arcade development roadmap without overwriting or renumbering completed milestones.

Document all completed features and outstanding issues.

Do not deploy without authorization.

---

# FINAL INSTRUCTION

**Turn Beat Lab into a complete song creation tool without changing the familiar experience my children already enjoy.**

A user should be able to make a drum beat, add it to the Playlist, create a bassline in Piano Roll, add a piano melody, introduce new instruments, import samples, edit tempo and pitch, arrange different musical sections, mix the result, and export a complete song.

All components must be connected and genuinely functional.

Preserve the current Beat Lab interface and all existing features.

Do not create a separate app.

Do not remove or simplify existing functionality.

Prioritize touchscreen interaction and two-player creativity wherever practical.

**Start by inspecting the current Beat Lab implementation, then build the new song-creation functionality into the existing game in tested, working phases.**