import {
  Audio,
  Collider,
  CollisionGroup,
  Entity,
  EntityOptions,
  PlayerEntityController,
  QuaternionLike,
  SceneUI,
  Vector3Like,
  World,
} from 'hytopia';

import GamePlayerEntity from './GamePlayerEntity';

const INVENTORIED_POSITION = { x: 0, y: -300, z: 0 };

export type HeldHand = 'left' | 'right' | 'both';

export interface ItemEntityOptions extends EntityOptions {
  heldHand: HeldHand;    // The hand the item is held in.
  iconImageUri: string;  // The image uri of the weapon icon.
  idleAnimation: string; // The animation played when the player holding it is idle.
  mlAnimation: string;   // The animation played when the player holding it clicks the left mouse button.
  quantity?: number;
  consumable?: boolean;
  consumeAudioUri?: string;
  consumeTimeMs?: number;
}

export default class ItemEntity extends Entity {
  public readonly consumable: boolean;
  public quantity: number;
  public readonly heldHand: HeldHand;
  public readonly iconImageUri: string;
  protected readonly consumeAudioUri: string | undefined;
  protected readonly consumeTimeMs: number;
  protected readonly idleAnimation: string;
  protected readonly mlAnimation: string;
  private readonly _labelSceneUI: SceneUI;

  public constructor(options: ItemEntityOptions) {
    if (!options.modelUri && !options.blockHalfExtents) {
      throw new Error('ItemEntity requires either modelUri or blockHalfExtents');
    }

    const colliderOptions = options.modelUri
      ? Collider.optionsFromModelUri(options.modelUri)
      : Collider.optionsFromBlockHalfExtents(options.blockHalfExtents!);


    super({
      ...options,
      parentNodeName: ItemEntity._getHandAnchorNode(options.heldHand),
      rigidBodyOptions: ItemEntity._createRigidBodyOptions(colliderOptions, options.modelScale ?? 1),
    });

    this.consumable = options.consumable ?? false;
    this.consumeAudioUri = options.consumeAudioUri;
    this.consumeTimeMs = options.consumeTimeMs ?? 0;
    this.quantity = options.quantity ?? -1;
    this.heldHand = options.heldHand;
    this.iconImageUri = options.iconImageUri;
    this.idleAnimation = options.idleAnimation;
    this.mlAnimation = options.mlAnimation;

    this._labelSceneUI = this._createLabelUI();
      
    if (options.parent) {
      this.setParentAnimations();
    }
  }

  public consume(): void {
    if (!this.consumable || !this.consumeAudioUri || !this.parent || !this.world) return;

    this.quantity--;

    if (!this.quantity) {
      this.drop(this.position, { x: 0, y: 0, z: 0 });
      this.despawn();
    }

    (new Audio({
      attachedToEntity: this.parent,
      uri: this.consumeAudioUri,
      volume: 0.5,
      referenceDistance: 5,
    })).play(this.world);
    
    this._updateVisualEffects();
  }

  public drop(fromPosition: Vector3Like, direction: Vector3Like): void {
    if (!this.world) return;

    this.setParent(undefined, undefined, fromPosition);

    // Apply impulse in next tick to avoid physics issues
    setTimeout(() => {
      this.applyImpulse({
        x: direction.x * this.mass * 7,
        y: direction.y * this.mass * 15,
        z: direction.z * this.mass * 7,
      });
    }, 0);

    this._updateVisualEffects();
  }

  public equip() {
    this.setPosition({ x: 0, y: 0, z: 0 });
    this.setParentAnimations();
  }

  public unequip() {
    this.setPosition(INVENTORIED_POSITION);

    if (this.parent instanceof GamePlayerEntity) {
      this.parent.resetAnimations();
    }
  }
  
  public getQuantity(): number {
    return this.quantity;
  }

  public pickup(player: GamePlayerEntity): void {
    if (!player.world) return;

    this.setParent(player, ItemEntity._getHandAnchorNode(this.heldHand), INVENTORIED_POSITION);
    this._updateVisualEffects();
    
    player.addItemToInventory(this);
  }

  public setParentAnimations(): void {
    if (!this.parent || !this.parent.world || !(this.parent instanceof GamePlayerEntity)) return;

    const controller = this.parent.controller as PlayerEntityController;
    controller.idleLoopedAnimations = [ this.idleAnimation, 'idle_lower' ];
    controller.walkLoopedAnimations = [ this.idleAnimation, 'walk_lower' ];
    controller.runLoopedAnimations = [ this.idleAnimation, 'run_lower' ];
  }

  public override spawn(world: World, position: Vector3Like, rotation?: QuaternionLike): void {
    super.spawn(world, position, rotation);
    this._updateVisualEffects(); 
  }

  private _createLabelUI(): SceneUI {
    return new SceneUI({
      attachedToEntity: this,
      templateId: 'item-label',
      state: { name: this.name, quantity: this.getQuantity() },
      viewDistance: 8,
      offset: { x: 0, y: 1, z: 0 },
    });
  }

  private _updateVisualEffects(): void {
    if (!this.world) return;

    if (!this.parent) {
      this._labelSceneUI.setState({ quantity: this.getQuantity() });
      this._labelSceneUI.load(this.world);
    } else {
      this._labelSceneUI.unload();
    }
  }

  private static _getHandAnchorNode(heldHand: HeldHand): string {
    return heldHand === 'left' ? 'hand_left_anchor' : 'hand_right_anchor';
  }

  private static _createRigidBodyOptions(colliderOptions: any, modelScale: number) {
    return {
      enabledRotations: { x: false, y: true, z: false },
      colliders: [{
        ...colliderOptions,
        collisionGroups: {
          belongsTo: [ CollisionGroup.ENTITY ],
          collidesWith: [ CollisionGroup.BLOCK ],
        },
        halfExtents: colliderOptions.halfExtents ? {
          x: colliderOptions.halfExtents.x * modelScale * 2,
          y: colliderOptions.halfExtents.y * modelScale * 2,
          z: colliderOptions.halfExtents.z * modelScale * 2,
        } : undefined,
        halfHeight: colliderOptions.halfHeight ? colliderOptions.halfHeight * modelScale * 2 : undefined,
        radius: colliderOptions.radius ? colliderOptions.radius * modelScale * 2 : undefined,
      }]
    };
  }
}