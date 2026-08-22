import Phaser from 'phaser';
import { Player } from '../entities/Player';

const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 1600;
const TILE_SIZE = 32;

export class WorldScene extends Phaser.Scene {
  private player!: Player;

  constructor() {
    super('world');
  }

  create(): void {
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    this.drawPrototypeGround();
    this.drawLandmarks();

    this.player = new Player(this, WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
    this.configureCamera();
    this.createOverlay();
  }

  update(): void {
    this.player.update();
  }

  private configureCamera(): void {
    const camera = this.cameras.main;
    camera.startFollow(this.player, true, 0.1, 0.1);
    camera.setDeadzone(80, 56);
    camera.setZoom(this.scale.width < 700 ? 1.4 : 2);
    camera.fadeIn(450, 8, 10, 15);

    this.scale.on('resize', (size: Phaser.Structs.Size) => {
      camera.setZoom(size.width < 700 ? 1.4 : 2);
    });
  }

  private drawPrototypeGround(): void {
    const ground = this.add.graphics().setDepth(-1000);
    ground.fillStyle(0x18222a);
    ground.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    for (let y = 0; y < WORLD_HEIGHT; y += TILE_SIZE) {
      for (let x = 0; x < WORLD_WIDTH; x += TILE_SIZE) {
        const alternating = (x / TILE_SIZE + y / TILE_SIZE) % 2 === 0;
        ground.fillStyle(alternating ? 0x1b2730 : 0x1d2932, 0.78);
        ground.fillRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2);

        // Deterministic tile detail makes camera movement easy to read.
        const hash = ((x * 17 + y * 31) / TILE_SIZE) % 11;
        if (hash < 2) {
          ground.fillStyle(0x263840, 0.8);
          ground.fillRect(x + 8, y + 12, 2, 2);
          ground.fillRect(x + 19, y + 20, 3, 2);
        }
      }
    }

    // Main road through the test area.
    ground.fillStyle(0x394047, 0.92);
    ground.fillRect(0, WORLD_HEIGHT / 2 - 54, WORLD_WIDTH, 108);
    ground.fillStyle(0x454b50, 0.7);
    ground.fillRect(0, WORLD_HEIGHT / 2 - 4, WORLD_WIDTH, 8);
    for (let x = 12; x < WORLD_WIDTH; x += 58) {
      ground.fillStyle(0x575c5e, 0.45);
      ground.fillRect(x, WORLD_HEIGHT / 2 - 2, 30, 3);
    }
  }

  private drawLandmarks(): void {
    const landmarks = [
      { x: 860, y: 630, label: 'SLUM GATE' },
      { x: 1540, y: 970, label: 'GUILD ROAD' },
      { x: 1210, y: 530, label: 'OLD ESTATE' },
    ];

    for (const landmark of landmarks) {
      const marker = this.add.graphics().setDepth(landmark.y - 1);
      marker.fillStyle(0x0b1017, 0.65);
      marker.fillCircle(landmark.x, landmark.y, 28);
      marker.lineStyle(2, 0xb99b60, 0.7);
      marker.strokeCircle(landmark.x, landmark.y, 24);
      marker.lineBetween(landmark.x - 13, landmark.y, landmark.x + 13, landmark.y);
      marker.lineBetween(landmark.x, landmark.y - 13, landmark.x, landmark.y + 13);

      this.add.text(landmark.x, landmark.y + 37, landmark.label, {
        fontFamily: 'Silkscreen, monospace',
        fontSize: '8px',
        color: '#9daab0',
        stroke: '#0b0e13',
        strokeThickness: 3,
      }).setOrigin(0.5).setDepth(landmark.y + 1);
    }
  }

  private createOverlay(): void {
    const panel = this.add.rectangle(18, 18, 252, 55, 0x080b10, 0.88)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(100_000);
    panel.setStrokeStyle(1, 0x596773, 0.75);

    this.add.text(32, 29, 'MOVEMENT PROTOTYPE', {
      fontFamily: 'Silkscreen, monospace',
      fontSize: '11px',
      color: '#d1b675',
    }).setScrollFactor(0).setDepth(100_001);

    this.add.text(32, 51, 'WASD / ARROWS  ·  EXPLORE', {
      fontFamily: 'Silkscreen, monospace',
      fontSize: '9px',
      color: '#9ba9b0',
    }).setScrollFactor(0).setDepth(100_001);
  }
}
