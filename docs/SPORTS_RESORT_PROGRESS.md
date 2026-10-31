# Little Big Sports Resort — persistent milestone plan

Original specification retained verbatim in SPORTS_RESORT_MASTER_PLAN.md. Base: Creative Freedom v6.33.0 / 31eb2df. Branch sports/resort-bowling-foundation. The user's final directive explicitly requests the tracking foundation and first fully playable Bowling checkpoint; M1/M2 are delivered together for its first deployed trial, then pause before Tennis. No prior milestone history is replaced.

1. **Motion foundation** — software checkpoint delivered: reuse Air Slice PoseTracker/PoseIdentities and LocalMediaSession; body-relative calibration, wrist/index/pinky/thumb coarse hand tracking, temporal gesture events, local preview/diagnostics, safe loss/overlap/pause/cleanup and genuine fallback controls. Full 21-point Hand Landmarker is investigated, not required for Bowling's arm release; separate finger-joint tracking is not claimed.
2. **Bowling** — software checkpoint delivered: actual local Babylon/Havok ball/pin contacts, ten frames/strikes/spares/tenth-frame fills, solo/personal-best, two-player turns/mixed per-player inputs, scorecards, original resort alley/equipment/avatar rig, sound and complete results/records.
3. **Tennis** — planned after user trial: rallies/AI/racket collision, measured fore/backhand/serve and mixed simultaneous controls with reliable identity gating.
4. **Boxing** — planned: measured punches/guard/dodge, safe short gestures, AI/counters/rounds and trustworthy two-person separation/fallbacks.
5. **Baseball and Golf** — planned: complete batting/pitch/foul/hit modes and multi-hole clubs/ball/hazard/par rules with actual temporal swing controls.
6. **Full resort integration** — later: expand current hub/avatar/profile foundations into complete championships/trophies for the five working sports.
7. **Final motion/gameplay polish** — later: full five-sport completion and physical target-PC camera/controller/multitouch/latency validation.

The current hub must explicitly label Tennis/Boxing/Baseball/Golf as planned, never imply that only Bowling completes the collection. Real pose inference is wired to the actual camera; generated landmark fixtures are reported separately from real hardware. Existing offline model/runtime licensing is reused; no footage upload, recording, face recognition or automatic camera permission.

## Verified checkpoint · 6.34.0

Read SPORTS_RESORT_BOWLING_DELIVERY.md for scope, evidence and physical limitations. Full 69-program tests plus final focused checks, six browser suites/170 accessibility-layout audits, preservation audit and build passed. Actual coarse-hand/body motion is wired; full finger tracking is not delivered. Pause before M3 for the deployed Bowling trial. Publication pin follows the application commit.

Publication: tested application `8b9add7b24ddcd2c99b5fa6b07234c2b2b70d5c6`, branch `sports/resort-bowling-foundation`, pushed and remote SHA verified. Documentation-only follow-up pins the tested source; no deployment performed. Stop for the user trial before Tennis.
