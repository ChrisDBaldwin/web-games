---
description: Create a single-page HTML game for games.voidtalker.com
user_invocable: true
---

# Single-Page HTML Game Creator

You are building a self-contained single-file HTML game for the web-games repo. Every game in this repo is a single `.html` file in the repo root — no subdirectories, no build steps, no external dependencies.

## Your task

The user has described a game concept (provided as `$ARGUMENTS` or in conversation). Your job is to build it as a polished, complete, playable game in one HTML file.

If the user hasn't described what they want, ask them what kind of game they'd like to make.

## Architecture Decision

First, choose the right rendering approach for this game:

| Approach | When to use | Examples in repo |
|----------|-------------|------------------|
| **Canvas 2D** | Physics, platformers, action games, particle effects | snowball.html, ram-butt.html, motion-storm.html |
| **WebGL** | 3D games, complex lighting, mathematical visualization | knot-equivalence.html |
| **DOM + CSS** | Card games, strategy, heavy UI, text-driven games | planning-joker.html |
| **Hybrid** | 3D with 2D overlays, canvas with HTML UI | knot-equivalence.html (WebGL + Canvas 2D modes) |

## Required Structure

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Game Name</title>
  <style>
    /* Reset */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0a0a0a; overflow: hidden; }

    /* CSS variables for theming */
    :root {
      --primary: #...;
      --accent: #...;
    }
  </style>
</head>
<body>
  <!-- Canvas or DOM elements -->
  <script>
    // All game code here — no modules, no imports
  </script>
</body>
</html>
```

## Mandatory Patterns

Follow these patterns — they are consistent across every game in the repo:

### State Machine
Every game must have explicit states. Minimum: title, playing, gameover. More complex games add states as needed.
```js
let state = 'title'; // 'title' | 'playing' | 'gameover'
```

### Game Loop
```js
function update(dt) { /* physics, logic */ }
function render() { /* drawing */ }
function frame(t) {
  const dt = (t - lastTime) / 1000;
  lastTime = t;
  if (state === 'playing') update(dt);
  render();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
```

### Input Handling
```js
const keys = {};
window.addEventListener('keydown', e => { keys[e.code] = true; });
window.addEventListener('keyup', e => { keys[e.code] = false; });
```
- Use `e.code` for positional keys (ArrowUp, KeyW)
- Prevent default on game keys to stop page scroll
- Support both arrow keys AND WASD where applicable
- For mouse: track position, down state, and delta for drag

### Configuration Object
All tunable parameters in one place at the top of the script:
```js
const CFG = {
  gravity: 0.4,
  friction: 0.98,
  playerSpeed: 5,
  // ... every magic number lives here
};
```

### Particle System (when applicable)
```js
const particles = [];
function spawnParticles(x, y, count, color) { /* ... */ }
// Update: move, age, remove dead. Render: draw with alpha fade.
```

## Visual Polish Requirements

These are NOT optional — every game in the repo has this level of polish:

1. **Title screen** with game name, brief instructions, and "press to start"
2. **Smooth animations** — use easing, not instant transitions
3. **Particle effects** for impacts, scoring, state changes
4. **Screen shake** or flash on big moments (hits, deaths, scores)
5. **Score/progress display** during gameplay
6. **Game over screen** with final score and restart option
7. **Color palette** — use CSS variables, dark backgrounds (#0a0a0a range), bright accents
8. **Typography** — import 1-2 Google Fonts or use system monospace. Existing games use: monospace, Georgia, 'DM Mono', 'Outfit'
9. **Sound** — use Web Audio API for procedural sound effects (no audio files). Generate tones, noise bursts, and simple synth sounds programmatically

## Rendering-Specific Guidelines

### Canvas 2D Games
- Fixed resolution (e.g., 960x540) centered in viewport, OR full-viewport with resize handler
- `ctx.save()`/`ctx.restore()` around complex transforms
- Camera follow with easing: `cam += (target - cam) * 0.08`
- Draw order: background -> world -> entities -> particles -> HUD
- Use `ctx.globalAlpha` for fade effects
- Rounded rects, gradients, and shadows for polished look

### WebGL Games
- Write minimal custom shaders — no libraries (no Three.js)
- Implement basic Phong lighting (ambient + diffuse + specular)
- Provide matrix utilities (perspective, lookAt, rotate)
- Mouse drag for rotation is the standard 3D interaction
- Always have a fallback or graceful error if WebGL unavailable

### DOM Games
- Flexbox/grid layouts with `clamp()` for responsive sizing
- CSS keyframe animations for state transitions
- `display: none` toggling between screens
- Hover transforms on interactive elements
- Modal overlays for secondary UI

## Web API Integration

If the game concept calls for it, use browser APIs directly:
- **Camera**: `navigator.mediaDevices.getUserMedia()` — always handle denial gracefully
- **Audio**: `AudioContext` for procedural sound — create oscillators and noise on the fly
- **Gamepad**: `navigator.getGamepad()` for controller support
- **DeviceOrientation**: for tilt controls on mobile
- Always feature-detect and show clear error messages if unavailable

## Code Style

Match the conventions in existing games:
- UPPERCASE for constants: `const GRAVITY = 0.4`
- Class syntax for entities: `class Ball { constructor(x, y) { ... } }`
- Descriptive variable names, minimal comments (only for complex math)
- Group utilities together (math helpers, rendering helpers, etc.)
- No semicolons or yes semicolons — just be consistent within the file (existing games use semicolons)

## Game Design Principles

- **Playable in 10 seconds** — minimal barrier to starting
- **Simple core mechanic** that's satisfying to execute
- **Escalating difficulty** — ramp challenge over time (waves, speed, complexity)
- **Clear feedback** — player always knows what happened and why
- **Replayable** — quick restart, score to beat, or randomized content
- **Fair** — if multiplayer, balanced; if single-player, death should feel earned

## Naming

- Filename: `kebab-case.html` in the repo root
- Title: creative/fun name that hints at the mechanic

## Final Checklist

Before delivering the game, verify:
- [ ] Single self-contained HTML file, no external dependencies (except Google Fonts CDN)
- [ ] Runs by opening the file directly in a browser (or with simple HTTP server if using camera/audio)
- [ ] Title screen with instructions
- [ ] Core gameplay loop is fun and polished
- [ ] Game over state with score and restart
- [ ] Smooth 60fps performance
- [ ] Keyboard controls documented on title screen
- [ ] No console errors
- [ ] Responsive — doesn't break on different window sizes
- [ ] Visual polish: particles, animations, screen effects

## After Creating the Game

Once the game is complete, add an entry to `readme.md` following the existing format:
```
- **game-name.html** — Brief description of the game concept and notable features.
```

Now create the game based on what the user has described!
