import { Quaternion, Vector3Like, QuaternionLike } from 'hytopia';
import GunEntity from '../GunEntity';
import type { GunEntityOptions } from '../GunEntity';

const DEFAULT_AK47_OPTIONS: GunEntityOptions = {
  ammo: 30,
  damage: 4,
  fireRate: 10,
  heldHand: 'both',
  iconImageUri: 'icons/ak-47.png',
  idleAnimation: 'idle_gun_both',
  mlAnimation: 'shoot_gun_both',
  name: 'AK-47',
  maxAmmo: 30,
  totalAmmo: 90,
  scopeZoom: 2,
  modelUri: 'models/items/ak-47.glb',
  modelScale: 1.3,
  range: 40,
  reloadAudioUri: 'audio/sfx/rifle-reload.mp3',
  reloadTimeMs: 1500,
  shootAudioUri: 'audio/sfx/rifle-shoot.mp3',
};

export default class AK47Entity extends GunEntity {
  public constructor(options: Partial<GunEntityOptions> = {}) {
    super({ ...DEFAULT_AK47_OPTIONS, ...options });
  }

  public override shoot(): void {
    if (!this.parent || !this.processShoot()) return;

    super.shoot();
  }

  public override getMuzzleFlashPositionRotation(): { position: Vector3Like, rotation: QuaternionLike } {
    return {
      position: { x: 0, y: 0.01, z: -1.25 },
      rotation: Quaternion.fromEuler(0, 90, 0),
    };
  }
}

