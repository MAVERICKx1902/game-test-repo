import Phaser from 'phaser';
import type { FacingDirection } from '../entities/Player';

const DIRECTIONS: FacingDirection[] = ['north', 'south', 'east', 'west'];

/** Creates temporary pixel art so the movement prototype has zero asset dependencies. */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  create(): void {
    for (const direction of DIRECTIONS) {
      for (let frame = 0; frame < 4; frame += 1) {
        this.createPlayerTexture(direction, frame);
      }

      this.anims.create({
        key: `player-idle-${direction}`,
        frames: [{ key: `player-${direction}-0` }],
        frameRate: 1,
        repeat: -1,
      });
      this.anims.create({
        key: `player-walk-${direction}`,
        frames: [0, 1, 0, 2].map((frame) => ({ key: `player-${direction}-${frame}` })),
        frameRate: 8,
        repeat: -1,
      });
    }

    this.scene.start('world');
  }

  private createPlayerTexture(direction: FacingDirection, frame: number): void {
    const graphics = this.make.graphics({ x: 0, y: 0 }, false);
    const bob = frame === 0 ? 0 : -1;
    const leftStep = frame === 1 ? -2 : frame === 2 ? 2 : 0;

    // Soft-edged pixel shadow.
    graphics.fillStyle(0x080b11, 0.55);
    graphics.fillRect(8, 41, 16, 3);
    graphics.fillRect(11, 44, 10, 1);

    // Boots and legs.
    graphics.fillStyle(0x202231);
    graphics.fillRect(11 + leftStep, 34 + bob, 4, 8);
    graphics.fillRect(18 - leftStep, 34 + bob, 4, 8);
    graphics.fillStyle(0x0c0e15);
    graphics.fillRect(10 + leftStep, 40 + bob, 5, 3);
    graphics.fillRect(18 - leftStep, 40 + bob, 5, 3);

    // Long exile coat.
    graphics.fillStyle(0x101722);
    graphics.fillRect(8, 21 + bob, 16, 15);
    graphics.fillStyle(0x25344a);
    graphics.fillRect(10, 20 + bob, 12, 15);
    graphics.fillStyle(0x3f5871);
    graphics.fillRect(direction === 'west' ? 10 : 19, 22 + bob, 3, 11);
    graphics.fillStyle(0xb79754);
    graphics.fillRect(10, 31 + bob, 12, 2);
    graphics.fillRect(15, 31 + bob, 2, 4);

    // Arms, shifted to communicate facing.
    graphics.fillStyle(0xd1a071);
    if (direction === 'east' || direction === 'west') {
      const handX = direction === 'east' ? 24 : 5;
      graphics.fillRect(handX, 25 + bob, 3, 5);
    } else {
      graphics.fillRect(6, 24 + bob, 3, 7);
      graphics.fillRect(23, 24 + bob, 3, 7);
    }

    // Head and dark auburn hair.
    graphics.fillStyle(0xd9a677);
    graphics.fillRect(11, 10 + bob, 11, 11);
    graphics.fillStyle(0x2d1e25);
    graphics.fillRect(10, 7 + bob, 13, 7);
    graphics.fillRect(9, 10 + bob, 4, 8);
    graphics.fillRect(20, 10 + bob, 4, 7);
    graphics.fillStyle(0x56303a);
    graphics.fillRect(12, 7 + bob, 8, 2);

    // Face cues establish all four directional states.
    if (direction === 'north') {
      graphics.fillStyle(0x2d1e25);
      graphics.fillRect(11, 12 + bob, 11, 8);
      graphics.fillStyle(0x56303a);
      graphics.fillRect(13, 10 + bob, 7, 2);
    } else if (direction === 'south') {
      graphics.fillStyle(0x1b1820);
      graphics.fillRect(13, 14 + bob, 2, 2);
      graphics.fillRect(19, 14 + bob, 2, 2);
      graphics.fillStyle(0xc7dbe0);
      graphics.fillRect(13, 14 + bob, 1, 1);
      graphics.fillRect(19, 14 + bob, 1, 1);
    } else {
      const eyeX = direction === 'east' ? 20 : 12;
      graphics.fillStyle(0x1b1820);
      graphics.fillRect(eyeX, 14 + bob, 2, 2);
    }

    graphics.generateTexture(`player-${direction}-${frame}`, 32, 48);
    graphics.destroy();
  }
}
