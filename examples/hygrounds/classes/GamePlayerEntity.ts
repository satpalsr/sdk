import { 
  Audio,
  BaseEntityControllerEvent,
  EventPayloads,
  Player,
  PlayerEntity,
  PlayerCameraMode,
  Vector3Like,
  QuaternionLike,
  World,
  PlayerEntityController,
} from 'hytopia';

import GunEntity from './GunEntity';
import ItemEntity from './ItemEntity';

const BASE_HEALTH = 100;
const TOTAL_INVENTORY_SLOTS = 5;
const INTERACT_RANGE = 4;

interface InventoryItem {
  name: string;
  iconImageUri: string;
  quantity: number;
}

export default class GamePlayerEntity extends PlayerEntity {
  private readonly _damageAudio: Audio;
  private readonly _inventory: (ItemEntity | undefined)[] = new Array(TOTAL_INVENTORY_SLOTS).fill(undefined);
  private _inventoryActiveSlotIndex: number = 0;
  private _health: number;
  private readonly _maxHealth: number;

  // Player entities always assign a PlayerController to the entity
  public get playerController(): PlayerEntityController {
    return this.controller as PlayerEntityController;
  }

  public get health(): number { return this._health; }
  public set health(value: number) {
    this._health = Math.max(0, Math.min(value, this._maxHealth));
    this._updatePlayerUIHealth();
  }

  public constructor(player: Player) {
    super({
      player,
      name: 'Player',
      modelUri: 'models/players/soldier-player.gltf',
      modelScale: 0.5,
    });
    
    this._setupPlayerController();
    this._setupPlayerUI();
    this._setupPlayerCamera();

    this._health = BASE_HEALTH;
    this._maxHealth = BASE_HEALTH;

    this._damageAudio = new Audio({
      attachedToEntity: this,
      uri: 'audio/sfx/player-hurt.mp3',
      loop: false,
      volume: 0.7,
    });
  }

  public override spawn(world: World, position: Vector3Like, rotation?: QuaternionLike): void {
    super.spawn(world, position, rotation);
    this._autoHealTicker();
    this._updatePlayerUIHealth();
  }

  public addItemToInventory(item: ItemEntity): void {
    const slot = this._findInventorySlot();
    this._inventory[slot] = item;
    this._updatePlayerUIInventory();
    this._updatePlayerUIInventoryActiveSlot();
  }
  
  public dropInventoryItem(): void {
    const item = this._inventory[this._inventoryActiveSlotIndex];
    if (!item) return;

    item.drop(this.position, this.player.camera.facingDirection);
    this._inventory[this._inventoryActiveSlotIndex] = undefined;
    this._updatePlayerUIInventory();
    this._updatePlayerUIInventoryActiveSlot();
  }

  public getItemInventorySlot(item: ItemEntity): number {
    return this._inventory.findIndex(slot => slot === item);
  }

  public isItemActiveInInventory(item: ItemEntity): boolean {
    return this._inventory[this._inventoryActiveSlotIndex] === item;
  }

  public setActiveInventorySlotIndex(index: number): void {
    this._inventoryActiveSlotIndex = index;
    this._updatePlayerUIInventoryActiveSlot();
  }

  public takeDamage(damage: number): void {
    if (!this.isSpawned || !this.world) return;

    this.health = this.health - damage;
    this._playDamageAudio();
  }

  public updateItemInventoryQuantity(item: ItemEntity): void {
    const index = this.getItemInventorySlot(item);
    if (index === -1) return;

    this.player.ui.sendData({
      type: 'inventory-quantity-update',
      index,
      quantity: item.getQuantity(),
    });
  }

  private _setupPlayerController(): void {
    this.playerController.autoCancelMouseLeftClick = false;
    
    this.playerController.idleLoopedAnimations = ['idle_lower', 'idle_upper'];
    this.playerController.interactOneshotAnimations = [];
    this.playerController.walkLoopedAnimations = ['walk_lower', 'walk_upper'];
    this.playerController.runLoopedAnimations = ['run_lower', 'run_upper'];

    this.playerController.on(BaseEntityControllerEvent.TICK_WITH_PLAYER_INPUT, this._onTickWithPlayerInput);
  }

  private _setupPlayerUI(): void {
    this.player.ui.load('ui/index.html');
  }

  private _setupPlayerCamera(): void {
    this.player.camera.setMode(PlayerCameraMode.FIRST_PERSON);
    this.player.camera.setModelHiddenNodes([ 'head', 'neck', 'torso', 'leg_right', 'leg_left' ]);
    this.player.camera.setOffset({ x: 0, y: 0.5, z: 0 });
  }

  private _onTickWithPlayerInput = (payload: EventPayloads[BaseEntityControllerEvent.TICK_WITH_PLAYER_INPUT]): void => {
    const { input } = payload;

    if (input.ml) {
      this._handleShoot();
    }

    if (input.e) {
      this._handleInteract();
      input.e = false;
    }

    if (input.q) {
      this.dropInventoryItem();
      input.q = false;
    }

    if (input.r) {
      this._handleReload();
      input.r = false;
    }

    this._handleInventoryHotkeys(input);
  }

  private _handleShoot(): void {
    const activeItem = this._inventory[this._inventoryActiveSlotIndex];
    if (activeItem instanceof GunEntity) {
      activeItem.shoot();
    }
  }

  private _handleReload(): void {
    const activeItem = this._inventory[this._inventoryActiveSlotIndex];
    if (activeItem instanceof GunEntity) {
      activeItem.reload();
    }
  }

  private _handleInventoryHotkeys(input: any): void {
    for (let i = 1; i <= TOTAL_INVENTORY_SLOTS; i++) {
      const key = i.toString();
      if (input[key]) {
        this.setActiveInventorySlotIndex(i - 1);
        input[key] = false;
      }
    }
  }

  private _handleInteract(): void {
    if (!this.world) return;

    const origin = {
      x: this.position.x,
      y: this.position.y + this.player.camera.offset.y,
      z: this.position.z,
    };
    
    const raycastHit = this.world.simulation.raycast(
      origin,
      this.player.camera.facingDirection,
      INTERACT_RANGE,
      { filterExcludeRigidBody: this.rawRigidBody }
    );

    const hitEntity = raycastHit?.hitEntity;
    if (hitEntity instanceof GunEntity) {
      hitEntity.pickup(this);
    }
  }

  private _findInventorySlot(): number {
    // Try active slot first if empty
    if (!this._inventory[this._inventoryActiveSlotIndex]) {
      return this._inventoryActiveSlotIndex;
    }

    // Find first empty slot or use active slot if none found
    const emptySlot = this._inventory.findIndex(slot => !slot);
    return emptySlot !== -1 ? emptySlot : this._inventoryActiveSlotIndex;
  }

  private _updatePlayerUIInventory(): void {
    this.player.ui.sendData({
      type: 'inventory',
      inventory: this._inventory.map(item => {
        if (!item) return;

        return {
          name: item.name,
          iconImageUri: item.iconImageUri,
          quantity: item.getQuantity(),
        } as InventoryItem;
      })
    });
  }

  private _updatePlayerUIInventoryActiveSlot(): void {
    this.player.ui.sendData({
      type: 'inventory-active-slot',
      index: this._inventoryActiveSlotIndex,
    });

    const activeItem = this._inventory[this._inventoryActiveSlotIndex];
    if (activeItem instanceof GunEntity) {
      activeItem.updateAmmoIndicatorUI();
    } else {
      this.player.ui.sendData({
        type: 'ammo-indicator',
        show: false,
      });
    }
  }

  private _updatePlayerUIHealth(): void {
    this.player.ui.sendData({
      type: 'health',
      health: this._health,
      maxHealth: this._maxHealth
    });
  }

  private _playDamageAudio(): void {
    this._damageAudio.setDetune(-200 + Math.random() * 800);
    this._damageAudio.play(this.world!, true);
  }

  private _autoHealTicker(): void {
    setTimeout(() => {
      if (!this.isSpawned) return;

      if (this.health < this._maxHealth) {
        this.health += 1;
      }

      this._autoHealTicker();
    }, 1000);
  }
}
