export type HeldHand = 'left' | 'right' | 'both';

export interface UIData {
  type: 'ammo-indicator' | 'inventory' | 'inventory-active-slot' | 'inventory-quantity-update' | 'health';
  [key: string]: any;
}

export interface InventoryItem {
  name: string;
  iconImageUri: string;
  quantity: number;
}

export interface AmmoIndicatorData extends UIData {
  type: 'ammo-indicator';
  ammo?: number;
  totalAmmo?: number;
  show?: boolean;
  reloading?: boolean;
}

export interface InventoryData extends UIData {
  type: 'inventory';
  inventory: (InventoryItem | undefined)[];
}

export interface InventoryActiveSlotData extends UIData {
  type: 'inventory-active-slot';
  index: number;
}

export interface InventoryQuantityUpdateData extends UIData {
  type: 'inventory-quantity-update';
  index: number;
  quantity: number;
}

export interface HealthData extends UIData {
  type: 'health';
  health: number;
  maxHealth: number;
} 