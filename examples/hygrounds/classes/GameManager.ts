import {
  Quaternion,
  World,
} from 'hytopia';

import {
  BEDROCK_BLOCK_ID,
  CHEST_SPAWNS,
  CHEST_SPAWNS_AT_START,
  CHEST_DROP_INTERVAL_MS,
  CHEST_DROP_REGION_AABB,
  ITEM_SPAWNS,
  ITEM_SPAWNS_AT_START,
  ITEM_SPAWN_ITEMS,
} from '../gameConfig';

import ChestEntity from './ChestEntity';
import ItemFactory from './ItemFactory';

export default class GameManager {
  public static readonly instance = new GameManager();

  public world: World | undefined;
  private _chestDropInterval: NodeJS.Timer | undefined;

  public setupGame(world: World) {
    this.world = world;

    // Add unbreakable bedrock
    for (let x = -50; x <= 50; x++) {
      for (let z = -50; z <= 50; z++) {
        world.chunkLattice.setBlock({ x, y: -1, z }, BEDROCK_BLOCK_ID);
      }
    }

    // Get random unique initial chest spawns
    const shuffledChestSpawns = [...CHEST_SPAWNS].sort(() => Math.random() - 0.5);
    const selectedChestSpawns = shuffledChestSpawns.slice(0, CHEST_SPAWNS_AT_START);

    // Spawn initial chests at selected positions
    selectedChestSpawns.forEach(spawn => {
      const chest = new ChestEntity();
      chest.spawn(world, spawn.position, spawn.rotation);
    });

    // Spawn initial items at selected positions
    const shuffledItemSpawns = [...ITEM_SPAWNS].sort(() => Math.random() - 0.5);
    const selectedItemSpawns = shuffledItemSpawns.slice(0, ITEM_SPAWNS_AT_START);
    const totalWeight = ITEM_SPAWN_ITEMS.reduce((sum, item) => sum + item.pickWeight, 0);

    selectedItemSpawns.forEach(async spawn => {
      let random = Math.random() * totalWeight;
      let selectedItem = ITEM_SPAWN_ITEMS[0];
      for (const item of ITEM_SPAWN_ITEMS) {
        random -= item.pickWeight;
        if (random <= 0) {
          selectedItem = item;
          break;
        }
      }

      const item = await ItemFactory.createItem(selectedItem.itemId);
      item.spawn(world, spawn.position, Quaternion.fromEuler(0, Math.random() * 360 - 180, 0));
    });

    // Setup chest drop interval
    this._chestDropInterval = setInterval(() => {
      const randomPosition = {
        x: Math.floor(Math.random() * (CHEST_DROP_REGION_AABB.max.x - CHEST_DROP_REGION_AABB.min.x + 1)) + CHEST_DROP_REGION_AABB.min.x,
        y: CHEST_DROP_REGION_AABB.min.y,
        z: Math.floor(Math.random() * (CHEST_DROP_REGION_AABB.max.z - CHEST_DROP_REGION_AABB.min.z + 1)) + CHEST_DROP_REGION_AABB.min.z,
      };
      
      const randomRotation = Quaternion.fromEuler(0, [0, 90, -90, 180][Math.floor(Math.random() * 4)], 0);
      
      const chest = new ChestEntity();
      chest.spawn(world, randomPosition, randomRotation);
    }, CHEST_DROP_INTERVAL_MS);
  }

}