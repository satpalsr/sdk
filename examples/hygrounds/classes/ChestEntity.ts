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
      // spit out some items
    }, 2000);
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
}