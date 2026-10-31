# LITTLE BIG ARCADE — LITTLE BIG SPORTS RESORT
## Complete Webcam Motion-Controlled 3D Sports Collection

### PRIMARY OBJECTIVE

Create a completely new game within the existing Little Big Arcade application called **Little Big Sports Resort** (working title).

The game should be heavily inspired by the fun, accessibility, responsive motion controls, and colorful presentation of Wii Sports.

However, create original characters, environments, artwork, music, animations, and interface designs. Do not copy Nintendo assets, characters, logos, or protected content.

**The primary feature is REAL WEBCAM MOTION TRACKING.**

Players should be able to stand in front of the large Windows touchscreen and physically move their hands, arms, and bodies to play sports.

This should feel like a motion-controlled console game, without requiring a Wii Remote, Kinect, VR headset, or additional tracking hardware.

A standard USB webcam should be sufficient, subject to practical tracking limitations.

Build this game inside the existing Little Big Arcade, not as a separate application.

Do not remove or modify unrelated existing games.

---

# 1. GAME CONCEPT — SPORTS RESORT

Create a colorful, fully 3D sports resort where players can select different activities.

The initial complete sports collection should include:

1. Bowling
2. Tennis
3. Boxing
4. Baseball
5. Golf

Make each sport a genuinely playable game, not a simple animation or demonstration.

Each should have its own gameplay, rules, environments, animations, scoring, and meaningful motion controls.

### Visual direction

Aim for a polished, colorful, family-friendly 3D presentation.

Create:

- Customizable cartoon-style player avatars.
- Attractive sports environments.
- Expressive character animations.
- Smooth camera movement.
- Detailed sports equipment.
- Appropriate environmental lighting and shadows.
- Satisfying visual effects.
- Animated spectators where practical.
- Professional scoreboards.
- Victory and defeat animations.
- Distinct audio for every sport.

Characters should look like actual stylized 3D game characters, not floating primitive shapes.

Favor an appealing console-game art style while respecting the graphics capabilities of the Windows PC.

---

# 2. REAL WEBCAM MOTION TRACKING

This is the most important technical requirement.

Implement functional webcam-based body and hand motion tracking.

Investigate MediaPipe Tasks Vision, including:

- Pose Landmarker.
- Hand Landmarker.
- Other compatible tracking methods where necessary.

Use a maintained, browser-compatible tracking solution that works with the existing Little Big Arcade architecture.

### Camera functionality

- Detect available webcams.
- Allow camera selection.
- Request browser camera permission.
- Display a live preview during setup.
- Support mirrored preview.
- Correctly map mirrored coordinates to game controls.
- Track body position.
- Track shoulders, elbows, wrists, and hands.
- Track arm movements over time.
- Detect gestures based on measured movement.
- Support left- and right-handed players.
- Stop tracking and release the camera when leaving the game.

Process camera frames locally where possible.

Do not upload, record, or transmit camera footage.

Camera access should require explicit permission and be active only when needed.

### Movement recognition

Create a reusable motion-recognition system capable of recognizing actions such as:

- Raising an arm.
- Swinging an arm forward.
- Swinging an arm sideways.
- Throwing motion.
- Punching.
- Blocking.
- Holding a position.
- Moving left or right.
- Leaning.
- Performing a golf-style swing.
- Bringing hands together.

Use actual pose trajectories, velocity estimates, joint angles, timing, and movement direction.

Do not simply check whether a hand has crossed one arbitrary point on the screen.

### Gesture confidence

Implement:

- Tracking confidence thresholds.
- Temporal smoothing.
- Movement filtering.
- Gesture activation thresholds.
- Hysteresis and cooldowns.
- False-positive prevention.
- Recovery when tracking is briefly lost.

Fast motion must not randomly trigger several actions.

The player should not need exaggerated or unsafe movements for the game to detect an action.

---

# 3. WEBCAM CALIBRATION

Before playing, provide a short, simple calibration process.

### Calibration screen

1. Show a live mirrored webcam preview.
2. Ask the player to stand in the camera's view.
3. Detect relevant body landmarks.
4. Confirm the player is sufficiently visible.
5. Ask the player to raise or extend their arms.
6. Measure useful movement ranges.
7. Establish a neutral stance.
8. Confirm tracking is ready.

Show clear tracking feedback.

Use simple messages such as:

- "Step back a little."
- "Move into the center."
- "Raise your hands."
- "Tracking ready!"

### Calibration settings

Include:

- Sensitivity.
- Preferred hand.
- Mirroring.
- Camera selection.
- Recalibration.
- Tracking quality indicator.
- Adjustable gesture thresholds.

Accommodate differences between children and adults.

Do not use fixed movement distances that only work for taller players.

Use calibrated body proportions and relative movement where appropriate.

Never interpret monocular webcam depth or throwing speed as perfectly measured physical values.

Use reasonable motion estimates and game-friendly physics.

---

# 4. GAME ONE — BOWLING

Create a complete 3D bowling game.

### Environment

Build an attractive bowling alley featuring:

- Multiple lanes.
- Wooden lane surfaces.
- Ten bowling pins.
- Detailed bowling balls.
- Animated pinsetter or reset sequence.
- Scoreboard.
- Appropriate lighting.
- Ball and pin sound effects.
- Crowd reactions and celebrations.

### Webcam controls

The player should be able to:

1. Stand in front of the webcam.
2. Prepare a bowling motion.
3. Swing their arm backward.
4. Swing their arm forward.
5. Release using a recognizable gesture or calibrated threshold.
6. Watch the ball roll down the lane.

Estimate the ball's initial speed and direction using tracked arm movement.

Allow reasonable aiming assistance or manual alignment to compensate for the limitations of a single webcam.

Use meaningful ball and pin physics.

### Rules

Support:

- Ten-frame bowling.
- Strikes.
- Spares.
- Split detection where relevant.
- Correct bowling scoring.
- Final scores.
- Multiplayer turns.
- Personal best records.

### Two-player gameplay

Allow two players to alternate turns.

Each player should have their own score and avatar.

Support both webcam and controller inputs.

---

# 5. GAME TWO — TENNIS

Create a fully playable cartoon-style 3D tennis game.

### Environment

Include:

- Detailed tennis court.
- Net.
- Animated players.
- Rackets.
- Ball physics.
- Court boundaries.
- Scoreboard.
- Appropriate audience and background environments.

### Webcam controls

Use body and hand tracking to detect:

- Forehand swings.
- Backhand swings.
- Serve motions.
- Racket direction.
- Swing timing.
- Approximate swing speed.
- Left/right player movement or leaning.

The player's tracked hand should control the virtual racket movement.

Animate the avatar's racket swing in response to actual webcam gestures.

Use practical, forgiving collision and timing windows.

### Gameplay

Include:

- Ball serving.
- Ball bouncing.
- Rallying.
- Return shots.
- Directional shots.
- Out-of-bounds detection.
- Points.
- Game and match scoring.
- Difficulty settings.

Create AI opponents with adjustable difficulty.

### Two-player mode

Where reliable multi-person tracking permits, support two players simultaneously.

For example, one player stands on the left side of the webcam view and the other on the right.

Each player controls a separate character.

Also support controller-versus-webcam and controller-versus-controller play.

If simultaneous camera tracking is unreliable, provide clear feedback and a working fallback instead of allowing incorrect control of the other player's avatar.

---

# 6. GAME THREE — BOXING

Create a colorful cartoon boxing game with responsive hand tracking.

### Environment

Include:

- Detailed boxing ring.
- Animated opponent.
- Boxing gloves.
- Character health and stamina.
- Hit reactions.
- Blocking animations.
- Punch impact effects.
- Crowd sounds.
- Round timer.
- Match results.

### Webcam controls

Track both of the player's hands.

Recognize:

- Left jab.
- Right jab.
- Straight punches.
- Guard position.
- Blocking.
- Leaning or dodging.
- Optional uppercut-style gestures when reliable.

Use hand position, elbow position, velocity, and movement direction to recognize punches.

Do not treat random hand movement as an attack.

### Gameplay

Add:

- Intelligent AI opponents.
- Distinct enemy attack patterns.
- Health or stamina.
- Defensive blocking.
- Counters.
- Knockdowns.
- Round scoring.
- Victory and defeat.
- Difficulty progression.

### Two-player support

Prioritize two-player boxing where tracking can reliably distinguish both people.

Support two controllers as a fallback.

Allow one player using webcam tracking to fight another using a controller.

### Safety

Design gestures for short, controlled movements.

Do not require full-force punches, jumping, or contact with another person.

Include safe play-area instructions.

---

# 7. GAME FOUR — BASEBALL

Create a 3D baseball batting game.

### Environment

Include:

- Baseball stadium.
- Animated pitcher.
- Batter.
- Baseball bat.
- Baseball.
- Fielders.
- Scoreboard.
- Crowd and stadium effects.

### Webcam controls

Allow the player to stand in a batting stance.

Track:

- Shoulder position.
- Hands.
- Arm movement.
- Swing timing.
- Swing direction.

Use the detected movement to animate a virtual bat swing.

A physical baseball bat must not be required.

### Gameplay

Implement:

- Pitching animations.
- Different pitch speeds.
- Ball/bat collision.
- Hit detection.
- Fouls.
- Strikes.
- Home runs.
- Outfield hits.
- Scoring.
- Home run challenge.
- Batting challenge.

Include a simple full batting game mode and an arcade-style home run competition.

### Multiplayer

Support alternating batting rounds.

Allow players to compete for highest scores.

Add controller support.

---

# 8. GAME FIVE — GOLF

Create a colorful 3D golf experience with a selection of holes.

### Environment

Include:

- Grass and terrain.
- Putting greens.
- Sand bunkers.
- Water hazards.
- Trees.
- Golf flag.
- Ball physics.
- Scenic backgrounds.
- Scorecards.

### Webcam controls

Allow players to perform a golf-style swing with their hands, without requiring a physical golf club.

Track:

- Hand position.
- Arm position.
- Shoulder rotation where measurable.
- Backswing.
- Forward swing.
- Approximate swing speed.
- Swing direction.

Translate the recognized motion into a virtual golf stroke.

Use calibration and forgiving swing recognition.

### Gameplay

Implement:

- Aiming.
- Power.
- Different club behaviors.
- Ball trajectory.
- Landing and rolling physics.
- Putting.
- Stroke counting.
- Par and hole scores.
- Multiple holes.
- Complete round results.

### Multiplayer

Support two-player turn-based golf.

Each player gets their own scorecard.

---

# 9. TWO-PLAYER SUPPORT — MAJOR PRIORITY

Little Big Arcade is intended for family play.

Every sport should support two players wherever practical.

### Multiplayer modes

- Single-player versus AI.
- Two-player competitive.
- Two-player cooperative challenges where sensible.
- Turn-based gameplay.
- Simultaneous gameplay where possible.

### Webcam tracking

Investigate multi-person pose tracking.

Implement stable player assignment so one person's movement does not accidentally control another player.

Allow calibration for each person.

Show clear player indicators.

If two people are detected but overlap excessively, warn them and temporarily pause or recover tracking as needed.

### Input combinations

Support:

- Webcam versus webcam, where reliable.
- Webcam versus Xbox controller.
- Xbox controller versus Xbox controller.
- Alternating webcam turns.
- Touchscreen interactions where practical.

Do not claim simultaneous two-player webcam support is complete unless it actually works.

---

# 10. PLAYER AVATARS

Create original stylized 3D avatars.

Include:

- Multiple appearances.
- Simple customization.
- Clothing color.
- Hair options.
- Basic accessories.
- Expressive facial animations.
- Celebrations.
- Idle movements.
- Sport-specific animations.

The webcam should control the avatar's movements through interpreted body tracking.

Do not just paste the player's webcam video over a character.

A full-body motion-capture system is not required, but the avatar should visibly respond to the player's real movements.

Connect avatar choices with existing Little Big Arcade player profiles where practical.

---

# 11. SPORTS RESORT HUB

Create an attractive sports-selection interface.

Show all five sports as large illustrated cards or selectable environments.

Each sport should display:

- Game name.
- Custom artwork.
- Player count.
- Webcam support.
- Controller support.
- High scores.
- Instructions.

The hub should be comfortable on a large touchscreen.

Allow players to switch sports without restarting Little Big Arcade.

Include smooth transitions and loading screens.

Do not redesign the existing main arcade launcher.

Add Sports Resort as a single new game entry with its own internal sport selection.

---

# 12. GAME MODES AND PROGRESSION

Make the sports enjoyable beyond a single match.

Include:

- Quick Play.
- Two-Player Match.
- Practice Mode.
- Challenge Mode.
- Personal Records.
- Difficulty settings.

### Sports Resort Championships

Create an optional tournament mode where players compete across multiple sports.

Examples:

- Bowling championship.
- Tennis tournament.
- Boxing ladder.
- Baseball home run challenge.
- Golf championship.

Track wins, trophies, and personal bests.

Add achievements and profile progression using the existing arcade systems.

Avoid introducing complicated account systems.

---

# 13. TOUCHSCREEN AND CONTROLLER FALLBACKS

Webcam tracking must be the standout feature, but the sports should remain playable when no camera is connected.

### Touchscreen

Provide suitable touch controls for:

- Menus.
- Player selection.
- Calibration.
- Aiming.
- Confirming actions.
- Turn-based sports.
- Basic fallback play.

### Xbox controllers

Where practical, implement full Xbox-style controller support.

Use the existing shared Gamepad system.

Allow controllers to substitute for webcam gestures.

For example:

- Bowling: analog aim and trigger-based throw.
- Tennis: analog movement and swing buttons.
- Boxing: punches, blocks, dodges.
- Baseball: timing and swing button.
- Golf: aim and swing-power controls.

Keep input methods consistent with Little Big Arcade's existing conventions.

---

# 14. PERFORMANCE AND TRACKING QUALITY

The game should run on a modest Windows PC with a USB webcam and integrated graphics where feasible.

### Tracking performance

- Avoid blocking the main rendering loop with expensive inference.
- Use worker-based inference where supported.
- Process camera frames at an appropriate tracking rate.
- Smooth landmark movements.
- Interpolate avatar motion where appropriate.
- Reduce camera-processing resolution if necessary.
- Avoid excessive GPU and memory usage.
- Stop unused tracking systems between sports.
- Cleanly release webcam resources.

Track actual detection latency and rendering performance during testing.

Do not claim a specific tracking framerate unless measured.

### Graphics quality

Use scalable settings for:

- Shadow quality.
- Environment detail.
- Character detail.
- Effects.
- Rendering resolution.

Prioritize responsive motion tracking and stable framerate over expensive graphical effects.

### Camera reliability

Handle:

- Low lighting.
- Partial body visibility.
- Temporary tracking loss.
- Two players overlapping.
- Camera disconnect.
- Permission denial.
- No webcam detected.
- Slow hardware.

Provide a useful fallback rather than crashing.

---

# 15. WEBCAM PRIVACY

Camera processing should happen locally in the browser wherever practical.

Do not upload camera video or image frames.

Do not require accounts, cloud tracking services, or external processing servers to recognize movement.

Do not implement facial identification.

Do not store images of players without explicit permission.

Camera permission must be requested using browser-supported secure-context APIs.

Provide an obvious camera-active indicator and camera-off control.

Bundle the required tracking models and assets where licenses permit so the game can operate offline after installation and caching.

---

# 16. GAME QUALITY REQUIREMENTS

Each sport must include:

- Functional webcam controls.
- Appropriate controller fallback.
- A complete playable gameplay loop.
- Scoring.
- Rules.
- Difficulty.
- Audio feedback.
- Animations.
- Victory/defeat or final results.
- Restart.
- Return-to-sports-hub navigation.
- Instructions.
- Player profiles where applicable.
- Two-player support appropriate to the sport.

Avoid leaving sports as unfinished demo scenes.

Do not substitute a simple tap-to-trigger animation for genuine webcam motion control.

---

# 17. IMPLEMENTATION MILESTONES

This is a substantial game-development project.

Implement it progressively while maintaining functional builds.

### Milestone 1 — Motion Tracking Foundation

- Inspect existing Little Big Arcade architecture.
- Review existing camera-enabled games, including Air Slice.
- Establish shared webcam tracking utilities.
- Implement body and hand landmark tracking.
- Create calibration interface.
- Implement gesture recognition.
- Add camera diagnostics.
- Validate actual gesture events.
- Implement fallback controls.

Do not rewrite working webcam systems unnecessarily.

### Milestone 2 — Bowling

Build and test a complete 3D bowling game with real throwing gestures, physics, scoring, sound, and two-player turns.

This should become the first fully playable motion-controlled sport.

### Milestone 3 — Tennis

Implement real swing tracking, a functioning tennis rally system, AI, scoring, and appropriate two-player options.

### Milestone 4 — Boxing

Implement actual hand-controlled punches, blocking, dodging, opponent AI, and full match results.

### Milestone 5 — Baseball and Golf

Build both sports with calibrated swing controls, polished visuals, real gameplay rules, scoring, and multiplayer turns.

### Milestone 6 — Sports Resort Integration

Add:

- Sports hub.
- Player avatars.
- Championships.
- High scores.
- Achievements.
- Profile integration.
- All common controls and settings.

### Milestone 7 — Final Motion Tracking and Gameplay Polish

Test every sport.

Improve gesture accuracy, animation synchronization, responsiveness, visual effects, sound, and overall performance.

Verify that every sport is playable from beginning to end.

Do not declare the collection complete after building only Bowling.

---

# 18. TESTING AND VERIFICATION

Build automated tests where appropriate, including prerecorded landmark sequences for gesture recognition.

Test at least:

1. Camera permission and initialization.
2. Pose detection.
3. Hand detection.
4. Single-player calibration.
5. Multi-person calibration.
6. Swing detection.
7. Throw detection.
8. Punch detection.
9. Block detection.
10. Gesture cooldown and false-positive prevention.
11. Tracking loss and recovery.
12. Webcam/controller switching.
13. Two-player separation.
14. Game-specific scoring.
15. Full match completion.
16. High-score saving.
17. Restart functionality.
18. Resource cleanup.
19. Production build.

For genuine webcam verification, use a real webcam and browser when available.

If physical testing is unavailable, clearly state which interactions were verified through simulation and which still need actual camera testing.

Do not claim real webcam tracking was physically tested when only synthetic landmark data was used.

Provide a tracking diagnostic screen so we can easily test actual body and hand movements on our Windows PC.

---

# 19. ARCADE INTEGRATION

Add Little Big Sports Resort to the existing game library.

Preserve:

- All other games.
- Player profiles.
- Saved games and projects.
- Achievement data.
- Existing touchscreen systems.
- Current controller systems.
- Existing arcade navigation.

Integrate Sports Resort with the game's launch, instructions, scorekeeping, and update notification systems.

Update ARCADE_REVAMP_PROGRESS.md and WORK_MODE_HANDOFF.md where present.

Do not overwrite historical milestones.

Do not create a replacement Little Big Arcade site.

Do not deploy without separate authorization.

---

# FINAL CREATIVE DIRECTIVE

Build an original, high-quality, motion-controlled sports collection inspired by the experience of Wii Sports.

**The most important feature is that players physically move in front of the webcam to control what happens in the game.**

When they swing their arm, the avatar should swing.

When they throw in Bowling, the bowling ball should launch.

When they punch in Boxing, the character should punch.

When they make a tennis swing, the racket should respond.

When they make a batting or golf motion, the game should interpret that motion appropriately.

Make the motions comfortable, accurate, satisfying, and suitable for children.

Prioritize:

1. Genuine webcam motion controls.
2. Fun and complete sports gameplay.
3. Two-player family entertainment.
4. High-quality 3D artwork and animations.
5. Responsive controls and low latency.
6. Webcam calibration and reliability.
7. Controller support.
8. Stable performance on modest Windows hardware.

Use Project Limit Break's reusable 3D systems where appropriate, without introducing unnecessary architectural changes.

Do not create a basic camera-tracking demonstration.

**Create an actual motion-controlled sports game that makes Little Big Arcade feel like a family gaming console.**

Begin by inspecting the existing project and its webcam capabilities, then implement the tracking foundation and first fully playable Bowling game. Continue through the remaining sports in working milestones.