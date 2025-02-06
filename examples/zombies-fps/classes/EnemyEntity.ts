import {
  Audio,
  Entity,
  EntityOptions,
  PathfindingEntityController,
} from 'hytopia';

import GamePlayerEntity from './GamePlayerEntity';

const RETARGET_ACCUMULATOR_THRESHOLD_MS = 5000;
const PATHFIND_ACCUMULATOR_THRESHOLD_MS = 3000;

export interface EnemyEntityOptions extends EntityOptions {
  damageAudioUri?: string;
  damage: number;
  health: number;
  jumpHeight?: number
  reward: number;
  speed: number;
}

export default class EnemyEntity extends Entity {
  public damage: number;
  public health: number;
  public maxHealth: number;
  public jumpHeight: number;
  public reward: number;
  public speed: number;

  private _damageAudio: Audio | undefined;
  private _targetEntity: Entity | undefined;
  private _pathfindAccumulatorMs = 0;
  private _retargetAccumulatorMs = 0;
  private _isPathfinding = false;

  public constructor(options: EnemyEntityOptions) {
    super(options);
    this.health = options.health;
    this.maxHealth = options.health;
    this.damage = options.damage;
    this.jumpHeight = options.jumpHeight ?? 1;
    this.reward = options.reward;
    this.speed = options.speed;

    if (options.damageAudioUri) {
      this._damageAudio = new Audio({
        attachedToEntity: this,
        uri: options.damageAudioUri,
        volume: 1,
        loop: false,
      });
    }

    this.onEntityCollision = this._onEntityCollision;
    this.onTick = this._onTick;

    this.setCcdEnabled(true);
  }

  public takeDamage(damage: number, fromPlayer: GamePlayerEntity) {
    if (!this.world) {
      return;
    }

    this.health -= damage;

    if (this._damageAudio) {
      this._damageAudio.play(this.world, true);
    }

    if (this.health <= 0 && this.isSpawned) {
      // Enemy is dead, give half reward & despawn
      fromPlayer.addMoney(Math.floor(this.reward / 2));
      this.despawn();
    } else {
      if (!this.isSpawned || !this.world) {
        return;
      }

      // Give a % of reward based on damage
      fromPlayer.addMoney(Math.floor(this.reward * (damage / this.maxHealth) * 0.5));

      // Apply red tint for 75ms to indicate damage
      this.setTintColor({ r: 255, g: 0, b: 0 });
      setTimeout(() => this.isSpawned ? this.setTintColor({ r: 255, g: 255, b: 255 }) : undefined, 75);
    }
  }

  private _onEntityCollision = (entity: Entity, otherEntity: Entity, started: boolean) => {
    if (!started || !(otherEntity instanceof GamePlayerEntity)) {
      return;
    }

    otherEntity.takeDamage(this.damage);
  }

  private _onTick = (entity: Entity, tickDeltaMs: number) => {
    if (!this.isSpawned) {
      return;
    }

    this._pathfindAccumulatorMs += tickDeltaMs;
    this._retargetAccumulatorMs += tickDeltaMs;

    // Acquire a target to hunt
    if (!this._targetEntity || !this._targetEntity.isSpawned || this._retargetAccumulatorMs > RETARGET_ACCUMULATOR_THRESHOLD_MS) {
      this._targetEntity = this._getNearestTarget();
      this._retargetAccumulatorMs = 0;
    }

    // No target, do nothing
    if (!this._targetEntity) {
      return;
    }

    const targetDistance = this._getTargetDistance(this._targetEntity);
    const pathfindingController = this.controller as PathfindingEntityController;

    if (targetDistance < 8 || (!this._isPathfinding && this._pathfindAccumulatorMs < PATHFIND_ACCUMULATOR_THRESHOLD_MS)) {
      pathfindingController.move(this._targetEntity.position, this.speed);
      pathfindingController.face(this._targetEntity.position, this.speed * 2);
    } else if (this._pathfindAccumulatorMs > PATHFIND_ACCUMULATOR_THRESHOLD_MS) {
      this._isPathfinding = pathfindingController.pathfind(this._targetEntity.position, this.speed, {
        maxFall: 3,
        maxJump: 1,
        maxOpenSetIterations: 300,
        verticalPenalty: 1,
        pathfindAbortCallback: () => this._isPathfinding = false,
        pathfindCompleteCallback: () => this._isPathfinding = false,
        waypointMoveSkippedCallback: () => this._isPathfinding = false,
      });

      this._pathfindAccumulatorMs = 0;
    }
  }

  private _getNearestTarget(): Entity | undefined {
    if (!this.world) {
      return undefined;
    }

    let nearestTarget: Entity | undefined;
    let nearestDistance = Infinity;

    const targetableEntities = this.world.entityManager.getAllPlayerEntities();

    targetableEntities.forEach(target => {
      const distance = this._getTargetDistance(target);
      if (distance < nearestDistance) {
        nearestTarget = target;
        nearestDistance = distance;
      }
    });

    return nearestTarget;
  }

  private _getTargetDistance(target: Entity) {
    const targetDistance = {
      x: target.position.x - this.position.x,
      y: target.position.y - this.position.y,
      z: target.position.z - this.position.z,
    };

    return Math.sqrt(targetDistance.x * targetDistance.x + targetDistance.y * targetDistance.y + targetDistance.z * targetDistance.z);
  }
}
