import { PathfindingEntityController } from 'hytopia';

import EnemyEntity from '../EnemyEntity';
import type { EnemyEntityOptions } from '../EnemyEntity';

export default class RipperEntity extends EnemyEntity {
  public constructor(options: Partial<EnemyEntityOptions> = {}) {
    const speed = options.speed ?? 2;
    const animation = speed > 6 ? 'animation.ripper_zombie.sprint' : 'animation.ripper_zombie.walk';

    super({
      damage: options.damage ?? 6,
      damageAudioUri: options.damageAudioUri ?? 'audio/sfx/entity/zombie/zombie-hurt.mp3',
      health: options.health ?? 300,
      idleAudioUri: options.idleAudioUri ?? 'audio/sfx/ripper-idle.mp3',
      idleAudioVolume: 1,
      idleAudioReferenceDistance: 8,
      jumpHeight: options.jumpHeight ?? 2,
      preferJumping: true,
      reward: options.reward ?? 300,
      speed,
      controller: new PathfindingEntityController(),
      modelUri: 'models/npcs/ripper-boss.gltf',
      modelLoopedAnimations: [ animation ],
      modelScale: 0.5,
      rigidBodyOptions: {
        enabledRotations: { x: false, y: true, z: false },
        ccdEnabled: true,
      },
    });
  }
}