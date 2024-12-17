import {
  startServer,
  PlayerEntity,
} from 'hytopia';

import MyEntityController from './MyEntityController';

import worldMap from './assets/map.json';

startServer(world => {
  // Uncomment this to visualize physics vertices, will cause noticable lag.
  // world.simulation.enableDebugRendering(true);
  
  // Visualize raycasts, like block breaking for our
  // entity controller.
  world.simulation.enableDebugRaycasting(true);

  world.loadMap(worldMap);

  world.onPlayerJoin = player => {
    const playerEntity = new PlayerEntity({
      player,
      name: 'Player',
      modelUri: 'models/player.gltf',
      modelLoopedAnimations: [ 'idle' ],
      modelScale: 0.5,
      controller: new MyEntityController(), // attach our entity controller
    });

    playerEntity.spawn(world, { x: 0, y: 10, z: 0 });
    console.log('Spawned player entity!');

  };
  
  world.onPlayerLeave = player => {
    world.entityManager.getAllPlayerEntities(player).forEach(entity => entity.despawn());
  };
});
