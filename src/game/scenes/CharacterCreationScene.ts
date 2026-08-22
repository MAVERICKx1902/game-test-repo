import Phaser from 'phaser';
import { CharacterProfile } from '../character/CharacterProfile';
import {
  CLASSES,
  getCharacterClass,
  getRace,
  RACES,
  type ClassId,
  type RaceId,
} from '../character/CharacterDefinitions';

export class CharacterCreationScene extends Phaser.Scene {
  private selectedRace: RaceId = 'human';
  private selectedClass: ClassId = 'knight';
  private raceCards!: Phaser.GameObjects.Container;
  private classCards!: Phaser.GameObjects.Container;
  private preview!: Phaser.GameObjects.Image;
  private summary!: Phaser.GameObjects.Text;

  constructor() {
    super('character-creation');
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#090d14');
    this.drawBackground();

    const centerX = this.scale.width / 2;
    this.add.text(centerX, 34, 'FORGE YOUR LEGACY', {
      fontFamily: 'Silkscreen, monospace',
      fontSize: '24px',
      color: '#e2cb91',
      stroke: '#080b10',
      strokeThickness: 5,
    }).setOrigin(0.5);
    this.add.text(centerX, 68, 'Choose the bloodline and discipline of your exiled heir', {
      fontFamily: 'Silkscreen, monospace',
      fontSize: '10px',
      color: '#8c9ca8',
    }).setOrigin(0.5);

    this.preview = this.add.image(centerX, 121, 'player-human-knight-south-0').setScale(2.3);
    this.summary = this.add.text(centerX + 58, 103, '', {
      fontFamily: 'Silkscreen, monospace',
      fontSize: '10px',
      color: '#d9e0df',
      lineSpacing: 7,
    });

    this.addSectionLabel(centerX, 174, 'I. SELECT A RACE');
    this.addSectionLabel(centerX, 374, 'II. SELECT A CLASS');
    this.raceCards = this.add.container(0, 0);
    this.classCards = this.add.container(0, 0);
    this.renderRaceCards();
    this.renderClassCards();
    this.refreshPreview();

    const beginButton = this.add.rectangle(centerX, 660, 310, 50, 0xb89b5e)
      .setStrokeStyle(2, 0xead49b)
      .setInteractive({ useHandCursor: true });
    const beginLabel = this.add.text(centerX, 660, 'ENTER THE FRONTIER', {
      fontFamily: 'Silkscreen, monospace',
      fontSize: '13px',
      color: '#11151c',
    }).setOrigin(0.5);

    beginButton.on('pointerover', () => beginButton.setFillStyle(0xd0b572));
    beginButton.on('pointerout', () => beginButton.setFillStyle(0xb89b5e));
    beginButton.on('pointerdown', () => {
      beginButton.disableInteractive();
      beginLabel.setText('AWAKENING...');
      const profile = new CharacterProfile('Aren Valeborn', this.selectedRace, this.selectedClass);
      this.registry.set('characterProfile', profile);
      this.cameras.main.fadeOut(300, 7, 10, 15);
      this.time.delayedCall(320, () => this.scene.start('world'));
    });
  }

  private renderRaceCards(): void {
    this.raceCards.removeAll(true);
    const layout = this.getCardLayout();
    RACES.forEach((race, index) => {
      const card = this.createCard(
        layout.startX + index * (layout.width + layout.gap),
        205,
        layout.width,
        race.name,
        race.title,
        race.description,
        race.accentColor,
        race.id === this.selectedRace,
      );
      card.on('pointerdown', () => {
        this.selectedRace = race.id;
        this.renderRaceCards();
        this.refreshPreview();
      });
      this.raceCards.add(card);
    });
  }

  private renderClassCards(): void {
    this.classCards.removeAll(true);
    const layout = this.getCardLayout();
    CLASSES.forEach((characterClass, index) => {
      const card = this.createCard(
        layout.startX + index * (layout.width + layout.gap),
        405,
        layout.width,
        characterClass.name,
        characterClass.role,
        characterClass.description,
        characterClass.accentColor,
        characterClass.id === this.selectedClass,
      );
      card.on('pointerdown', () => {
        this.selectedClass = characterClass.id;
        this.renderClassCards();
        this.refreshPreview();
      });
      this.classCards.add(card);
    });
  }

  private createCard(
    x: number,
    y: number,
    width: number,
    title: string,
    subtitle: string,
    description: string,
    accent: number,
    selected: boolean,
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y).setSize(width, 138);
    const background = this.add.rectangle(0, 0, width, 138, selected ? 0x1c2731 : 0x111820, 0.98)
      .setOrigin(0)
      .setStrokeStyle(selected ? 2 : 1, selected ? accent : 0x34424d);
    const accentLine = this.add.rectangle(0, 0, 5, 138, accent).setOrigin(0);
    const titleText = this.add.text(17, 15, title.toUpperCase(), {
      fontFamily: 'Silkscreen, monospace',
      fontSize: '13px',
      color: selected ? '#f2e5c2' : '#c2ccd0',
    });
    const subtitleText = this.add.text(17, 40, subtitle.toUpperCase(), {
      fontFamily: 'Silkscreen, monospace',
      fontSize: '8px',
      color: `#${accent.toString(16).padStart(6, '0')}`,
    });
    const bodyText = this.add.text(17, 67, description, {
      fontFamily: 'Silkscreen, monospace',
      fontSize: '8px',
      color: '#84939c',
      wordWrap: { width: width - 30 },
      lineSpacing: 4,
    });

    container.add([background, accentLine, titleText, subtitleText, bodyText]);
    container.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, 138), Phaser.Geom.Rectangle.Contains);
    container.input!.cursor = 'pointer';
    container.on('pointerover', () => background.setFillStyle(0x202c36));
    container.on('pointerout', () => background.setFillStyle(selected ? 0x1c2731 : 0x111820));
    return container;
  }

  private refreshPreview(): void {
    const race = getRace(this.selectedRace);
    const characterClass = getCharacterClass(this.selectedClass);
    const profile = new CharacterProfile('Aren Valeborn', race.id, characterClass.id);
    this.preview.setTexture(`${profile.texturePrefix}-south-0`);
    this.summary.setText([
      `${race.name} ${characterClass.name}`,
      `HP ${profile.stats.maxHealth}  MP ${profile.stats.maxMana}`,
    ]);
  }

  private getCardLayout(): { startX: number; width: number; gap: number } {
    const gap = 14;
    const width = Math.min(250, (this.scale.width - 72 - gap * 2) / 3);
    return { startX: (this.scale.width - (width * 3 + gap * 2)) / 2, width, gap };
  }

  private addSectionLabel(x: number, y: number, text: string): void {
    this.add.text(x, y, text, {
      fontFamily: 'Silkscreen, monospace',
      fontSize: '10px',
      color: '#71818b',
    }).setOrigin(0.5);
  }

  private drawBackground(): void {
    const graphics = this.add.graphics();
    for (let x = 0; x < this.scale.width; x += 32) {
      for (let y = 0; y < this.scale.height; y += 32) {
        graphics.fillStyle((x + y) % 64 === 0 ? 0x0d141d : 0x0b1118);
        graphics.fillRect(x, y, 31, 31);
      }
    }
    graphics.fillStyle(0x090d14, 0.52);
    graphics.fillRect(0, 0, this.scale.width, this.scale.height);
  }
}
