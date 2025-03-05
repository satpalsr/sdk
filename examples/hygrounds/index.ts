import {
  startServer,
  PlayerEntity,
  PlayerEvent,
} from 'hytopia';

import GamePlayerEntity from './classes/GamePlayerEntity';
import PistolEntity from './classes/guns/PistolEntity';

import worldMap from './assets/map.json';

startServer(world => {
  // Load the game map
  world.loadMap(worldMap);

  world.simulation.enableDebugRaycasting(true);

  const testPistol = new PistolEntity();
  testPistol.spawn(world, { x: 3, y: 2.5, z: 3 });


  // Handle player joining the game
  world.on(PlayerEvent.JOINED_WORLD, ({ player }) => {
    const playerEntity = new GamePlayerEntity(player);
    
    // Spawn player at starting position
    playerEntity.spawn(world, { x: 0, y: 10, z: 0 });
  });

  // Handle player leaving the game
  world.on(PlayerEvent.LEFT_WORLD, ({ player }) => {
    // Clean up player entities
    world.entityManager
      .getPlayerEntitiesByPlayer(player)
      .forEach(entity => entity.despawn());
  });
});
