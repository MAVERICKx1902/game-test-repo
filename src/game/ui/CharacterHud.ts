import Phaser from 'phaser';
import { getCharacterClass, getRace } from '../character/CharacterDefinitions';
import type { CharacterProfile } from '../character/CharacterProfile';

/** Screen-space character HUD. Values can later subscribe to a stats component. */
export class CharacterHud {
  private readonly depth = 100_000;

  constructor(scene: Phaser.Scene, profile: CharacterProfile) {
    const race = getRace(profile.raceId);
    const characterClass = getCharacterClass(profile.classId);
    const panel = scene.add.graphics().setScrollFactor(0).setDepth(this.depth);

    panel.fillStyle(0x070a0f, 0.94);
    panel.fillRect(16, 16, 344, 92);
    panel.lineStyle(1, 0x596773, 0.9);
    panel.strokeRect(16, 16, 344, 92);
    panel.fillStyle(race.accentColor, 0.8);
    panel.fillRect(16, 16, 344, 3);

    const portraitFrame = scene.add.rectangle(28, 28, 68, 68, 0x111923)
      .setOrigin(0)
      .setStrokeStyle(2, characterClass.accentColor)
      .setScrollFactor(0)
      .setDepth(this.depth + 1);
    portraitFrame.setData('ui', true);
    scene.add.image(62, 62, profile.portraitTexture)
      .setScale(1.25)
      .setScrollFactor(0)
      .setDepth(this.depth + 2);

    scene.add.text(108, 25, profile.name.toUpperCase(), {
      fontFamily: 'Silkscreen, monospace',
      fontSize: '11px',
      color: '#e5d9b9',
    }).setScrollFactor(0).setDepth(this.depth + 2);
    scene.add.text(108, 43, `${race.name} · ${characterClass.name} · LV. 1`, {
      fontFamily: 'Silkscreen, monospace',
      fontSize: '8px',
      color: '#8fa0a8',
    }).setScrollFactor(0).setDepth(this.depth + 2);

    this.createBar(scene, 108, 61, 238, 14, profile.stats.maxHealth, 0xb63d45, 'HP');
    this.createBar(scene, 108, 82, 238, 14, profile.stats.maxMana, 0x3e73bd, 'MP');

    const guildPanel = scene.add.rectangle(16, 116, 164, 26, 0x070a0f, 0.9)
      .setOrigin(0)
      .setStrokeStyle(1, 0x596773, 0.7)
      .setScrollFactor(0)
      .setDepth(this.depth);
    guildPanel.setData('ui', true);
    scene.add.text(27, 123, 'GUILD RANK', {
      fontFamily: 'Silkscreen, monospace',
      fontSize: '8px',
      color: '#82919a',
    }).setScrollFactor(0).setDepth(this.depth + 1);
    scene.add.text(158, 120, 'F', {
      fontFamily: 'Silkscreen, monospace',
      fontSize: '14px',
      color: '#d6b86f',
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(this.depth + 1);
  }

  private createBar(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    value: number,
    color: number,
    label: string,
  ): void {
    const graphics = scene.add.graphics().setScrollFactor(0).setDepth(this.depth + 1);
    graphics.fillStyle(0x151820);
    graphics.fillRect(x, y, width, height);
    graphics.fillStyle(color);
    graphics.fillRect(x + 2, y + 2, width - 4, height - 4);
    graphics.lineStyle(1, 0x68747c, 0.8);
    graphics.strokeRect(x, y, width, height);

    scene.add.text(x + 6, y + 2, label, {
      fontFamily: 'Silkscreen, monospace',
      fontSize: '8px',
      color: '#ffffff',
      stroke: '#141820',
      strokeThickness: 2,
    }).setScrollFactor(0).setDepth(this.depth + 2);
    scene.add.text(x + width - 6, y + 2, `${value} / ${value}`, {
      fontFamily: 'Silkscreen, monospace',
      fontSize: '8px',
      color: '#f2f2f2',
      stroke: '#141820',
      strokeThickness: 2,
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(this.depth + 2);
  }
}
