# Little Big Arcade

Migration of the existing working application, version 6.2.0. Original source: `/workspace/sites/little-big-arcade/`, commit `d646050` (full SHA in MIGRATION.json). No games or interfaces have been rebuilt.

## Install and run

Install Node.js 22 or newer (npm included), then:

```sh
npm ci
npm start
```

Open http://localhost:8080. `npm run dev` uses the same local static server. On Windows use a terminal in the project folder. No environment variables or credentials are needed for local gameplay. PORT optionally changes the local port.

## Source and build

**dist/ is the authoritative editable source**, not disposable generated output. It contains HTML, CSS, JavaScript modules, workers, service worker, models, animations, textures, fonts, vendored engines and tracking models. Keep it tracked in Git.

```sh
npm run build
```

The migration build copies the complete static application into `build/`; no compilation was required by the original project. `build/` is ignored. Existing Sites hosting continues to serve `dist/`, as declared by `.openai/hosting.json`. Pinned dependencies and local vendor files are preserved. `scripts/vendor-3d.mjs` refreshes pinned 3D vendor assets only when intentionally needed; it is not required on each build. Asset authoring scripts may require Python, Blender or their separately documented tooling; these are not needed to run the shipped application.

## Test

```sh
npm test
npm run test:3d
npm run test:limit
```

The full suite covers the existing game systems, persistence, offline behavior, media and 3D functionality. Consult AGENTS.md and 3D_GAME_DEVELOPMENT.md before changes. Automated fixtures do not establish real Windows multitouch, physical cameras/microphones, gamepad or GPU compatibility. Smoke-test those devices on the actual arcade PC.

## Deploy to the existing website

Current website: https://little-big-arcade-parks.diladiop.chatgpt.site

Existing Sites project ID: `appgprj_6adab219a4788191952c4c83432002c5`. Preserve `.openai/hosting.json` and its `static.directory: dist`. A GitHub push alone does **not** publish to this Sites website, and this export contains no deployment credentials or GitHub Actions deployment integration.

For future Codex updates, commit and push changes to GitHub, then use a ChatGPT/Codex environment with the Sites connector and Sites skill. Select this exact existing project, get fresh source repository access, open its existing source checkout with the Sites source workflow helper, import the reviewed GitHub changes, run tests and build/package the static dist directory, synchronize that exact source commit to the Sites source repository, save a matching version and deploy it using the site's existing access policy. Verify the terminal deployment result. Do not create a replacement Site. The Sites skill supplies the authenticated helper and exact current API workflow; credentials are session-only and are deliberately absent here.

An independent static host can also serve `build/` over HTTPS, but that creates a different hosting destination and does not update the current Sites URL. Serve `.wasm` with application/wasm. Camera/microphone features require HTTPS or localhost.

## Data and preservation

Profiles, scores, settings, drawings and imported audio stored in the browser are not repository files. Use the application's backup/export feature on the original browser and restore on a new device/origin. Keep the original browser data until restore is verified. Service-worker caching may require the normal application update flow/reload after publication.

All runtime source and assets were preserved byte-for-byte. Added files provide migration tooling and documentation; package.json only gains start/dev/build scripts. Existing asset licenses and source notices remain included. The upstream application's overall license is not newly granted by this migration.

Excluded: .git internals, node_modules, generated verification screenshots/logs and temporary build/cache output. No secrets were intentionally exported. See EXPORT_TREE.txt, SOURCE_SHA256.json and MIGRATION.json for the complete inventory and provenance.

## Push this export manually if needed

The requested destination is https://github.com/imashleyparks95/touchscreenapp on main. Inspect the remote before pushing; never force-push or replace unrelated work. This migration includes a downloadable source ZIP without Git internals.
