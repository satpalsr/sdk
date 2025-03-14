import { Quaternion, RaycastHit, Vector3Like } from 'hytopia';
import MeleeWeaponEntity from '../MeleeWeaponEntity';
import type { MeleeWeaponEntityOptions } from '../MeleeWeaponEntity';
import type GamePlayerEntity from '../GamePlayerEntity';

const DEFAULT_PICKAXE_OPTIONS: MeleeWeaponEntityOptions = {
  damage: 10,         // 9 hits to kill unshielded
  attackRate: 5,    // Slower attack rate to prevent spam
  heldHand: 'right',
  iconImageUri: 'icons/pickaxe.png',
  idleAnimation: 'idle_gun_right',
  mlAnimation: 'simple_interact', 
  name: 'Pickaxe',
  modelUri: 'models/items/pickaxe.gltf',
  modelScale: 1.25,
  range: 2.5,
  minesMaterials: true,
  attackAudioUri: 'audio/sfx/player/player-swing-woosh.mp3',
  hitAudioUri: 'audio/sfx/dig/dig-stone.mp3',
};

export default class PickaxeEntity extends MeleeWeaponEntity {
  public constructor(options: Partial<MeleeWeaponEntityOptions> = {}) {
    super({ ...DEFAULT_PICKAXE_OPTIONS, ...options });
  }

  public override attack(): void {
    if (!this.parent || !this.processAttack()) return;

    super.attack();
    
    // Cancel input since pickaxe requires click-to-attack
    (this.parent as GamePlayerEntity).player.input.ml = false;
  }

  public override equip(): void {
    super.equip();

    this.setPosition({ x: 0, y: 0.2, z: 0 });
    this.setRotation(Quaternion.fromEuler(-90, 0, 90));
  }
}
