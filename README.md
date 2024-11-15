# HYTOPIA SDK

## Quick Links
[Quickstart](#quickstart) • [API Reference](./docs/server.md) • [Report Bugs or Request Features](https://github.com/hytopiagg/sdk/issues)

## What is HYTOPIA?

![HYTOPIA Demo](./readme/assets/demo.gif)

HYTOPIA is a modern games platform inspired by Minecraft, Roblox, and Rec Room.

HYTOPIA allows you to create your own highly-sharable, immersive, massively multiplayer games in a voxel-like style by writing TypeScript or JavaScript. All playable in a web browser on any device!

## What is this SDK?

*Note: This SDK is currently in alpha development. Expect breaking changes with new version releases.*

The HYTOPIA SDK makes it easy for developers to create multiplayer games on the HYTOPIA platform using JavaScript or TypeScript. 

Available as a simple NPM package, this SDK provides everything you need to get started:

- Compiled HYTOPIA Server: The ready-to-use server software.
- Game Client & Debugger: Accessible at https://play.hytopia.com
- TypeScript Definitions: For strong typing and code completion.
- Documentation: Detailed guides and API reference.
- Default Assets: Textures, models, audio and more you can use in your games.
- Examples: Sample projects & scripts showing how to build different types of games.

With these resources, you can quickly build and share immersive, voxel-style multiplayer games on HYTOPIA.

## Quickstart

1. Install a compatible JavaScript runtime. We recommend you use [Bun](https://bun.sh/), but [Node.js](https://nodejs.org/) and [Deno](https://deno.com/) can work with additional configuration. All examples will be given using Bun.

2. Create a new project directory somewhere on your machine and navigate into it.
```bash
mkdir my-project-directory && cd my-project-directory
```

3. Initialize a hytopia project from boilerplate or an existing example. Sets up package.json and all dependencies, copies assets and an index.ts game script into your project.
```bash
# Option 1: Initialize a boilerplate project
bunx hytopia init

# Option 2: Initialize a project from any of the examples in the examples directory like so:
bunx hytopia init --template payload-game
```

3. Start the server, use --watch for hot reloads as you make changes.
```bash
bun --watch index.ts
```

4. Visit https://play.hytopia.com - when prompted, enter `localhost:8080` - this is the hostname of the local server you started in the previous step.

**Note: If you'd prefer to use JavaScript instead of TypeScript, simply change the file extension of index.ts to index.js - Your editor will highlight the TypeScript syntax errors, simple delete the type annotations and everything should work the same without any TypeScript usage.**

Once you're up and running, here's some other resources to go further:
- [Game Examples](./examples)
- [API Reference](./docs/server.md)

## Architecture & Motivation

HYTOPIA gives developers full control to create any game imaginable in a voxel-like style. The underlying architecture handles low-level tasks like networking, prediction, entity lifecycle, physics and more, so you can focus on building and deploying games quickly.

With HYTOPIA's 100% server-authoritative setup and overall implementation, games are default-deterministic. All game inputs by players are relayed to and verified by the server, making gameplay naturally anti-cheat and preventing exploits like position spoofing.

HYTOPIA overcomes the creativity limits of Minecraft, the complexities of Unity and UE5, and the difficult developer learning curve of Roblox with a developer-first, flexible approach, enabling you to build games in hours using JavaScript or TypeScript.

Bring your own game assets as GLTF models with full server-driven animation support, block textures, ambient and sfx audio, and more - or use HYTOPIA's defaults included with this SDK to craft your game.

We built HYTOPIA to empower both veteran and aspiring game developers to create multiplayer-first, voxel-style, hyper-sharable games. Developer APIs and documentations are simple, powerful and clear. Whether you've been building games for years, a frontend web developer who's dreamed of building a game, an eager learner that's always dreamed of building games, or a curious school student, HYTOPIA was built for you..