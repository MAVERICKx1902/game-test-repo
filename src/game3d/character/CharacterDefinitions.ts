export type RaceId = 'human' | 'high-elf' | 'dark-elf';
export type ClassId = 'knight' | 'magician' | 'ranger';

export interface RaceDefinition {
  id: RaceId;
  name: string;
  title: string;
  description: string;
  skinColor: number;
  hairColor: number;
  accentColor: number;
  healthBonus: number;
  manaBonus: number;
  earScale: number;
}

export interface ClassDefinition {
  id: ClassId;
  name: string;
  role: string;
  description: string;
  health: number;
  mana: number;
  armorColor: number;
}

export const RACES: readonly RaceDefinition[] = [
  { id: 'human', name: 'Human', title: 'The Exiled Houses', description: 'Adaptable nobles with balanced vitality and spirit.', skinColor: 0xd9a677, hairColor: 0x4b2931, accentColor: 0xc5a766, healthBonus: 10, manaBonus: 10, earScale: 0 },
  { id: 'high-elf', name: 'High Elf', title: 'Children of the Dawn', description: 'Ancient scholars gifted with exceptional mana.', skinColor: 0xe4c39e, hairColor: 0xe3d5a3, accentColor: 0x68c9b4, healthBonus: 0, manaBonus: 35, earScale: 1 },
  { id: 'dark-elf', name: 'Dark Elf', title: 'Moonless Court', description: 'Swift exiles wielding shadow-born resilience.', skinColor: 0x71658d, hairColor: 0xd7d3e1, accentColor: 0xa778db, healthBonus: 15, manaBonus: 20, earScale: 1 },
];

export const CLASSES: readonly ClassDefinition[] = [
  { id: 'knight', name: 'Knight', role: 'Vanguard', description: 'Armored defender trained to hold the front line.', health: 180, mana: 70, armorColor: 0x526579 },
  { id: 'magician', name: 'Magician', role: 'Arcane Damage', description: 'A learned spellcaster with a vast mana reserve.', health: 105, mana: 210, armorColor: 0x394b82 },
  { id: 'ranger', name: 'Ranger', role: 'Ranged Scout', description: 'A mobile hunter who strikes from a distance.', health: 135, mana: 125, armorColor: 0x466849 },
];

export const getRace = (id: RaceId): RaceDefinition => RACES.find((item) => item.id === id) ?? RACES[0];
export const getCharacterClass = (id: ClassId): ClassDefinition => CLASSES.find((item) => item.id === id) ?? CLASSES[0];
