import {
  startServer,
  DefaultPlayerEntity,
  Entity,
  PathfindingEntityController,
  PlayerEvent,
  Quaternion,
  RigidBodyType,
  ColliderShape,
} from 'hytopia';

import worldMap from './assets/map.json';

startServer(world => {
  world.loadMap(worldMap);

  // Spawn our zombie that will pathfind around the map
  const zombie = new Entity({
    controller: new PathfindingEntityController(),
    name: 'Zombie',
    modelUri: 'models/npcs/zombie.gltf',
    modelLoopedAnimations: [ 'walk' ],
    modelScale: 0.5,
    rigidBodyOptions: {
      enabledRotations: { x: false, y: true, z: false },
      ccdEnabled: true,
    },
  });

  // Spawn somewhere in front of the player
  zombie.spawn(world, { x: 4, y: 3, z: -6 }, Quaternion.fromEuler(0, 180, 0)); // rotate 180 degrees around Y, facing the player spawn point.

  // Enter /pathfind to make the zombie pathfind to the player
  let pathfindMarkers: Entity[] = [];
  world.chatManager.registerCommand('/pathfind', (player, args) => {
    // Remove all existing pathfind markers, which we use in the example just to visualize the path taken.
    pathfindMarkers.forEach(marker => marker.despawn());
    pathfindMarkers = [];
    
    // Define fixed target coordinates
    const targetPosition = { x: -4, y: 1, z: 10 };
    
    // Calculate approximate distance to target for setting appropriate iteration limit
    const startPos = zombie.position;
    const approxDistance = Math.abs(targetPosition.x - startPos.x) + 
                         Math.abs(targetPosition.y - startPos.y) + 
                         Math.abs(targetPosition.z - startPos.z);
    const requiredIterations = Math.max(1000, approxDistance * 50); // Scale with distance
    
    // Pathfind the zombie to the fixed coordinates
    const pathfindingController = zombie.controller as PathfindingEntityController;

    // .pathfind() is synchronous and returns immediately soon as a path is found or not, but before the entity has reached the target.
    const succeeded = pathfindingController.pathfind(targetPosition, 3, { // all possible options for example
      debug: true, // Setting true will console log pathfinding result info
      maxFall: 5, // The maximum fall distance (in blocks) the entity can fall when considering a path.
      maxJump: 2,  // The maximum height (in blocks) the entity will jump when considering a path
      maxOpenSetIterations: requiredIterations, // Dynamically set based on distance
      verticalPenalty: -1, // A behavior control. The more negative the value, the more the entity will prefer taking a route that requires jumping and falling, even going out of its way to do so. A more positive value will prefer avoiding jumps and falls unless absolutely necessary.
      pathfindAbortCallback: () => { // Invoked when maxOpenSetIterations is reached and pathfinding aborts.
        console.log('Pathfinding aborted');
      },
      pathfindCompleteCallback: () => { // Invoked when the entity associated with the PathfindingEntityController finishes pathfinding and is now at the target coordinate.
        console.log('Pathfinding complete');
      },
      waypointMoveCompleteCallback: () => { // Invoked when the entity associated with the PathfindingEntityController finishes moving to a calculate waypoint of its current path.
        console.log('Waypoint reached');
      },
      waypointMoveSkippedCallback: () => { // Invoked when the entity associated with the PathfindingEntityController skips a waypoint because it exceeded the waypointTimeoutMs.
        console.log('Waypoint skipped');
      },
      waypointTimeoutMs: 2000, // The timeout in milliseconds for a waypoint to be considered reached. Defaults to 2000ms divided by the speed of the entity.
    });

    // .pathfind() will return true if the algorithm found a path and began traversing it.
    console.log(`Path found successfully?: ${succeeded}`);

    // Spawn visual markers for the path
    pathfindingController.waypoints.forEach(waypoint => {
      const pathfindMarker = new Entity({
        modelUri: 'models/items/cookie.gltf',
        rigidBodyOptions: {
          type: RigidBodyType.FIXED,
          colliders: [
            {
              shape: ColliderShape.BLOCK,
              halfExtents: { x: 0.5, y: 0.5, z: 0.5 },
              isSensor: true,
            },
          ],
        },
      });
  
      pathfindMarker.spawn(world, waypoint);
      
      pathfindMarkers.push(pathfindMarker);
    });
  });

  // Spawn a player entity when a player joins the game.
  world.on(PlayerEvent.JOINED_WORLD, ({ player }) => {
    const playerEntity = new DefaultPlayerEntity({
      player,
      name: 'Player',
    });

    world.chatManager.sendPlayerMessage(player, 'To make the zombie pathfind to you, enter: /pathfind', '00FF00');

    playerEntity.spawn(world, { x: 4, y: 3, z: 1 });
  });

  // Despawn all player entities when a player leaves the game.
  world.on(PlayerEvent.LEFT_WORLD, ({ player }) => {
    world.entityManager.getPlayerEntitiesByPlayer(player).forEach(entity => entity.despawn());
  });
});
