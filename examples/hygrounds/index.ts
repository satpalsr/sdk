import {
  startServer,
  PlayerEntity,
  PlayerEvent,
} from 'hytopia';

import GamePlayerEntity from './classes/GamePlayerEntity';

import PistolEntity from './classes/weapons/PistolEntity';
import PickaxeEntity from './classes/weapons/PickaxeEntity';

import worldMap from './assets/map.json';

startServer(world => {
  // Load the game map
  world.loadMap(worldMap);

  world.simulation.enableDebugRaycasting(true);

  const textPickaxe = new PickaxeEntity();
  textPickaxe.spawn(world, { x: -3, y: 3, z: -3 });

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
