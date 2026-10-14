import { getCharacterClass, getRace, type ClassId, type RaceId } from './CharacterDefinitions';

export class CharacterProfile {
  readonly name = 'Aren Valeborn';
  readonly maxHealth: number;
  readonly maxMana: number;

  constructor(public readonly raceId: RaceId, public readonly classId: ClassId) {
    const race = getRace(raceId);
    const characterClass = getCharacterClass(classId);
    this.maxHealth = characterClass.health + race.healthBonus;
    this.maxMana = characterClass.mana + race.manaBonus;
  }
}
