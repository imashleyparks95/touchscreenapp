# Little Big Arcade 6.0.2 — natural Wobbly Wars colors and update installation

Date: 2026-10-26

## Requested result

The existing Wobbly Wars 3D game has ten distinct, richer environment palettes. Grass, forest, earth, sand, ocean and volcanic rock replace the shared pale appearance. Snowy Valley keeps snow with dark evergreen/stone contrast. Light intensity changes from the toolkit defaults (ambient 0.82 / sun 1.7) to game-owned values (0.62 / 1.02), material reflections are reduced, and fog density changes from 0.009 to 0.0018. No shared engine defaults are changed.

`wars3d-environment.js` owns the art: bounded decorative terrain patches, trees, cactus, city silhouettes and surrounding land/water. Small surrounding ground tiles avoid the compatibility renderer's near-plane clipping of one oversized plane. Floor dimensions, all authored collision obstacles, deployment zones, unit statistics, combat, cameras and the restored purchasing workflow remain intact. Decoration has no rigid bodies or gameplay collisions.

## Version diagnosis and fix

The previous v6.0.1 publication was confirmed successful through the native Sites deployment status. Recovered source HEAD was `0d78ea0f1fbe24a9aa55cbc7368e9b23f78c6e09` and contained v6.0.1. This does not establish which URL/browser state the user has open; the observed implementation does explain how an older tab can continue showing v6.0.0: the service worker serves a complete installed cache and a newly downloaded worker waits for older clients to close.

Version 6.0.2 retains coherent versioned offline caches and adds:

- **Check for Updates** in Settings, plus an **Update Ready · Install & Reload** button in the lobby/Settings when a complete update is waiting.
- Registration with `updateViaCache: 'none'` and precaching requests with `cache: 'reload'` to avoid stale HTTP assets.
- Deliberate, message-only worker activation. Installation itself does not call `skipWaiting`.
- Activation rejection if another arcade window is open; the user closes it and retries. A running game in this tab cannot request activation.
- A blocking installation dialog and exactly one reload after deliberate activation, plus clear network/unsupported/timeout recovery messages.
- No localStorage, IndexedDB, profile, result, creation or backup deletion/migration.

The older v6.0.0 shell cannot display this new control until refreshed. Initial recovery: use the published HTTPS link online, hard-refresh once (Windows Ctrl+Shift+R), or allow the download to complete, close every arcade tab/installed app window and reopen. Do not clear site data. If a different URL still shows an old release, inspect that exact URL rather than assuming its source or deleting data.

## Completed checks

| Check | Result |
| --- | --- |
| `npm test` | All 24 suites passed, including the independent 3D toolkit/starter, profile/media backups, other games and 100 campaign/difficulty solutions. |
| `node tests/wars3d-environment.mjs` | All ten actual Babylon/Havok environments render through the real compatibility renderer; finite scene coordinates, bounded mesh counts, distinct terrain/scenery colors, lower haze, original obstacle maps, and exactly the original floor/obstacle rigid-body counts. Repeated after the surrounding-plane/foliage corrections. |
| `node tests/offline.mjs` | All required offline assets exist, coherent v6.0.2 cache, fresh HTTP precaching, explicit safe activation, other-window rejection, no automatic game reload, exactly-once explicit reload, network failure, timeout and unsupported-browser behavior. Repeated after the precache change. |
| `node tests/wars3d-controller.mjs` | All 21 restored illustrated cards; 133 purchases across solo/versus/co-op; exact prices, independent budgets, refunds, restrictions, gates and actual profile/achievement/backup integration. |
| Browser preview | v6.0.2 app/game release notices, grass/sand/forest terrain, ocean surroundings, corrected green foliage, original cards, purchasing and affordability, camera zoom, random army, exit safety and Settings check UI. |
| Syntax / source hygiene | `node --check` for shell/environment/service worker; `git diff --check`. |

## Verification limits

The cloud browser reports WebGL unavailable and uses the clearly labeled software renderer. It also reports service-worker APIs unavailable on the HTTP preview origin. Therefore real HTTPS waiting-worker activation is covered by the actual module/worker event fixtures, not claimed as a browser-installed update test. Physical Windows USB touch, GPU lighting/shadows and target-device frame rate remain device checks. The independent toolkit tests exercise real Havok and model rendering; this is not a claim of GPU or hardware performance certification.

The existing private Site, all profiles, previous records, classic Wobbly Wars, other games and the reusable toolkit remain in the same project. Release information is updated in the home badge, app notice and Wobbly Wars notice.
