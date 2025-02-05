import { Collider, ColliderShape, CollisionGroup } from 'hytopia';
import PurchaseBarrierEntity from './PurchaseBarrierEntity';
import { INVISIBLE_WALLS, PURCHASE_BARRIERS, ENEMY_SPAWN_POINTS } from '../gameConfig';
import type { World } from 'hytopia';

export default class GameManager {
  public static readonly instance = new GameManager();

  public setupGame(world: World) {
    // Setup invisible walls that only enemies can pass through
    INVISIBLE_WALLS.forEach(wall => {
      const wallCollider = new Collider({
        shape: ColliderShape.BLOCK,
        halfExtents: wall.halfExtents,
        relativePosition: wall.position, // since this is not attached to a rigid body, relative position is realtive to the world global coordinate space.
        collisionGroups: {
          belongsTo: [ CollisionGroup.BLOCK ],
          collidesWith: [ CollisionGroup.PLAYER ],
        },
      });

      wallCollider.addToSimulation(world.simulation);
    });

    // Setup purchase barriers
    PURCHASE_BARRIERS.forEach(barrier => {
      const purchaseBarrier = new PurchaseBarrierEntity({
        name: barrier.name,
        removalPrice: barrier.removalPrice,
        width: barrier.width,
      });

      purchaseBarrier.spawn(world, barrier.position, barrier.rotation);
    });
  }
}