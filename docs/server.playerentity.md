<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [server](./server.md) &gt; [PlayerEntity](./server.playerentity.md)

## PlayerEntity class

Represents an entity controlled by a player in a world.

**Signature:**

```typescript
export default class PlayerEntity extends Entity 
```
**Extends:** [Entity](./server.entity.md)

## Remarks

Player entities extend the [Entity](./server.entity.md) class. They can be created and assigned to a player at anytime during gameplay, but most commonly when a player joins a world. PlayerEntity expects a controller to be set prior to spawning. Without setting a controller, the player entity will not respond to player inputs and throw an error.

## Example


```typescript
world.onPlayerJoin = player => {
  const playerEntity = new PlayerEntity({
    player,
    name: 'Player',
    modelUri: 'models/players/player.gltf',
    modelLoopedAnimations: [ 'idle_lower', 'idle_upper' ],
    modelScale: 0.5,
  });

  playerEntity.spawn(world, { x: 10, y: 20, z: 15 });
};
```

## Constructors

<table><thead><tr><th>

Constructor


</th><th>

Modifiers


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[(constructor)(options)](./server.playerentity._constructor_.md)


</td><td>


</td><td>

Constructs a new instance of the `PlayerEntity` class


</td></tr>
</tbody></table>

## Properties

<table><thead><tr><th>

Property


</th><th>

Modifiers


</th><th>

Type


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[nametagSceneUI](./server.playerentity.nametagsceneui.md)


</td><td>

`readonly`


</td><td>

[SceneUI](./server.sceneui.md)


</td><td>

The SceneUI instance for the player entity's nametag.


</td></tr>
<tr><td>

[player](./server.playerentity.player.md)


</td><td>

`readonly`


</td><td>

[Player](./server.player.md)


</td><td>

The player the player entity is assigned to and controlled by.


</td></tr>
</tbody></table>
