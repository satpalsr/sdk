import { Audio, Collider, ColliderShape, CollisionGroup, GameServer } from 'hytopia';
import PurchaseBarrierEntity from './PurchaseBarrierEntity';
import { INVISIBLE_WALLS, INVISIBLE_WALL_COLLISION_GROUP, PURCHASE_BARRIERS, ENEMY_SPAWN_POINTS, WEAPON_CRATES } from '../gameConfig';
import type { World, Vector3Like } from 'hytopia';

// temp
import ZombieEntity from './enemies/ZombieEntity';
import WeaponCrateEntity from './WeaponCrateEntity';

const GAME_WAVE_INTERVAL_MS = 30 * 1000; // 30 seconds between waves
const SLOWEST_SPAWN_INTERVAL_MS = 4000; // Starting spawn rate
const FASTEST_SPAWN_INTERVAL_MS = 500; // Fastest spawn rate
const WAVE_SPAWN_INTERVAL_REDUCTION_MS = 250; // Spawn rate reduction per wave

export default class GameManager {
  public static readonly instance = new GameManager();

  public waveNumber = 0;
  public unlockedIds: Set<string> = new Set([ 'start' ]);
  public world: World | undefined;

  private _enemySpawnTimeout: NodeJS.Timeout | undefined;
  private _startTime: number | undefined;
  private _waveTimeout: NodeJS.Timeout | undefined;
  private _waveStartAudio: Audio;

  public constructor() {
    this._waveStartAudio = new Audio({
      uri: 'audio/sfx/wave-start.mp3',
      loop: false,
      volume: 1,
    });
  }

  public addUnlockedId(id: string) {
    this.unlockedIds.add(id);
  }

  public setupGame(world: World) {
    this.world = world;

    // Setup invisible walls that only enemies can pass through
    // INVISIBLE_WALLS.forEach(wall => {
    //   const wallCollider = new Collider({
    //     shape: ColliderShape.BLOCK,
    //     halfExtents: wall.halfExtents,
    //     relativePosition: wall.position, // since this is not attached to a rigid body, relative position is relative to the world global coordinate space.
    //     collisionGroups: {
    //       belongsTo: [ INVISIBLE_WALL_COLLISION_GROUP ],
    //       collidesWith: [ CollisionGroup.PLAYER ],
    //     },
    //   });

    //   wallCollider.addToSimulation(world.simulation);
    // });

    // // Setup purchase barriers
    // PURCHASE_BARRIERS.forEach(barrier => {
    //   const purchaseBarrier = new PurchaseBarrierEntity({
    //     name: barrier.name,
    //     removalPrice: barrier.removalPrice,
    //     unlockIds: barrier.unlockIds,
    //     width: barrier.width,
    //   });

    //   purchaseBarrier.spawn(world, barrier.position, barrier.rotation);
    // });

    // Setup weapon crates
    WEAPON_CRATES.forEach(crate => {
      const weaponCrate = new WeaponCrateEntity({
        name: crate.name,
        purchasePrice: crate.purchasePrice,
        tintColor: crate.tintColor,
      });

      weaponCrate.spawn(world, crate.position, crate.rotation);
    });

    world.chatManager.registerCommand('/start', () => this.startGame());
  }

  public startGame() {
    if (!this.world) return; // type guard

    const playerCount = this.world.entityManager.getAllPlayerEntities().length;

    this._startTime = Date.now();

    GameServer.instance.playerManager.getConnectedPlayersByWorld(this.world).forEach(player => {
      player.ui.sendData({
        type: 'start',
        playerCount,
      });
    });

    this._spawnLoop();
    this._waveLoop();
  }

  private _spawnLoop() {
    if (!this.world) return; // type guard

    clearTimeout(this._enemySpawnTimeout);

    const spawnPoints: Vector3Like[] = [];

    this.unlockedIds.forEach(id => {
      const spawnPoint = ENEMY_SPAWN_POINTS[id];
      if (spawnPoint) spawnPoints.push(...spawnPoint);
    });

    const spawnPoint = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
    const zombie = new ZombieEntity({
      speed: Math.min(6, 2 + this.waveNumber * 0.5), // max speed of 6
    });

    zombie.spawn(this.world, spawnPoint);

    const nextSpawn = Math.max(FASTEST_SPAWN_INTERVAL_MS, SLOWEST_SPAWN_INTERVAL_MS - (this.waveNumber * WAVE_SPAWN_INTERVAL_REDUCTION_MS));

    this._enemySpawnTimeout = setTimeout(() => this._spawnLoop(), nextSpawn);
  }

  private _waveLoop() {
    if (!this.world) return; // type guard

    clearTimeout(this._waveTimeout);

    this.waveNumber++;

    this._waveStartAudio.play(this.world, true);

    GameServer.instance.playerManager.getConnectedPlayersByWorld(this.world).forEach(player => {
      player.ui.sendData({
        type: 'wave',
        wave: this.waveNumber,
      });
    });

    // Spawn a few zombies to start the wave
    for (let i = 0; i < Math.min(12, this.waveNumber * 2); i++) {
      this._spawnLoop();
    }

    this._waveTimeout = setTimeout(() => this._waveLoop(), GAME_WAVE_INTERVAL_MS);
  }
}
