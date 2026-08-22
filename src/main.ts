import Phaser from 'phaser';
import './style.css';
import { BootScene } from './game/scenes/BootScene';
import { CharacterCreationScene } from './game/scenes/CharacterCreationScene';
import { WorldScene } from './game/scenes/WorldScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#111722',
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  scene: [BootScene, CharacterCreationScene, WorldScene],
};

new Phaser.Game(config);
