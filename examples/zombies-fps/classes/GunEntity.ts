import {
  Entity,
  EntityOptions,
  PlayerEntity,
  Quaternion,
} from 'hytopia';

import BulletEntity from './guns/BulletEntity';

export type GunHand = 'left' | 'right' | 'both';

export interface GunEntityOptions extends EntityOptions {
  ammo: number;       // The amount of ammo in the clip.
  damage: number;     // The damage of the gun.
  fireRate: number;   // Bullets shot per second.
  reloadTime: number; // Seconds to reload.
  hand: GunHand;      // The hand the weapon is held in.
  maxAmmo: number;    // The amount of ammo the clip can hold.
}

export default class GunEntity extends Entity {
  public ammo: number;
  public damage: number;
  public fireRate: number;
  public hand: GunHand;
  public maxAmmo: number;
  public reloadTime: number;
  private _lastFireTime: number = 0;

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
    this.maxAmmo = options.maxAmmo;
    this.reloadTime = options.reloadTime;
  }

  // simple convenience helper for handling ammo and fire rate in shoot() overrides.
  public processShoot(): boolean {
    const now = performance.now();

    if (this._lastFireTime && now - this._lastFireTime < 1000 / this.fireRate) {
      return false;
    }

    if (this.ammo <= 0) {
      //return false;
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

    const parentPlayerEntity = this.parent as PlayerEntity;
    const bullet = new BulletEntity(this.damage, parentPlayerEntity.player.camera.facingDirection);
   
    // Get bullet direction from player camera
    const direction = parentPlayerEntity.player.camera.facingDirection;
    const yaw = Math.atan2(-direction.x, -direction.z);
    const pitch = Math.asin(direction.y);
    const rotation = Quaternion.fromEuler(pitch * (180 / Math.PI), yaw * (180 / Math.PI), 0);

    // Calculate spawn position
    const { x, y, z } = parentPlayerEntity.position;
    const cameraYOffset = parentPlayerEntity.player.camera.offset.y;
    const spawnPosition = {
      x: x + (direction.x * 1.5),
      y: y + (direction.y * 1.5) + cameraYOffset,
      z: z + (direction.z * 1.5),
    };

    bullet.spawn(this.parent.world, spawnPosition, rotation);
  }

  // convenience helper for getting the node name of the hand the gun is held in.
  private static _getParentNodeName(hand: GunHand): string {
    return hand === 'left' ? 'hand_left_anchor' : 'hand_right_anchor';
  }
}
