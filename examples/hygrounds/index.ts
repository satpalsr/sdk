import {
  startServer,
  PlayerEvent,
  ModelRegistry,
} from 'hytopia';

import GameManager from './classes/GameManager';
import GamePlayerEntity from './classes/GamePlayerEntity';

import AK47Entity from './classes/weapons/AK47Entity';
import AutoShotgunEntity from './classes/weapons/AutoShotgunEntity';
import BoltActionSniperEntity from './classes/weapons/BoltActionSniper';
import LightMachineGunEntity from './classes/weapons/LightMachineGun';
import PistolEntity from './classes/weapons/PistolEntity';
import PickaxeEntity from './classes/weapons/PickaxeEntity';
import RocketLauncherEntity from './classes/weapons/RocketLauncher';
import ShotgunEntity from './classes/weapons/ShotgunEntity';
import MedPackEntity from './classes/items/MedPackEntity';
import ShieldPotionEntity from './classes/items/ShieldPotionEntity';

import worldMap from './assets/map.json';

startServer(world => {
  // Load the game map
  world.loadMap(worldMap);

  // Set lighting
  world.setAmbientLightIntensity(0.6);
  world.setDirectionalLightIntensity(5);

  world.simulation.enableDebugRaycasting(true);

  GameManager.instance.setupGame(world);

  const testAK47 = new AK47Entity();
  testAK47.spawn(world, { x: -5, y: 10, z: -3 });

  const testAutoShotgun = new AutoShotgunEntity();
  testAutoShotgun.spawn(world, { x: -9, y: 10, z: -4 });

  const testBoltActionSniper = new BoltActionSniperEntity();
  testBoltActionSniper.spawn(world, { x: -5, y: 10, z: -8 });

  const lightMachineGun = new LightMachineGunEntity();
  lightMachineGun.spawn(world, { x: -5, y: 10, z: -13 });

  const medPack = new MedPackEntity();
  medPack.spawn(world, { x: -16, y: 10, z: -7 });

  const shieldPotion = new ShieldPotionEntity();
  shieldPotion.spawn(world, { x: -18, y: 10, z: -3 });

  const rocketLauncher = new RocketLauncherEntity();
  rocketLauncher.spawn(world, { x: -23, y: 10, z: -9 });

  const testShotgun = new ShotgunEntity();
  testShotgun.spawn(world, { x: -5, y: 10, z: -5 });
 
  const textPickaxe = new PickaxeEntity();
  textPickaxe.spawn(world, { x: -3, y: 3, z: -3 });

  const testPistol = new PistolEntity();
  testPistol.spawn(world, { x: 3, y: 2.5, z: 3 });

  // Handle player joining the game
  world.on(PlayerEvent.JOINED_WORLD, ({ player }) => {
    const playerEntity = new GamePlayerEntity(player);
    
    // Spawn player at starting position
    playerEntity.spawn(world, { x: -22, y: 3, z: -9 });
  });

  // Handle player leaving the game
  world.on(PlayerEvent.LEFT_WORLD, ({ player }) => {
    // Clean up player entities
    world.entityManager
      .getPlayerEntitiesByPlayer(player)
      .forEach(entity => entity.despawn());
  });
});
