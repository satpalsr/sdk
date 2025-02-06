import {
  Audio,
  Collider,
  ColliderShape,
  CollisionGroup,
  CollisionGroupsBuilder,
  Entity,
  EntityOptions,
  PlayerEntity,
  Quaternion,
  RigidBodyType,
  Vector3Like,
  QuaternionLike,
  World,
} from 'hytopia';

import EnemyEntity from './EnemyEntity';
import type GamePlayerEntity from './GamePlayerEntity';

export type GunHand = 'left' | 'right' | 'both';

export interface GunEntityOptions extends EntityOptions {
  ammo: number;         // The amount of ammo in the clip.
  damage: number;       // The damage of the gun.
  fireRate: number;     // Bullets shot per second.
  reloadAudioUri: string; // The audio played when reloading
  reloadTimeMs: number;   // Seconds to reload.
  shootAudioUri: string; // The audio played when shooting
  hand: GunHand;        // The hand the weapon is held in.
  parent?: GamePlayerEntity; // The parent player entity.
  iconImageUri: string; // The image uri of the weapon icon.
  maxAmmo: number;      // The amount of ammo the clip can hold.
}

export default class GunEntity extends Entity {
  public ammo: number;
  public damage: number;
  public fireRate: number;
  public hand: GunHand;
  public iconImageUri: string;
  public maxAmmo: number;
  public reloadTimeMs: number;
  private _lastFireTime: number = 0;
  private _muzzleFlashChildEntity: Entity | undefined;
  private _reloadAudio: Audio;
  private _reloading: boolean = false;
  private _shootAudio: Audio;

  public constructor(options: GunEntityOptions) {
    super({
      ...options,
      parent: options.parent,
      parentNodeName: options.parent ? GunEntity._getParentNodeName(options.hand) : undefined,
    });

    this.fireRate = options.fireRate;
    this.damage = options.damage;
    this.ammo = options.ammo;
    this.hand = options.hand;
    this.iconImageUri = options.iconImageUri;
    this.maxAmmo = options.maxAmmo;
    this.reloadTimeMs = options.reloadTimeMs;

    this._reloadAudio = new Audio({
      attachedToEntity: this,
      uri: options.reloadAudioUri,  
    });

    this._shootAudio = new Audio({
      attachedToEntity: this,
      uri: options.shootAudioUri,
    });
  }

  public get isEquipped(): boolean { return !!this.parent; }

  public override spawn(world: World, position: Vector3Like, rotation: QuaternionLike) {
    super.spawn(world, position, rotation);
    this.createMuzzleFlashChildEntity();
    this._updatePlayerUIAmmo();
    this._updatePlayerUIWeapon();
  }

  public createMuzzleFlashChildEntity() {
    if (!this.isSpawned || !this.world) {
      return;
    }

    this._muzzleFlashChildEntity = new Entity({
      parent: this,
      modelUri: 'models/environment/muzzle-flash.gltf',
      modelScale: 0.5,
      opacity: 0,
    });

    // pistol specific atm
    this._muzzleFlashChildEntity.spawn(this.world, { x: 0.03, y: 0.1, z: -0.5 }, Quaternion.fromEuler(0, 90, 0));
  }

  // simple convenience helper for handling ammo and fire rate in shoot() overrides.
  public processShoot(): boolean {
    const now = performance.now();

    if (this._lastFireTime && now - this._lastFireTime < 1000 / this.fireRate) {
      return false;
    }

    if (this.ammo <= 0) {
      this.reload();
      return false;
    }

    this.ammo--;
    this._lastFireTime = now;

    return true;
  }

  // override to create specific gun shoot logic
  public shoot() {
    if (!this.parent || !this.parent.world) {
      return;
    }

    const parentPlayerEntity = this.parent as GamePlayerEntity;
    
    // Check for hit
    this.checkHit();

    // Show Muzzle Flash
    if (this._muzzleFlashChildEntity) {
      this._muzzleFlashChildEntity.setOpacity(1);
      setTimeout(() => {
        this._muzzleFlashChildEntity.setOpacity(0);
      }, 35);
    }
    
    // Update player ammo
    this._updatePlayerUIAmmo();
    
    // Play shoot audio
    this._shootAudio.play(this.parent.world, true);
  }

  public checkHit() {
    if (!this.parent || !this.parent.world) {
      return;
    }

    const parentPlayerEntity = this.parent as GamePlayerEntity;

    const { x, y, z } = parentPlayerEntity.position;
    const cameraYOffset = parentPlayerEntity.player.camera.offset.y;    
    const direction = parentPlayerEntity.player.camera.facingDirection;
    const origin = {
      x: x + (direction.x * 0.5),
      y: y + (direction.y * 0.5) + cameraYOffset,
      z: z + (direction.z * 0.5),
    };

    const raycastHit = this.parent.world.simulation.raycast(origin, direction, 50, {
      filterGroups: CollisionGroupsBuilder.buildRawCollisionGroups({ // filter group is the group the raycast belongs to.
        belongsTo: [ CollisionGroup.ALL ],
        collidesWith: [ CollisionGroup.BLOCK, CollisionGroup.ENTITY ],
      }),
    });

    const hitEntity = raycastHit?.hitEntity;

    if (hitEntity && hitEntity instanceof EnemyEntity) {
      hitEntity.takeDamage(this.damage, parentPlayerEntity);
    }
  }

  public reload() {
    if (!this.parent || !this.parent.world || this._reloading) {
      return;
    }

    this.ammo = 0; // set the ammo to 0 to prevent fire while reloading if clip wasn't empty.
    this._reloading = true;
    this._reloadAudio.play(this.parent.world, true);
    this._updatePlayerUIReload();

    setTimeout(() => {
      if (!this.isEquipped) {
        return;
      }

      this.ammo = this.maxAmmo;
      this._reloading = false;
      this._updatePlayerUIAmmo();
    }, this.reloadTimeMs);
  }

  private _updatePlayerUIAmmo() {
    if (!this.parent || !this.parent.world) {
      return;
    }

    const parentPlayerEntity = this.parent as PlayerEntity;

    parentPlayerEntity.player.ui.sendData({
      type: 'ammo',
      ammo: this.ammo,
      maxAmmo: this.maxAmmo,
    });
  }

  private _updatePlayerUIReload() {
    if (!this.parent || !this.parent.world) {
      return;
    }

    const parentPlayerEntity = this.parent as PlayerEntity;

    parentPlayerEntity.player.ui.sendData({ type: 'reload' });
  }

  private _updatePlayerUIWeapon() {
    if (!this.parent || !this.parent.world) {
      return;
    }

    const parentPlayerEntity = this.parent as PlayerEntity;

    parentPlayerEntity.player.ui.sendData({
      type: 'weapon',
      name: this.name,
      iconImageUri: this.iconImageUri,
    });
  }

  // convenience helper for getting the node name of the hand the gun is held in.
  private static _getParentNodeName(hand: GunHand): string {
    return hand === 'left' ? 'hand_left_anchor' : 'hand_right_anchor';
  }
}
