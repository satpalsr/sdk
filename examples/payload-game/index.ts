import {
  Audio,
  BlockType,
  ColliderShape,
  CollisionGroup,
  DefaultCharacterController,
  Entity,
  EventRouter,
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

import worldJson from './assets/map.json';

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

// Globals, yuck
const enemyHealth: Record<number, number> = {};
const enemyPathfindAccumulators: Record<number, number> = {};
const enemyPathfindingTargets: Record<number, Vector3> = {};
const playerEntityHealth: Record<number, number> = {};
let started = false;
let payloadEntity: Entity | null = null;
let payloadPlayerEntityCount = 0;
let playerCount = 0;
let targetWaypointCoordinateIndex = 0;

// Configure Global Event Router
EventRouter.serverInstance.logIgnoreEvents = [ 'CONNECTION.PACKET_SENT' ];
EventRouter.serverInstance.logIgnoreEventPrefixes = [ 'CONNECTION.PACKET_SENT:' ];
EventRouter.serverInstance.logAllEvents = false;

// Run
void startServer(world => {
  const chatManager = world.chatManager;

  // Enable local ssl
  GameServer.instance.webServer.enableLocalSSL();

  // Load Map
  world.loadMap(worldJson);

  // Setup Player Join & Spawn Controlled Entity
  world.onPlayerJoin = player => {
    const playerEntity = new PlayerEntity({
      player,
      name: 'Player',
      modelUri: 'models/player-with-gun.gltf',
      modelLoopedAnimations: [ 'idle' ],
      modelScale: 0.5,
    });

    const randomSpawnCoordinate = PLAYER_SPAWN_COORDINATES[Math.floor(Math.random() * PLAYER_SPAWN_COORDINATES.length)];
    playerEntity.spawn(world, randomSpawnCoordinate);

    playerEntity.characterController!.onTickPlayerMovement = onTickPlayerMovement;

    playerEntity.setCollisionGroupsForSolidColliders({
      belongsTo: [ CollisionGroup.ENTITY, CollisionGroup.PLAYER ],
      collidesWith: [ CollisionGroup.ALL ],
    });

    playerEntityHealth[playerEntity.id!] = 20;
    playerCount++;

    chatManager.sendBroadcastMessage(`Player ${player.username} has joined the game!`, 'FFFFFF');

    if (!started) {
      chatManager.sendBroadcastMessage('Enter command /start to start the game!', 'FFFFFF');
    }
  };

  // Setup Player Leave & Despawn Controlled Entity
  world.onPlayerLeave = player => {
    world.entityManager.getAllPlayerEntities(player).forEach(entity => {
      entity.setTranslation({ x: 0, y: 100, z: 0 });
      setTimeout(() => entity.despawn(), 50);
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

  // Start Ambient Music
  (new Audio({
    uri: 'audio/music/game.mp3',
    loop: true,
    volume: 0.2,
  })).play(world);
});

// Helper Functions
function startEnemySpawnLoop(world: World) {
  let spawnInterval;

  const spawn = () => {
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
  const bullet = new Entity({
    name: 'Bullet',
    modelUri: 'models/bullet.gltf',
    modelScale: 0.3,
    rigidBodyOptions: {
      type: RigidBodyType.KINEMATIC_VELOCITY,
      linearVelocity: {
        x: direction.x * BULLET_SPEED,
        y: direction.y * BULLET_SPEED,
        z: direction.z * BULLET_SPEED,
      },
      rotation: getRotationFromDirection(direction),
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

  bullet.onBlockCollision = (block: BlockType, started: boolean) => {
    if (started) {
      bullet.despawn();
    }
  };

  bullet.onEntityCollision = (entity: Entity, started: boolean) => {
    if (!started || ![ 'Spider', 'Zombie' ].includes(entity.name)) {
      return;
    }
    
    enemyHealth[entity.id!]--;

    const bulletDirection = bullet.getDirectionFromRotation();
    const mass = entity.getMass();
    const knockback = 14 * mass;

    entity.applyImpulse({
      x: -bulletDirection.x * knockback,
      y: 0,
      z: -bulletDirection.z * knockback,
    });

    if (enemyHealth[entity.id!] <= 0) {
      // have to YEET the spider to register it leaving the sensor
      entity.setTranslation({ x: 0, y: 100, z: 0 });
      setTimeout(() => { entity.despawn(); }, 50);
    }

    bullet.despawn();
  };

  bullet.spawn(world, coordinate);

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
          halfExtents: { x: 0.9, y: 1.6, z: 2.5 },
          collisionGroups: {
            belongsTo: [ CollisionGroup.ALL ],
            collidesWith: [ CollisionGroup.ENTITY, CollisionGroup.ENTITY_SENSOR, CollisionGroup.PLAYER ],
          },
        },
        {
          shape: ColliderShape.BLOCK,
          halfExtents: { x: 3.75, y: 2, z: 6 },
          isSensor: true,
          collisionGroups: {
            belongsTo: [ CollisionGroup.ENTITY_SENSOR ],
            collidesWith: [ CollisionGroup.PLAYER, CollisionGroup.ENTITY ],
          },
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

  payloadEntity.onTick = onTickPathfindPayload;
  payloadEntity.spawn(world, PAYLOAD_SPAWN_COORDINATE);

  (new Audio({
    uri: 'audio/sfx/payload-idle.mp3',
    loop: true,
    attachedToEntity: payloadEntity,
    volume: 0.25,
    referenceDistance: 5,
  })).play(world);
} 

function spawnSpider(world: World, coordinate: Vector3) {
  const baseScale = 0.5;
  const baseSpeed = 3;
  const randomScaleMultiplier = Math.random() * 2 + 1; // Random value between 1 and 3

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
          tag: 'body',
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
          onCollision: (other: BlockType | Entity, started: boolean) => {
            if (other instanceof PlayerEntity) {
              started ? targetPlayers.add(other) : targetPlayers.delete(other);
            }
          },
        },
      ],
    },
  });

  const targetPlayers = new Set<PlayerEntity>();

  spider.onTick = (tickDeltaMs: number) => onTickPathfindEnemy(
    spider,
    targetPlayers,
    baseSpeed * randomScaleMultiplier,
    tickDeltaMs,
  );

  spider.onEntityCollision = (entity: Entity, started: boolean) => {
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

  enemyHealth[spider.id!] = 2 * Math.round(randomScaleMultiplier);
}

function onTickPathfindPayload(this: Entity, tickDeltaMs: number) {
  const speed = started
    ? Math.max(Math.min(PAYLOAD_PER_PLAYER_SPEED * payloadPlayerEntityCount, PAYLOAD_MAX_SPEED), 0)
    : 0;

  if (!speed) {
    this.stopModelAnimations(Array.from(this.modelLoopedAnimations).filter(v => v !== 'idle'));
    this.startModelLoopedAnimations([ 'idle' ]);
  } else {
    this.stopModelAnimations(Array.from(this.modelLoopedAnimations).filter(v => v !== 'walk'));
    this.startModelLoopedAnimations([ 'walk' ]);
  }

  // Calculate direction to target
  const targetWaypointCoordinate = PAYLOAD_WAYPOINT_COORDINATES[targetWaypointCoordinateIndex];
  const currentPosition = this.getTranslation();
  const deltaX = targetWaypointCoordinate.x - currentPosition.x;
  const deltaZ = targetWaypointCoordinate.z - currentPosition.z;

  const direction = {
    x: Math.abs(deltaX) > 0.1 ? Math.sign(deltaX) : 0,
    z: Math.abs(deltaZ) > 0.1 ? Math.sign(deltaZ) : 0,
  };

  // Apply rotation to face direction if necessary
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
  enemyPathfindAccumulators[entityId] ??= 0;

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
    chatManager.sendPlayerMessage(
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
