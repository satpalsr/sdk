import {
  PathfindingEntityController,
} from 'hytopia';

import EnemyEntity from '../EnemyEntity';
import type { EnemyEntityOptions } from '../EnemyEntity';

export default class ZombieEntity extends EnemyEntity {
  public constructor(options: Partial<EnemyEntityOptions>) {
    super({
      damage: options.damage ?? 5,
      health: options.health ?? 100,
      jumpHeight: options.jumpHeight ?? 2,
      speed: options.speed ?? 5,

      controller: new PathfindingEntityController(),
      modelUri: 'models/npcs/zombie.gltf',
      modelLoopedAnimations: [ 'walk' ],
      modelScale: 0.4 + Math.random() * 0.4,
      rigidBodyOptions: {
        enabledRotations: { x: false, y: true, z: false },
        ccdEnabled: true,
      },
    });
  }
}
