# Exiled Heir

Phase 1 movement-and-camera prototype for a top-down pixel-art action RPG.

## Framework choice

This prototype uses **Phaser 3 + TypeScript**. Phaser is a strong fit for a 2D, tile-based RPG: it has mature camera, input, Arcade Physics, animation, and Tiled-map support, while the web target gives the project a very short edit/test loop. TypeScript keeps the engine code explicit and scalable as combat, quests, NPCs, and estate systems are introduced.

The current milestone intentionally contains only player movement, four-direction animation state, world bounds, and a smooth follow camera. The player art and test field are generated in code so this milestone has no external asset dependency.

## Run locally

```bash
npm install
npm run dev
```

Production validation:

```bash
npm run build
```

## Controls

- Move: **WASD** or **arrow keys**
- Diagonal movement is normalized to the same speed as cardinal movement.

## Project structure

```text
public/assets/
├── sprites/
│   ├── player/       # player sprite sheets
│   ├── npcs/         # NPC sprite sheets and portraits
│   └── enemies/      # enemy sprite sheets
├── maps/             # Tiled .tmx/.json map exports
├── tilesets/         # tileset images and .tsx metadata
├── ui/               # HUD frames, icons, fonts
└── audio/
    ├── music/
    └── sfx/

src/
├── main.ts                 # Phaser configuration and entry point
└── game/
    ├── entities/Player.ts  # player domain object and movement state
    ├── input/PlayerInput.ts# remappable input boundary
    └── scenes/
        ├── BootScene.ts    # asset/animation setup
        └── WorldScene.ts   # world composition and follow camera
```

## Architecture notes

- `PlayerInput` translates physical keys into a movement vector. Future keyboard, gamepad, or touch schemes can implement the same boundary without changing player behavior.
- `Player` owns velocity, facing, and animation state, but not camera or world construction.
- `WorldScene` composes the world and camera. Future Tiled loading belongs here or in a dedicated map service.
- Y-based depth sorting is already enabled on the player for future foreground props and NPCs.
