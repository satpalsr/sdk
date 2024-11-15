# HYTOPIA SDK Examples

HYTOPIA SDK examples are a collection of HYTOPIA SDK projects that demonstrate full games or specific features using the SDK.

In each folder, you'll find an index.ts file - this is the main entry point and where you'll find the code for each example.

Here's an overview of the examples available:
- [`payload-game`](./payload-game): A simple game where players must stay near a payload for it to move towards its destination while enemies spawn and swarm the players.
- [`character-controller`](./character-controller): A simple example of how to implement your own character controller class.
- [`entity-spawn`](./entity-spawn): A simple example of how to spawn an entity and set some of its properties.

## Use Examples As Templates For Your Projects

If you want to init a new HYTOPIA project based on an example in this directory, you can use the `hytopia init` command with the `--template` flag. 

For example, to create a new project based on the `payload-game` example, you can run:

```bash
bunx hytopia init --template payload-game
```

The value passed to the `--template` flag should be the name of the folder in the examples directory.