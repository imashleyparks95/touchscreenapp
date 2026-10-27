# Little Big Arcade 5.4.0 — Update notifications

Implemented October 25, 2026. This release changes the shell, update UI, release data and offline resource handling. It does not change game rules or saved player data.

## Delivered behavior

- The header and Settings show the current `APP_VERSION` from `dist/js/releases.js`. The compact header badge includes the current release summary and opens complete recorded arcade history.
- A shared native dialog renders welcome announcements, arcade updates, game updates, new-game introductions and histories. It uses existing game artwork, not placeholder images.
- Updated-game notice appears before that game's controller or setup is created. Acknowledgment then permits setup. Existing Play → mandatory How to Play → gameplay gating remains intact.
- Every direct shell route uses the same gate, including leaderboard shortcuts, Creative Studio, Beat Lab and the hidden game. No separate announcement logic was added inside games.
- Global and game acknowledgments are independent. Profile changes do not repeat notices. Existing open tabs refresh the shared saved acknowledgment state before checking or writing.
- Multiple missed releases are combined newest first; identical descriptions are deduplicated. Only release entries containing the selected stable game ID produce a game notice. Unchanged games remain quiet.
- Newly introduced games use “New game” and “Discover the game,” then proceed to setup and normal instructions. Later releases use the normal update heading.
- Manual history is read-only and does not acknowledge pending updates. From a mandatory notice, history's Back button or Escape returns to that notice.
- Game Update History is available on each game's initial setup/title screen. It is hidden after a live session has acknowledged How to Play, so opening history cannot leave game clocks or physics running under it. Return to setup via the arcade to view it again.
- Feed the Face remains absent from the public deck and public release notes. Its five-logo-tap activation and instructions remain intact; the secret shell entry also supports future private game notices after activation.

## First installation and migration

Acknowledgments use the independent browser-local `lba-update-notices-v1` key, never individual child profiles. This leaves the existing profile/leaderboard/media storage and backup format unchanged.

- A new browser without existing arcade records receives Welcome once. Its baseline is the installed release, so included games do not each show an old update notice.
- An existing arcade installation without notice tracking gets the current arcade announcement. Because older builds did not save an installed application version, migration conservatively uses the last documented pre-combat release, 5.2.0. It announces the verified 5.3.0 changes in Air Slice, Wobbly Wars and Castle Creator once, independently of the new 5.4.0 notification feature. It does not invent a prior acknowledged version or announce unrelated games.
- Closing or leaving before acknowledgment leaves the notice pending. Returning from a game notice to the arcade does not acknowledge it.
- If browser storage is blocked or full, acknowledgment works for the running page and a visible warning says it may return next launch. No game data is cleared to make room.
- The recorded release history begins with the documented 5.2.0 release; unknown earlier release dates and descriptions are not fabricated.

## Offline and reset behavior

- Notes ship with the app; notices and history require no API, analytics or external request. Acknowledgments work offline when browser storage is available.
- The service worker precaches the release modules and serves installed resources from its versioned cache. A new worker waits rather than replacing the worker during a running game. Open online to download an update, then close all arcade tabs and reopen to activate a completely cached version. A failed cache installation leaves the previous worker available.
- Private hosting authentication may still need a connection in a new browser. An uncached first visit cannot work offline.
- Settings → Reset update acknowledgments only requires confirmation. It replays the documented arcade and game notices, preserves larger-text preference, and touches no profiles, settings, scores, media or game saves.
- Ordinary backup restore and profile changes leave this installation's notice acknowledgments intact. They are deliberately separate from portable family progress.
- Clearing all browser site data removes both notices and local player data. Settings explains this and recommends exporting a backup first. A new installation then welcomes the player.

## Accessibility and reading

- Native modal dialog contains keyboard focus and blocks underlying pointer/touch interactions. The heading receives focus; Tab reaches all controls. Mandatory notices cannot be dismissed with Escape or backdrop tapping.
- Large text is persistent and shared across profiles. Notes scroll when needed, with the acknowledgment footer staying visible.
- Read Aloud starts only on intentional input, uses browser speech synthesis at a comfortable rate, has Stop, and cancels on dialog close. Unsupported browsers disable the reading buttons; synthesis errors show an explanation without blocking acknowledgment.
- Speech voices depend on the browser/OS; some voices may need connectivity. No external paid speech API or new remote dependency was added.
- Existing reduced-motion preference and the OS media preference disable the arrival animation.

## Release maintenance

Edit only the newest-first `RELEASES` data to describe a shipped release. The first entry supplies the installed version and summary. Include `games[stableGameId].changes` only for games that changed. Use `introduced: true` with a child-friendly `introduction` only for a genuine new game. Changes carry NEW, IMPROVED, FIXED or PERFORMANCE categories. Keep hidden-game descriptions out of public `changes`; a future `games.face` entry will be shown only after secret activation or in its own history.

Package and lock versions are checked against the release source. Do not claim unverified hardware outcomes in release notes. The Air Slice note describes hand collision and fallback behavior, not certified segmentation quality on a physical webcam.

## Verification

The full 17-suite `npm test` run passed, including the preexisting 16 suites. The new update suite covers fresh installation, unacknowledged reload, existing migration, independent app/game acknowledgment, unchanged games, missed updates, duplicates, a later update, future new-game introduction, read-only history, reset, storage failures, multiple tabs, reading controls and the actual shell entry wrappers. The actual shared modal is exercised with no launch before acknowledgment, duplicate input rejection, Escape handling, navigation cancellation and deferred input-frame separation.

The existing launch suite also runs real game controllers/models and advances 30 seconds of frame callbacks while acknowledgment is withheld: no game model, timer, physics, enemy or score starts. It continues to cover all normal worlds and the secret game, both creative workspaces and in-session restarts.

Browser QA of the actual application verified:

- 5.4.0 arcade notice with 5.3.0 + 5.4.0 recorded changes; correct header badge after acknowledgment; no automatic repeat in another tab.
- Wobbly Wars notice before setup, with matching original artwork and no canvas underneath.
- Acknowledgment proceeds to setup; two-player selection still reaches separate How to Play with both player names and turn rules.
- Changing Kelly to Roxy does not repeat the Wobbly notice. Its manual history opens from setup.
- Castle Creator's update remains pending after returning to the arcade without acknowledgment.
- Large-text Castle notice fits inside actual 1366×768 and 1920×1080 iframe viewports, with its footer visible and no internal dialog overflow. At 800×600 the notes scroll while the footer remains in the viewport.

Physical Windows touchscreen input, native Windows fullscreen, screen-reader announcements and audible output from the target PC were not hardware-tested. Browser controls, DOM layout and speech lifecycle were checked; actual OS voice availability remains device-dependent.
