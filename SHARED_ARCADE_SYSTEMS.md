# Shared arcade systems — v6.5.0

These lightweight ES modules do not load Babylon, access profiles, select a game theme, or implement game rules. Import them directly from `dist/js/shared/`. Keep native gameplay bindings in the game; controller cursors do not become direct movement controls merely by sharing menus.

## Input and resource ownership

`createLifetime({onError})` owns cleanup callbacks. `listen(target,type,fn,options)` registers and removes the same listener/options. `defer(fn)` adds a cleanup; registrations after disposal clean up immediately. `dispose()` is idempotent, runs in reverse order, and reports cleanup errors while continuing through other resources. It is not a world clock, async task canceller or automatic game-session manager. Existing scene/session tokens still guard late asset completions.

`pointerPoint(element,event,{width,height})` maps client coordinates through the element's current CSS rectangle into a caller-selected logical size. Omitted dimensions use CSS pixels. Zero-size elements return null. It recomputes the rectangle during resize/fullscreen; arbitrary CSS rotation/perspective transforms are outside this contract.

`bindPointers(element,{enabled,maxPointers,down,move,up,cancel,win})` captures independent Pointer Events and returns `{size,cancel,dispose}`. `down(contact,event)` can return game-owned `contact.data`; `move(contact,event,{x,y})` receives client-pixel deltas. Contacts retain their original data even when crossing player areas. Cancellation, loss of capture, blur, hiding, pagehide, disabled movement and disposal never invoke a successful `up`. `enabled` should express the game's pause/modal policy; call `cancel()` when switching modes without an event. Set `touch-action:none` and `user-select:none` on direct-manipulation surfaces. The caller chooses player assignment, logical coordinates, gestures and maximum contacts.

Forest's LOOK pad uses this binder with one contact; the touchscreen diagnostic uses multiple contacts. The existing 3D binder reuses `pointerPoint` and the lifetime owner while retaining its own camera/ground/ownership rules. `GamepadHub` continues to own stable standard-controller slots and neutral handoffs; see `3D_GAME_DEVELOPMENT.md`. No second hub is added inside the Forest.

## Common menus and dialogs

`menuUsable(node)` excludes disabled, hidden, inert and unrendered controls. `stepSelect(select,direction,{wrap:false})` skips disabled options and disabled optgroups and dispatches change only when selection changes. `menuNeighbor(nodes,active,dx,dy)` finds a spatial neighbor, with vertical wrapping as fallback. Callers supply allowed controls, their focus style and confirm/back policy. Both the global controller and Forest native controller use these helpers.

The global adapter clears input and stops processing the current frame after confirmation/back/help/pause actions, so a second controller cannot immediately act on a newly opened dialog. Native Forest ownership and the mandatory instruction gate remain intact.

`shell.modal(content,setup)` accepts an optional cleanup function returned by `setup(dialog)`. Closing, replacing or navigating away disposes the previous owner's resources. A queued close event from a replaced dialog does not dispose the new owner. Ordinary close restores focus to the initiating control when it still exists. Do not return a Promise instead of a cleanup; asynchronous game resources still need session tokens.

## Audio

`createMusicClock({getState,onBeat,onQuiet,doc,win,schedule,unschedule,interval})` has `sync`, `running`, `dispose`. State includes ready/muted/musicOn/music/backgroundSuspended. It owns at most one interval, skips hidden pages and never creates or resumes an AudioContext. Synchronizing unrelated settings preserves musical phase. Event hooks are optional for headless fixtures. Shared `audio.js` uses it and stops queued common synth voices when muted or hidden. Beat Lab's background-music suspension also stops scheduling. The shared AudioContext remains available for recording and game-owned audio; this change does not close it or replace per-game ambience/capture lifecycles. Audible quality and autoplay behavior still need real-device checks.

## Graphics and presentation

`presentationSettings(value)` supplies default `{effects:'full'}`; `validatePresentationSettings(settings)` accepts absent legacy preferences and rejects malformed optional values. `decorativeCount(count,settings)` bounds nonnegative counts, returns a quarter of decorative particles for Reduced or reduced-motion mode, and zero for Off. The option lives in optional `DB.settings.presentation.effects` with unchanged schema/storage/backup identities.

Settings exposes Full/Reduced/Off for shared Wobbly Wars impact particles and the classic canvas engine. It does not suppress gameplay events, damage, projectiles, collision or audio routing. It does not claim all 25 games use this option. Forest benchmark workloads remain unchanged. Existing capability-negotiated `GRAPHICS_PRESETS`, `resolveGraphics` and `createGraphicsControl` are the shared 3D graphics foundation; retain each game's saved presets and formal benchmark settings. No new global renderer, heavy dependency or automatic benchmark quality reduction is introduced.

## Verification

- `npm test`: independent shared module/audio/persistence checks plus every existing toolkit/starter, Forest, Wobbly Wars and arcade regression.
- `npm run test:browser`: responsive/accessibility entry audits, controller cursors, real drawing and actual offline reload.
- `npm run test:shared:browser`: actual settings persistence, common music timer behavior, CDP two-touch diagnostic cleanup/focus, dialog replacement and simultaneous-controller confirmation handoff. Injected visibility and standard-gamepad fixtures are explicitly labeled.
- `npm run test:limit:browser`: actual imported Forest scene/input, co-op, camera, monitor, benchmark/export and engine cleanup.
- `npm run audit:arcade` and `npm run build`: roster, original asset integrity, offline closure, hosting/save identities and packaging.

No physical Windows/USB/Bluetooth, audible-quality or target-GPU pass is implied by these checks. Per-game native controls, art, new zones and launcher redesign remain their later milestones.
