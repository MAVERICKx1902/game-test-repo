# Exiled Heir 3D

A browser-based low-poly 3D action-RPG foundation built with **Three.js and TypeScript**.

## Current playable milestone

- First-person fantasy-survival presentation inspired by the immersive exploration feel of *The Forest*
- Mouse-look with pointer lock plus drag-to-look fallback for embedded previews
- Perspective 3D world with a bright blue gradient sky, clouds, lighting, soft shadows, atmospheric fog, roads, village buildings, forests, ancient ruins, a campfire, arcane fungi, and a glowing Guild crystal
- WASD and arrow-key movement with normalized diagonals, head bob, equipment sway, and world bounds
- Correctly levelled first-person camera with visible arms and class equipment
- Toggleable 24-slot inventory with equipment, consumables, stats, gold, weight, rarity colors, and item tooltips
- Data-driven character creation
  - Races: Human, High Elf, Dark Elf
  - Classes: Knight, Magician, Ranger, Paladin, Cleric, Assassin
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
- Look: **click the game**, then move the mouse
- Embedded-browser fallback: **hold and drag** to look around
- Press **E** to open or close the inventory
- Press **Escape** to release the mouse
- Diagonal movement is normalized to match cardinal movement speed.

## Architecture

```text
src/game3d/
├── GameApp.ts                         # renderer, scene loop, camera, lighting
├── character/
│   ├── CharacterDefinitions.ts        # data-driven race/class catalog
│   ├── CharacterProfile.ts            # serializable identity and derived stats
│   └── CharacterController.ts         # first-person movement, look, and equipment
├── ui/
│   ├── CharacterCreation.ts           # responsive character selection
│   ├── CharacterHud.ts                # portrait, HP, MP, level, guild rank
│   └── Inventory.ts                   # equipment and backpack interface
└── world/
    └── FantasyWorld.ts                 # procedural 3D environment
```

The character profile is intentionally independent from rendering so it can later be persisted by an authoritative game server. A real massive MMORPG will additionally require account services, server-owned movement and combat, persistence, zoning, interest management, chat, parties, guilds, matchmaking, monitoring, and anti-cheat. Those should be introduced as focused networking milestones rather than coupled to the 3D renderer.
