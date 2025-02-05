import { Collider, CollisionGroup, Entity, RigidBodyType, Vector3Like, QuaternionLike, World, BlockType } from 'hytopia';
import EnemyEntity from '../EnemyEntity';
import type GamePlayerEntity from '../GamePlayerEntity';

const BULLET_SPEED = 75;
const DESPAWN_TIME_MS = 1500;

export default class BulletEntity extends Entity {
  private _damage: number;
  private _fromPlayer: GamePlayerEntity;
  
  public constructor(fromPlayer: GamePlayerEntity, damage: number, direction: Vector3Like) {
    super({
      modelUri: 'models/projectiles/bullet-trace.gltf',
      modelScale: 0.5,
      rigidBodyOptions: {
        type: RigidBodyType.KINEMATIC_VELOCITY,
        linearVelocity: {
          x: direction.x * BULLET_SPEED,
          y: direction.y * BULLET_SPEED,
          z: direction.z * BULLET_SPEED,
        },
        colliders: [
          {
            ...Collider.optionsFromModelUri('models/projectiles/bullet-trace.gltf'),
            collisionGroups: {
              belongsTo: [ CollisionGroup.ENTITY_SENSOR],
              collidesWith: [ CollisionGroup.BLOCK, CollisionGroup.ENTITY ],
            },
            isSensor: true,
          }
        ]
      },
    });

    this._damage = damage;
    this._fromPlayer = fromPlayer;

    this.onBlockCollision = this._onBlockCollision;
    this.onEntityCollision = this._onEntityCollision;
  }

  public override spawn(world: World, position: Vector3Like, rotation?: QuaternionLike): void {
    super.spawn(world, position, rotation);

    setTimeout(() => {
      if (!this.isSpawned) { return; } 
      this.despawn();
    }, DESPAWN_TIME_MS);
  }

  private _onBlockCollision = (entity: Entity, blockType: BlockType, started: boolean) => {
    if (!this.isSpawned || !started) { return; }
    this.despawn();
  }

  private _onEntityCollision = (entity: Entity, otherEntity: Entity, started: boolean) => {
    if (!this.isSpawned || !started) { return; }
    this.despawn();

    if (otherEntity instanceof EnemyEntity) {
      otherEntity.takeDamage(this._damage, this._fromPlayer);
    }
  }
}
