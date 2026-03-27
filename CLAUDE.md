# Web Games

Single-page HTML games for games.voidtalker.com. Each game is one self-contained `.html` file in the repo root.

## Conventions

- **One file per game** — no subdirectories, no build steps, no external JS/CSS libraries
- **No frameworks** — vanilla JS only. No Three.js, Phaser, React, etc. Google Fonts CDN is the one allowed external resource
- **Rendering**: Canvas 2D for most games, raw WebGL (no libraries) for 3D, DOM+CSS for UI-heavy games
- **Filename**: `kebab-case.html` in repo root
- **State machine**: every game has explicit states (title, playing, gameover at minimum)
- **Config object**: all tunable parameters (`CFG` or similar) grouped at the top
- **Polish expected**: title screen, particles, screen effects, game over screen, smooth animations
- **Sound**: Web Audio API for procedural sound effects — no audio files
- **Responsive**: viewport meta tag, handle resize, dark backgrounds (#0a0a0a range)
- **README**: add a one-line entry to `readme.md` for each new game

## Creating a New Game

Use `/project:game` for the full game creation workflow with detailed patterns and guidelines.
