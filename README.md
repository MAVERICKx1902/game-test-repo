# Exiled Heir

Phase 1 movement-and-camera prototype for a top-down pixel-art action RPG.

## Framework choice

This prototype uses **Phaser 3 + TypeScript**. Phaser is a strong fit for a 2D, tile-based RPG: it has mature camera, input, Arcade Physics, animation, and Tiled-map support, while the web target gives the project a very short edit/test loop. TypeScript keeps the engine code explicit and scalable as combat, quests, NPCs, and estate systems are introduced.

The current milestone includes player movement, four-direction animation, a smooth follow camera, character creation, and the first RPG HUD. The player art, race variants, portraits, and test field are generated in code so the prototype has no external asset dependency.

## Playable character options

- **Races:** Human, High Elf, and Dark Elf
- **Classes:** Knight, Magician, and Ranger
- Every race/class pairing has its own colors, portrait, health, and mana values.
- The in-world HUD displays the character portrait, name, race, class, level, health, mana, and Guild Rank F.

The race and class definitions are data-driven. More archetypes can be added without rewriting the character controller. A true MMORPG will later require authoritative servers, accounts, persistence, networking, chat, parties, and anti-cheat; those are deliberately separate future milestones.

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
├── main.ts                         # Phaser configuration and entry point
└── game/
    ├── character/
    │   ├── CharacterDefinitions.ts # data-driven races and classes
    │   └── CharacterProfile.ts     # serializable identity and derived stats
    ├── entities/Player.ts          # player movement and animation state
    ├── input/PlayerInput.ts        # remappable input boundary
    ├── ui/CharacterHud.ts          # portrait, HP, MP, level, and guild rank
    └── scenes/
        ├── BootScene.ts            # generated assets and animations
        ├── CharacterCreationScene.ts
        └── WorldScene.ts           # world composition and follow camera
```

## Architecture notes

- `CharacterDefinitions` is the central content catalog for playable races and classes; `CharacterProfile` is intentionally serializable for future persistence/networking.
- `CharacterHud` owns screen-space identity and resource presentation without coupling it to the world scene.
- `PlayerInput` translates physical keys into a movement vector. Future keyboard, gamepad, or touch schemes can implement the same boundary without changing player behavior.
- `Player` owns velocity, facing, and animation state, but not camera or world construction.
- `WorldScene` composes the world and camera. Future Tiled loading belongs here or in a dedicated map service.
- Y-based depth sorting is already enabled on the player for future foreground props and NPCs.
