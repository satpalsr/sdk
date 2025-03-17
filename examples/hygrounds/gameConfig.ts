import { Quaternion } from 'hytopia';

export const BEDROCK_BLOCK_ID = 2;

export const BLOCK_ID_BREAK_DAMAGE: Record<string | number, number> = {
  1: 50, // bricks
  4: 50, // cobblestone
  6: 70, // diamond block
  7: 70, // diamond ore
  8: 10, // dirt
  14: 10, // glass
  15: 70, // gold ore
  16: 10, // grass
  17: 10, // gravel
  19: 100, // infected shadowrock core
  20: 100, // infected shadowrock
  24: 50, // mossy cobblestone
  27: 10, // oak leaves
  30: 10, // sand
  36: 100, // stone bricks
  37: 40, // stone (also build block)
  default: 30, // default for all other blocks
}

export const BLOCK_ID_MATERIALS: Record<string | number, number> = {
  1: 4, // bricks
  2: 0, // bedrock
  6: 10, // diamond block
  7: 10, // diamond ore,
  8: 0, // dirt
  14: 0, // glass
  15: 8, // gold ore,
  16: 0, // grass
  19: 8, // infected shadowrock core
  20: 8, // infected shadowrock
  22: 0, // lava
  23: 2, // log
  28: 2, // oak planks
  36: 5, // stone bricks
  42: 0, // water flow
  43: 0, // water still
  default: 1, // default for all other blocks
};

export const BUILD_BLOCK_ID = 37; // stone

export const CHEST_DROP_INTERVAL_MS = 20 * 1000; // 20 seconds

export const CHEST_DROP_REGION_AABB = {
  min: { x: -45, y: 100, z: -45 },
  max: { x: 45, y: 100, z: 45 },
};

export const CHEST_SPAWNS_AT_START = 10;

export const CHEST_MAX_DROP_ITEMS = 2;

export const CHEST_DROP_ITEMS = [
  {
    itemId: 'ak47',
    pickWeight: 0.4,
  },
  {
    itemId: 'auto-shotgun',
    pickWeight: 0.5,
  },
  {
    itemId: 'bolt-action-sniper',
    pickWeight: 0.6,
  },
  {
    itemId: 'light-machine-gun',
    pickWeight: 0.3,
  },
  {
    itemId: 'medpack',
    pickWeight: 1,
  },
  {
    itemId: 'pistol',
    pickWeight: 1,
  },
  {
    itemId: 'rocket-launcher',
    pickWeight: 0.2,
  },
  {
    itemId: 'shotgun',
    pickWeight: 0.5,
  },
  {
    itemId: 'shield-potion',
    pickWeight: 1,
  },
]

export const CHEST_SPAWNS = [
  {
    position: { x: -14, y: 2, z: -16 },
    rotation: Quaternion.fromEuler(0, -90, 0),
  },
  {
    position: { x: -14, y: 2, z: -25 },
    rotation: Quaternion.fromEuler(0, 90, 0),
  },
  {
    position: { x: -36, y: 2, z: -34.5},
    rotation: Quaternion.fromEuler(0, 180, 0),
  },
  {
    position: { x: -30.5, y: 6, z: -33 },
    rotation: Quaternion.fromEuler(0, -90, 0),
  },
  {
    position: { x: -8, y: 2, z: -40 },
    rotation: Quaternion.fromEuler(0, 180, 0),
  },
  {
    position: { x: 38, y: 2, z: -18 },
    rotation: Quaternion.fromEuler(0, 0, 0),
  },
  {
    position: { x: 47, y: 2, z: -33 },
    rotation: Quaternion.fromEuler(0, 90, 0),
  },
  {
    position: { x: 41, y: 5, z: -46.5 },
    rotation: Quaternion.fromEuler(0, 180, 0),
  },
  {
    position: { x: 39.5, y: 4, z: 9 },
    rotation: Quaternion.fromEuler(0, 90, 0),
  },
  {
    position: { x: -2.5, y: 3, z: 13 },
    rotation: Quaternion.fromEuler(0, 180, 0),
  },
  {
    position: { x: 5.5, y: 3, z: 13 },
    rotation: Quaternion.fromEuler(0, 0, 0),
  },
  {
    position: { x: -2.5, y: 3, z: 8 },
    rotation: Quaternion.fromEuler(0, 180, 0),
  },
  {
    position: { x: 5.5, y: 3, z: 8 },
    rotation: Quaternion.fromEuler(0, 0, 0),
  },
  {
    position: { x: 35, y: 15, z: 34.5 },
    rotation: Quaternion.fromEuler(0, 0, 0),
  },
  {
    position: { x: 33.5, y: 3, z: 29 },
    rotation: Quaternion.fromEuler(0, 90, 0),
  },
  {
    position: { x: 40.5, y: 3, z: 31 },
    rotation: Quaternion.fromEuler(0, 0, 0),
  },
  {
    position: { x: 45, y: 3, z: 45 },
    rotation: Quaternion.fromEuler(0, 0, 0),
  },
  {
    position: { x: 9, y: 3, z: 40 },
    rotation: Quaternion.fromEuler(0, 0, 0),
  },
  {
    position: { x: -22.5, y: 3, z: 44 },
    rotation: Quaternion.fromEuler(0, -90, 0),
  },
  {
    position: { x: -14, y: 3, z: 42.5 },
    rotation: Quaternion.fromEuler(0, 0, 0),
  },
  {
    position: { x: -18, y: 8, z: 45 },
    rotation: Quaternion.fromEuler(0, -90, 0),
  },
  {
    position: { x: -22.5, y: 8, z: 46 },
    rotation: Quaternion.fromEuler(0, -90, 0),
  },
  {
    position: { x: -33.5, y: 3, z: 47 },
    rotation: Quaternion.fromEuler(0, -90, 0),
  },
  {
    position: { x: -44.5, y: 3, z: 23.5 },
    rotation: Quaternion.fromEuler(0, 180, 0),
  },
  {
    position: { x: -29, y: 3, z: 14 },
    rotation: Quaternion.fromEuler(0, 90, 0),
  },
  {
    position: { x: -32, y: 3, z: 21 },
    rotation: Quaternion.fromEuler(0, -90, 0),
  },
  {
    position: { x: -36, y: 3, z: 5.5 },
    rotation: Quaternion.fromEuler(0, 0, 0),
  },
  {
    position: { x: -12, y: 15, z: 27 },
    rotation: Quaternion.fromEuler(0, 90, 0),
  },
  {
    position: { x: -33.5, y: 20, z: 5.5 },
    rotation: Quaternion.fromEuler(0, 90, 0),
  },
  {
    position: { x: -24, y: 3, z: -8 },
    rotation: Quaternion.fromEuler(0, 180, 0),
  },
  {
    position: { x: -15.5, y: 3, z: 0 },
    rotation: Quaternion.fromEuler(0, -90, 0),
  },
  {
    position: { x: -14, y: 3, z: 5 },
    rotation: Quaternion.fromEuler(0, 180, 0),
  },
  {
    position: { x: 10, y: 3, z: -16 },
    rotation: Quaternion.fromEuler(0, 0, 0),
  },
  {
    position: { x: 18, y: 15, z: 4 },
    rotation: Quaternion.fromEuler(0, 0, 0),
  },
  {
    position: { x: -5.5, y: 3, z: 11.5 },
    rotation: Quaternion.fromEuler(0, 0, 0),
  },
  {
    position: { x: -12, y: 9, z: 3.5 },
    rotation: Quaternion.fromEuler(0, 180, 0),
  },
  {
    position: { x: 4, y: 9, z: 8 },
    rotation: Quaternion.fromEuler(0, 180, 0),
  },
  {
    position: { x: 17, y: 3, z: 16.5 },
    rotation: Quaternion.fromEuler(0, 180, 0),
  },
  {
    position: { x: 25, y: 3, z: 3.5 },
    rotation: Quaternion.fromEuler(0, 180, 0),
  },
  {
    position: { x: 24, y: 3, z: -13.5 },
    rotation: Quaternion.fromEuler(0, 0, 0),
  },
  {
    position: { x: 26.5, y: 3, z: -46.5 },
    rotation: Quaternion.fromEuler(0, 90, 0),
  },
  {
    position: { x: -44, y: 3, z: -46 },
    rotation: Quaternion.fromEuler(0, 180, 0),
  },
  {
    position: { x: 11, y: 9, z: -40 },
    rotation: Quaternion.fromEuler(0, 180, 0),
  },
  {
    position: { x: 3, y: 6, z: -19 },
    rotation: Quaternion.fromEuler(0, 180, 0),
  },
  {
    position: { x: 0.5, y: 3, z: -43.5 },
    rotation: Quaternion.fromEuler(0, 180, 0),
  },
  {
    position: { x: -42.5, y: 3, z: -18.5 },
    rotation: Quaternion.fromEuler(0, 180, 0),
  },
  {
    position: { x: -32.5, y: 3, z: -46.5 },
    rotation: Quaternion.fromEuler(0, 90, 0),
  },
  {
    position: { x: 40, y: 15, z: -18 },
    rotation: Quaternion.fromEuler(0, 0, 0),
  },
  {
    position: { x: 13, y: 3, z: 1 },
    rotation: Quaternion.fromEuler(0, 0, 0),
  },
  {
    position: { x: 7, y: 5, z: 36.5 },
    rotation: Quaternion.fromEuler(0, 0, 0),
  },
  {
    position: { x: -14, y: 9, z: -21 },
    rotation: Quaternion.fromEuler(0, 0, 0),
  },
  {
    position: { x: -33, y: 15, z: -35.5 },
    rotation: Quaternion.fromEuler(0, 90, 0),
  },
  {
    position: { x: -28, y: 15, z: -35.5 },
    rotation: Quaternion.fromEuler(0, 90, 0),
  },
  {
    position: { x: -23, y: 3, z: 2.5 },
    rotation: Quaternion.fromEuler(0, 90, 0),
  },
  {
    position: { x: -6, y: 5, z: 22 },
    rotation: Quaternion.fromEuler(0, 180, 0),
  },
];

export const GAME_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export const ITEM_SPAWNS = [
  { position: { x: -21.5, y: 2, z: -17 } },
  { position: { x: -28.5, y: 7, z: -35.5 } },
  { position: { x: -19.5, y: 2, z: -46.5 } },
  { position: { x: -37.5, y: 2, z: -3.5 } },
  { position: { x: -31.5, y: 2, z: 16.5 } },
  { position: { x: -18.5, y: 2, z: 40.5 } },
  { position: { x: 1.5, y: 2, z: 11.5 } },
  { position: { x: 7.5, y: 10, z: 36.5 } },
  { position: { x: 20.5, y: 2, z: 44.5 } },
  { position: { x: 37.5, y: 2, z: 38.5 } },
  { position: { x: 44.5, y: 2, z: -3.5 } },
  { position: { x: 37.5, y: 2, z: -17.5 } },
  { position: { x: 40.5, y: 10, z: -41.5 } },
  { position: { x: 3.5, y: 10, z: -31.5 } },
  { position: { x: -30.5, y: 10, z: 41.5 } },
];

export const ITEM_SPAWN_ITEMS = [
  {
    itemId: 'ak47',
    pickWeight: 0.05,
  },
  {
    itemId: 'auto-shotgun',
    pickWeight: 0.05,
  },
  {
    itemId: 'bolt-action-sniper',
    pickWeight: 0.05,
  },
  {
    itemId: 'light-machine-gun',
    pickWeight: 0.05,
  },
  {
    itemId: 'medpack',
    pickWeight: 1,
  },
  {
    itemId: 'pistol',
    pickWeight: 1,
  },
  {
    itemId: 'rocket-launcher',
    pickWeight: 0.03,
  },
  {
    itemId: 'shotgun',
    pickWeight: 0.08,
  },
  {
    itemId: 'shield-potion',
    pickWeight: 1,
  },
];

export const ITEM_SPAWNS_AT_START = 8;

export const MINIMUM_PLAYERS_TO_START = 2;

export const SPAWN_REGION_AABB = {
  min: { x: -45, y: 30, z: -45 },
  max: { x: 45, y: 35, z: 45 },
};