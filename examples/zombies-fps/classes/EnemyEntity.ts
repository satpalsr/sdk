import {
  Entity,
  EntityOptions,
  PathfindingEntityController,
  Vector3Like,
} from 'hytopia';

const PATHFIND_MAX_OPEN_SET_ITERATIONS = 200;
const MAX_ALLOWED_SKIPPED_WAYPOINTS = 3;
let pathfindCount = 0;
export interface EnemyEntityOptions extends EntityOptions {
  damage: number;
  health: number;
  jumpHeight?: number
  speed: number;
}

export default class EnemyEntity extends Entity {
  public damage: number;
  public health: number;
  public jumpHeight: number;
  public speed: number;

  public constructor(options: EnemyEntityOptions) {
    super(options);
    this.health = options.health;
    this.damage = options.damage;
    this.jumpHeight = options.jumpHeight ?? 1;
    this.speed = options.speed;
  }

  public smartPathfind(targetEntity: Entity, maxOpenSetIterations:number = 1000) {
    const pathfindingController = this.controller as PathfindingEntityController;

    const pathFound = pathfindingController.pathfind(targetEntity.position, this.speed, {
      debug: true,
      maxOpenSetIterations,
      maxFall: 20,
      maxJump: this.jumpHeight,
      verticalPenalty: 10,
    });

    console.log(pathfindingController.waypoints);

    if (!pathFound) {
      console.log('Path not found');
    }
  }

  public takeDamage(damage: number) {
    this.health -= damage;

    // Apply random angular velocity around Y axis for stutter effect
    if (this.health <= 0 && this.isSpawned) {
      this.despawn();
    }
  }
}
