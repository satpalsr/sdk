import { Quaternion, Vector3Like, QuaternionLike } from 'hytopia';
import GunEntity from '../GunEntity';
import type { GunEntityOptions } from '../GunEntity';
import type GamePlayerEntity from '../GamePlayerEntity';

const DEFAULT_ROCKET_LAUNCHER_OPTIONS: GunEntityOptions = {
  ammo: 1,
  damage: 10,
  fireRate: 1.25,
  heldHand: 'right',
  iconImageUri: 'icons/rocket-launcher.png',
  idleAnimation: 'idle_gun_right',
  mlAnimation: 'shoot_gun_right',
  name: 'Rocket Launcher',
  maxAmmo: 1,
  totalAmmo: 8,
  modelUri: 'models/items/rocket-launcher.glb',
  modelScale: 1.3,
  range: 8,
  reloadAudioUri: 'audio/sfx/rocket-launcher-reload.mp3',
  reloadTimeMs: 1000,
  shootAudioUri: 'audio/sfx/rocket-launcher-shoot.mp3',
};

export default class RocketLauncherEntity extends GunEntity {
  public constructor(options: Partial<GunEntityOptions> = {}) {
    super({ ...DEFAULT_ROCKET_LAUNCHER_OPTIONS, ...options });
  }

  public override shoot(): void {
    if (!this.parent || !this.processShoot()) return;

    super.shoot();
    
    // Cancel input since rocket launcher requires click-to-shoot
    (this.parent as GamePlayerEntity).player.input.ml = false;
  }

  public override getMuzzleFlashPositionRotation(): { position: Vector3Like, rotation: QuaternionLike } {
    return {
      position: { x: 0.03, y: 0.6, z: -1.5 },
      rotation: Quaternion.fromEuler(0, 90, 0),
    };
  }

  public override equip(): void {
    super.equip();

    this.setPosition({ x: 0, y: 0.3, z: 0.4 });
  }

  public override shootRaycast(origin: Vector3Like, direction: Vector3Like, length: number) {
    
  }
}

