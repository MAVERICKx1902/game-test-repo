# Exiled Heir 3D

A browser-based low-poly 3D action-RPG foundation built with **Three.js and TypeScript**.

## Current playable milestone

- Perspective 3D world with lighting, soft shadows, atmospheric fog, roads, village buildings, forest, and a glowing Guild crystal
- Smooth top-down follow camera
- WASD and arrow-key movement with normalized diagonals and world bounds
- Procedural low-poly 3D character with walking animation and a readable face
- Data-driven character creation
  - Races: Human, High Elf, Dark Elf
  - Classes: Knight, Magician, Ranger
- Race-specific skin, hair, eyes, accents, and elven ears
- Class-specific armor, equipment, health, and mana
- MMORPG-style HUD with face portrait, identity, level, health, mana, and Guild Rank F
- Responsive character creation and HUD layouts

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
- Diagonal movement is normalized to match cardinal movement speed.

## Architecture

```text
src/game3d/
├── GameApp.ts                         # renderer, scene loop, camera, lighting
├── character/
│   ├── CharacterDefinitions.ts        # data-driven race/class catalog
│   ├── CharacterProfile.ts            # serializable identity and derived stats
│   ├── CharacterModel.ts              # procedural low-poly avatar factory
│   └── CharacterController.ts         # movement, animation, camera following
├── ui/
│   ├── CharacterCreation.ts           # responsive character selection
│   └── CharacterHud.ts                # portrait, HP, MP, level, guild rank
└── world/
    └── FantasyWorld.ts                 # procedural 3D environment
```

The character profile is intentionally independent from rendering so it can later be persisted by an authoritative game server. A real massive MMORPG will additionally require account services, server-owned movement and combat, persistence, zoning, interest management, chat, parties, guilds, matchmaking, monitoring, and anti-cheat. Those should be introduced as focused networking milestones rather than coupled to the 3D renderer.
