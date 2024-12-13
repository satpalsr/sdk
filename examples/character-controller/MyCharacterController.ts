import {
  Audio,
  BaseCharacterController,
  CollisionGroup,
  Collider,
  Entity,
  ColliderShape,
  BlockType,
} from 'hytopia';

import type {
  PlayerInput,
  PlayerCameraOrientation,
  Vector3,
} from 'hytopia';

export default class MyCharacterController extends BaseCharacterController {
  public jumpVelocity: number = 10;
  public runVelocity: number = 8;
  public walkVelocity: number = 4;

  private _stepAudio: Audio;
  private _groundContactCount: number = 0;
  private _platform: Entity | undefined;

  public constructor(entity: Entity) {
    super(entity);

    // Setup any audio or dependencies in the constructor.
    this._stepAudio = new Audio({
      uri: 'audio/sfx/step.wav',
      loop: true,
      volume: 0.1,
      attachedToEntity: this.entity,
    });

    this.entity.lockAllRotations(); // prevent physics from applying rotation to the entity.
  }

  /** Whether the entity is grounded. */
  public get isGrounded(): boolean { return this._groundContactCount > 0; }

  /** Whether the entity is on a platform, a platform is any entity with a kinematic rigid body. */
  public get isOnPlatform(): boolean { return !!this._platform; }

  /** The platform the entity is on, if any. */
  public get platform(): Entity | undefined { return this._platform; }

  /**
   * Create the sensor colliders for the character controller.
   */
  public createSensorColliders(): Collider[] {
    if (!this.entity.isSpawned) {
      throw new Error('CharacterController.createSensorColliders(): Entity is not spawned!');
    }

    const sensorColliders: Collider[] = [];

    /**
     * Our ground sensor detects when we're on the ground.
     * It assumes a cylinder shape and is positioned manually
     * relative to the default entity rigid body as defined
     * by the DEFAULT_ENTITY_RIGID_BODY_OPTIONS constant of
     * the hytopia package.
     */
    sensorColliders.push(new Collider({
      shape: ColliderShape.CYLINDER,
      radius: 0.30,
      halfHeight: 0.125,
      collisionGroups: {
        belongsTo: [ CollisionGroup.ENTITY_SENSOR ],
        collidesWith: [ CollisionGroup.BLOCK, CollisionGroup.ENTITY ],
      },
      isSensor: true,
      relativeTranslation: { x: 0, y: -0.75, z: 0 },
      tag: 'groundSensor',
      onCollision: (_other: BlockType | Entity, started: boolean) => {
        // Ground contact
        this._groundContactCount += started ? 1 : -1;
  
        if (!this._groundContactCount) { // Trigger animations
          this.entity.startModelOneshotAnimations([ 'jump_loop' ]);
        } else {
          this.entity.stopModelAnimations([ 'jump_loop' ]);
        }

        // Platform contact
        if (!(_other instanceof Entity) || !_other.isKinematic) return;
        
        if (started) {
          this._platform = _other;
        } else if (_other === this._platform && !started) {
          this._platform = undefined;
        }
      },
    }));

    return sensorColliders;
  }

  /**
   * Handles movement of the entity based on player's input
   * each tick. tickPlayerMovement is called internally if the entity
   * is of the PlayerEntity class.
   */
  public tickWithPlayerInput(input: PlayerInput, cameraOrientation: PlayerCameraOrientation, deltaTimeMs: number) {
    if (!this.entity.isSpawned || !this.entity.world) return; // type guard.

    super.tickWithPlayerInput(input, cameraOrientation, deltaTimeMs);

    const { w, a, s, d, sp, sh, ml, mr } = input; // See PlayerInput type for all possible inputs.
    const { yaw } = cameraOrientation; // Camera/perspectie orientation of player.
    const currentVelocity = this.entity.getLinearVelocity();
    const targetVelocities = { x: 0, y: 0, z: 0 };
    const isRunning = sh;

    // Handle movement animations if relevant.
    if (w || a || s || d) {
      if (isRunning) {
        // We stop irrelevant animations to prevent blending issues.
        this.entity.stopModelAnimations(Array.from(this.entity.modelLoopedAnimations).filter(v => v !== 'run'));
        // If run is already playing, internally startModelLoopedAnimations will do nothing.
        this.entity.startModelLoopedAnimations([ 'run' ]);
        // Manually set a playback rate of our step audio to audibly sync to our walk speed.
        this._stepAudio.setPlaybackRate(0.83);
      } else {
        this.entity.stopModelAnimations(Array.from(this.entity.modelLoopedAnimations).filter(v => v !== 'walk'));
        this.entity.startModelLoopedAnimations([ 'walk' ]);
        this._stepAudio.setPlaybackRate(0.5);
      }

      this._stepAudio.play(this.entity.world, !this._stepAudio.isPlaying);
    } else {
      this._stepAudio.pause();
      this.entity.stopModelAnimations(Array.from(this.entity.modelLoopedAnimations).filter(v => v !== 'idle'));
      this.entity.startModelLoopedAnimations([ 'idle' ]);
    }

    // Play a simple interact animation on left mouse click then clear the input.
    if (ml) {
      this.entity.startModelOneshotAnimations([ 'simple_interact' ]);
      input.ml = false;
    }

    // Rocket the player up on mouse right click.
    if (mr) {
      targetVelocities.y = 20;
      input.mr = false;
    }

    // Calculate target horizontal velocities (run/walk)
    const velocity = isRunning ? this.runVelocity : this.walkVelocity;

    if (w) {
      targetVelocities.x -= velocity * Math.sin(yaw);
      targetVelocities.z -= velocity * Math.cos(yaw);
    }

    if (s) {
      targetVelocities.x += velocity * Math.sin(yaw);
      targetVelocities.z += velocity * Math.cos(yaw);
    }
    
    if (a) {
      targetVelocities.x -= velocity * Math.cos(yaw);
      targetVelocities.z += velocity * Math.sin(yaw);
    }
    
    if (d) {
      targetVelocities.x += velocity * Math.cos(yaw);
      targetVelocities.z -= velocity * Math.sin(yaw);
    }

    // Normalize for diagonals
    const length = Math.sqrt(targetVelocities.x * targetVelocities.x + targetVelocities.z * targetVelocities.z);
    if (length > velocity) {
      const factor = velocity / length;
      targetVelocities.x *= factor;
      targetVelocities.z *= factor;
    }

    // Calculate target vertical velocity (jump)
    if (sp) {
      if (this.isGrounded && currentVelocity.y <= 3) {
        targetVelocities.y = this.jumpVelocity;
      }
    }

    // Apply impulse relative to target velocities, taking platform velocity into account
    const platformVelocity = this._platform ? this._platform.getLinearVelocity() : { x: 0, y: 0, z: 0 };
    const deltaVelocities = {
      x: targetVelocities.x - currentVelocity.x + platformVelocity.x,
      y: targetVelocities.y + platformVelocity.y,
      z: targetVelocities.z - currentVelocity.z + platformVelocity.z,
    };

    const hasExternalVelocity = 
      Math.abs(currentVelocity.x) > this.runVelocity ||
      Math.abs(currentVelocity.y) > this.jumpVelocity ||
      Math.abs(currentVelocity.z) > this.runVelocity;

    if (!hasExternalVelocity) { // allow external velocities like impulses to resolve, otherwise our deltas will cancel them out.
      if (Object.values(deltaVelocities).some(v => v !== 0)) {
        const mass = this.entity.getMass();

        this.entity.applyImpulse({ // multiply by mass for the impulse to result in applying the correct target velocity
          x: deltaVelocities.x * mass,
          y: deltaVelocities.y * mass,
          z: deltaVelocities.z * mass,
        });
      }
    }

    // Apply rotation relative to camera orientation.
    if (yaw !== undefined) {
      const halfYaw = yaw / 2;
      
      this.entity.setRotation({
        x: 0,
        y: Math.fround(Math.sin(halfYaw)),
        z: 0,
        w: Math.fround(Math.cos(halfYaw)),
      });
    }
  }

  public tickPathfindingMovement(_destination: Vector3, _deltaTimeMs: number) {
    console.log('Non-player pathfinding not implemented!');
  }
}