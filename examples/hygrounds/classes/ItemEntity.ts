import {
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
}

export default class ItemEntity extends Entity {
  public readonly heldHand: HeldHand;
  public readonly iconImageUri: string;
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
      rigidBodyOptions: ItemEntity._createRigidBodyOptions(colliderOptions),
    });

    this.heldHand = options.heldHand;
    this.iconImageUri = options.iconImageUri;
    this.idleAnimation = options.idleAnimation;
    this.mlAnimation = options.mlAnimation;

    this._labelSceneUI = this._createLabelUI();
      
    if (options.parent) {
      this.setParentAnimations();
    }
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
    this.setParentAnimations();
  }

  public unequip() {
    this.setPosition(INVENTORIED_POSITION);

    if (this.parent instanceof GamePlayerEntity) {
      this.parent.resetAnimations();
    }
  }
  
  public getQuantity(): number {
    return -1;
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

  private static _createRigidBodyOptions(colliderOptions: any) {
    return {
      enabledRotations: { x: false, y: true, z: false },
      colliders: [{
        ...colliderOptions,
        collisionGroups: {
          belongsTo: [ CollisionGroup.ENTITY ],
          collidesWith: [ CollisionGroup.BLOCK ],
        },
        halfExtents: colliderOptions.halfExtents ? {
          x: colliderOptions.halfExtents.x * 2,
          y: colliderOptions.halfExtents.y * 2,
          z: colliderOptions.halfExtents.z * 2,
        } : undefined,
        halfHeight: colliderOptions.halfHeight ? colliderOptions.halfHeight * 2 : undefined,
        radius: colliderOptions.radius ? colliderOptions.radius * 2 : undefined,
      }]
    };
  }
}