import Phaser from 'phaser';
import { CLASSES, RACES, type ClassDefinition, type RaceDefinition } from '../character/CharacterDefinitions';
import type { FacingDirection } from '../entities/Player';

const DIRECTIONS: FacingDirection[] = ['north', 'south', 'east', 'west'];

/** Creates temporary pixel art so the prototype has zero asset dependencies. */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  create(): void {
    for (const race of RACES) {
      for (const characterClass of CLASSES) {
        const prefix = `player-${race.id}-${characterClass.id}`;
        for (const direction of DIRECTIONS) {
          for (let frame = 0; frame < 3; frame += 1) {
            this.createPlayerTexture(prefix, race, characterClass, direction, frame);
          }

          this.anims.create({
            key: `${prefix}-idle-${direction}`,
            frames: [{ key: `${prefix}-${direction}-0` }],
            frameRate: 1,
            repeat: -1,
          });
          this.anims.create({
            key: `${prefix}-walk-${direction}`,
            frames: [0, 1, 0, 2].map((frame) => ({ key: `${prefix}-${direction}-${frame}` })),
            frameRate: 8,
            repeat: -1,
          });
        }
        this.createPortrait(race, characterClass);
      }
    }

    this.scene.start('character-creation');
  }

  private createPlayerTexture(
    prefix: string,
    race: RaceDefinition,
    characterClass: ClassDefinition,
    direction: FacingDirection,
    frame: number,
  ): void {
    const graphics = this.make.graphics({ x: 0, y: 0 }, false);
    const bob = frame === 0 ? 0 : -1;
    const leftStep = frame === 1 ? -2 : frame === 2 ? 2 : 0;

    graphics.fillStyle(0x080b11, 0.55);
    graphics.fillRect(8, 41, 16, 3);
    graphics.fillRect(11, 44, 10, 1);

    graphics.fillStyle(0x202231);
    graphics.fillRect(11 + leftStep, 34 + bob, 4, 8);
    graphics.fillRect(18 - leftStep, 34 + bob, 4, 8);
    graphics.fillStyle(0x0c0e15);
    graphics.fillRect(10 + leftStep, 40 + bob, 5, 3);
    graphics.fillRect(18 - leftStep, 40 + bob, 5, 3);

    const darkAccent = Phaser.Display.Color.ValueToColor(characterClass.accentColor).darken(58).color;
    graphics.fillStyle(0x101722);
    graphics.fillRect(8, 21 + bob, 16, 15);
    graphics.fillStyle(darkAccent);
    graphics.fillRect(10, 20 + bob, 12, 15);
    graphics.fillStyle(characterClass.accentColor);
    graphics.fillRect(direction === 'west' ? 10 : 19, 22 + bob, 3, 11);
    graphics.fillStyle(race.accentColor);
    graphics.fillRect(10, 31 + bob, 12, 2);
    graphics.fillRect(15, 31 + bob, 2, 4);

    graphics.fillStyle(race.skinColor);
    if (direction === 'east' || direction === 'west') {
      graphics.fillRect(direction === 'east' ? 24 : 5, 25 + bob, 3, 5);
    } else {
      graphics.fillRect(6, 24 + bob, 3, 7);
      graphics.fillRect(23, 24 + bob, 3, 7);
    }

    // Long elven ears remain visible from the front and sides.
    if (race.id !== 'human') {
      graphics.fillStyle(race.skinColor);
      graphics.fillTriangle(10, 13 + bob, 4, 11 + bob, 10, 17 + bob);
      graphics.fillTriangle(22, 13 + bob, 28, 11 + bob, 22, 17 + bob);
    }

    graphics.fillStyle(race.skinColor);
    graphics.fillRect(11, 10 + bob, 11, 11);
    graphics.fillStyle(race.hairColor);
    graphics.fillRect(10, 7 + bob, 13, 7);
    graphics.fillRect(9, 10 + bob, 4, 8);
    graphics.fillRect(20, 10 + bob, 4, 7);

    if (direction === 'north') {
      graphics.fillStyle(race.hairColor);
      graphics.fillRect(11, 12 + bob, 11, 8);
    } else if (direction === 'south') {
      graphics.fillStyle(0x171722);
      graphics.fillRect(13, 14 + bob, 2, 2);
      graphics.fillRect(19, 14 + bob, 2, 2);
      graphics.fillStyle(race.id === 'dark-elf' ? 0xb68cff : 0xd9f4f2);
      graphics.fillRect(13, 14 + bob, 1, 1);
      graphics.fillRect(19, 14 + bob, 1, 1);
    } else {
      graphics.fillStyle(0x171722);
      graphics.fillRect(direction === 'east' ? 20 : 12, 14 + bob, 2, 2);
    }

    graphics.generateTexture(`${prefix}-${direction}-${frame}`, 32, 48);
    graphics.destroy();
  }

  private createPortrait(race: RaceDefinition, characterClass: ClassDefinition): void {
    const graphics = this.make.graphics({ x: 0, y: 0 }, false);
    graphics.fillStyle(0x101722);
    graphics.fillRect(0, 0, 48, 48);
    graphics.fillStyle(characterClass.accentColor, 0.3);
    graphics.fillCircle(24, 32, 23);

    if (race.id !== 'human') {
      graphics.fillStyle(race.skinColor);
      graphics.fillTriangle(15, 17, 2, 14, 16, 25);
      graphics.fillTriangle(33, 17, 46, 14, 32, 25);
    }
    graphics.fillStyle(race.skinColor);
    graphics.fillRect(13, 13, 22, 27);
    graphics.fillStyle(race.hairColor);
    graphics.fillRect(11, 7, 26, 13);
    graphics.fillRect(10, 13, 7, 20);
    graphics.fillRect(31, 13, 7, 20);
    graphics.fillStyle(0x171722);
    graphics.fillRect(17, 24, 4, 3);
    graphics.fillRect(28, 24, 4, 3);
    graphics.fillStyle(race.id === 'dark-elf' ? 0xc09cff : 0xd9f4f2);
    graphics.fillRect(18, 24, 2, 1);
    graphics.fillRect(29, 24, 2, 1);
    graphics.fillStyle(characterClass.accentColor);
    graphics.fillRect(8, 41, 32, 7);

    graphics.generateTexture(`portrait-${race.id}-${characterClass.id}`, 48, 48);
    graphics.destroy();
  }
}
