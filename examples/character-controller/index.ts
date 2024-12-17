import {
  startServer,
  PlayerEntity,
} from 'hytopia';

import MyCharacterController from './MyCharacterController';

import worldMap from './assets/map.json';

startServer(world => {
  // Uncomment this to visualize physics vertices, will cause noticable lag.
  // world.simulation.enableDebugRendering(true);
  
  // Visualize raycasts, like block breaking for our
  // character controller.
  world.simulation.enableDebugRaycasting(true);

  world.loadMap(worldMap);

  world.onPlayerJoin = player => {
    const playerEntity = new PlayerEntity({
      player,
      name: 'Player',
      modelUri: 'models/player.gltf',
      modelLoopedAnimations: [ 'idle' ],
      modelScale: 0.5,
      characterController: new MyCharacterController(), // attach our character controller
    });

    playerEntity.spawn(world, { x: 0, y: 10, z: 0 });
    console.log('Spawned player entity!');

  };
  
  world.onPlayerLeave = player => {
    world.entityManager.getAllPlayerEntities(player).forEach(entity => entity.despawn());
  };
});
