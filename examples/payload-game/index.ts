/**
 * 
 */

import {
  Audio,
  BlockType,
  ColliderShape,
  CollisionGroup,
  DefaultCharacterController,
  Entity,
  GameServer,
  PlayerEntity,
  RigidBodyType,
  World,
  startServer,
} from 'hytopia';

import type {
  PlayerInputState,
  PlayerOrientationState,
  Rotation,
  Vector3,
} from 'hytopia';

import map from './assets/map.json';

// Constants
const BULLET_SPEED = 50;

const PATHFIND_ACCUMULATOR_THRESHOLD = 60;
const PAYLOAD_SPAWN_COORDINATE = { x: 1.5, y: 2.6, z: 69.5 };
const PAYLOAD_PER_PLAYER_SPEED = 1;
const PAYLOAD_MAX_SPEED = 5;
const PAYLOAD_WAYPOINT_COORDINATES = [
  { x: 1.5, z: 1.5 },
  { x: 60.5, z: 1.5 },
  { x: 60.5, z: -62.5 },
];
const PLAYER_SPAWN_COORDINATES = [
  { x: 4, y: 3, z: 71 },
  { x: -2, y: 3, z: 68 },
  { x: 0, y: 3, z: 66 },
  { x: 3, y: 3, z: 66 },
  { x: 5, y: 3, z: 68 },
];
const PAYLOAD_WAYPOINT_ENEMY_SPAWNS = [
  [
    { x: -16, y: 2, z: 1 },
    { x: 9, y: 2, z: -18 },
  ],
  [
    { x: 61, y: 2, z: 19 },
    { x: 75, y: 2, z: -7 },
  ],
  [
    { x: 44, y: 2, z: -62 },
    { x: 60, y: 2, z: -76 },
    { x: 76, y: 2, z: -76 },
  ],
];

// Simple game state tracking via globals.
const enemyHealth: Record<number, number> = {}; // Entity id -> health
const enemyPathfindAccumulators: Record<number, number> = {}; // Entity id -> accumulator, so we don't pathfind each tick
const enemyPathfindingTargets: Record<number, Vector3> = {}; // Entity id -> target coordinate
const playerEntityHealth: Record<number, number> = {}; // Player entity id -> health
let started = false; // Game started flag
let payloadEntity: Entity | null = null; // Payload entity
let payloadPlayerEntityCount = 0; // Number of player entities within the payload sensor, minus number of enemies
let playerCount = 0; // Number of players in the game
let targetWaypointCoordinateIndex = 0; // Current waypoint coordinate index for the payload

// Run
startServer(world => { // Perform our game setup logic in the startServer init callback here.
  const chatManager = world.chatManager;

  // Enable local ssl, so we can connect to https://localhost:8080 from play.hytopia.com for testing
  // If using NGROK or a reverse proxy that handles SSL, you need to comment this out to be able to
  // connect to the server from the client using the reverse proxy URL.
  GameServer.instance.webServer.enableLocalSSL();

  // Load Map
  world.loadMap(map);

  // Setup Player Join & Spawn Controlled Entity
  world.onPlayerJoin = player => {
    const playerEntity = new PlayerEntity({ // Create an entity our newly joined player controls
      player,
      name: 'Player',
      modelUri: 'models/player-with-gun.gltf',
      modelLoopedAnimations: [ 'idle' ],
      modelScale: 0.5,
    });

    // Spawn the player entity at a random coordinate
    const randomSpawnCoordinate = PLAYER_SPAWN_COORDINATES[Math.floor(Math.random() * PLAYER_SPAWN_COORDINATES.length)];
    playerEntity.spawn(world, randomSpawnCoordinate);

    // We need to do some custom logic for player inputs, so let's assign custom onTick handler to the default player controller.
    playerEntity.characterController!.onTickPlayerMovement = onTickPlayerMovement;

    // Set custom collision groups for the player entity, this is so we can reference the PLAYER collision group
    // specifically in enemy collision sensors.
    playerEntity.setCollisionGroupsForSolidColliders({
      belongsTo: [ CollisionGroup.ENTITY, CollisionGroup.PLAYER ],
      collidesWith: [ CollisionGroup.ALL ],
    });

    // Initialize player health
    playerEntityHealth[playerEntity.id!] = 20;

    // Increment player count
    playerCount++;

    // Send a message to all players informing them that a new player has joined
    chatManager.sendBroadcastMessage(`Player ${player.username} has joined the game!`, 'FFFFFF');

    // If the game hasn't started yet, send a message to all players to start the game
    if (!started) {
      chatManager.sendBroadcastMessage('Enter command /start to start the game!', 'FFFFFF');
    }
  };

  // Setup Player Leave & Despawn Controlled Entity
  world.onPlayerLeave = player => {
    // Despawn all player entities for the player that left
    // We apply a translation prior to despawn because of a bug in the RAPIER
    // physics engine we use where entities despawned to not trigger a collision
    // event for leaving a sensor. This is a workaround till a better solution is found.
    world.entityManager.getAllPlayerEntities(player).forEach(entity => {
      entity.setTranslation({ x: 0, y: 100, z: 0 });
      setTimeout(() => entity.despawn(), 50); // Despawn after a short delay so we step the physics after translating it so leaving the sensor registers.
    });

    playerCount--;

    chatManager.sendBroadcastMessage(`Player ${player.username} has left the game!`, 'FFFFFF');
  };

  // Spawn Payload
  spawnPayloadEntity(world);

  // Start spawning enemies
  startEnemySpawnLoop(world);

  // Game Commands
  chatManager.registerCommand('/start', () => {
    chatManager.sendBroadcastMessage('Game started!');
    started = true;
  });

  chatManager.registerCommand('/stop', () => {
    chatManager.sendBroadcastMessage('Game stopped!');
    started = false;
  });

  // Start ambient music for all players
  (new Audio({
    uri: 'audio/music/game.mp3',
    loop: true,
    volume: 0.2,
  })).play(world);
});

// Helper Functions
function startEnemySpawnLoop(world: World) {
  let spawnInterval;

  const spawn = () => { // Simple spawn loop that spawns enemies relative to the payload's current waypoint
    const possibleSpawnCoordinate = PAYLOAD_WAYPOINT_ENEMY_SPAWNS[targetWaypointCoordinateIndex];
    
    if (!possibleSpawnCoordinate) {
      return console.warn('No possible spawn coordinate found!');
    }

    if (started) {
      for (let i = 0; i < playerCount; i++) {
        spawnSpider(world, possibleSpawnCoordinate[Math.floor(Math.random() * possibleSpawnCoordinate.length)]);
      }
    }

    spawnInterval = 3500 - targetWaypointCoordinateIndex * 1000;

    setTimeout(spawn, spawnInterval);
  };

  spawn();
}

function spawnBullet(world: World, coordinate: Vector3, direction: Vector3) {
  // Spawn a bullet when the player shoots.
  const bullet = new Entity({
    name: 'Bullet',
    modelUri: 'models/bullet.gltf',
    modelScale: 0.3,
    rigidBodyOptions: {
      type: RigidBodyType.KINEMATIC_VELOCITY, // Kinematic means entity's rigid body will not be affected by physics. KINEMATIC_VELOCITY means the entity is moved by setting velocity.
      linearVelocity: {
        x: direction.x * BULLET_SPEED,
        y: direction.y * BULLET_SPEED,
        z: direction.z * BULLET_SPEED,
      },
      rotation: getRotationFromDirection(direction), // Get the rotation from the direction vector so it's facing the right way we shot it
      colliders: [
        {
          shape: ColliderShape.BALL,
          radius: 0.1,
          isSensor: true,
          collisionGroups: {
            belongsTo: [ CollisionGroup.ENTITY_SENSOR ],
            collidesWith: [ CollisionGroup.ENTITY, CollisionGroup.BLOCK ],
          },
        },
      ],
    },
  });

  bullet.onBlockCollision = (block: BlockType, started: boolean) => { // If the bullet hits a block, despawn it
    if (started) {
      bullet.despawn();
    }
  };

  bullet.onEntityCollision = (entity: Entity, started: boolean) => { // If the bullet hits an enemy, deal damage if it is a Spider
    if (!started || entity.name !== 'Spider') {
      return;
    }
    
    enemyHealth[entity.id!]--;

    // Apply knockback, the knockback effect is less if the spider is larger, and more if it is smaller
    // because of how the physics simulation applies forces relative to automatically calculated mass from the spider's
    // size
    const bulletDirection = bullet.getDirectionFromRotation();
    const mass = entity.getMass();
    const knockback = 14 * mass;

    entity.applyImpulse({
      x: -bulletDirection.x * knockback,
      y: 0,
      z: -bulletDirection.z * knockback,
    });

    if (enemyHealth[entity.id!] <= 0) {
      // YEET the spider before despawning it so it registers leaving the sensor
      entity.setTranslation({ x: 0, y: 100, z: 0 });
      setTimeout(() => { entity.despawn(); }, 50); // Despawn after a short delay so we step the physics after translating it so leaving the sensor registers.
    }

    bullet.despawn();
  };

  bullet.spawn(world, coordinate);

  // Play a bullet noise that follows the bullet spatially
  (new Audio({
    uri: 'audio/sfx/shoot.mp3',
    playbackRate: 2,
    volume: 1,
    attachedToEntity: bullet,
    referenceDistance: 20,
  })).play(world);

  return bullet;
}

function spawnPayloadEntity(world: World) {
  if (payloadEntity) {
    return console.warn('Payload entity already exists!');
  }

  payloadEntity = new Entity({
    name: 'Payload',
    modelUri: 'models/payload.gltf',
    modelScale: 0.7,
    modelLoopedAnimations: [ 'idle' ],
    rigidBodyOptions: {
      type: RigidBodyType.KINEMATIC_VELOCITY,
      colliders: [
        {
          shape: ColliderShape.BLOCK,
          halfExtents: { x: 0.9, y: 1.6, z: 2.5 }, // Note: We manually set the collider size, the SDK currently does not support automatic sizing of colliders to a model.
          collisionGroups: {
            belongsTo: [ CollisionGroup.ALL ],
            collidesWith: [ CollisionGroup.ENTITY, CollisionGroup.ENTITY_SENSOR, CollisionGroup.PLAYER ],
          },
        },
        {
          shape: ColliderShape.BLOCK, // Create a proximity sensor for movement when players are near.
          halfExtents: { x: 3.75, y: 2, z: 6 },
          isSensor: true,
          collisionGroups: {
            belongsTo: [ CollisionGroup.ENTITY_SENSOR ],
            collidesWith: [ CollisionGroup.PLAYER, CollisionGroup.ENTITY ],
          },
          // We use a onCollision handler specific to this sensor, and 
          // not the whole entity, so we can track the number of players in the payload sensor.
          onCollision: (other: BlockType | Entity, started: boolean) => { 
            if (other instanceof PlayerEntity) {
              started ? payloadPlayerEntityCount++ : payloadPlayerEntityCount--;
            } else if (other instanceof Entity) {
              started ? payloadPlayerEntityCount-- : payloadPlayerEntityCount++;
            }
          },
        },
      ],
    },
  });

  payloadEntity.onTick = onTickPathfindPayload; // Use our own basic pathfinding function each tick of the game for the payload.
  payloadEntity.spawn(world, PAYLOAD_SPAWN_COORDINATE); // Spawn the payload at the designated spawn coordinate

  (new Audio({ // Play a looped idle sound that follows the payload spatially
    uri: 'audio/sfx/payload-idle.mp3',
    loop: true,
    attachedToEntity: payloadEntity,
    volume: 0.25,
    referenceDistance: 5, // Reference distance affects how loud the audio is relative to a player's proximity to the entity
  })).play(world);
} 

function spawnSpider(world: World, coordinate: Vector3) {
  const baseScale = 0.5;
  const baseSpeed = 3;
  const randomScaleMultiplier = Math.random() * 2 + 1; // Random value between 1 and 3 // Random scale multiplier to make each spider a different size
  const targetPlayers = new Set<PlayerEntity>();

  const spider = new Entity({
    name: 'Spider',
    modelUri: 'models/spider.gltf',
    modelLoopedAnimations: [ 'walk' ],
    modelScale: baseScale * randomScaleMultiplier,
    rigidBodyOptions: {
      type: RigidBodyType.DYNAMIC,
      enabledRotations: { x: false, y: true, z: false },
      colliders: [
        {
          shape: ColliderShape.ROUND_CYLINDER,
          borderRadius: 0.1 * randomScaleMultiplier,
          halfHeight: 0.225 * randomScaleMultiplier,
          radius: 0.5 * randomScaleMultiplier,
          tag: 'body', // Note we use tags here, they don't really serve a purpose in this example other than showing that they can be used.
          collisionGroups: {
            belongsTo: [ CollisionGroup.ENTITY ],
            collidesWith: [ CollisionGroup.BLOCK, CollisionGroup.ENTITY_SENSOR, CollisionGroup.PLAYER ],
          },
        },
        {
          shape: ColliderShape.CYLINDER,
          radius: 20,
          halfHeight: 1,
          isSensor: true,
          tag: 'aggro-sensor', // unecessary but for clarity
          collisionGroups: {
            belongsTo: [ CollisionGroup.ENTITY_SENSOR ],
            collidesWith: [ CollisionGroup.PLAYER ],
          },
          onCollision: (other: BlockType | Entity, started: boolean) => { // If a player enters or exits the aggro sensor, add or remove them from the target players set
            if (other instanceof PlayerEntity) {
              started ? targetPlayers.add(other) : targetPlayers.delete(other);
            }
          },
        },
      ],
    },
  });

  spider.onTick = (tickDeltaMs: number) => onTickPathfindEnemy( // Use our own basic pathfinding function each tick of the game for the enemy
    spider,
    targetPlayers,
    baseSpeed * randomScaleMultiplier,
    tickDeltaMs,
  );

  spider.onEntityCollision = (entity: Entity, started: boolean) => { // If the spider hits a player, deal damage and apply knockback
    if (started && entity instanceof PlayerEntity && entity.isSpawned) {
      const spiderDirection = spider.getDirectionFromRotation();
      const knockback = 4 * randomScaleMultiplier;

      entity.applyImpulse({
        x: -spiderDirection.x * knockback,
        y: 4,
        z: -spiderDirection.z * knockback,
      });

      (new Audio({
        uri: 'audio/sfx/damage.wav',
        volume: 0.2,
        attachedToEntity: spider,
        referenceDistance: 8,
      })).play(world);

      damagePlayer(entity);
    }
  };

  spider.spawn(world, coordinate);

  // Give the spider a health value relative to its size, bigger = more health
  enemyHealth[spider.id!] = 2 * Math.round(randomScaleMultiplier);
}

function onTickPathfindPayload(this: Entity, tickDeltaMs: number) { // Movement logic for the payload
  const speed = started // Set the payload speed relative to the number of players in the payload sensor
    ? Math.max(Math.min(PAYLOAD_PER_PLAYER_SPEED * payloadPlayerEntityCount, PAYLOAD_MAX_SPEED), 0)
    : 0;

  if (!speed) { // Play animations based on if its moving or not
    this.stopModelAnimations(Array.from(this.modelLoopedAnimations).filter(v => v !== 'idle'));
    this.startModelLoopedAnimations([ 'idle' ]);
  } else {
    this.stopModelAnimations(Array.from(this.modelLoopedAnimations).filter(v => v !== 'walk'));
    this.startModelLoopedAnimations([ 'walk' ]);
  }

  // Calculate direction to target waypoint
  const targetWaypointCoordinate = PAYLOAD_WAYPOINT_COORDINATES[targetWaypointCoordinateIndex];
  const currentPosition = this.getTranslation();
  const deltaX = targetWaypointCoordinate.x - currentPosition.x;
  const deltaZ = targetWaypointCoordinate.z - currentPosition.z;

  const direction = {
    x: Math.abs(deltaX) > 0.1 ? Math.sign(deltaX) : 0,
    z: Math.abs(deltaZ) > 0.1 ? Math.sign(deltaZ) : 0,
  };

  // Apply rotation to face direction if necessary based on the current target waypoint
  const rotation = this.getRotation();
  const currentAngle = 2 * Math.atan2(rotation.y, rotation.w);
  const targetAngle = Math.atan2(direction.x, direction.z) + Math.PI; // Add PI to face forward

  let angleDiff = targetAngle - currentAngle;
  while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
  while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

  if (Math.abs(angleDiff) > 0.01) {
    const rotationStep = (Math.PI / 2) * (tickDeltaMs / 1000) * Math.sign(angleDiff);
    const actualRotation = Math.abs(rotationStep) > Math.abs(angleDiff) ? angleDiff : rotationStep;
    const newAngle = currentAngle + actualRotation;

    this.setRotation({
      x: 0,
      y: Math.sin(newAngle / 2),
      z: 0,
      w: Math.cos(newAngle / 2),
    });
  }

  // Apply velocity to move towards target
  this.setLinearVelocity({
    x: direction.x * speed,
    y: 0,
    z: direction.z * speed,
  });

  // Check if we're within 3 blocks of the target waypoint, if so move to next waypoint
  const distanceX = Math.abs(currentPosition.x - targetWaypointCoordinate.x);
  const distanceZ = Math.abs(currentPosition.z - targetWaypointCoordinate.z);
  
  if (distanceX <= 2 && distanceZ <= 2) {
    if (targetWaypointCoordinateIndex + 1 < PAYLOAD_WAYPOINT_COORDINATES.length) {
      targetWaypointCoordinateIndex++;
    } else {
      console.log('GAME WON!');
    }
  }
}

function onTickPathfindEnemy(entity: Entity, targetPlayers: Set<PlayerEntity>, speed: number, _tickDeltaMs: number) {
  if (!entity.isSpawned || !payloadEntity) return;
  
  const entityId = entity.id!;
  enemyPathfindAccumulators[entityId] ??= 0; // Initialize the accumulator for this enemy if it isn't initialized yet

  // Handle pathfinding
  if (!enemyPathfindingTargets[entityId] || enemyPathfindAccumulators[entityId] >= PATHFIND_ACCUMULATOR_THRESHOLD) {
    const targetPlayer = targetPlayers.values().next().value as PlayerEntity | undefined;

    enemyPathfindingTargets[entityId] = targetPlayer?.isSpawned
      ? targetPlayer.getTranslation()
      : payloadEntity.getTranslation();

    enemyPathfindAccumulators[entityId] -= PATHFIND_ACCUMULATOR_THRESHOLD;

    const currentPosition = entity.getTranslation();
    const dx = enemyPathfindingTargets[entityId].x - currentPosition.x;
    const dz = enemyPathfindingTargets[entityId].z - currentPosition.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    
    if (distance < 10) {
      const mass = entity.getMass();
      entity.applyImpulse({ x: 0, y: (10 * Math.random() + 5) * mass, z: 0 });
    }
  }

  enemyPathfindAccumulators[entityId]++;

  // Handle movement to target
  const currentPosition = entity.getTranslation();
  const targetPosition = enemyPathfindingTargets[entityId];
  const direction = {
    x: targetPosition.x - currentPosition.x,
    y: 0, // We only want rotation around Y axis, so ignore vertical difference
    z: targetPosition.z - currentPosition.z,
  };

  // Normalize the direction vector
  const length = Math.sqrt(direction.x * direction.x + direction.z * direction.z);
  if (length > 0) {
    direction.x /= length;
    direction.z /= length;
  }

  // Calculate facing rotation
  const angle = Math.atan2(direction.x, direction.z);
  const adjustedAngle = angle + Math.PI;
  const sinHalfAngle = Math.sin(adjustedAngle * 0.5);
  const cosHalfAngle = Math.cos(adjustedAngle * 0.5);

  entity.setRotation({ x: 0, y: sinHalfAngle, z: 0, w: cosHalfAngle });

  // Calculate movement
  const currentVelocity = entity.getLinearVelocity();

  if (Math.abs(currentVelocity.x) < speed && Math.abs(currentVelocity.z) < speed) {
    const movement = {
      x: direction.x * speed,
      y: currentVelocity.y,
      z: direction.z * speed,
    };

    entity.setLinearVelocity(movement);
  }
}

function onTickPlayerMovement(this: DefaultCharacterController, inputState: PlayerInputState, orientationState: PlayerOrientationState, _deltaTimeMs: number) {
  if (!this.entity.world) return;

  if (inputState.ml) {
    const world = this.entity.world;
    const entity = this.entity;
    const direction = getDirectionFromOrientation(orientationState);

    this.entity.startModelOneshotAnimations([ 'shoot' ]);

    const bullet = spawnBullet(world, entity.getTranslation(), direction);
    setTimeout(() => bullet.isSpawned && bullet.despawn(), 2000);
  }
}

function damagePlayer(playerEntity: PlayerEntity) {
  const chatManager = playerEntity.world!.chatManager;
  
  playerEntityHealth[playerEntity.id!]--;

  chatManager.sendPlayerMessage(
    playerEntity.player, 
    `You have been hit! You have ${playerEntityHealth[playerEntity.id!]} health remaining.`, 
    'FF0000',
  );

  if (playerEntityHealth[playerEntity.id!] <= 0) {
    chatManager.sendPlayerMessage( // Alert the player they've been damaged, since we don't have UI support yet, we just use chat
      playerEntity.player,
      'You have died!',
      'FF0000',
    );

    playerEntity.despawn();
  }
}

function getDirectionFromOrientation(orientationState: PlayerOrientationState): Vector3 {
  const { yaw, pitch } = orientationState;
  const cosPitch = Math.cos(pitch);
  
  return {
    x: -Math.sin(yaw) * cosPitch,
    y: Math.sin(pitch),
    z: -Math.cos(yaw) * cosPitch,
  };
}

function getRotationFromDirection(direction: Vector3): Rotation {
  // Calculate yaw (rotation around Y-axis)
  const yaw = Math.atan2(-direction.x, -direction.z);
  
  // Calculate pitch (rotation around X-axis)
  const pitch = Math.asin(direction.y);

  // Pre-calculate common terms
  const halfYaw = yaw * 0.5;
  const halfPitch = pitch * 0.5;
  const cosHalfYaw = Math.cos(halfYaw);
  const sinHalfYaw = Math.sin(halfYaw);
  const cosHalfPitch = Math.cos(halfPitch);
  const sinHalfPitch = Math.sin(halfPitch);

  // Convert to quaternion
  return {
    x: sinHalfPitch * cosHalfYaw,
    y: sinHalfYaw * cosHalfPitch,
    z: sinHalfYaw * sinHalfPitch,
    w: cosHalfPitch * cosHalfYaw,
  };
}
