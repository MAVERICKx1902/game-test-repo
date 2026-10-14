import { CLASSES, getCharacterClass, getRace, RACES, type ClassId, type RaceId } from '../character/CharacterDefinitions';
import { CharacterProfile } from '../character/CharacterProfile';

export class CharacterCreation {
  private raceId: RaceId = 'human';
  private classId: ClassId = 'knight';
  private readonly root = document.createElement('section');

  constructor(private readonly onComplete: (profile: CharacterProfile) => void) {
    this.root.className = 'creator';
    document.body.append(this.root);
    this.render();
  }

  private render(): void {
    const race = getRace(this.raceId);
    const characterClass = getCharacterClass(this.classId);
    const profile = new CharacterProfile(this.raceId, this.classId);
    this.root.innerHTML = `
      <div class="creator__panel">
        <p class="eyebrow">EXILED HEIR · ONLINE</p>
        <h1>Forge your legacy</h1>
        <p class="creator__lead">Choose the bloodline and discipline of your adventurer.</p>
        <div class="creator__summary">
          <div class="avatar avatar--${race.id}" style="--skin:#${race.skinColor.toString(16).padStart(6, '0')};--hair:#${race.hairColor.toString(16).padStart(6, '0')};--accent:#${race.accentColor.toString(16).padStart(6, '0')}"><i></i></div>
          <div><strong>${race.name} ${characterClass.name}</strong><span>${characterClass.role} · HP ${profile.maxHealth} · MP ${profile.maxMana}</span></div>
        </div>
        <h2>I. Select a race</h2>
        <div class="choice-grid" data-group="race">
          ${RACES.map((item) => this.card(item.id, item.name, item.title, item.description, item.id === this.raceId)).join('')}
        </div>
        <h2>II. Select a class</h2>
        <div class="choice-grid" data-group="class">
          ${CLASSES.map((item) => this.card(item.id, item.name, item.role, item.description, item.id === this.classId)).join('')}
        </div>
        <button class="enter-world" type="button">Enter the frontier <span>→</span></button>
      </div>`;

    this.root.querySelectorAll<HTMLButtonElement>('[data-group="race"] .choice').forEach((button) => {
      button.onclick = () => { this.raceId = button.dataset.id as RaceId; this.render(); };
    });
    this.root.querySelectorAll<HTMLButtonElement>('[data-group="class"] .choice').forEach((button) => {
      button.onclick = () => { this.classId = button.dataset.id as ClassId; this.render(); };
    });
    this.root.querySelector<HTMLButtonElement>('.enter-world')!.onclick = () => {
      this.root.classList.add('creator--leaving');
      window.setTimeout(() => {
        this.root.remove();
        this.onComplete(new CharacterProfile(this.raceId, this.classId));
      }, 300);
    };
  }

  private card(id: string, name: string, title: string, description: string, selected: boolean): string {
    return `<button class="choice ${selected ? 'choice--selected' : ''}" data-id="${id}" type="button">
      <b>${name}</b><small>${title}</small><span>${description}</span>
    </button>`;
  }
}
