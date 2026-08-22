import { getCharacterClass, getRace } from '../character/CharacterDefinitions';
import type { CharacterProfile } from '../character/CharacterProfile';

export class CharacterHud {
  constructor(profile: CharacterProfile) {
    const race = getRace(profile.raceId);
    const characterClass = getCharacterClass(profile.classId);
    const hud = document.createElement('div');
    hud.className = 'hud';
    hud.innerHTML = `
      <div class="hud__identity">
        <div class="avatar avatar--${race.id}" style="--skin:#${race.skinColor.toString(16).padStart(6, '0')};--hair:#${race.hairColor.toString(16).padStart(6, '0')};--accent:#${race.accentColor.toString(16).padStart(6, '0')}"><i></i></div>
        <div class="hud__stats">
          <strong>${profile.name}</strong>
          <small>${race.name} · ${characterClass.name} · LV. 1</small>
          ${this.bar('HP', profile.maxHealth, 'health')}
          ${this.bar('MP', profile.maxMana, 'mana')}
        </div>
      </div>
      <div class="guild-rank"><span>Guild rank</span><b>F</b></div>
      <div class="crosshair" aria-hidden="true"></div>
      <div class="controls"><b>CLICK</b> LOOK · <b>WASD</b> MOVE · <b>E</b> INVENTORY</div>`;
    document.body.append(hud);
  }

  private bar(label: string, value: number, type: string): string {
    return `<div class="resource resource--${type}"><i></i><b>${label}</b><span>${value} / ${value}</span></div>`;
  }
}
