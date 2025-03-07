import { Quaternion } from 'hytopia';

export const BEDROCK_BLOCK_ID = 2;

export const CHEST_DROP_INTERVAL_MS = 20 * 1000; // 20 seconds

export const CHEST_DROP_REGION_AABB = {
  min: { x: -45, y: 100, z: -45 },
  max: { x: 45, y: 100, z: 45 },
};

export const CHEST_SPAWNS_AT_START = 10;

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

const ITEM_SPAWNS = [

];