import {
  startServer,
  GameServer,
  PlayerEntity,
} from 'hytopia';

import MyCharacterController from './MyCharacterController';

import worldMap from './assets/map.json';

startServer(world => {
  GameServer.instance.webServer.enableLocalSSL();
  world.simulation.enableDebugRendering(true);
  world.loadMap(worldMap);

  world.onPlayerJoin = player => {
    const playerEntity = new PlayerEntity({
      player,
      name: 'Player',
      modelUri: 'models/player.gltf',
      modelLoopedAnimations: [ 'idle' ],
      modelScale: 0.5,
    });

    // Assign a custom character controller factory to the player entity.
    // This must be assigned before spawning the entity.
    // createCustomCharacterController if set will be handled internally when
    // .spawn() is called.
    playerEntity.createCustomCharacterController = () => {
      console.log('Creating custom player entity character controller...');

      return new MyCharacterController(playerEntity);
    }

    playerEntity.spawn(world, { x: 0, y: 10, z: 0 });
    console.log('Spawned player entity!');

  };
  
  world.onPlayerLeave = player => {
    world.entityManager.getAllPlayerEntities(player).forEach(entity => entity.despawn());
  };
});
