import {
  startServer,
  PlayerEvent,
  ModelRegistry,
} from 'hytopia';

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
    
    // Spawn player at starting position
    playerEntity.spawn(world, { x: -22, y: 3, z: -9 });
  });

  // Handle player leaving the game
  world.on(PlayerEvent.LEFT_WORLD, ({ player }) => {
    // Clean up player entities
    world.entityManager
      .getPlayerEntitiesByPlayer(player)
      .forEach(entity => entity.despawn());
  });
});
