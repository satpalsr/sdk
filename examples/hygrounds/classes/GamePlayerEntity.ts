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
import PickaxeEntity from './weapons/PickaxeEntity';
import MeleeWeaponEntity from './MeleeWeaponEntity';

const BASE_HEALTH = 100;
const TOTAL_INVENTORY_SLOTS = 6;
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
    this._setupPlayerInventory();
    this._autoHealTicker();
    this._updatePlayerUIHealth();
  }

  public addItemToInventory(item: ItemEntity): void {
    const slot = this._findInventorySlot();
    this._inventory[slot] = item;
    this._updatePlayerUIInventory();
    this._updatePlayerUIInventoryActiveSlot();
    this.setActiveInventorySlotIndex(this._inventoryActiveSlotIndex);
  }
  
  public dropInventoryItem(): void {
    if (this._inventoryActiveSlotIndex === 0) {
      this.world?.chatManager?.sendPlayerMessage(this.player, 'You cannot drop your pickaxe!');
      return;
    }

    const item = this._inventory[this._inventoryActiveSlotIndex];
    if (!item) return;

    item.unequip();
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

  public resetAnimations(): void {
    this.playerController.idleLoopedAnimations = ['idle_lower', 'idle_upper'];
    this.playerController.interactOneshotAnimations = [];
    this.playerController.walkLoopedAnimations = ['walk_lower', 'walk_upper'];
    this.playerController.runLoopedAnimations = ['run_lower', 'run_upper'];
  }

  public setActiveInventorySlotIndex(index: number): void {
    if (index !== this._inventoryActiveSlotIndex) {
      this._inventory[this._inventoryActiveSlotIndex]?.unequip();
    }

    this._inventoryActiveSlotIndex = index;

    if (this._inventory[index]) {
      this._inventory[index].equip();
    }

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

    this.resetAnimations();

    this.playerController.on(BaseEntityControllerEvent.TICK_WITH_PLAYER_INPUT, this._onTickWithPlayerInput);
  }

  private _setupPlayerInventory(): void {
    const pickaxe = new PickaxeEntity();
    pickaxe.spawn(this.world!, this.position);
    pickaxe.pickup(this);
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
      this._handleMouseLeftClick();
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

  private _handleMouseLeftClick(): void {
    const activeItem = this._inventory[this._inventoryActiveSlotIndex];
    
    if (activeItem instanceof GunEntity) {
      activeItem.shoot();
    }

    if (activeItem instanceof MeleeWeaponEntity) {
      activeItem.attack();
    }
  }

  private _handleReload(): void {
    const activeItem = this._inventory[this._inventoryActiveSlotIndex];
    if (activeItem instanceof GunEntity) {
      activeItem.reload();
    }
  }

  private _handleInventoryHotkeys(input: any): void {
    if (input.f) {
      this.setActiveInventorySlotIndex(0);
      input.f = false;
    }

    for (let i = 1; i <= TOTAL_INVENTORY_SLOTS; i++) {
      const key = i.toString();
      if (input[key]) {
        this.setActiveInventorySlotIndex(i);
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
    if (hitEntity instanceof ItemEntity) {
      if (this._findInventorySlot() === 0) {
        this.world?.chatManager?.sendPlayerMessage(this.player, 'You cannot replace your pickaxe! Switch to a different item first to pick up this item.');
        return;
      }

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
