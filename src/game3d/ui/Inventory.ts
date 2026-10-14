import { getCharacterClass, getRace } from '../character/CharacterDefinitions';
import type { CharacterProfile } from '../character/CharacterProfile';

interface InventoryItem {
  icon: string;
  name: string;
  type: string;
  rarity: 'common' | 'uncommon' | 'rare';
}

const CLASS_GEAR: Record<CharacterProfile['classId'], InventoryItem[]> = {
  knight: [
    { icon: '⚔', name: 'Iron Longsword', type: 'Main hand · 12 damage', rarity: 'common' },
    { icon: '◈', name: 'House Shield', type: 'Off hand · 8 armor', rarity: 'uncommon' },
  ],
  magician: [
    { icon: '✦', name: 'Apprentice Staff', type: 'Main hand · 14 arcane', rarity: 'uncommon' },
    { icon: '◇', name: 'Mana Crystal', type: 'Trinket · +20 mana', rarity: 'rare' },
  ],
  ranger: [
    { icon: '➶', name: 'Ashwood Bow', type: 'Main hand · 11 damage', rarity: 'uncommon' },
    { icon: '⌁', name: 'Hunter Quiver', type: 'Back · 24 arrows', rarity: 'common' },
  ],
  paladin: [
    { icon: '†', name: 'Dawnblade', type: 'Main hand · 10 holy', rarity: 'rare' },
    { icon: '⬡', name: 'Sun Guard', type: 'Off hand · 10 armor', rarity: 'uncommon' },
  ],
  cleric: [
    { icon: '☼', name: 'Mender Mace', type: 'Main hand · 9 holy', rarity: 'uncommon' },
    { icon: '✚', name: 'Healing Tome', type: 'Off hand · +12 healing', rarity: 'rare' },
  ],
  assassin: [
    { icon: '⟋', name: 'Duskgedge', type: 'Main hand · 13 damage', rarity: 'rare' },
    { icon: '⟍', name: 'Veiled Fang', type: 'Off hand · 11 damage', rarity: 'uncommon' },
  ],
};

const SUPPLIES: InventoryItem[] = [
  { icon: '◆', name: 'Minor Health Potion', type: 'Consumable · Restores 40 HP', rarity: 'common' },
  { icon: '●', name: 'Minor Mana Potion', type: 'Consumable · Restores 35 MP', rarity: 'common' },
  { icon: '♨', name: 'Forest Rations', type: 'Consumable · Restores hunger', rarity: 'common' },
  { icon: '⌘', name: 'Guild Waystone', type: 'Quest item · Bound', rarity: 'rare' },
];

export class Inventory {
  private readonly root = document.createElement('section');
  private open = false;

  constructor(profile: CharacterProfile) {
    const race = getRace(profile.raceId);
    const characterClass = getCharacterClass(profile.classId);
    const items = [...CLASS_GEAR[profile.classId], ...SUPPLIES];
    const slots = Array.from({ length: 24 }, (_, index) => {
      const item = items[index];
      return item
        ? `<button class="inventory-slot inventory-slot--${item.rarity}" type="button" aria-label="${item.name}"><b>${item.icon}</b><span><strong>${item.name}</strong><small>${item.type}</small></span></button>`
        : '<div class="inventory-slot inventory-slot--empty"></div>';
    }).join('');

    this.root.className = 'inventory';
    this.root.setAttribute('aria-hidden', 'true');
    this.root.innerHTML = `
      <div class="inventory__window">
        <header><div><small>ADVENTURER SATCHEL</small><h2>Inventory</h2></div><kbd>E</kbd></header>
        <div class="inventory__body">
          <aside>
            <div class="inventory__portrait avatar avatar--${race.id}" style="--skin:#${race.skinColor.toString(16).padStart(6, '0')};--hair:#${race.hairColor.toString(16).padStart(6, '0')};--accent:#${race.accentColor.toString(16).padStart(6, '0')}"><i></i></div>
            <strong>${profile.name}</strong><small>${race.name} ${characterClass.name}</small>
            <dl><div><dt>Level</dt><dd>1</dd></div><div><dt>Health</dt><dd>${profile.maxHealth}</dd></div><div><dt>Mana</dt><dd>${profile.maxMana}</dd></div><div><dt>Gold</dt><dd>120</dd></div></dl>
          </aside>
          <main><div class="inventory__grid">${slots}</div><footer><span>6 / 24 SLOTS</span><span>WEIGHT 8.4 / 40</span></footer></main>
        </div>
      </div>`;
    document.body.append(this.root);

    window.addEventListener('keydown', (event) => {
      if (event.code !== 'KeyE' || event.repeat) return;
      event.preventDefault();
      this.toggle();
    });
  }

  private toggle(): void {
    this.open = !this.open;
    this.root.classList.toggle('inventory--open', this.open);
    this.root.setAttribute('aria-hidden', String(!this.open));
    if (this.open && document.pointerLockElement) document.exitPointerLock();
  }
}
