import * as THREE from 'three';
import type { CharacterProfile } from './CharacterProfile';
import { CharacterModel } from './CharacterModel';

export class CharacterController {
  readonly object: THREE.Group;
  private readonly model: CharacterModel;
  private readonly keys = new Set<string>();
  private readonly velocity = new THREE.Vector3();
  private readonly cameraTarget = new THREE.Vector3();
  private readonly cameraOffset = new THREE.Vector3(8, 10, 11);
  private readonly speed = 5.2;

  constructor(scene: THREE.Scene, profile: CharacterProfile) {
    this.object = new THREE.Group();
    this.model = new CharacterModel(profile);
    this.object.add(this.model);
    scene.add(this.object);

    window.addEventListener('keydown', (event) => this.keys.add(event.code));
    window.addEventListener('keyup', (event) => this.keys.delete(event.code));
    window.addEventListener('blur', () => this.keys.clear());
  }

  update(delta: number, elapsed: number, camera: THREE.PerspectiveCamera): void {
    const x = Number(this.isDown('KeyD', 'ArrowRight')) - Number(this.isDown('KeyA', 'ArrowLeft'));
    const z = Number(this.isDown('KeyS', 'ArrowDown')) - Number(this.isDown('KeyW', 'ArrowUp'));
    this.velocity.set(x, 0, z);
    const moving = this.velocity.lengthSq() > 0;

    if (moving) {
      this.velocity.normalize();
      this.object.position.addScaledVector(this.velocity, this.speed * delta);
      this.object.rotation.y = Math.atan2(this.velocity.x, this.velocity.z);
      this.object.position.x = THREE.MathUtils.clamp(this.object.position.x, -38, 38);
      this.object.position.z = THREE.MathUtils.clamp(this.object.position.z, -38, 38);
    }
    this.model.animate(elapsed, moving);

    const desiredCamera = this.object.position.clone().add(this.cameraOffset);
    const smoothing = 1 - Math.exp(-delta * 4.5);
    camera.position.lerp(desiredCamera, smoothing);
    this.cameraTarget.lerp(this.object.position.clone().add(new THREE.Vector3(0, 1, 0)), smoothing);
    camera.lookAt(this.cameraTarget);
  }

  private isDown(primary: string, alternate: string): boolean {
    return this.keys.has(primary) || this.keys.has(alternate);
  }
}
