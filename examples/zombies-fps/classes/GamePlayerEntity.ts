import { 
  Audio,
  CollisionGroup,
  Light,
  LightType,
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
import PurchaseBarrierEntity from './PurchaseBarrierEntity';
import type GunEntity from './GunEntity';
import { INVISIBLE_WALL_COLLISION_GROUP } from '../gameConfig';

const BASE_HEALTH = 100;

export default class GamePlayerEntity extends PlayerEntity {
  public health: number;
  public maxHealth: number;
  public money: number;
  private _damageAudio: Audio;
  private _purchaseAudio: Audio;
  private _gun: GunEntity | undefined;
  private _light: Light;

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
    this.playerController.walkLoopedAnimations = [ 'idle_gun_right', 'walk_lower' ];
    this.playerController.runLoopedAnimations = [ 'idle_gun_right', 'run_lower' ];
    this.playerController.onTickWithPlayerInput = this._onTickWithPlayerInput;
    
    // Setup UI
    this.player.ui.load('ui/index.html');

    // Setup first person camera
    this.player.camera.setMode(PlayerCameraMode.FIRST_PERSON);
    this.player.camera.setModelHiddenNodes([ 'head', 'neck', 'torso', 'leg_right', 'leg_left' ]);
    this.player.camera.setOffset({ x: 0, y: 0.5, z: 0 });
  
    // Set base stats
    this.health = BASE_HEALTH;
    this.maxHealth = BASE_HEALTH;
    this.money = 0;

    // Setup damage audio
    this._damageAudio = new Audio({
      attachedToEntity: this,
      uri: 'audio/sfx/player-hurt.mp3',
      loop: false,
      volume: 0.7,
    });

    // Setup purchase audio
    this._purchaseAudio = new Audio({
      attachedToEntity: this,
      uri: 'audio/sfx/purchase.mp3',
      loop: false,
      volume: 1,
    });

    this._light = new Light({
      angle: Math.PI / 4 + 0.1,
      penumbra: 0.03,
      attachedToEntity: this,
      trackedEntity: this,
      type: LightType.SPOTLIGHT,
      intensity: 5,
      offset: { x: 0, y: 0, z: 0.1 }, 
      color: { r: 255, g: 255, b: 255 },
    });
  }

  public override spawn(world: World, position: Vector3Like, rotation?: QuaternionLike): void {
    super.spawn(world, position, rotation);

    // Prevent players from colliding, setup appropriate collision groups for invisible walls, etc.
    this.setCollisionGroupsForSolidColliders({
      belongsTo: [ CollisionGroup.PLAYER ],
      collidesWith: [ CollisionGroup.BLOCK, CollisionGroup.ENTITY, CollisionGroup.ENTITY_SENSOR, INVISIBLE_WALL_COLLISION_GROUP ],
    });

    // Give player a pistol.
    this._gun = new PistolEntity({ parent: this });
    this._gun.spawn(world, { x: 0, y: 0, z: -0.2 }, Quaternion.fromEuler(-90, 0, 0));

    // Spawn light
    this._light.spawn(world);
  }

  public addMoney(amount: number) {
    this.money += amount;
    this._updatePlayerUIMoney();
  }

  public spendMoney(amount: number): boolean {
    if (!this.world || this.money < amount) {
      return false;
    }

    this.money -= amount;
    this._updatePlayerUIMoney();
    this._purchaseAudio.play(this.world, true);
    return true;
  }

  public takeDamage(damage: number) {
    if (!this.isSpawned || !this.world) {
      return;
    }

    this.health -= damage;

    this.player.ui.sendData({
      type: 'health',
      health: this.health,
      maxHealth: this.maxHealth,
    });

    // if player is dead, despawn, gg's, todo: make a 15s time for player to be revived.
    if (this.health <= 0) {
      this.despawn();
      return;
    }

    // randomize the detune for variation each hit
    this._damageAudio.setDetune(-200 + Math.random() * 800);
    this._damageAudio.play(this.world, true);
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
      input.r = false;
    }

    if (input.e) {
      this._interactRaycast();
      input.e = false;
    }
  }

  private _interactRaycast() {
    if (!this.world) {
      return;
    }

    // Get raycast direction from player camera
    const origin = {
      x: this.position.x,
      y: this.position.y + this.player.camera.offset.y,
      z: this.position.z,
    };
    const direction = this.player.camera.facingDirection;
    const length = 4;

    const raycastHit = this.world.simulation.raycast(origin, direction, length, {
      filterExcludeRigidBody: this.rawRigidBody, // prevent raycast from hitting the player
    });

    const hitEntity = raycastHit?.hitEntity;

    if (!hitEntity) {
      return;
    }

    if (hitEntity instanceof PurchaseBarrierEntity) {
      hitEntity.purchase(this);
    }
  }

  private _updatePlayerUIMoney() {
    this.player.ui.sendData({ type: 'money', money: this.money });
  }
}

