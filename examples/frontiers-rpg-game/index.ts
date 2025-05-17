import {
  startServer,
  Audio,
  DefaultPlayerEntity,
  Entity,
  PlayerEvent,
  ColliderShape,
} from 'hytopia';

import worldMap from './assets/maps/farm-start.json';

/**
 * startServer is always the entry point for our game.
 * It accepts a single function where we should do any
 * setup necessary for our game. The init function is
 * passed a World instance which is the default
 * world created by the game server on startup.
 * 
 * Documentation: https://github.com/hytopiagg/sdk/blob/main/docs/server.startserver.md
 */

startServer(world => {
  world.loadMap(worldMap);

  // const rodent1 = new Entity({
  //   name: 'Rodent',
  //   modelUri: 'models/npcs/adventurer.gltf',
  //   modelPreferredShape: ColliderShape.BLOCK,
  //   modelLoopedAnimations: [ 'idle' ],
  //   modelScale: 0.75,
  // });
  // rodent1.spawn(world, { x: -2, y: 10, z: 0 });

  // const rodent2 = new Entity({
  //   name: 'Rodent',
  //   modelUri: 'models/npcs/farmer.gltf',
  //   modelPreferredShape: ColliderShape.BLOCK,
  //   modelLoopedAnimations: [ 'idle' ],
  //   modelScale: 0.75,
  // });
  // rodent2.spawn(world, { x: 0, y: 10, z: 0 });

  // const rodent3 = new Entity({
  //   name: 'Rodent',
  //   modelUri: 'models/npcs/miner.gltf',
  //   modelPreferredShape: ColliderShape.BLOCK,
  //   modelLoopedAnimations: [ 'idle' ],
  //   modelScale: 0.75,
  // });
  // rodent3.spawn(world, { x: 2, y: 10, z: 0 });

  const rodent4 = new Entity({
    name: 'Rodent',
    modelUri: 'models/npcs/mushroom-boy.gltf',
    modelPreferredShape: ColliderShape.BLOCK,
    modelLoopedAnimations: [ 'idle' ],
    modelScale: 0.5,
  });
  rodent4.spawn(world, { x: 0, y: 10, z: 0 });

  world.on(PlayerEvent.JOINED_WORLD, ({ player }) => {
    const playerEntity = new DefaultPlayerEntity({
      player,
      name: 'Player',
    });
  
    playerEntity.spawn(world, { x: 0, y: 10, z: 0 });
  });

  world.on(PlayerEvent.LEFT_WORLD, ({ player }) => {
    world.entityManager.getPlayerEntitiesByPlayer(player).forEach(entity => entity.despawn());
  });
});
