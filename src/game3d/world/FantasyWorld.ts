import * as THREE from 'three';

const standard = (color: number, roughness = 0.9) => new THREE.MeshStandardMaterial({ color, roughness });

export class FantasyWorld {
  constructor(scene: THREE.Scene) {
    scene.background = new THREE.Color(0x111a21);
    scene.fog = new THREE.Fog(0x111a21, 28, 76);

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(90, 90, 18, 18), standard(0x263c35));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const road = new THREE.Mesh(new THREE.PlaneGeometry(9, 90), standard(0x665f54));
    road.rotation.x = -Math.PI / 2;
    road.position.y = 0.012;
    road.receiveShadow = true;
    scene.add(road);

    this.addVillage(scene);
    this.addForest(scene);
    this.addGuildCrystal(scene);
  }

  private addVillage(scene: THREE.Scene): void {
    const locations = [
      [-12, -11, 0.2], [-17, -4, -0.15], [-14, 9, 0.1],
      [13, -14, -0.1], [16, 2, 0.15], [13, 14, -0.2],
    ];
    for (const [x, z, rotation] of locations) {
      const house = new THREE.Group();
      const walls = new THREE.Mesh(new THREE.BoxGeometry(5, 3.3, 4.5), standard(0x8a765e));
      walls.position.y = 1.65;
      walls.castShadow = true;
      walls.receiveShadow = true;
      const roof = new THREE.Mesh(new THREE.ConeGeometry(4.1, 2.5, 4), standard(0x56363a));
      roof.position.y = 4.2;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      const door = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2, 0.12), standard(0x3a2922));
      door.position.set(0, 1, 2.31);
      house.add(walls, roof, door);
      house.position.set(x, 0, z);
      house.rotation.y = rotation;
      scene.add(house);
    }
  }

  private addForest(scene: THREE.Scene): void {
    let seed = 712367;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let index = 0; index < 90; index += 1) {
      const x = random() * 82 - 41;
      const z = random() * 82 - 41;
      if (Math.abs(x) < 8 || (Math.abs(x) < 21 && Math.abs(z) < 20)) continue;
      const scale = 0.75 + random() * 0.75;
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.25, 1.8, 6), standard(0x56402b));
      trunk.position.y = 0.9;
      trunk.castShadow = true;
      const crown = new THREE.Mesh(new THREE.ConeGeometry(1.25, 3.1, 7), standard(random() > 0.2 ? 0x315844 : 0x3b6149));
      crown.position.y = 2.8;
      crown.castShadow = true;
      tree.add(trunk, crown);
      tree.position.set(x, 0, z);
      tree.scale.setScalar(scale);
      scene.add(tree);
    }
  }

  private addGuildCrystal(scene: THREE.Scene): void {
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.9, 0.65, 8), standard(0x4f5660));
    base.position.set(0, 0.32, -18);
    base.castShadow = true;
    scene.add(base);

    const crystalMaterial = new THREE.MeshStandardMaterial({
      color: 0x63c7d3,
      emissive: 0x1c6370,
      emissiveIntensity: 1.5,
      roughness: 0.22,
    });
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(1.25, 0), crystalMaterial);
    crystal.position.set(0, 2, -18);
    crystal.scale.y = 1.7;
    crystal.castShadow = true;
    scene.add(crystal);

    const glow = new THREE.PointLight(0x69deeb, 5, 12, 2);
    glow.position.set(0, 2.4, -18);
    scene.add(glow);
  }
}
