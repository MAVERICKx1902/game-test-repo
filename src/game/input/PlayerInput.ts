import Phaser from 'phaser';

/** Owns input bindings so the Player never depends on a specific control scheme. */
export class PlayerInput {
  private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private readonly keys: Record<'up' | 'down' | 'left' | 'right', Phaser.Input.Keyboard.Key>;

  constructor(scene: Phaser.Scene) {
    if (!scene.input.keyboard) {
      throw new Error('Keyboard input is unavailable.');
    }

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as Record<'up' | 'down' | 'left' | 'right', Phaser.Input.Keyboard.Key>;
  }

  getMovement(): Phaser.Math.Vector2 {
    const horizontal = Number(this.keys.right.isDown || this.cursors.right.isDown)
      - Number(this.keys.left.isDown || this.cursors.left.isDown);
    const vertical = Number(this.keys.down.isDown || this.cursors.down.isDown)
      - Number(this.keys.up.isDown || this.cursors.up.isDown);

    const movement = new Phaser.Math.Vector2(horizontal, vertical);
    return movement.lengthSq() > 1 ? movement.normalize() : movement;
  }
}
