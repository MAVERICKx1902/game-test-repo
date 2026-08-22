import Phaser from 'phaser';
import { PlayerInput } from '../input/PlayerInput';

export type FacingDirection = 'north' | 'south' | 'east' | 'west';
export type MovementState = 'idle' | 'walk';

const MOVE_SPEED = 155;

/**
 * Domain object for the player character.
 * Combat, equipment, and stats can be composed into this class later without
 * leaking input or camera concerns into those systems.
 */
export class Player extends Phaser.Physics.Arcade.Sprite {
  private readonly controls: PlayerInput;
  private facing: FacingDirection = 'south';
  private movementState: MovementState = 'idle';

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player-south-0');

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.controls = new PlayerInput(scene);

    this.setDepth(y);
    this.setCollideWorldBounds(true);
    this.setSize(14, 12);
    this.setOffset(9, 33);
  }

  update(): void {
    const movement = this.controls.getMovement();
    this.setVelocity(movement.x * MOVE_SPEED, movement.y * MOVE_SPEED);

    if (movement.lengthSq() > 0) {
      this.setFacingFromMovement(movement);
      this.setMovementState('walk');
    } else {
      this.setMovementState('idle');
    }

    // Y-sorting prepares the renderer for props and NPCs occupying the world.
    this.setDepth(Math.round(this.y));
  }

  getFacing(): FacingDirection {
    return this.facing;
  }

  private setFacingFromMovement(movement: Phaser.Math.Vector2): void {
    if (Math.abs(movement.x) > Math.abs(movement.y)) {
      this.facing = movement.x > 0 ? 'east' : 'west';
    } else {
      this.facing = movement.y > 0 ? 'south' : 'north';
    }
  }

  private setMovementState(nextState: MovementState): void {
    const animationKey = `player-${nextState}-${this.facing}`;
    if (this.movementState !== nextState || this.anims.currentAnim?.key !== animationKey) {
      this.movementState = nextState;
      this.play(animationKey, true);
    }
  }
}
