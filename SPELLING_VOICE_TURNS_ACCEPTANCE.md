# Spelling Adventure — voice and one-word turns (5.4.1)

Released October 25, 2026. This patch is limited to Spelling Adventure, its instructions and release notes, plus the versioned offline cache. All 3,350 existing vocabulary entries are unchanged.

## Voice behavior

- Automatically ranks English voices supplied by the browser and operating system. Recognized natural/enhanced female voices are preferred; ordinary female English voices and other English voices are available fallbacks. The browser does not expose a reliable voice-gender or clarity measurement, so selection uses known voice names and quality labels rather than claiming an audio quality test.
- Accepts browser-provided English voices as well as installed local voices. No account, key, subscription, payment or additional installation is required by this feature. Availability and sound still depend on the computer/browser.
- Waits for delayed voice discovery. If the selected voice fails, tries other English voices, explicitly retaining a local fallback, then the browser's default English voice. Failed voices are avoided for the rest of that page's session. A visible definition/pattern fallback remains if synthesis is unavailable.
- Default normal speed remains 0.85. Existing explicitly saved speed preferences are preserved. Repeat Word replaces old speech; Say It Slowly uses 75% of the selected rate without changing the saved normal speed.
- Every speech call replaces the whole-word name Niko with the spoken text `NEE-koh`. The displayed name and saved profile remain Niko. Other names such as Nikolai are unaffected.
- Automatic simultaneous prompts remain queued to prevent overlap. Manual repeats replace the queue. Pause, handoff, results and exit cancel speech; late events cannot restart a canceled prompt. Voice-loading listeners and timers are released on cancellation/exit.

Actual naturalness, female-voice availability and audible NEE-koh pronunciation on the family's Windows computer were not verified. The cloud browser's speech attempt failed, and its visible fallback was verified rather than reported as successful audio playback.

## Strict turn-based flow

Only `layout: turns` uses these rules. Solo, simultaneous split-screen and cooperative scoring/flow retain their existing behavior.

1. Player 1 gets a word after the usual mandatory instructions.
2. A submitted answer updates that player's score, accuracy and streak once and displays feedback. Answer controls lock until the player chooses Next Player.
3. Both workspaces are hidden during a Ready handoff. The next prompt is not generated, encountered, drawn or queued for speech yet. The clock is stopped.
4. The next player intentionally presses Ready. Only then does their next word enter their personal history and become visible/spoken.
5. Players alternate exactly one word each. A 10-word setting means ten per player, twenty individual turns; 15 and 20 are likewise per player.
6. Results show both names, scores, correct/wrong counts, accuracy, best streak, turns, winner/tie and Play Again.

The next player's name and difficulty are visible on the transition, without exposing their word. Ready has a large touch target and initial focus. Tab cycles between Ready and an arcade exit. Repeated held Enter/Space cannot acknowledge the handoff accidentally. The underlying workspace is inert; pause/settings cannot replace the handoff. Exiting still offers the normal unfinished-round confirmation.

Each player retains their own board operations. With Auto-Clear OFF, their writing returns on their next turn. With it ON, only the outgoing player's board clears. A `canDraw` guard also stops captured drawing input when that player becomes inactive or the game pauses. Tile drag/release handlers reject inactive or completed challenges.

## Equal-turn special modes and scoring

To satisfy equal completed challenges in every turn-based activity:

- Spelling Bee, Letter Builder and Missing Letters complete the selected word count per player.
- Turn-based Sprint uses the selected active time per word, rather than letting one player spend a whole timed session first. An expired word counts as one incorrect answer, shows its correction once, then waits for the normal handoff. Feedback and Ready time do not consume the word timer.
- Turn-based Survival records the existing hearts/mistakes, clamped at zero, while both players finish their selected word count. Solo/split/co-op Survival retains its existing elimination rule.
- A short Practice Missed Words list recycles only that player's review words to provide equal turns. If either selected practice list is empty, the game explains the issue and returns to setup without starting a scored round.

These turn-based rules are explained in setup and mode-specific How to Play text.

Normal correct-answer, no-hint and streak points form the unchanged base score. Turn-based difficulty weights are Niko ×1, Roxy ×1.25, Kelly ×1.5. Total adjusted score is rounded from the running base total, preventing accumulated rounding bias. Highest adjusted score wins; accuracy breaks matching scores, then the game is tied. Other layouts retain base scoring.

New competitive turn records use `spelling-turns-v2`. Original records remain stored and selectable as Original spelling rules; they are not mixed into the adjusted-turn ranking. The existing backup format continues to retain vocabulary history, mastery, achievements, profiles and old/new results.

## Verification

The full 17-suite arcade test run passed. Focused spelling, instruction-launch, update-notification and offline checks were repeated after the final input/focus and instruction refinements.

The expanded tests exercise the actual controller with real spelling models across all five activities and both Auto-Clear settings. They verify exactly twenty alternating turns, independent histories/boards/streaks, inactive input rejection, prompt/speech/history deferral until Ready, frozen handoff clocks, timeout scoring once, review recycling, weighted totals and one final commit. Existing solo, split and co-op controller tests still pass.

Speech fixtures verify natural female voice preference, late voice-list events, preferred-voice failure/local fallback, speech serialization, cancellation, replacement, slow replay and the NEE-koh text override. They are simulated speech callbacks, not a recording of a physical voice.

Actual browser playthrough:

- Arcade and Spelling Adventure update notices precede setup and mandatory instructions.
- Niko versus Roxy completed all twenty turns through normal form/Ready controls. Both received ten words; results showed Niko 125, Roxy 0, correct/wrong counts, accuracy, best streaks and the winner.
- A real pointer-drawn stroke remained on Niko's board when his second turn returned; Roxy had a separate empty workspace.
- The first handoff contained zero visible player panels, an empty Player 2 prompt/word counter and focused Ready. No next word was exposed before the acknowledgment.
- Ready card/button fit at 1366×768 and 1920×1080, with no horizontal overflow. Final Spelling Bee instructions at 1366×768 measure 1120×672 pixels, with matching scroll/client heights (no internal scrolling). Instructions and gameplay were checked inside the actual app at touchscreen dimensions.

Physical Windows/USB multitouch, native Windows fullscreen, speaker output and individual installed voices remain unverified. No camera or microphone is used by this patch.

## 5.4.2 pronunciation correction

The spoken-name text override is now exactly `NEE-KO`, as requested, for every case-insensitive whole-word occurrence of Niko. Display names, profile storage, word decks and scoring remain unchanged. Focused spelling, release-notification and offline tests passed after this correction. Audible pronunciation on the physical Windows device remains unverified.

## 5.4.3 American English correction

Per the user's correction, Spelling Adventure now reads the name as `Niko`, without hyphenated phonetic text, and requests `en-US` for every utterance. Registered American English voices take priority regardless of another accent's voice quality. Female/natural preferences apply within American English. The synthesizer tries only registered American English voices, then an unbound browser-default `en-US` request; it never explicitly selects a British voice. The fallback status describes the American English request rather than guaranteeing an accent the device may not provide. No account, paid API or installation was added. Display names and game data are unchanged. Focused spelling, release and offline tests passed. Audible voice quality/name pronunciation on the physical Windows PC remains unverified.

## 5.4.4 word-only replay and voice choice

Manual Repeat Word, Say It Slowly and Hear Sentence no longer prepend a player's name. Automatic multiplayer turn announcements may still identify the active player once. Word prompts use the actual written word, capitalize the pronoun I and terminate the utterance with punctuation. Default slow replay is about 0.72x rather than 0.64x to avoid excessive stretching; the ordinary saved speed stays unchanged. No vocabulary or scoring changed.

Setup's Audio settings and paused in-game Settings now share a voice picker, explicit Try This Voice sample and visible playback/error feedback. It offers Automatic and up to three distinct registered female American English voices, with real device names and an honest available count. Known voice-name matching is used because Web Speech exposes no reliable gender field. It never invents voice options or creates three pitch variants of one voice. If a browser supplies fewer matching voices, fewer are offered; no accounts, paid services, keys or installations are introduced.

The selected stable voice identifier is saved in the current setup player's Spelling settings, survives backup/restore and is honored before automatic ranking. An unavailable saved voice falls back automatically without erasing that preference. New voice-list events refresh the picker, and listeners are released on exit. Selecting/previewing voices cancels old speech and does not restart the round or reset scores.

Expanded real-model controller tests cover word-only manual speech in solo, turns, split and co-op; female-US filtering, three-choice cap/deduplication, selected-voice precedence, delayed discovery, missing-voice fallback, settings normalization and backup retention. Existing turn/canvas and launch-gate tests still pass.

Browser QA used both the actual browser's empty voice catalog and a clearly labeled simulated three-voice catalog (no actual speech audio). The simulated catalog verified all three options, selection, preview and persistence after reload. In a real-controller two-player session, Repeat Word requested only `disaster.`; after a correct answer, changing/previewing a voice in paused Settings preserved 188 points and 1/10 words. This tests UI routing, not physical voice quality. The actual cloud browser's lack of named female voices is shown honestly. Audible pronunciation and voice availability on the family's Windows PC remain unverified.

## 5.4.5 Niko word-length variety

Niko's existing 550-entry bank already contained 320 four-letter, 42 five-letter and 15 six-letter words. Adaptive tier sorting kept new sessions on the 171 tier-one short words, and Survival also pulled short-tier entries ahead of the mixed deck.

Normal Niko runs now use the 523 existing 3–6-letter entries. Each ten-word block shuffles a pattern of three 3-letter, four 4-letter, two 5-letter and one 6-letter word. Words inside each length group still prefer unseen entries and then older history; adaptive tier ordering remains within those groups. This per-length recency rule ensures long words remain in the mix even while many shorter words are still unseen. The first twenty words include the balanced mix in both ten-word blocks. Survival respects this mixed order for Niko. Roxy and Kelly retain their existing selection/progression rules.

No vocabulary entries or saved histories were deleted. Practice Missed Words still uses the actual marked review list, including older short entries. Score formulas, mastery, voice controls, writing and turn alternation are unchanged. The Niko setup card and normal active-player header show 3–6 letters.

Tests cover eighty seeded decks at each adaptive tier, both first ten-word blocks, uniqueness of all 523 eligible entries, all five Niko modes, legacy one-letter review, and unchanged Roxy/Kelly recent-word priority. The full spelling suite also retains all multiplayer and voice checks.
