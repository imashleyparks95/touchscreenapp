# Final consolidated arcade acceptance — v6.29.0

User-directed consolidation of all remaining 7/8/9 review and milestone 10 into **one final checkpoint**. Historical milestone numbering/progress is retained. This document is an acceptance record, not a claim that every possible artwork improvement, physical test or requested native mapping has been finished. It distinguishes delivered software from work needing the actual family device. No separate M9D/M10 development chain is planned; issues found in the final deployed trial belong to this final milestone.

## Automated result

61 test programs and all 21 browser suites pass at v6.29.0. Final audit/build/syntax/diff checks pass; 25 public IDs and all 98 original asset/vendor hashes retained. Exact invocation version, suite exit codes and logs: revamp/FINAL_BROWSER_SUMMARY.json. No browser suite failed/skipped in the integrated run. Physical/user acceptance below remains pending.

## Delivered software / verification scope

All 25 public game IDs, one secret route, classic Wobbly and old score editions, local profiles/achievements/projects/media/armies, offline assets and original source checksum provenance remain. Shared controller cursor navigation remains for pointer games; native gameplay is available for Limit Break, Slime, Ninja and Wobbly 3D. Freehand art/handwriting stays touch/mouse first. This is the existing practical capability contract, not a claim of native direct control for every game.

Current integration fixes preserve both old Beat Battle takes before a new battle; prior 7A–9C gameplay/art/input/persistence changes remain. Full unit suite and every browser suite are run and evidenced for this version. Browser/source fixture tests validate correctness and local rendered scenarios, not a complete natural-time human playthrough of each campaign. Some long flows use declared accelerated clocks, generated camera/microphone or injected controller inputs. Standalone 3D tests use actual models/Havok under NullEngine; this is not GPU image quality or frame-rate evidence. Historical per-suite JSON may contain older fixed version labels; FINAL_BROWSER_SUMMARY.json and invocation logs identify the actual integrated runtime.

| Stable game ID | Current automated paths | Final user/device acceptance and honest remaining polish |
| --- | --- | --- |
| `gladiator` | arena-browser / quest-controllers | Physical tactical input, full user career; further character art |
| `math` | learning-browser / math-expansion / quest-controllers | Handwriting, educational pacing, mixed-grade user trial |
| `bugs` | reaction-browser / refinement | Physical fast touch/audio |
| `paint` | creative-browser / studios | Physical two-artist drawing, additional brush/sticker art |
| `balloons` | reaction-browser / refinement | Physical tracking/touch/audio |
| `cafe` | care-browser / refinement | Natural-time two-player shift and recipe/audio feel |
| `circuit` | workshop-browser / circuit-face | Physical drag/controller feel |
| `gravity` | physics-browser / gravity | Physical rotation/ramp gestures and target PC |
| `battle` | play-browser / refinement | Physical simultaneous play/audio |
| `build` | physics-browser / smash | Physical sling/building, additional material/effects art |
| `beat` | creative-browser / studios / beat-sessions | Audible latency/mic/full 30-second takes; new expansion separate |
| `slime` | motion-browser / touch-worlds | Physical native advanced-course controls |
| `dentist` | care-browser / care-revamp | Physical precise treatment gestures |
| `ninja` | motion-browser / touch-worlds | Physical native full missions |
| `castle` | defense-browser / castle-overhaul | Physical building/defense; further troop/projectile art |
| `buddy` | play-browser / premium | Physical multi-limb/gadget advanced rooms |
| `doodle` | defense-browser / defense-polish | Physical sketch feel/mine/healer balance |
| `robot` | workshop-browser / premium | Physical precision tools/difficulty feel |
| `wars` | wars-pointer/native/presentation browser / core/weapon tests | Physical pads/touch/audio/GPU/large-army frame pacing |
| `funny` | media-browser / media-polish | Physical face tracking/filter combinations/recording |
| `monster` | media-browser / media-polish | Physical voice/face and personality QA |
| `zoo` | zoo-air-browser / zoo-air-polish | Physical pan/care/local voices |
| `air` | zoo-air-browser / air-slice | Physical hand-only camera tracking and co-op audio |
| `spelling` | learning-browser / spelling | Audible pronunciation/device voices and physical writing |
| `limit` | limit/expedition/benchmark browser / toolkit/core/scene | Physical four-zone solo/co-op, target GPU, 30/60 FPS tuning |

## Deployed final trial

1. Use the existing URL/origin and a normal lobby/Settings update; export real family backup first and retain browser data. Verify version 6.29.0 and actual deployed commit. No replacement site.
2. Check every game launches after its once-per-session instructions, starts/restarts, pauses/backgrounds, exits cleanly and retains scores/progress. Try solo and each actual advertised local mode; quit an incomplete match and verify no completed result appears.
3. Pair two real controllers, test native games and cursor-based menus, release-to-confirm, disconnect/reconnect/no automatic resume, mixed touch/controller. Test actual multi-finger capture, fullscreen and device screen scaling. Check turn fairness/rematches and personal/co-op record separation.
4. Check artwork/readability/color, reduced motion/effects and audible sound at family-safe volume. Try real microphone/camera/voice permissions and verify capture stops on exit/background. Imported fixture images/streams do not replace this trial.
5. Play Limit Break four connected zones and replay, benchmark all scenarios and auto-tune on the actual target PC. Record measured resolution/backend/frame times/1% lows/median/p95 and honest unavailable GPU/RAM metrics. Check Wobbly armies across quality presets. No FPS target is certified in cloud tests.
6. Test binary backup/export and reopen existing drawings/music/sounds/armies/designs. Beat Battle: preserve a dirty named song and both preceding takes, start another battle, recover each owner’s item from Projects; saved originals remain unchanged.

## Remaining work / completion criteria

Automated final release readiness can be complete while physical acceptance remains pending. The earlier per-game ledger still records additional subjective art/animation, balance and hardware refinements. They are not silently checked off by consolidation, and universal native controller gameplay is not implemented. Capture any user findings under this final milestone, fix concrete failures and rerun relevant checks before declaring complete target-device acceptance. The broad original artistic vision has no objective all-art-finished test; retain documented limits and user judgment.

## Beat Lab follows in exactly three milestones

Full attached specification: BEAT_LAB_EXPANSION_MASTER_PLAN.md. Executable roadmap: BEAT_LAB_THREE_MILESTONES.md. **BL1 Playlist/song foundations; BL2 Piano Roll/instruments/performance; BL3 advanced audio/mixer/export/final workflow**. Planning only at this checkpoint. Existing familiar Beat Lab interface is explicitly preserved; no advanced placeholder or fake time-stretch/export claim. Each future milestone gets its own tested deployment/trial boundary.
