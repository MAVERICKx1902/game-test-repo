import * as THREE from 'three';
import { CharacterController } from './character/CharacterController';
import type { CharacterProfile } from './character/CharacterProfile';
import { CharacterCreation } from './ui/CharacterCreation';
import { CharacterHud } from './ui/CharacterHud';
import { FantasyWorld } from './world/FantasyWorld';

export class GameApp {
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.08, 140);
  private readonly renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  private readonly clock = new THREE.Clock();
  private controller?: CharacterController;

  constructor(container: HTMLElement) {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    container.append(this.renderer.domElement);

    this.camera.position.set(8, 10, 11);
    this.camera.lookAt(0, 1, 0);
    new FantasyWorld(this.scene);
    this.addLighting();
    new CharacterCreation((profile) => this.startAdventure(profile));

    window.addEventListener('resize', () => this.resize());
    this.renderer.setAnimationLoop(() => this.update());
  }

  private startAdventure(profile: CharacterProfile): void {
    this.controller = new CharacterController(this.scene, this.camera, this.renderer.domElement, profile);
    new CharacterHud(profile);
  }

  private update(): void {
    const delta = Math.min(this.clock.getDelta(), 0.05);
    this.controller?.update(delta);
    this.renderer.render(this.scene, this.camera);
  }

  private addLighting(): void {
    this.scene.add(new THREE.HemisphereLight(0xa8c8df, 0x263226, 2.2));
    const sun = new THREE.DirectionalLight(0xffe4bc, 3.4);
    sun.position.set(-18, 28, 14);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -35;
    sun.shadow.camera.right = 35;
    sun.shadow.camera.top = 35;
    sun.shadow.camera.bottom = -35;
    sun.shadow.camera.far = 80;
    this.scene.add(sun);
  }

  private resize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}
