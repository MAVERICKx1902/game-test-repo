import * as THREE from 'three';
import { getCharacterClass, getRace } from './CharacterDefinitions';
import type { CharacterProfile } from './CharacterProfile';

/** First-person survival controller with pointer-lock and drag-to-look fallback. */
export class CharacterController {
  private readonly rig = new THREE.Group();
  private readonly keys = new Set<string>();
  private readonly move = new THREE.Vector3();
  private readonly forward = new THREE.Vector3();
  private readonly right = new THREE.Vector3();
  private readonly hands = new THREE.Group();
  private readonly speed = 5.4;
  private pitch = -0.08;
  private yaw = Math.PI;
  private dragging = false;
  private lastPointer = new THREE.Vector2();
  private walkTime = 0;

  constructor(
    scene: THREE.Scene,
    private readonly camera: THREE.PerspectiveCamera,
    canvas: HTMLCanvasElement,
    profile: CharacterProfile,
  ) {
    this.rig.position.set(0, 0, 4);
    this.camera.position.set(0, 1.72, 0);
    // Clear the character-creation camera's lookAt rotation. Keeping that old
    // quaternion caused a visible roll when the first-person controller began.
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.set(0, 0, 0);
    this.rig.add(this.camera);
    scene.add(this.rig);
    this.createFirstPersonEquipment(profile);
    this.camera.add(this.hands);

    window.addEventListener('keydown', (event) => {
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
        event.preventDefault();
      }
      this.keys.add(event.code);
    });
    window.addEventListener('keyup', (event) => this.keys.delete(event.code));
    window.addEventListener('blur', () => this.keys.clear());

    canvas.addEventListener('click', () => {
      canvas.focus();
      if (document.pointerLockElement !== canvas) {
        void canvas.requestPointerLock().catch(() => {
          // Embedded previews may deny pointer lock; drag-to-look remains available.
        });
      }
    });
    canvas.addEventListener('pointerdown', (event) => {
      this.dragging = true;
      this.lastPointer.set(event.clientX, event.clientY);
    });
    window.addEventListener('pointerup', () => { this.dragging = false; });
    window.addEventListener('pointermove', (event) => {
      if (document.pointerLockElement === canvas) {
        this.look(event.movementX, event.movementY);
      } else if (this.dragging) {
        this.look(event.clientX - this.lastPointer.x, event.clientY - this.lastPointer.y);
        this.lastPointer.set(event.clientX, event.clientY);
      }
    });
  }

  update(delta: number): void {
    const horizontal = Number(this.isDown('KeyD', 'ArrowRight')) - Number(this.isDown('KeyA', 'ArrowLeft'));
    const vertical = Number(this.isDown('KeyW', 'ArrowUp')) - Number(this.isDown('KeyS', 'ArrowDown'));

    this.forward.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    this.right.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    this.move.set(0, 0, 0).addScaledVector(this.forward, vertical).addScaledVector(this.right, horizontal);
    const moving = this.move.lengthSq() > 0;
    if (moving) {
      this.move.normalize();
      this.rig.position.addScaledVector(this.move, this.speed * delta);
      this.rig.position.x = THREE.MathUtils.clamp(this.rig.position.x, -42, 42);
      this.rig.position.z = THREE.MathUtils.clamp(this.rig.position.z, -42, 42);
      this.walkTime += delta * 10;
    }

    this.rig.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
    const bob = moving ? Math.sin(this.walkTime) * 0.045 : 0;
    const sway = moving ? Math.cos(this.walkTime * 0.5) * 0.018 : 0;
    this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, 1.72 + bob, 0.16);
    this.hands.position.x = THREE.MathUtils.lerp(this.hands.position.x, sway, 0.12);
    this.hands.position.y = THREE.MathUtils.lerp(this.hands.position.y, -0.25 - Math.abs(bob) * 0.7, 0.12);
  }

  private look(deltaX: number, deltaY: number): void {
    const sensitivity = 0.0022;
    this.yaw -= deltaX * sensitivity;
    this.pitch = THREE.MathUtils.clamp(this.pitch - deltaY * sensitivity, -1.35, 1.35);
  }

  private isDown(primary: string, alternate: string): boolean {
    return this.keys.has(primary) || this.keys.has(alternate);
  }

  private createFirstPersonEquipment(profile: CharacterProfile): void {
    const race = getRace(profile.raceId);
    const characterClass = getCharacterClass(profile.classId);
    const skin = new THREE.MeshStandardMaterial({ color: race.skinColor, roughness: 0.85 });
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.55, 2, 6), skin);
    arm.rotation.x = -1.05;
    arm.rotation.z = -0.2;
    arm.position.set(0.4, -0.26, -0.55);
    this.hands.add(arm);

    if (profile.classId === 'knight' || profile.classId === 'paladin') {
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.055, 0.06, 1.35),
        new THREE.MeshStandardMaterial({
          color: profile.classId === 'paladin' ? 0xffdc83 : 0xcbd5d7,
          emissive: profile.classId === 'paladin' ? 0x6b4810 : 0x000000,
          emissiveIntensity: 0.5,
          metalness: 0.8,
          roughness: 0.22,
        }),
      );
      blade.rotation.x = 0.16;
      blade.position.set(0.42, -0.17, -1.06);
      this.hands.add(blade);
    } else if (profile.classId === 'magician' || profile.classId === 'cleric') {
      const staff = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.04, 1.5, 7),
        new THREE.MeshStandardMaterial({ color: 0x63432d, roughness: 1 }),
      );
      staff.rotation.x = Math.PI / 2.7;
      staff.position.set(0.42, -0.2, -0.85);
      const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.13),
        new THREE.MeshStandardMaterial({ color: race.accentColor, emissive: race.accentColor, emissiveIntensity: 2 }),
      );
      crystal.position.set(0.42, 0.28, -1.4);
      this.hands.add(staff, crystal);
    } else if (profile.classId === 'assassin') {
      for (const x of [0.28, 0.55]) {
        const dagger = new THREE.Mesh(
          new THREE.BoxGeometry(0.035, 0.035, 0.72),
          new THREE.MeshStandardMaterial({ color: 0x9fa8b5, metalness: 0.85, roughness: 0.2 }),
        );
        dagger.position.set(x, -0.22, -0.72 - x * 0.2);
        dagger.rotation.y = x === 0.28 ? -0.16 : 0.16;
        this.hands.add(dagger);
      }
    } else {
      const bow = new THREE.Mesh(
        new THREE.TorusGeometry(0.38, 0.025, 5, 12, Math.PI * 1.55),
        new THREE.MeshStandardMaterial({ color: 0x936b3d, roughness: 0.9 }),
      );
      bow.rotation.set(0.2, 0, 0.65);
      bow.position.set(0.38, -0.12, -0.75);
      this.hands.add(bow);
    }

    const cuff = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.1, 0.24, 7),
      new THREE.MeshStandardMaterial({ color: characterClass.armorColor, roughness: 0.7 }),
    );
    cuff.rotation.x = -1.05;
    cuff.position.set(0.38, -0.18, -0.47);
    this.hands.add(cuff);
    this.hands.position.set(0, -0.25, 0);
  }
}
