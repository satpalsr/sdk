import {
  startServer,
  PlayerEvent,
} from 'hytopia';

import { SPAWN_REGION_AABB } from './gameConfig';
import GameManager from './classes/GameManager';
import GamePlayerEntity from './classes/GamePlayerEntity';

import worldMap from './assets/map.json';

import BoltActionSniperEntity from './classes/weapons/BoltActionSniperEntity';

startServer(world => {
  // Load the game map
  world.loadMap(worldMap);

  // Set lighting
  world.setAmbientLightIntensity(0.6);
  world.setDirectionalLightIntensity(5);

  world.simulation.enableDebugRaycasting(true);

  GameManager.instance.setupGame(world);

  const sniper = new BoltActionSniperEntity();
  sniper.spawn(world, { x: -5, y: 10, z: 0 });

  // Handle player joining the game
  world.on(PlayerEvent.JOINED_WORLD, ({ player }) => {
    const playerEntity = new GamePlayerEntity(player);
    
    // Spawn player at a random position within the spawn region
    // const randomX = SPAWN_REGION_AABB.min.x + Math.random() * (SPAWN_REGION_AABB.max.x - SPAWN_REGION_AABB.min.x);
    // const randomY = SPAWN_REGION_AABB.min.y + Math.random() * (SPAWN_REGION_AABB.max.y - SPAWN_REGION_AABB.min.y);
    // const randomZ = SPAWN_REGION_AABB.min.z + Math.random() * (SPAWN_REGION_AABB.max.z - SPAWN_REGION_AABB.min.z);
    playerEntity.spawn(world, { x: 0, y: 30, z: 0 });
  });

  // Handle player leaving the game
  world.on(PlayerEvent.LEFT_WORLD, ({ player }) => {
    // Clean up player entities
    world.entityManager
      .getPlayerEntitiesByPlayer(player)
      .forEach(entity => entity.despawn());
  });
});
