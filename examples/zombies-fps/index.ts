import { startServer, Collider, ColliderShape, CollisionGroup, PathfindingEntityController } from 'hytopia';
import GamePlayerEntity from './classes/GamePlayerEntity';
import PurchaseBarrierEntity from './classes/PurchaseBarrierEntity';
import { INVISIBLE_WALLS, PURCHASE_BARRIERS, ENEMY_SPAWN_POINTS } from './gameConfig';
import worldMap from './assets/maps/terrain.json';

import ZombieEntity from './classes/enemies/ZombieEntity';

startServer(world => {
  // Load map.
  world.loadMap(worldMap);

  world.simulation.enableDebugRaycasting(true);

  // Setup lighting
  world.setAmbientLightIntensity(0.3);
  world.setAmbientLightColor({ r: 255, g: 192, b: 192 });
  world.setDirectionalLightIntensity(0.8);

  const spawnPoints = [
    ...ENEMY_SPAWN_POINTS.start,
    ...ENEMY_SPAWN_POINTS.theater,
    ...ENEMY_SPAWN_POINTS.parlor,
    ...ENEMY_SPAWN_POINTS.dining,
    ...ENEMY_SPAWN_POINTS.gallery,
    ...ENEMY_SPAWN_POINTS.kitchen,
    ...ENEMY_SPAWN_POINTS.treasure,
  ];

  
  // Setup invisible walls that only enemies can pass through
  // INVISIBLE_WALLS.forEach(wall => {
  //   const wallCollider = new Collider({
  //     shape: ColliderShape.BLOCK,
  //     halfExtents: wall.halfExtents,
  //     relativePosition: wall.position, // since this is not attached to a rigid body, relative position is realtive to the world global coordinate space.
  //     collisionGroups: {
  //       belongsTo: [ CollisionGroup.BLOCK ],
  //       collidesWith: [ CollisionGroup.PLAYER ],
  //     },
  //   });

  //   wallCollider.addToSimulation(world.simulation);
  // });

  // Setup purchase barriers
  // PURCHASE_BARRIERS.forEach(barrier => {
  //   const purchaseBarrier = new PurchaseBarrierEntity({
  //     name: barrier.name,
  //     removalPrice: barrier.removalPrice,
  //     width: barrier.width,
  //   });

  //   purchaseBarrier.spawn(world, barrier.position, barrier.rotation);
  // });

  // Spawn a player entity when a player joins the game.
  world.onPlayerJoin = player => {
    const playerEntity = new GamePlayerEntity(player);

    playerEntity.spawn(world, { x: 2, y: 10, z: 19 });

    let i = 0;
    setTimeout(() => {
      console.log('Game starting');
      //setInterval(() => {
        const spawnPoint = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
        const zombie = new ZombieEntity({ health: 7, damage: 5 });
        zombie.spawn(world, { x: spawnPoint.x, y: 5, z: spawnPoint.z });
    
        zombie.smartPathfind(playerEntity);
        i++;
        console.log(`Spawned ${i} zombies`);
      //}, 1000);
    }, 500);
  };

  // Despawn all player entities when a player leaves the game.
  world.onPlayerLeave = player => {
    world.entityManager.getPlayerEntitiesByPlayer(player).forEach(entity => entity.despawn());
  };
});