# v4.0.1 — Buddy neck, Ladybug sizing and mandatory instructions

## Scope

The update changes Buddy Mayhem's neck joint, Ladybug's playfield layout/coordinate transform and game-session entry across the arcade. Other game rules, storage keys, player profiles, scoring rulesets, legacy records, saved creations and secret activation are preserved. Hard remains the default. Shared Ragdoll neck correction is opt-in for Buddy; Wobbly Wars retains its previous joints.

## Buddy

The head now has a torso-relative rotary constraint with a gentle damped spring and ±0.5 radian (about ±29°) neck stops. The angular stop applies equal/opposite reactions, and excess attachment stretch is solved through the physical attachment points with inverse-mass weighting. It does not lock to screen vertical. The body remains free to flip, fall, collide, bounce and respond to independent limb grabs and gadgets. Normal impacts produce small wobble that settles toward the torso's natural head pose. Ragdoll cleanup removes its joint callbacks.

## Ladybug

Only the Ladybug room gets the measured flex/grid sizing fix: a bounded full-viewport height chain, stretch-aligned minmax grid columns, a real flex playfield and an absolutely fitted canvas. Canvas intrinsic dimensions can no longer grow its grid or collapse its height. Rendering uses one proportional transform with centered letterboxing; pointer input applies its exact inverse and rejects empty margins. ResizeObserver and window resize update the backing surface and model scale, including fullscreen changes. Bug bounds include the entire rotated illustration (legs and antennae), not only its body radius. Difficulty counts, radii, speed, color pools, target-change audio, scoring and reaction clocks remain in the same model.

## Instructions

`game-instructions.js` supplies one native modal dialog and dedicated content for all 17 ordinary games and the hidden Feed the Face game. Every new session enters it after Play and settings selection, before creating a gameplay model, countdown, physics world or interactive music/art workspace. It includes objective, gestures, controls, win condition, scoring, rules, selected player names and the relevant simultaneous/alternating/cooperative explanation. Creative and diagnosis instructions distinguish their real outcomes from ranked completion.

The dialog traps focus and makes the underlying page inert. Escape/backdrop do not dismiss it. Only GOT IT — START GAME schedules the start, once, on the next animation frame after the click ends; Game Selection exits without starting. Disposal cancels pending starts. There is no skip preference or auto-dismissal. Rematches and new challenges show instructions; active-session Restart bypasses them. Existing turn handoffs/countdowns remain. Creative Studio and Beat Lab have an explicit Play entry before their shared instruction window. The hidden game's instructions are reachable only after its existing five-logo-tap reveal and mode selection.

## Automated verification

Full `npm test` passed with the new launch-fixes suite and all existing regression suites. The targeted suite additionally checks seven physical scenarios (idle, throw, counter-spin, limb grab, head grab, inversion and gadgets), finite bodies, attached neck, recovery, unconstrained whole-body tumbling and unchanged War joints. Ladybug checks run every difficulty at four scales, including live scale changes, with full illustration bounds and color events.

All 18 content entries and the real dialog are exercised for focus, blocked Escape, duplicate taps, delayed start, cancellation and disposal. Shipped launch controllers run with real models: even after 30 seconds of frame callbacks while instructions are pending, no model is constructed. After acknowledgement, the real models are created. In-session Restart does not reopen instructions. Creative entry checks prove the drawing/audio workspaces are installed after acknowledgement.

## Browser verification

All 18 instruction windows were opened through their actual UI at both 1366×768 and 1920×1080 (36 windows). Every window fit with equal scroll/client height, no internal scrolling, visible action buttons, and no underlying gameplay canvas before acknowledgement. Secret activation and two-player names/rules were verified through the real five-tap reveal. Escape stayed blocked; starting produced the countdown only afterward. Restart omitted the instruction dialog.

Expert two-player Ladybug measured 683/680px-wide fields at 1366px and 960/957px-wide fields at 1920px; field heights were 479px and 791px respectively. Document scroll widths/heights exactly matched both viewports. The solo field also fit, and the real fullscreen control reported Exit fullscreen / aria-pressed=true after entry, then returned normally. A prior flex/grid alignment defect found in browser review was corrected before final publication. Native Buddy head-grab/release produced a physical throw and target hit with the head visibly attached and aligned to the tilted torso; the resting head returned upright. Its Restart bypassed the instructions, while Try Again opened them for the next session.

Verification used the cloud browser and automated physics/pointer simulation. Physical Windows USB multitouch input, device audio output and sustained cabinet frame rates were not tested. No test player records or viewport harness are shipped.
