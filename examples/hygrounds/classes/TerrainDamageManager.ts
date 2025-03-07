import { Block, Vector3Like, World } from 'hytopia';
import { BEDROCK_BLOCK_ID } from '../gameConfig';

interface BlockDamage {
  blockId: number;
  totalDamage: number;
}

export default class TerrainDamageManager {
  public static instance: TerrainDamageManager = new TerrainDamageManager();

  private _blockDamages: Map<string, BlockDamage> = new Map();

  private constructor() {}

  public static getBreakMaterialCount(blockId: number): number {
    switch (blockId) {
      case BEDROCK_BLOCK_ID:
      case 22: // lava
      case 42: // water flow
      case 43: // water still
        return 0;
      default:
        return 1;
    }
  }

  public damageBlock(world: World, block: Block, damage: number): void {
    const coordinateKey = this._coordinateToKey(block.globalCoordinate);
    let blockDamage = this._blockDamages.get(coordinateKey);

    if (!blockDamage) {
      const blockId = block.blockType.id;

      if (block.blockType.isLiquid || blockId === BEDROCK_BLOCK_ID) {
        return;
      }

      blockDamage = { blockId, totalDamage: 0 };
      this._blockDamages.set(coordinateKey, blockDamage);
    }

    blockDamage.totalDamage += damage;

    if (blockDamage.totalDamage > 1) { // change later
      world.chunkLattice.setBlock(block.globalCoordinate, 0);
      this._blockDamages.delete(coordinateKey);
    }
  }

  private _coordinateToKey(coordinate: Vector3Like): string {
    return `${coordinate.x},${coordinate.y},${coordinate.z}`;
  }
}