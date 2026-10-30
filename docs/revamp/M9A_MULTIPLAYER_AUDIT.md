# Milestone 9A multiplayer / replayability audit

This is a source-contract inventory of all 25 public launcher games, not 25 new physical playthroughs. Capability labels are taken from dist/js/library.js and checked by existing instruction/library regressions. Secret and legacy score-only entries are intentionally absent. Earlier per-game evidence remains in progress/history.

| Game ID | Existing advertised local mode |
| --- | --- |
| gladiator | Turn-based duels |
| math | Take turns · co-op |
| bugs | Split-screen versus |
| paint | Create together |
| balloons | Split-screen versus |
| cafe | Take turns |
| circuit | Split-screen versus |
| gravity | Split-screen versus |
| battle | Simultaneous versus |
| build | Take turns |
| beat | Shared studio · take turns |
| slime | Split-screen races |
| dentist | Take turns |
| ninja | Split-screen races |
| castle | Take turns · co-op |
| buddy | Take turns |
| doodle | Split-screen · co-op |
| robot | Take turns |
| wars | Versus · co-op |
| funny | Two-face challenges |
| monster | Take turns · create |
| zoo | Shared zoo · take turns |
| air | Versus · co-op |
| spelling | Split-screen · turns · co-op |
| limit | Simultaneous co-op |

## Shared result path reviewed

`data.js:commitRound` owns result identity, personal bests, XP, wins/streaks and pair rivalries. Explicit winner overrides score (round wins/other game comparators); null means tie. Separate single-entry co-op commits in Wobbly, Spelling, Math and Air preserve each partner's achievements without inventing a head-to-head rivalry. Those contracts are retained.

Verified first fixes: reject duplicate/nonexistent ranked profiles and non-finite scores before either player mutates; retain per-entry IDs for unranked feedback without records; explain existing alternating next starter on café/penalty results. Negative finite scores remain legal. No retroactive changes to old statistics, records, saved formats or score editions; no new multiplayer indicators/modes. Game controllers retain responsibility for exactly-once completion and incomplete-session exclusion; the recorder does not guess a session identity or deduplicate legitimate equal-score rematches.

## Current evidence and remaining work

New isolated recorder tests check invalid roster/score/winner atomicity, no-write practice, explicit round winner, tie, reversed pair, co-op separation and backup validation. Existing real-host refinement regressions cover equal fresh turns, sudden death, first-player rotation, exactly-once recording and pause-safe clocks. Café browser completes two turns with a declared accelerated-clock fixture, checks real next-starter result copy and pause behavior. Shell browser checks common navigation. Full regression results are in M9A_UNIT.txt after completion.

Next proposed M9B: review game-specific two-player progression/reward gaps, starting with learning/co-op sessions and replay choices. Hardware controller/touch combinations, full live multiplayer playthroughs and M10 acceptance remain. M9 is not complete.
