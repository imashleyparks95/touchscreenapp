# Little Big Arcade project requirements

- Before revamp work, read `ARCADE_REVAMP_PROGRESS.md` and the full specification in `docs/ARCADE_REVAMP_MASTER_PLAN.md`. Resume from the latest verified state; do not duplicate existing Limit Break systems.
- Update `ARCADE_REVAMP_PROGRESS.md` at the end of every coding session with completed work, unfinished items, actual tests/results, failures/limitations and precise next steps.
- Stop after each milestone so the user can try it before implementation of the next milestone. Do not treat earlier deployment authorization as approval to deploy new milestone changes; deployment needs explicit authorization for the current work.
- The user prefers a dark overall arcade UI: use muted dark backgrounds and softer accents, not bright cream/light shell surfaces. Keep text readable and preserve individual games' intentional art direction.

- Add two-player support to every new game whenever reasonably feasible, in the initial implementation. Use simultaneous versus and co-op where the mechanics permit. Use clearly explained alternating turns or pass-and-play when the input hardware cannot support simultaneous interaction.
- Preserve single-player play, existing games, profiles, scores, achievements, saved projects, multiplayer behavior and backup compatibility.
- Every open game session requires the shared, game-specific instruction acknowledgement once before gameplay or device capture. Rounds, levels, restarts, rematches and internal activity changes do not repeat it. Exiting to the arcade and reopening requires it again. Keep manual How to Play available.
- Games may have their own appropriate artistic identity. Do not redesign existing UI or games just to enforce a neon theme or aesthetic uniformity.
- Label camera/touch/mouse input honestly. Never substitute synthetic tracking for real tracking in normal gameplay. Keep device processing local and release capture resources on exit/backgrounding.
- Distinguish automated fixtures and generated streams from physical camera, microphone, Windows and USB multitouch verification in acceptance reports.
- Before creating or modifying a 3D game, read `3D_GAME_DEVELOPMENT.md` and reuse the tested interfaces in `dist/js/3d/`. Keep game-specific art, rig mappings and rules outside the toolkit. Update the documentation when shared systems change, run independent toolkit/starter tests and regression-test existing dependent games. Do not call an untested extracted helper reusable.
- Preserve existing menus, visual purchasing controls and established player workflows during 3D/engine upgrades unless the user explicitly requests UI changes. Recover originals from source/history before reconstructing; document missing references and never invent a purchasing subsystem or silently downgrade the engine as a UI-restoration fallback.
