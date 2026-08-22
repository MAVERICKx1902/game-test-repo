import * as THREE from 'three';
import { getCharacterClass, getRace } from './CharacterDefinitions';
import type { CharacterProfile } from './CharacterProfile';

const material = (color: number, roughness = 0.8, metalness = 0.05) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness });

const mesh = (geometry: THREE.BufferGeometry, color: number): THREE.Mesh => {
  const result = new THREE.Mesh(geometry, material(color));
  result.castShadow = true;
  result.receiveShadow = true;
  return result;
};

/** Builds a lightweight low-poly avatar from race and class data. */
export class CharacterModel extends THREE.Group {
  private readonly leftArm = new THREE.Group();
  private readonly rightArm = new THREE.Group();
  private readonly leftLeg = new THREE.Group();
  private readonly rightLeg = new THREE.Group();

  constructor(profile: CharacterProfile) {
    super();
    const race = getRace(profile.raceId);
    const characterClass = getCharacterClass(profile.classId);

    const torso = mesh(new THREE.CapsuleGeometry(0.38, 0.65, 3, 8), characterClass.armorColor);
    torso.position.y = 1.45;
    this.add(torso);

    const belt = mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.13, 8), race.accentColor);
    belt.position.y = 1.12;
    this.add(belt);

    const head = mesh(new THREE.SphereGeometry(0.34, 12, 8), race.skinColor);
    head.position.y = 2.23;
    head.scale.set(0.9, 1.05, 0.88);
    this.add(head);

    const hair = mesh(new THREE.SphereGeometry(0.36, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), race.hairColor);
    hair.position.y = 2.36;
    hair.scale.set(0.95, 0.75, 0.95);
    this.add(hair);

    // Eyes and nose make the character's face readable from the game camera.
    for (const x of [-0.12, 0.12]) {
      const eye = mesh(new THREE.SphereGeometry(0.035, 6, 4), profile.raceId === 'dark-elf' ? 0xd4a5ff : 0xd9f7f4);
      eye.position.set(x, 2.25, 0.3);
      this.add(eye);
    }
    const nose = mesh(new THREE.ConeGeometry(0.035, 0.1, 5), race.skinColor);
    nose.rotation.x = Math.PI / 2;
    nose.position.set(0, 2.16, 0.34);
    this.add(nose);

    if (race.earScale > 0) {
      for (const side of [-1, 1]) {
        const ear = mesh(new THREE.ConeGeometry(0.09, 0.45, 5), race.skinColor);
        ear.rotation.z = side * Math.PI / 2;
        ear.position.set(side * 0.43, 2.24, 0);
        this.add(ear);
      }
    }

    this.createLimb(this.leftArm, -0.5, 1.73, race.skinColor, true);
    this.createLimb(this.rightArm, 0.5, 1.73, race.skinColor, true);
    this.createLimb(this.leftLeg, -0.2, 0.92, 0x252a33, false);
    this.createLimb(this.rightLeg, 0.2, 0.92, 0x252a33, false);
    this.add(this.leftArm, this.rightArm, this.leftLeg, this.rightLeg);

    this.addClassEquipment(profile);
  }

  animate(elapsed: number, moving: boolean): void {
    const swing = moving ? Math.sin(elapsed * 10) * 0.58 : Math.sin(elapsed * 2) * 0.035;
    this.leftArm.rotation.x = swing;
    this.rightArm.rotation.x = -swing;
    this.leftLeg.rotation.x = -swing;
    this.rightLeg.rotation.x = swing;
    this.position.y = moving ? Math.abs(Math.sin(elapsed * 10)) * 0.035 : 0;
  }

  private createLimb(group: THREE.Group, x: number, y: number, color: number, arm: boolean): void {
    group.position.set(x, y, 0);
    const limb = mesh(new THREE.CapsuleGeometry(arm ? 0.1 : 0.13, arm ? 0.55 : 0.62, 2, 6), color);
    limb.position.y = -0.35;
    group.add(limb);
  }

  private addClassEquipment(profile: CharacterProfile): void {
    const race = getRace(profile.raceId);
    if (profile.classId === 'knight') {
      const sword = mesh(new THREE.BoxGeometry(0.08, 0.9, 0.04), 0xc8d2d5);
      sword.position.set(0.68, 1.15, 0.05);
      sword.rotation.z = -0.2;
      this.add(sword);
      const shield = mesh(new THREE.CylinderGeometry(0.35, 0.28, 0.09, 6), race.accentColor);
      shield.rotation.x = Math.PI / 2;
      shield.position.set(-0.62, 1.35, 0.2);
      this.add(shield);
    } else if (profile.classId === 'magician') {
      const staff = mesh(new THREE.CylinderGeometry(0.035, 0.045, 1.7, 7), 0x5a3c2b);
      staff.position.set(0.65, 1.15, 0);
      this.add(staff);
      const crystal = mesh(new THREE.OctahedronGeometry(0.18), race.accentColor);
      crystal.position.set(0.65, 2.08, 0);
      this.add(crystal);
    } else {
      const bow = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.035, 5, 10, Math.PI * 1.45), material(0x8a623d));
      bow.position.set(-0.55, 1.42, 0);
      bow.rotation.z = 0.8;
      bow.castShadow = true;
      this.add(bow);
    }
  }
}
