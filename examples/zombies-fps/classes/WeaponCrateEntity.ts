import {
  Collider,
  RigidBodyType,
  QuaternionLike,
  Vector3Like,
  World,
  SceneUI,
} from 'hytopia';

import GamePlayerEntity from './GamePlayerEntity';
import InteractableEntity from './InteractableEntity';

import AK47Entity from './guns/AK47Entity';
import AR15Entity from './guns/AR15Entity';
import AutoPistolEntity from './guns/AutoPistolEntity';
import AutoShotgunEntity from './guns/AutoShotgunEntity';
import PistolEntity from './guns/PistolEntity';
import ShotgunEntity from './guns/ShotgunEntity';
import type { GunEntityOptions } from './GunEntity';
import type GunEntity from './GunEntity';

const POSSIBLE_WEAPONS = [
  {
    id: 'ak47',
    name: 'AK-47',
    iconUri: 'icons/ak-47.png',
  },
  {
    id: 'ar15',
    name: 'AR-15',
    iconUri: 'icons/ar-15.png',
  },
  {
    id: 'auto-pistol',
    name: 'Auto Pistol',
    iconUri: 'icons/auto-pistol.png',
  },
  {
    id: 'auto-shotgun',
    name: 'Auto Shotgun',
    iconUri: 'icons/auto-shotgun.png',
  },
  {
    id: 'pistol',
    name: 'Pistol',
    iconUri: 'icons/pistol.png',
  },
  {
    id: 'shotgun',
    name: 'Shotgun',
    iconUri: 'icons/shotgun.png',
  },
]

export default class WeaponCrateEntity extends InteractableEntity {
  public purchasePrice: number;
  private _purchaseSceneUI: SceneUI;
  private _rouletteSceneUI: SceneUI;
  private _rolledWeaponId: string | undefined;

  public constructor() {
    const colliderOptions = Collider.optionsFromModelUri('models/environment/weaponbox.gltf');

    if (colliderOptions.halfExtents) { // make it taller for better interact area
      colliderOptions.halfExtents.y = 3;
    }

    super({
      name: 'Weapon Crate',
      modelUri: 'models/environment/weaponbox.gltf',
      rigidBodyOptions: {
        type: RigidBodyType.FIXED,
        colliders: [ colliderOptions ]
      },
      tintColor: { r: 255, g: 255, b: 255 },
    });

    this.purchasePrice = 200;

    this._purchaseSceneUI = new SceneUI({
      attachedToEntity: this,
      offset: { x: 0, y: 1, z: 0 },
      templateId: 'purchase-label',
      viewDistance: 4,
      state: {
        name: this.name,
        cost: this.purchasePrice,
      },
    });

    this._rouletteSceneUI = new SceneUI({
      attachedToEntity: this,
      offset: { x: 0, y: 1, z: 0 },
      templateId: 'weapon-roulette',
      viewDistance: 4,
    });
  }

  public override interact(interactingPlayer: GamePlayerEntity) {
    if (!this.isSpawned || !this.world) {
      return;
    }

    // If interacting and a weapon is rolled, equip it.
    if (this._rolledWeaponId) {
      this._rouletteSceneUI.unload();
      this._purchaseSceneUI.load(this.world);

      const GunClass = this._weaponIdToGunClass(this._rolledWeaponId);
      if (GunClass) {
        interactingPlayer.equipGun(new GunClass({ parent: interactingPlayer }));
      }
      
      this._rolledWeaponId = undefined;
      return;
    }

    // If interacting and no weapon is rolled, spend $ to roll a weapon.
    if (!interactingPlayer.spendMoney(this.purchasePrice)) {
      this.world.chatManager.sendPlayerMessage(interactingPlayer.player, `You don't have enough money to purchase this weapon crate!`, 'FF0000');
      return;
    }

    // Unload purchase scene UI
    this._purchaseSceneUI.unload();

    // Roll a weapon and show roll UI
    this._rolledWeaponId = POSSIBLE_WEAPONS[Math.floor(Math.random() * POSSIBLE_WEAPONS.length)].id;
    this._rouletteSceneUI.setState({
      selectedWeaponId: this._rolledWeaponId,
      possibleWeapons: POSSIBLE_WEAPONS,
    });
    this._rouletteSceneUI.load(this.world);
  }

  public override spawn(world: World, position: Vector3Like, rotation?: QuaternionLike): void {
    super.spawn(world, position, rotation);

    // Spawn Scene UI that shows purchase price
    this._purchaseSceneUI.load(world);
  }

  private _weaponIdToGunClass(weaponId: string): (new (options: Partial<GunEntityOptions>) => GunEntity) | undefined {
    switch (weaponId) {
      case 'ak47': return AK47Entity;
      case 'ar15': return AR15Entity;
      case 'auto-pistol': return AutoPistolEntity;
      case 'auto-shotgun': return AutoShotgunEntity;
      case 'pistol': return PistolEntity;
      case 'shotgun': return ShotgunEntity;
      default: return undefined;
    }   
  }
}
