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
export interface WeaponCrateEntityOptions {
  name?: string;
  purchasePrice: number;
  tintColor?: { r: number, g: number, b: number };
}

export default class WeaponCrateEntity extends InteractableEntity {
  public purchasePrice: number;

  public constructor(options: WeaponCrateEntityOptions) {
    const colliderOptions = Collider.optionsFromModelUri('models/environment/weaponbox.gltf');

    if (colliderOptions.halfExtents) { // make it taller for better interact area
      colliderOptions.halfExtents.y = 3;
    }
console.log(options.tintColor);
    super({
      name: options.name,
      modelUri: 'models/environment/weaponbox.gltf',
      rigidBodyOptions: {
        type: RigidBodyType.FIXED,
        colliders: [ colliderOptions ]
      },
      tintColor: options.tintColor ?? { r: 255, g: 255, b: 255 },
    });

    this.purchasePrice = options.purchasePrice;
  }

  public override interact(interactingPlayer: GamePlayerEntity) {
    if (!this.isSpawned || !this.world) {
      return;
    }

    if (!interactingPlayer.spendMoney(this.purchasePrice)) {
      this.world.chatManager.sendPlayerMessage(interactingPlayer.player, `You don't have enough money to purchase this weapon crate!`, 'FF0000');
      return;
    }

    // Show crate animation, and item
  }

  public override spawn(world: World, position: Vector3Like, rotation?: QuaternionLike): void {
    super.spawn(world, position, rotation);

    // Spawn Scene UI that shows purchase price
    (new SceneUI({
      attachedToEntity: this,
      offset: { x: 0, y: 1, z: 0 },
      templateId: 'purchase-label',
      viewDistance: 4,
      state: {
        name: this.name,
        cost: this.purchasePrice,
      },
    })).load(world);
  }
}
