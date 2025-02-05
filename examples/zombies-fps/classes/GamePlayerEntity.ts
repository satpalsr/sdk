import { 
  Audio,
  CollisionGroup,
  Player,
  PlayerCameraOrientation,
  PlayerEntity,
  PlayerCameraMode,
  PlayerInput,
  Vector3Like,
  QuaternionLike,
  World,
  Quaternion,
  PlayerEntityController,
} from 'hytopia';

import PistolEntity from './guns/PistolEntity';
import type GunEntity from './GunEntity';

const BASE_HEALTH = 100;
const BASE_MONEY = 10;

export default class GamePlayerEntity extends PlayerEntity {
  public health: number;
  public maxHealth: number;
  public money: number;
  private _damageAudio: Audio;
  private _gun: GunEntity | null = null;

  // Player entities always assign a PlayerController to the entity, so we can safely create a convenience getter
  public get playerController(): PlayerEntityController {
    return this.controller as PlayerEntityController;
  }

  public constructor(player: Player) {
    super({
      player,
      name: 'Player',
      modelUri: 'models/players/soldier-player.gltf',
      modelScale: 0.5,
    });
    
    // Prevent mouse left click from being cancelled, required
    // for auto-fire and semi-auto fire mechanics, etc.
    this.playerController.autoCancelMouseLeftClick = false;
    
    // Setup player animations
    this.playerController.idleLoopedAnimations = [ 'idle_gun_right' ];
    this.playerController.interactOneshotAnimations = [];
    this.playerController.walkLoopedAnimations = [ 'idle_gun_right:additive', 'walk_lower' ];
    this.playerController.runLoopedAnimations = [ 'idle_gun_right:additive', 'run_lower' ];
    this.playerController.onTickWithPlayerInput = this._onTickWithPlayerInput;
    
    // Setup UI
    this.player.ui.load('ui/index.html');

    // Setup first person camera
    this.player.camera.setMode(PlayerCameraMode.FIRST_PERSON);
    this.player.camera.setModelHiddenNodes([ 'head', 'neck' ]);
    this.player.camera.setOffset({ x: 0, y: 0.5, z: 0 });
    this.player.camera.setForwardOffset(0.2);
  
    // Set base stats
    this.health = BASE_HEALTH;
    this.maxHealth = BASE_HEALTH;
    this.money = BASE_MONEY;

    // Setup damage audio
    this._damageAudio = new Audio({
      uri: 'audio/sfx/player-hurt.mp3',
      loop: false,
      volume: 0.7,
    });
  }

  public override spawn(world: World, position: Vector3Like, rotation?: QuaternionLike): void {
    super.spawn(world, position, rotation);

    // Prevent players from colliding, setup appropriate collision groups for invisible walls, etc.
    this.setCollisionGroupsForSolidColliders({
      belongsTo: [ CollisionGroup.PLAYER ],
      collidesWith: [ CollisionGroup.BLOCK, CollisionGroup.ENTITY, CollisionGroup.ENTITY_SENSOR ],
    });

    // Give player a pistol.
    this._gun = new PistolEntity({ parent: this });
    this._gun.spawn(world, { x: 0, y: 0, z: -0.2 }, Quaternion.fromEuler(-90, 0, 0));
  }

  public addMoney(amount: number) {
    this.money += amount;
    this.player.ui.sendData({ type: 'money', money: this.money });
  }

  public takeDamage(damage: number) {
    if (!this.isSpawned || !this.world) {
      return;
    }

    this.health -= damage;

    // randomize the detune for variation each hit
    this._damageAudio.setDetune(-200 + Math.random() * 800);
    this._damageAudio.play(this.world, true);

    this.player.ui.sendData({
      type: 'health',
      health: this.health,
      maxHealth: this.maxHealth,
    });
  }

  private _onTickWithPlayerInput = (entity: PlayerEntity, input: PlayerInput, cameraOrientation: PlayerCameraOrientation, deltaTimeMs: number) => {
    if (!this._gun) {
      return;
    }
    
    if (input.ml) {
      this._gun.shoot();
    }

    if (input.r) {
      this._gun.reload();
    }
  }
}

