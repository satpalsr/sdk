import {
  ColliderOptions,
  ColliderShape,
  CollisionGroup,
  Entity,
  RigidBodyType,
  QuaternionLike,
  Vector3Like,
  World,
} from 'hytopia';

const WALL_COLLIDER_OPTIONS: ColliderOptions = {
  shape: ColliderShape.BLOCK,
  halfExtents: {
    x: 0.5,
    y: 5,
    z: 0.5,
  },
  collisionGroups: {
    belongsTo: [ CollisionGroup.BLOCK ],
    collidesWith: [ CollisionGroup.PLAYER ],
  },
};

export interface PurchaseBarrierEntityOptions {
  name: string;
  removalPrice: number;
  width: number;
}

export default class PurchaseBarrierEntity extends Entity {
  public removalPrice: number;
  private _width: number;

  public constructor(options: PurchaseBarrierEntityOptions) {
    super({
      name: options.name,
      modelUri: 'models/environment/barbedfence.gltf',
      rigidBodyOptions: {
        type: RigidBodyType.FIXED,
        colliders: [ WALL_COLLIDER_OPTIONS ],
      },
    });

    this.removalPrice = options.removalPrice;
    this._width = options.width;
  }

  public get width(): number {
    return this._width;
  }

  public override spawn(world: World, position: Vector3Like, rotation?: QuaternionLike): void {
    super.spawn(world, position, rotation);    

    if (this._width > 1) {
      const offset = Math.floor((this._width - 1) / 2);
      for (let i = -offset; i <= offset; i++) {
        if (i === 0) continue; // Skip center since parent barrier is there
        
        const barrier = new Entity({
          name: `${this.name} (${Math.abs(i)})`,
          modelUri: 'models/environment/barbedfence.gltf',
          rigidBodyOptions: {
            type: RigidBodyType.FIXED,
            colliders: [ WALL_COLLIDER_OPTIONS ],
          },
        });

        barrier.spawn(world, {
          x: position.x + (rotation?.w === 1 ? i : 0),
          y: position.y,
          z: position.z + (rotation?.w === 1 ? 0 : i),
        }, rotation);
      }
    };
  }
}

