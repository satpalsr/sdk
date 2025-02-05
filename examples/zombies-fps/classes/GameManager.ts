import { Collider, ColliderShape, CollisionGroup } from 'hytopia';
import PurchaseBarrierEntity from './PurchaseBarrierEntity';
import { INVISIBLE_WALLS, PURCHASE_BARRIERS, ENEMY_SPAWN_POINTS } from '../gameConfig';
import type { World } from 'hytopia';

// temp
import ZombieEntity from './enemies/ZombieEntity';


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


    const spawnPositions = ENEMY_SPAWN_POINTS.start;

    setInterval(() => {
      const zombie = new ZombieEntity();
      const randomIndex = Math.floor(Math.random() * spawnPositions.length);
      const spawnPosition = spawnPositions[randomIndex];
      zombie.spawn(world, { x: spawnPosition.x, y: 3, z: spawnPosition.z });
    }, 3000);
  }
}