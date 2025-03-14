import {
  Audio,
  Collider,
  Entity,
  EntityOptions,
  QuaternionLike,
  SceneUI,
  Vector3Like,
  World,
} from 'hytopia';

import { CHEST_DROP_ITEMS, CHEST_MAX_DROP_ITEMS } from '../gameConfig';
import type ItemEntity from './ItemEntity';

export default class ChestEntity extends Entity {
  private _labelSceneUI: SceneUI;
  private _openAudio: Audio;
  private _opened: boolean = false;

  public constructor(options: EntityOptions = {}) {
    super({
      modelUri: 'models/environment/chest.gltf',
      modelScale: 1,
      name: 'Item Chest',
      rigidBodyOptions: {
        additionalMass: 10000,
        enabledPositions: { x: false, y: true, z: false },
        enabledRotations: { x: false, y: false, z: false },
        ccdEnabled: true,
        gravityScale: 0.3, // we want it to drop slow when spawned mid-game in the sky randomly.
        colliders: [
          {
            ...Collider.optionsFromModelUri('models/environment/chest.gltf'),
            radius: 0.45, // collider isn't calculating perfect because of the coin positions in the model.
            bounciness: 0.25,
          }
        ]
      },
      ...options,
    });

    this._labelSceneUI = this._createLabelUI();

    this._openAudio = new Audio({
      attachedToEntity: this,
      uri: 'audio/sfx/chest-open-2.mp3',
      volume: 0.7,
      referenceDistance: 8,
    });
  }

  public open(): void {
    if (this._opened || !this.world) return;

    this._opened = true;
    this._openAudio.play(this.world, true);
    this._labelSceneUI.unload();

    this.startModelOneshotAnimations(['opening']);

    setTimeout(() => {
      this.startModelLoopedAnimations([ 'open' ]);

      const numItems = Math.floor(Math.random() * CHEST_MAX_DROP_ITEMS) + 1;

      for (let i = 0; i < numItems; i++) {
        this._spawnRandomChestItem();
      }
    }, 600);
  }

  public override spawn(world: World, position: Vector3Like, rotation?: QuaternionLike): void {
    super.spawn(world, position, rotation);
    this._labelSceneUI.load(world);
  }

  private _createLabelUI(): SceneUI {
    return new SceneUI({
      attachedToEntity: this,
      templateId: 'chest-label',
      state: { name: this.name },
      viewDistance: 8,
      offset: { x: 0, y: 0.85, z: 0 },
    });
  }

  private async _spawnRandomChestItem(): Promise<void> {
    if (!this.world) return;

    // Calculate total weight
    const totalWeight = CHEST_DROP_ITEMS.reduce((sum, item) => sum + item.pickWeight, 0);

    // Get random value between 0 and total weight
    let random = Math.random() * totalWeight;

    // Find the selected item
    let selectedItem = CHEST_DROP_ITEMS[0];
    for (const item of CHEST_DROP_ITEMS) {
      random -= item.pickWeight;
      if (random <= 0) {
        selectedItem = item;
        break;
      }
    }

    let itemModule

    // We do imports here to avoid circular dependencies
    // We should really just refactor import patterns,
    // but this is a quick fix for now.
    switch(selectedItem.itemId) {
      case 'ak47':
        itemModule = await import('./weapons/AK47Entity');
        break;
      case 'auto-shotgun':
        itemModule = await import('./weapons/AutoShotgunEntity');
        break;
      case 'bolt-action-sniper':
        itemModule = await import('./weapons/BoltActionSniperEntity');
        break;
      case 'light-machine-gun':
        itemModule = await import('./weapons/LightMachineGunEntity');
        break;
      case 'medpack':
        itemModule = await import('./items/MedPackEntity');
        break;
      case 'pistol':
        itemModule = await import('./weapons/PistolEntity');
        break;
      case 'rocket-launcher':
        itemModule = await import('./weapons/RocketLauncherEntity');
        break;
      case 'shotgun':
        itemModule = await import('./weapons/ShotgunEntity');
        break;
      case 'shield-potion':
        itemModule = await import('./items/ShieldPotionEntity');
        break;
      default:
        throw new Error(`Unknown chest item id: ${selectedItem.itemId}`);
    }

    const itemClass = itemModule.default;
    const item = new itemClass();

    if (item) {
      item.spawn(this.world, {
        x: this.position.x,
        y: this.position.y + 2,
        z: this.position.z,
      });

      item.applyImpulse({ // apply an impulse in a random x/z direction
        x: (Math.random() - 0.5) * 10 * item.mass,
        y: 5 * item.mass,
        z: (Math.random() - 0.5) * 10 * item.mass,
      });
    } else {
      console.error(`Failed to create item: ${selectedItem.itemId}`);
    }
  }
}