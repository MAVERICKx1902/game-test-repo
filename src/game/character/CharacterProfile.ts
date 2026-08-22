import {
  getCharacterClass,
  getRace,
  type ClassId,
  type RaceId,
} from './CharacterDefinitions';

export interface CharacterStats {
  maxHealth: number;
  maxMana: number;
}

/** Serializable player identity. It can later be sent to an MMO character service. */
export class CharacterProfile {
  readonly name: string;
  readonly raceId: RaceId;
  readonly classId: ClassId;
  readonly stats: CharacterStats;

  constructor(name: string, raceId: RaceId, classId: ClassId) {
    const race = getRace(raceId);
    const characterClass = getCharacterClass(classId);

    this.name = name.trim() || 'Aren Valeborn';
    this.raceId = raceId;
    this.classId = classId;
    this.stats = {
      maxHealth: characterClass.health + race.healthBonus,
      maxMana: characterClass.mana + race.manaBonus,
    };
  }

  get texturePrefix(): string {
    return `player-${this.raceId}-${this.classId}`;
  }

  get portraitTexture(): string {
    return `portrait-${this.raceId}-${this.classId}`;
  }
}
