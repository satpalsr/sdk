import { Quaternion } from 'hytopia';

export const INVISIBLE_WALLS = [
  { // Main entrance (south door)
    position: { x: 2.5, y: 1, z: 25},
    halfExtents: { x: 1, y: 5, z: 0.5 },
  },
  { // Main entrance (south window)
    position: { x: -4, y: 1, z: 25},
    halfExtents: { x: 1, y: 5, z: 0.5 },
  },
  { // Main entrance (east window)
    position: { x: 13, y: 1, z: 22 },
    halfExtents: { x: 0.5, y: 5, z: 1 },
  },
  { // Main entrance (north window)
    position: { x: 8, y: 1, z: 15 },
    halfExtents: { x: 1, y: 5, z: 0.5 },
  },
  { // Theater (south window)
    position: { x: -8, y: 1, z: 12},
    halfExtents: { x: 1, y: 5, z: 0.5 },
  },
  { // Parlor (south window)
    position: { x: -21, y: 1, z: 16},
    halfExtents: { x: 1, y: 5, z: 0.5 },
  },
  { // Parlor (north window)
    position: { x: -26, y: 1, z: -2},
    halfExtents: { x: 1, y: 5, z: 0.5 },
  },
  { // Dining Hall (south window)
    position: { x: 31, y: 1, z: 15},
    halfExtents: { x: 1, y: 5, z: 0.5 },
  },
  { // Dining Hall (north window)
    position: { x: 31, y: 1, z: -2},
    halfExtents: { x: 1.5, y: 5, z: 0.5 },
  },
  { // Art Gallery (north window)
    position: { x: 26, y: 1, z: -26},
    halfExtents: { x: 2.5, y: 5, z: 0.5 },
  },
  { // Kitchen (west window 1)
    position: { x: -29, y: 1, z: -18 },
    halfExtents: { x: 0.5, y: 5, z: 1.5 },
  },
  { // Kitchen (west window 2)
    position: { x: -29, y: 1, z: -23 },
    halfExtents: { x: 0.5, y: 5, z: 1.5 },
  }
]

export const PURCHASE_BARRIERS = [
  {
    name: 'Unlock Theater Room (South)',
    removalPrice: 100,
    position: { x: 2.5, y: 1.5, z: 15 },
    rotation: Quaternion.fromEuler(0, 0, 0),
    width: 5,
    unlockIds: [ 'theater' ],
  },
  {
    name: 'Unlock Parlor (South)',
    removalPrice: 25,
    position: { x: -8, y: 1.5, z: 18.5 },
    rotation: Quaternion.fromEuler(0, 90, 0),
    width: 3,
    unlockIds: [ 'parlor' ],
  },
  {
    name: 'Unlock Dining Hall (South)',
    removalPrice: 50,
    position: { x: 13, y: 1.5, z: 18.5 },
    rotation: Quaternion.fromEuler(0, 90, 0),
    width: 3,
    unlockIds: [ 'dining' ],
  },
  {
    name: 'Unlock Theater Room (West)',
    removalPrice: 75,
    position: { x: -15, y: 1.5, z: 3 },
    rotation: Quaternion.fromEuler(0, 90, 0),
    width: 5,
    unlockIds: [ 'theater', 'parlor' ],
  },
  {
    name: 'Unlock Theater Room (East)',
    removalPrice: 75,
    position: { x: 19, y: 1.5, z: 3 },
    rotation: Quaternion.fromEuler(0, 90, 0),
    width: 5,
    unlockIds: [ 'theater', 'dining' ],
  },
  {
    name: 'Unlock Art Gallery (South)',
    removalPrice: 200,
    position: { x: 26.5, y: 1.5, z: -2 },
    rotation: Quaternion.fromEuler(0, 0, 0),
    width: 5,
    unlockIds: [ 'gallery', 'dining' ],
  },
  {
    name: 'Unlock Kitchen (South)',
    removalPrice: 200,
    position: { x: -22, y: 1.5, z: -2 },
    rotation: Quaternion.fromEuler(0, 0, 0),
    width: 5,
    unlockIds: [ 'kitchen', 'parlor' ],
  },
  {
    name: 'Unlock Vault',
    removalPrice: 200,
    position: { x: 0.5, y: 1.5, z: -26 },
    rotation: Quaternion.fromEuler(0, 0, 0),
    width: 3,
    unlockIds: [ 'vault' ],
  },
  {
    name: 'Unlock Treasure Room (West)',
    removalPrice: 75,
    position: { x: -15, y: 1.5, z: -19 },
    rotation: Quaternion.fromEuler(0, 90, 0),
    width: 5,
    unlockIds: [ 'treasure', 'kitchen' ],
  },
  {
    name: 'Unlock Treasure Room (East)',
    removalPrice: 75,
    position: { x: 20, y: 1.5, z: -19 },
    rotation: Quaternion.fromEuler(0, 90, 0),
    width: 5,
    unlockIds: [ 'treasure', 'gallery' ],
  },
]

export const ENEMY_SPAWN_POINTS = {
  start: [
    { x: -20, z: 34 },
    { x: 12, z: 36 },
    { x: 26, z: 20 },
    { x: 18, z: 8 },
  ],
  theater: [
    { x: -13.5, z: 10 },
  ],
  parlor: [
    { x: -36, z: 23 },
    { x: -35, z: -5 },
  ],
  dining: [
    { x: 46, z: 16 },
    { x: 41, z: -5 },
  ],
  gallery: [
    { x: 35, z: -39 },
    { x: 12, z: -40 },
  ],
  kitchen: [
    { x: -28, z: -32 },
    { x: -40, z: -5 },
  ],
  treasure: [
    { x: -13, z: -27 },
    { x: 0, z: -37 },
  ],
};
