
export default class ItemFactory {
  public static async createItem(itemId: string) {
    let itemModule

    // We do imports here to avoid circular dependencies
    // We should really just refactor import patterns,
    // but this is a quick fix for now.
    switch(itemId) {
      case 'ak47':
        itemModule = await import('./weapons/AK47Entity');
        break;
      case 'auto-shotgun':
        itemModule = await import('./weapons/AutoShotgunEntity');
        break;
      case 'bolt-action-sniper':
        itemModule = await import('./weapons/BoltActionSniperEntity');
        break;
      case 'light-machine-gun':
        itemModule = await import('./weapons/LightMachineGunEntity');
        break;
      case 'medpack':
        itemModule = await import('./items/MedPackEntity');
        break;
      case 'pistol':
        itemModule = await import('./weapons/PistolEntity');
        break;
      case 'rocket-launcher':
        itemModule = await import('./weapons/RocketLauncherEntity');
        break;
      case 'shotgun':
        itemModule = await import('./weapons/ShotgunEntity');
        break;
      case 'shield-potion':
        itemModule = await import('./items/ShieldPotionEntity');
        break;
      default:
        throw new Error(`Unknown chest item id: ${itemId}`);
    }

    const itemClass = itemModule.default;
    const item = new itemClass();

    return item;
  }
}