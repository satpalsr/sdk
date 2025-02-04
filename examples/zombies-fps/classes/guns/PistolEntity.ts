import {
  Audio,
  PlayerEntity,
} from 'hytopia';

import GunEntity from '../GunEntity';
import type { GunEntityOptions } from '../GunEntity';

export default class PistolEntity extends GunEntity {
  public constructor(options: Partial<GunEntityOptions>) {
    super({
      ammo: options.ammo ?? 10,
      damage: options.damage ?? 3,
      fireRate: options.fireRate ?? 5,
      hand: options.hand ?? 'right',
      maxAmmo: options.maxAmmo ?? 10,
      modelUri: 'models/items/pistol.glb',
      modelScale: 1.3,
      parent: options.parent,
      reloadTime: options.reloadTime ?? 1,
    });
  }

  public override shoot() {
    if (!this.parent || !this.processShoot()) {
      return;
    }

    const parentPlayerEntity = this.parent as PlayerEntity;

    if (!parentPlayerEntity.world) {
      return;
    }

    // shoot the bullet
    super.shoot();

    // cancel the input, pistols require click to shoot
    parentPlayerEntity.player.input.ml = false;

    // play shoot animation
    parentPlayerEntity.startModelOneshotAnimations([ 'shoot_gun_right' ]);

    (new Audio({
      position: parentPlayerEntity.position,
      referenceDistance: 20,
      uri: 'audio/sfx/pistol-shoot-1.mp3',
      volume: 1,
    })).play(parentPlayerEntity.world, true);
  }
}

