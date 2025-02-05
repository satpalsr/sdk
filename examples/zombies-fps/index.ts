import { startServer } from 'hytopia';
import GamePlayerEntity from './classes/GamePlayerEntity';
import worldMap from './assets/maps/terrain.json';

import GameManager from './classes/GameManager';

startServer(world => {
  // Load map.
  world.loadMap(worldMap);

  world.simulation.enableDebugRaycasting(true);

  // Setup lighting
  world.setAmbientLightIntensity(0.3);
  world.setAmbientLightColor({ r: 255, g: 192, b: 192 });
  world.setDirectionalLightIntensity(0.8);

  // Setup game
  GameManager.instance.setupGame(world);

  // Spawn a player entity when a player joins the game.
  world.onPlayerJoin = player => {
    const playerEntity = new GamePlayerEntity(player);

    playerEntity.spawn(world, { x: 2, y: 10, z: 19 });
  };

  // Despawn all player entities when a player leaves the game.
  world.onPlayerLeave = player => {
    world.entityManager.getPlayerEntitiesByPlayer(player).forEach(entity => entity.despawn());
  };
});