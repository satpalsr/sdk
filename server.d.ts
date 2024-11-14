/// <reference types="node" />

import type { AnyPacket } from '@hytopia.com/server-protocol';
import http from 'http';
import type { IncomingMessage } from 'http';
import type { InputSchema } from '@hytopia.com/server-protocol';
import type { IPacket } from '@hytopia.com/server-protocol';
import protocol from '@hytopia.com/server-protocol';
import RAPIER from '@dimforge/rapier3d-compat';
import { SdpMatrix3 } from '@dimforge/rapier3d-compat';
import type { Socket as Socket_2 } from 'net';
import { Vector } from '@dimforge/rapier3d-compat';
import { WebSocket as WebSocket_2 } from 'ws';

/**
 * Represents a audio playback in a world.
 *
 * @remarks
 * Audio instances are created directly as instances.
 * They support a variety of configuration options through
 * the {@link AudioOptions} constructor argument.
 *
 * @example
 * ```typescript
 * (new Audio({
 *   uri: 'assets/music/song.mp3',
 *   loop: true,
 *   volume: 0.5,
 * })).play(world);
 * ```
 *
 * @public
 */
export declare class Audio implements protocol.Serializable {















    /**
     * @param audioData - The options for the audio instance.
     */
    constructor(options: AudioOptions);
    /** The unique identifier for the audio. */
    get id(): number | undefined;
    /** The entity to which the audio is attached if explicitly set. */
    get attachedToEntity(): Entity | undefined;
    /** The duration of the audio in seconds if explicitly set. */
    get duration(): number | undefined;
    /** The detune of the audio in cents if explicitly set. */
    get detune(): number | undefined;
    /** The amount of distortion to apply to the audio if explicitly set. */
    get distortion(): number | undefined;
    /** Whether the audio is looped. */
    get loop(): boolean;
    /** The offset time in seconds from which the audio should start playing if explicitly set. */
    get offset(): number | undefined;
    /** Whether the audio has loaded into the world. Audio is loaded the first time play() is called. */
    get isLoaded(): boolean;
    /** Whether the audio is currently playing. */
    get isPlaying(): boolean;
    /** Whether the audio is positional (Entity or position attached). */
    get isPositional(): boolean;
    /** The position of the audio in the world if explicitly set. */
    get position(): Vector3 | undefined;
    /** The playback rate of the audio if explicitly set. */
    get playbackRate(): number | undefined;
    /** The reference distance of the audio if explicitly set. */
    get referenceDistance(): number | undefined;
    /** The server tick at which the audio started playing. */
    get startTick(): number | undefined;
    /** The URI of the audio asset. */
    get uri(): string;
    /** The volume of the audio if explicitly set. */
    get volume(): number | undefined;
    /** The world the audio is in if already loaded. */
    get world(): World | undefined;
    /**
     * Plays or resumes the audio.
     *
     * @param world - The world to play the audio in.
     * @param restart - If true, the audio will restart from the beginning if it is already playing.
     */
    play(world: World, restart?: boolean): void;
    /**
     * Pauses the audio.
     */
    pause(): void;
    /**
     * Sets the entity to which the audio is attached, following its position.
     *
     * @param entity - The entity to attach the audio to.
     */
    setAttachedToEntity(entity: Entity): void;
    /**
     * Sets the detune of the audio.
     *
     * @param detune - The detune in cents.
     */
    setDetune(detune: number): void;
    /**
     * Sets the distortion of the audio.
     *
     * @param distortion - The distortion amount.
     */
    setDistortion(distortion: number): void;
    /**
     * Sets the position of the audio. Will detach from entity if attached.
     *
     * @param position - The position in the world.
     */
    setPosition(position: Vector3): void;
    /**
     * Sets the playback rate of the audio.
     *
     * @param playbackRate - The playback rate.
     */
    setPlaybackRate(playbackRate: number): void;
    /**
     * Sets the reference distance of the audio.
     *
     * @param referenceDistance - The reference distance.
     */
    setReferenceDistance(referenceDistance: number): void;
    /**
     * Sets the volume of the audio.
     *
     * @param volume - The volume level.
     */
    setVolume(volume: number): void;


}

/** Payloads for events an Audio instance can emit. @public */
export declare namespace AudioEventPayload {
    export interface Pause {
        audio: Audio;
    }
    export interface Play {
        audio: Audio;
    }
    export interface PlayRestart {
        audio: Audio;
    }
    export interface SetAttachedToEntity {
        audio: Audio;
        entity: Entity | undefined;
    }
    export interface SetDetune {
        audio: Audio;
        detune: number;
    }
    export interface SetDistortion {
        audio: Audio;
        distortion: number;
    }
    export interface SetPosition {
        audio: Audio;
        position: Vector3;
    }
    export interface SetPlaybackRate {
        audio: Audio;
        playbackRate: number;
    }
    export interface SetReferenceDistance {
        audio: Audio;
        referenceDistance: number;
    }
    export interface SetVolume {
        audio: Audio;
        volume: number;
    }
}

/** Event types an Audio instance can emit. @public */
export declare enum AudioEventType {
    PAUSE = "AUDIO.PAUSE",
    PLAY = "AUDIO.PLAY",
    PLAY_RESTART = "AUDIO.PLAY_RESTART",
    SET_ATTACHED_TO_ENTITY = "AUDIO.SET_ATTACHED_TO_ENTITY",
    SET_DETUNE = "AUDIO.SET_DETUNE",
    SET_DISTORTION = "AUDIO.SET_DISTORTION",
    SET_POSITION = "AUDIO.SET_POSITION",
    SET_PLAYBACK_RATE = "AUDIO.SET_PLAYBACK_RATE",
    SET_REFERENCE_DISTANCE = "AUDIO.SET_REFERENCE_DISTANCE",
    SET_VOLUME = "AUDIO.SET_VOLUME"
}

/**
 * Manages audio instances in a world.
 *
 * @remarks
 * The AudioManager is created internally as a singleton
 * for each {@link World} instance in a game server.
 * It allows retrieval of all loaded audio, entity
 * attached audio, looped audio, and more.
 *
 * @example
 * ```typescript
 * // Stop all audio in the world
 * const audioManager = world.audioManager;
 * audioManager.getAllAudios().map(audio => audio.pause());
 * ```
 *
 * @public
 */
export declare class AudioManager {




    /** The world the audio manager is for. */
    get world(): World;


    /**
     * Retrieves all loaded audio instances for the world.
     *
     * @returns An array of audio instances.
     */
    getAllAudios(): Audio[];
    /**
     * Retrieves all loaded audio instances attached to a specific entity.
     *
     * @param entity - The entity to get attached audio instances for.
     * @returns An array of audio instances.
     */
    getAllEntityAttachedAudios(entity: Entity): Audio[];
    /**
     * Retrieves all looped audio instances for the world.
     *
     * @returns An array of audio instances.
     */
    getAllLoopedAudios(): Audio[];
    /**
     * Retrieves all oneshot (non-looped) audio instances for the world.
     *
     * @returns An array of audio instances.
     */
    getAllOneshotAudios(): Audio[];
}

/** Options for creating an Audio instance. @public */
export declare interface AudioOptions {
    /** If set, audio playback will follow the entity's position. */
    attachedToEntity?: Entity;
    /** The duration of the audio in seconds. Defaults to full duration. */
    duration?: number;
    /** The detuning of the audio in cents. */
    detune?: number;
    /** The amount of distortion to apply to the audio. */
    distortion?: number;
    /** Whether the audio should loop when it reaches the end. Defaults to false. */
    loop?: boolean;
    /** The offset time in seconds from which the audio should start playing. */
    offset?: number;
    /** The position in the world where the audio is played. */
    position?: Vector3;
    /** The playback speed of the audio. Defaults to 1. */
    playbackRate?: number;
    /** The reference distance for reducing volume as the audio source moves away from the listener. */
    referenceDistance?: number;
    /** The URI or path to the audio asset to be played. */
    uri: string;
    /** The volume level of the audio. Defaults to 0.5. */
    volume?: number;
}

/**
 * A base class for character controller implementations.
 *
 * @remarks
 * The BaseCharacterController should be extended
 * by a more specific character controller that you or a
 * plugin implements.
 *
 * @public
 */
export declare abstract class BaseCharacterController {
    /** The entity the controller is for. */
    readonly entity: Entity;
    /**
     * A callback function for when the controller ticks
     * player movement.
     * @param inputState - The current input state of the player.
     * @param orientationState - The current orientation state of the player.
     * @param deltaTimeMs - The delta time in milliseconds since the last tick.
     */
    onTickPlayerMovement?: (inputState: PlayerInputState, orientationState: PlayerOrientationState, deltaTimeMs: number) => void;
    /**
     * A callback function for when the controller ticks
     * pathfinding movement.
     * @param destination - The destination to move to.
     * @param deltaTimeMs - The delta time in milliseconds since the last tick.
     */
    onTickPathfindingMovement?: (destination: Vector3, deltaTimeMs: number) => void;
    /**
     * @param entity - The entity the controller is for.
     * @param _options - Arbitrary options you may provide or omit for your controller implementation.
     */
    constructor(entity: Entity, _options?: Record<string, unknown>);
    /**
     * Override this method to create sensor colliders
     * to be attached to the controlled entity when it spawns.
     * @returns An array of colliders.
     */
    createSensorColliders(): Collider[];
    /**
     * Override this method to handle entity movements
     * based on player input for your character controller.
     * @param inputState - The current input state of the player.
     * @param orientationState - The current orientation state of the player.
     * @param deltaTimeMs - The delta time in milliseconds since the last tick.
     */
    tickPlayerMovement(inputState: PlayerInputState, orientationState: PlayerOrientationState, deltaTimeMs: number): void;
    /**
     * Override this method to implement pathfinding
     * movement logic for your character controller.
     * NOTE: This method is not fully supported yet.
     * @param destination - The destination target to move to.
     * @param deltaTimeMs - The delta time in milliseconds since the last tick.
     */
    tickPathfindingMovement(destination: Vector3, deltaTimeMs: number): void;
}

/**
 * Represents a block in a world.
 *
 * @remarks
 * Instances of this class are created internally but made
 * publicly available through various public facing API
 * methods.
 *
 * @public
 */
export declare class Block {
    /** The global coordinate of the block. */
    readonly globalCoordinate: Vector3;
    /** The block type of the block. */
    readonly blockType: BlockType;


}

/**
 * Represents a block type.
 *
 * @remarks
 * Block types are created directly as instances.
 * They support a variety of configuration options through
 * the {@link BlockTypeOptions} constructor argument.
 * Block types are registered with a {@link BlockTypeRegistry} instance,
 * allowing you to create custom blocks with unique visual representations
 * and behaviors.
 *
 * @example
 * ```typescript
 * const stoneBlockTypeId = 10;
 * world.blockTypeRegistry.registerBlockType(stoneBlockTypeId, new BlockType({
 *   id: stoneBlockTypeId,
 *   textureUri: 'assets/textures/stone.png',
 *   name: 'Stone',
 * }));
 *
 * // Create a stone block at coordinate 0, 1, 0
 * world.chunkLattice.setBlock({ x: 0, y: 1, z: 0 }, stoneBlockTypeId);
 * ```
 *
 * @public
 */
export declare class BlockType implements protocol.Serializable {
    /**
     * A callback function that is invoked when an entity collides with blocks of this type.
     * @param entity - The entity that collided with the block.
     * @param started - Whether the collision started.
     */
    onEntityCollision?: (this: BlockType, entity: Entity, started: boolean) => void;
    /**
     * A callback function that is invoked when an entity contacts a block of this type.
     * @param entity - The entity that contacted the block.
     * @param contactForceData - The contact force data.
     */
    onEntityContactForce?: (this: BlockType, entity: Entity, contactForceData: ContactForceData) => void;




    /**
     * Creates a new block type instance.
     * @param world - The world the block type is for.
     * @param options - The options for the block type.
     */
    constructor(options?: BlockTypeOptions);
    /** The unique identifier for the block type. */
    get id(): number;
    /** The collider options for the block type. */
    get colliderOptions(): ColliderOptions;
    /** The URI of the texture for the block type. */
    get textureUri(): string;
    /** The name of the block type. */
    get name(): string;
    /** Whether the block type is meshable. */
    get isMeshable(): boolean;


}

/** Options for creating a block type instance. @public */
export declare interface BlockTypeOptions {
    id: number;
    textureUri: string;
    name: string;
    customColliderOptions?: ColliderOptions;
}

/**
 * Manages known block types in a world.
 *
 * @remarks
 * Block type registries are created internally as a singleton
 * for each {@link World} instance in a game server. A block
 * type registry allows you to register and retrieve block
 * types by their unique id for a world.
 *
 * @example
 * ```typescript
 * world.blockTypeRegistry.registerGenericBlockType({
 *   id: 15,
 *   textureUri: 'assets/textures/dirt.png',
 *   name: 'Dirt',
 * });
 * ```
 *
 * @public
 */
export declare class BlockTypeRegistry implements protocol.Serializable {



    /** The world the block type registry is for. */
    get world(): World;
    /**
     * Get all registered block types.
     * @returns An array of all registered block types.
     */
    getAllBlockTypes(): BlockType[];
    /**
     * Get a registered block type by its id.
     * @param id - The id of the block type to get.
     * @returns The block type with the given id.
     */
    getBlockType(id: number): BlockType;
    /**
     * Register a generic block type.
     * @param blockTypeOptions - The options for the block type.
     * @returns The registered block type.
     */
    registerGenericBlockType(blockTypeOptions: BlockTypeOptions): BlockType;
    /**
     * Register a block type.
     * @param id - The id of the block type to register.
     * @param blockTypeReference - The block type to register.
     */
    registerBlockType(id: number, blockTypeReference: BlockType): void;

}

/** Payloads for events a BlockTypeRegistry instance can emit. @public */
export declare namespace BlockTypeRegistryEventPayload {
    export interface RegisterBlockType {
        blockTypeRegistry: BlockTypeRegistry;
        id: number;
        blockType: BlockType;
    }
}

/** Event types a BlockTypeRegistry instance can emit. @public */
export declare enum BlockTypeRegistryEventType {
    REGISTER_BLOCK_TYPE = "BLOCK_TYPE_REGISTRY.REGISTER_BLOCK_TYPE"
}

/** Payloads for events a ChatManager instance can emit. @public */
export declare namespace ChatEventPayload {
    export interface SendBroadcastMessage {
        message: string;
        color?: string;
    }
    export interface SendPlayerMessage {
        player: Player;
        message: string;
        color?: string;
    }
}

/** Event types a ChatManager instance can emit. @public */
export declare enum ChatEventType {
    SEND_BROADCAST_MESSAGE = "CHAT.SEND_BROADCAST_MESSAGE",
    SEND_PLAYER_MESSAGE = "CHAT.SEND_PLAYER_MESSAGE"
}

/**
 * Manages chat and commands in a world.
 *
 * @remarks
 * The ChatManager is created internally as a singleton
 * for each {@link World} instance in a game server.
 * The ChatManager allows you to broadcast messages,
 * send messages to specific players, and register
 * commands that can be used in chat to execute game
 * logic.
 *
 * @example
 * ```typescript
 * world.chatManager.registerCommand('/kick', (player, args, message) => {
 *   const admins = [ 'arkdev', 'testuser123' ];
 *   if (admins.includes(player.username)) {
 *     const targetUsername = args[0];
 *     const targetPlayer = world.playerManager.getConnectedPlayerByUsername(targetUsername);
 *
 *     if (targetPlayer) {
 *       targetPlayer.disconnect();
 *     }
 *   }
 * });
 * ```
 *
 * @public
 */
export declare class ChatManager {



    /**
     * Register a command and its callback.
     * @param command - The command to register.
     * @param callback - The callback function to execute when the command is used.
     */
    registerCommand(command: string, callback: CommandCallback): void;
    /**
     * Unregister a command.
     * @param command - The command to unregister.
     */
    unregisterCommand(command: string): void;
    /**
     * Send a broadcast message to all players in the world.
     * @param message - The message to send.
     * @param color - The color of the message as a hex color code, excluding #.
     *
     * @example
     * ```typescript
     * chatManager.sendBroadcastMessage('Hello, world!', 'FF00AA');
     * ```
     */
    sendBroadcastMessage(message: string, color?: string): void;
    /**
     * Send a message to a specific player, only visible to them.
     * @param player - The player to send the message to.
     * @param message - The message to send.
     * @param color - The color of the message as a hex color code, excluding #.
     *
     * @example
     * ```typescript
     * chatManager.sendPlayerMessage(player, 'Hello, player!', 'FF00AA');
     * ```
     */
    sendPlayerMessage(player: Player, message: string, color?: string): void;


}

/**
 * A 16^3 chunk of blocks. Used to represent a world's terrain.
 *
 * @remarks
 * Chunks make up the bulk of the terrain in a world. Chunks are
 * fixed size, each containing 16^3 possible blocks as
 * a 16x16x16 cube. Chunks can be spawned, despawned, have their
 * unique blocks set or removed, and more. Chunks represent their
 * internal block coordinates in local space, meaning only coordinates
 * x: 0...15, y: 0...15, z: 0...15 are valid.
 *
 * The Chunk follows a spawn and despawn lifecycle pattern.
 * When you create a chunk, when you're ready to load it in your
 * world you use .spawn(). To remove it, you use .despawn().
 *
 * Use .setBlock() to set the block type id at a specific local cooridnate.
 * Block type ids are ones that have been registered in the {@link BlockTypeRegistry}
 * associated with the {@link World} the chunk belongs to. A block type id of 0
 * is used to represent no block. Removing a block is done by .setBlock(localCoordinate, 0).
 *
 * @example
 * ```typescript
 * // Assume we previously registered a stone block with type id of 10..
 *
 * const chunk = new Chunk();
 *
 * chunk.setBlock({ x: 0, y: 0, z: 0 }, 10); // Set the block at 0, 0, 0 to stone
 * chunk.spawn(world, { x: 16, y: 0, z: 16 }); // Spawn the chunk at global coordinate 16, 0, 16
 * ```
 *
 * @public
 */
export declare class Chunk implements protocol.Serializable {





    /**
     * Creates a new chunk instance.
     */
    constructor();
    /** The blocks in the chunk as a flat Uint8Array[4096], each index as 0 or a block type id. */
    get blocks(): Readonly<Uint8Array>;

    /** Whether the chunk is actively simulated in the internal physics engine. */
    get isSimulated(): boolean;
    /** Whether the chunk has been spawned. */
    get isSpawned(): boolean;
    /** The origin coordinate of the chunk. */
    get originCoordinate(): Vector3 | undefined;
    /** The world the chunk belongs to. */
    get world(): World | undefined;
    /**
     * Convert a block index to a local coordinate.
     * @param index - The index of the block to convert.
     * @returns The local coordinate of the block.
     */
    static blockIndexToLocalCoordinate(index: number): Vector3;
    /**
     * Convert a global coordinate to a local coordinate.
     * @param globalCoordinate - The global coordinate to convert.
     * @returns The local coordinate.
     */
    static globalCoordinateToLocalCoordinate(globalCoordinate: Vector3): Vector3;
    /**
     * Convert a global coordinate to an origin coordinate.
     * @param globalCoordinate - The global coordinate to convert.
     * @returns The origin coordinate.
     */
    static globalCoordinateToOriginCoordinate(globalCoordinate: Vector3): Vector3;
    /**
     * Check if an origin coordinate is valid.
     * @param coordinate - The coordinate to check.
     * @returns Whether the coordinate is valid.
     */
    static isValidOriginCoordinate(coordinate: Vector3): boolean;
    /**
     * Spawn the chunk in the world.
     * @param world - The world to spawn the chunk in.
     * @param originCoordinate - The origin coordinate of the chunk.
     */
    spawn(world: World, originCoordinate: Vector3): void;
    /**
     * Despawn the chunk from the world.
     */
    despawn(): void;
    /**
     * Set the block at a specific local coordinate by block type id.
     * @param localCoordinate - The local coordinate of the block to set.
     * @param blockTypeId - The block type id to set.
     */
    setBlock(localCoordinate: Vector3, blockTypeId: number): void;







}

/** Payloads for events a Chunk instance can emit. @public */
export declare namespace ChunkEventPayload {
    export interface Despawn {
        chunk: Chunk;
    }
    export interface SetBlock {
        chunk: Chunk;
        globalCoordinate: Vector3;
        localCoordinate: Vector3;
        blockTypeId: number;
    }
    export interface Spawn {
        chunk: Chunk;
    }
}

/** Event types a Chunk instance can emit. @public */
export declare enum ChunkEventType {
    DESPAWN = "CHUNK.DESPAWN",
    SET_BLOCK = "CHUNK.SET_BLOCK",
    SPAWN = "CHUNK.SPAWN"
}

/**
 * A lattice of chunks that represent a world's terrain.
 *
 * @remarks
 * The ChunkLattice lattice tracks the current terrain of a world,
 * comprised of {@link Chunk} instances.
 *
 * @public
 */
export declare class ChunkLattice {


    /**
     * Creates a new chunk lattice instance.
     * @param world - The world the chunk lattice is for.
     */
    constructor(world: World);


    /**
     * Get a chunk by its origin coordinate.
     * @param originCoordinate - The origin coordinate of the chunk to get.
     * @returns The chunk at the given origin coordinate or undefined if not found.
     */
    getChunk(originCoordinate: Vector3): Chunk | undefined;
    /**
     * Get all chunks in the lattice.
     * @returns An array of all chunks in the lattice.
     */
    getAllChunks(): Chunk[];
    /**
     * Check if a chunk exists by its origin coordinate.
     * @param originCoordinate - The origin coordinate of the chunk to check.
     * @returns Whether the chunk exists.
     */
    hasChunk(originCoordinate: Vector3): boolean;
    /**
     * Set the block at a global coordinate by block type id, automatically
     * creating a chunk if it doesn't exist.
     * @param globalCoordinate - The global coordinate of the block to set.
     * @param blockTypeId - The block type id to set.
     */
    setBlock(globalCoordinate: Vector3, blockTypeId: number): void;


}

/**
 * Represents a collider in a world's physics simulation.
 *
 * @remarks
 * Colliders make up the foundation of the physical interactions
 * in a world. They are highly configurable and have many
 * aspects that can be adjusted both before simulation and
 * while simulated. Colliders will most often be used through
 * passing {@link ColliderOptions} to a {@link RigidBody} or
 * an entity's {@link EntityOptions}.
 *
 * @public
 */
export declare class Collider {






    /**
     * @param colliderOptions - The options for the collider instance.
     */
    constructor(colliderOptions: ColliderOptions);
    /** Whether the collider is enabled. */
    get isEnabled(): boolean;
    /** Whether the collider has been removed from the simulation. */
    get isRemoved(): boolean;
    /** Whether the collider is a sensor. */
    get isSensor(): boolean;
    /** Whether the collider is simulated. */
    get isSimulated(): boolean;
    /** The parent rigid body of the collider. */
    get parentRigidBody(): RigidBody | undefined;
    /** The raw collider object from the Rapier physics engine. */
    get rawCollider(): RAPIER.Collider | undefined;
    /** An arbitrary identifier tag of the collider. Useful for your own logic. */
    get tag(): string | undefined;
    /**
     * Gets the bounciness of the collider.
     * @returns The bounciness of the collider.
     */
    getBounciness(): number;
    /**
     * Gets the collision groups the collider belongs to.
     * @returns The collision groups the collider belongs to.
     */
    getCollisionGroups(): CollisionGroups;
    /**
     * Gets the friction of the collider.
     * @returns The friction of the collider.
     */
    getFriction(): number;
    /**
     * Gets the relative rotation of the collider.
     * @returns The relative rotation of the collider.
     */
    getRelativeRotation(): Rotation;
    /**
     * Gets the relative translation of the collider to its parent rigid body.
     * @returns The relative translation of the collider.
     */
    getRelativeTranslation(): Vector3;
    /**
     * Sets the bounciness of the collider.
     * @param bounciness - The bounciness of the collider.
     */
    setBounciness(bounciness: number): void;
    /**
     * Sets the on collision callback for the collider.
     * @param callback - The on collision callback for the collider.
     */
    setOnCollision(callback: CollisionCallback | undefined): void;
    /**
     * Sets the collision groups of the collider.
     * @param collisionGroups - The collision groups of the collider.
     */
    setCollisionGroups(collisionGroups: CollisionGroups): void;
    /**
     * Sets whether the collider is enabled.
     * @param enabled - Whether the collider is enabled.
     */
    setEnabled(enabled: boolean): void;
    /**
     * Sets the friction of the collider.
     * @param friction - The friction of the collider.
     */
    setFriction(friction: number): void;
    /**
     * Sets the mass of the collider.
     * @param mass - The mass of the collider.
     */
    setMass(mass: number): void;
    /**
     * Sets the relative rotation of the collider.
     * @param rotation - The relative rotation of the collider.
     */
    setRelativeRotation(rotation: Rotation): void;
    /**
     * Sets the relative translation of the collider to its parent rigid body.
     * @param translation - The relative translation of the collider.
     */
    setRelativeTranslation(translation: Vector3): void;
    /**
     * Sets whether the collider is a sensor.
     * @param sensor - Whether the collider is a sensor.
     */
    setSensor(sensor: boolean): void;
    /**
     * Sets the tag of the collider.
     * @param tag - The tag of the collider.
     */
    setTag(tag: string): void;
    /**
     * Adds the collider to the simulation.
     * @param simulation - The simulation to add the collider to.
     * @param parentRigidBody - The parent rigid body of the collider.
     */
    addToSimulation(simulation: Simulation, parentRigidBody?: RigidBody): void;
    /**
     * Enables or disables collision events for the collider.
     * This is automatically enabled if an on collision callback is set.
     * @param enabled - Whether collision events are enabled.
     */
    enableCollisionEvents(enabled: boolean): void;
    /**
     * Enables or disables contact force events for the collider.
     * This is automatically enabled if an on contact force callback is set.
     * @param enabled - Whether contact force events are enabled.
     */
    enableContactForceEvents(enabled: boolean): void;
    /**
     * Removes the collider from the simulation.
     */
    removeFromSimulation(): void;





}

/** Options for creating a Collider instance. @public */
export declare interface ColliderOptions {
    /** The shape of the collider. */
    shape: ColliderShape;
    /** The border radius of the collider if the shape is a round cylinder. */
    borderRadius?: number;
    /** The bounciness of the collider. */
    bounciness?: number;
    /** The collision groups the collider belongs to. */
    collisionGroups?: CollisionGroups;
    /** Whether the collider is enabled. */
    enabled?: boolean;
    /** The friction of the collider. */
    friction?: number;
    /** The half extents of the collider if the shape is a block. */
    halfExtents?: Vector3;
    /** The half height of the collider if the shape is a capsule, cone, cylinder, or round cylinder. */
    halfHeight?: number;
    /** Whether the collider is a sensor. */
    isSensor?: boolean;
    /** The mass of the collider. */
    mass?: number;
    /** The on collision callback for the collider. */
    onCollision?: CollisionCallback;
    /** The parent rigid body of the collider. */
    parentRigidBody?: RigidBody;
    /** The radius of the collider if the shape is a ball, capsule, cone, cylinder, or round cylinder. */
    radius?: number;
    /** The relative rotation of the collider. Relative to parent rigid body. */
    relativeRotation?: Rotation;
    /** The relative translation of the collider. Relative to parent rigid body. */
    relativeTranslation?: Vector3;
    /** The simulation the collider is in, if provided the collider will automatically be added to the simulation. */
    simulation?: Simulation;
    /** An arbitrary identifier tag of the collider. Useful for your own logic. */
    tag?: string;
}

/** The shapes a collider can be. @public */
export declare enum ColliderShape {
    BALL = "ball",
    BLOCK = "block",
    CAPSULE = "capsule",
    CONE = "cone",
    CYLINDER = "cylinder",
    ROUND_CYLINDER = "round-cylinder"
}

/**
 * A callback function that is called when a collision occurs.
 * @param other - The other object involved in the collision, a block or entity.
 * @param started - Whether the collision has started or ended.
 * @public
 */
export declare type CollisionCallback = (other: BlockType | Entity, started: boolean) => void;

/**
 * The default collision groups.
 *
 * @remarks
 * The collision groups are used to determine which objects collide and
 * generate collision and contact force events. The default collision groups
 * can be used for most entity and block interactions, but you may want to
 * create your own for more complex scenarios. Up to 15 collision groups can be
 * registered. Collision groups use pairwise filtering using bit masks.
 *
 * This filtering method is based on two 16-bit values:
 * - The belongsTo groups (the 16 left-most bits of `self.0`).
 * - The collidesWith mask (the 16 right-most bits of `self.0`).
 *
 * An interaction is allowed between two filters `a` and `b` two conditions
 * are met simultaneously:
 * - The belongsTo groups of `a` has at least one bit set to `1` in common with the collidesWith mask of `b`.
 * - The belongsTo groups of `b` has at least one bit set to `1` in common with the collidesWith mask of `a`.
 * In other words, interactions are allowed between two filter if the following condition is met:
 *
 * ```
 * ((a >> 16) & b) != 0 && ((b >> 16) & a) != 0
 * ```
 *
 * @public
 */
export declare enum CollisionGroup {
    BLOCK = 1,
    ENTITY = 2,
    ENTITY_SENSOR = 4,
    PLAYER = 8,
    ALL = 65535
}

/** A set of collision groups. @public */
export declare type CollisionGroups = {
    belongsTo: CollisionGroup[];
    collidesWith: CollisionGroup[];
};

/**
 * A helper class for building and decoding collision groups.
 *
 * @remarks
 * This class should be used directly with its static methods.
 * You can assign collision groups to colliders of entities and
 * blocks to control optimized collision interactions and filterings
 * between blocks and entities, and entities and other entities.
 *
 * @public
 */
export declare class CollisionGroupsBuilder {
    private static readonly BELONGS_TO_SHIFT;
    private static readonly COLLIDES_WITH_MASK;
    /**
     * Builds a raw set of collision groups from a set of collision groups.
     * @param collisionGroups - The set of collision groups to build.
     * @returns A raw set of collision groups represented as a 32-bit number.
     */
    static buildRawCollisionGroups(collisionGroups: CollisionGroups): RawCollisionGroups;
    /**
     * Decodes a raw set of collision groups into a set of collision groups.
     * @param groups - The raw set of collision groups to decode.
     * @returns A set of collision groups.
     */
    static decodeRawCollisionGroups(groups: RawCollisionGroups): CollisionGroups;
    /**
     * Decodes a set of collision groups into a set of their string equivalents.
     * @param collisionGroups - The set of collision groups to decode.
     * @returns A set of collision groups represented as their string equivalents.
     */
    static decodeCollisionGroups(collisionGroups: CollisionGroups): DecodedCollisionGroups;
    /**
     * Checks if the collision groups are the default collision groups.
     * @param collisionGroups - The set of collision groups to check.
     * @returns Whether the collision groups are the default collision groups.
     */
    static isDefaultCollisionGroups(collisionGroups: CollisionGroups): boolean;
    /**
     * Combines an array of collision groups into a raw set of collision groups.
     * @param groups - The array of collision groups to combine.
     * @returns A raw set of collision groups represented as a 32-bit number.
     */
    private static combineGroups;


}

/**
 * A callback function for a chat command.
 * @param player - The player that sent the command.
 * @param args - An array of arguments, comprised of all space separated text after the command.
 * @param message - The full message of the command.
 * @public
 */
export declare type CommandCallback = (player: Player, args: string[], message: string) => void;

/** Data for contact forces. @public */
declare type ContactForceData = {
    /** The total force vector. */
    totalForce: RAPIER.Vector;
    /** The magnitude of the total force. */
    totalForceMagnitude: number;
    /** The direction of the maximum force. */
    maxForceDirection: RAPIER.Vector;
    /** The magnitude of the maximum force. */
    maxForceMagnitude: number;
};

/** A decoded set of collision groups represented as their string equivalents. @public */
export declare type DecodedCollisionGroups = {
    belongsTo: string[];
    collidesWith: string[];
};

/** The default rigid body options when EntityOptions.rigidBodyOptions is not provided. @public */
export declare const DEFAULT_ENTITY_RIGID_BODY_OPTIONS: RigidBodyOptions;

/**
 * The default character controller implementation.
 *
 * @remarks
 * This class extends {@link BaseCharacterController}
 * and implements the default movement logic for a
 * character entity. This is used as the default for
 * players when they join your game. This class may be extended
 * if you'd like to implement additional logic on top of the
 * DefaultCharacterController implementation.
 *
 * @example
 * ```typescript
 * // Create a custom character controller for myEntity, prior to spawning it.
 * myEntity.createCustomCharacterController = () => {
 *   return new DefaultCharacterController(myEntity, {
 *     jumpVelocity: 10,
 *     runVelocity: 8,
 *     walkVelocity: 4,
 *   });
 * };
 *
 * // Spawn the entity in the world.
 * myEntity.spawn(world, { x: 53, y: 10, z: 23 });
 * ```
 *
 * @public
 */
export declare class DefaultCharacterController extends BaseCharacterController {
    /** The upward velocity applied to the entity when it jumps. */
    jumpVelocity: number;
    /** The normalized horizontal velocity applied to the entity when it runs. */
    runVelocity: number;
    /** The normalized horizontal velocity applied to the entity when it walks. */
    walkVelocity: number;
    /**
     * A function allowing custom logic to determine if the entity can walk.
     * @param this - The character controller instance.
     * @returns Whether the entity can walk.
     */
    canWalk: (this: DefaultCharacterController) => boolean;
    /**
     * A function allowing custom logic to determine if the entity can run.
     * @param this - The character controller instance.
     * @returns Whether the entity can run.
     */
    canRun: (this: DefaultCharacterController) => boolean;
    /**
     * A function allowing custom logic to determine if the entity can jump.
     * @param this - The character controller instance.
     * @returns Whether the entity can jump.
     */
    canJump: (this: DefaultCharacterController) => boolean;



    /**
     * @param entity - The entity the controller is for.
     * @param options - Options for the controller.
     */
    constructor(entity: Entity, options?: DefaultCharacterControllerOptions);
    /** Whether the entity is grounded. */
    get isGrounded(): boolean;
    /** Whether the entity is on a platform, a platform is any entity with a kinematic rigid body. */
    get isOnPlatform(): boolean;
    /** The platform the entity is on, if any. */
    get platform(): Entity | undefined;
    /**
     * Creates the sensor colliders for the character controller,
     * overriding the default implementation.
     * @returns An array of colliders.
     */
    createSensorColliders(): Collider[];
    /**
     * Ticks the player movement for the character controller,
     * overriding the default implementation.
     * @param inputState - The current input state of the player.
     * @param orientationState - The current orientation state of the player.
     * @param deltaTimeMs - The delta time in milliseconds since the last tick.
     */
    tickPlayerMovement(inputState: PlayerInputState, orientationState: PlayerOrientationState, deltaTimeMs: number): void;
    /**
     * Ticks the pathfinding movement for the character controller,
     * overriding the default implementation.
     * @param destination - The destination to move to.
     * @param deltaTimeMs - The delta time in milliseconds since the last tick.
     */
    tickPathfindingMovement(destination: Vector3, deltaTimeMs: number): void;
}

/** Options for creating a DefaultCharacterController instance. @public */
export declare interface DefaultCharacterControllerOptions {
    /** The upward velocity applied to the entity when it jumps. */
    jumpVelocity?: number;
    /** The normalized horizontal velocity applied to the entity when it runs. */
    runVelocity?: number;
    /** The normalized horizontal velocity applied to the entity when it walks. */
    walkVelocity?: number;
    /** A function allowing custom logic to determine if the entity can jump. */
    canJump?: () => boolean;
    /** A function allowing custom logic to determine if the entity can walk. */
    canWalk?: () => boolean;
    /** A function allowing custom logic to determine if the entity can run. */
    canRun?: () => boolean;
}

/**
 * Represents an entity in a world.
 *
 * @remarks
 * Entities are highly configurable and controllable. All
 * entities are created from a .gltf model asset and
 * allow full control of their rigid body and attached collider
 * dynamics.
 *
 * @example
 * ```typescript
 * const spider = new Entity({
 *   name: 'Spider',
 *   modelUri: 'models/spider.gltf',
 *   modelLoopedAnimations: [ 'walk' ],
 *   rigidBodyOptions: {
 *     type: RigidBodyType.DYNAMIC,
 *     enabledRotations: { x: false, y: true, z: false },
 *     colliders: [
 *       {
 *         shape: ColliderShape.ROUND_CYLINDER,
 *         borderRadius: 0.1,
 *         halfHeight: 0.225,
 *         radius: 0.5,
 *         tag: 'body',
 *       }
 *     ],
 *   },
 * });
 *
 * spider.spawn(world, { x: 20, y: 6, z: 10 });
 * ```
 *
 * @public
 */
export declare class Entity extends RigidBody implements protocol.Serializable {
    /**
     * A function that creates a custom character controller for the entity.
     * @param this - The Entity instance.
     * @returns A character controller that extends {@link BaseCharacterController}.
     */
    createCustomCharacterController?: (this: Entity) => BaseCharacterController;
    /**
     * A function that is called when the entity collides with a block.
     * @param this - The Entity instance.
     * @param block - The block that the entity collided with.
     * @param started - Whether the collision started or ended.
     */
    onBlockCollision?: (this: Entity, block: BlockType, started: boolean) => void;
    /**
     * A function that is called when the entity collides with a block.
     * @param this - The Entity instance.
     * @param block - The block that the entity collided with.
     * @param contactForceData - The contact force data.
     */
    onBlockContactForce?: (this: Entity, block: BlockType, contactForceData: ContactForceData) => void;
    /**
     * A function that is called when the entity collides with another entity.
     * @param this - The Entity instance.
     * @param entity - The entity that the entity collided with.
     * @param started - Whether the collision started or ended.
     */
    onEntityCollision?: (this: Entity, entity: Entity, started: boolean) => void;
    /**
     * A function that is called when the entity contacts another entity.
     * @param this - The Entity instance.
     * @param entity - The entity that the entity collided with.
     * @param contactForceData - The contact force data.
     */
    onEntityContactForce?: (this: Entity, entity: Entity, contactForceData: ContactForceData) => void;
    /**
     * A function that is called when the entity is spawned.
     * @param this - The Entity instance.
     */
    onSpawn?: (this: Entity) => void;
    /**
     * A function that is called when the entity is despawned.
     * @param this - The Entity instance.
     */
    onDespawn?: (this: Entity) => void;
    /**
     * A function that is called every tick.
     * @param this - The Entity instance.
     * @param tickDeltaMs - The delta time in milliseconds since the last tick.
     */
    onTick?: (this: Entity, tickDeltaMs: number) => void;










    /**
     * @param options - The options for the entity.
     */
    constructor(options: EntityOptions);
    /** The unique identifier for the entity. */
    get id(): number | undefined;
    /** The URI or path to the .gltf model asset to be used for the entity. */
    get modelUri(): string | undefined;
    /** The looped animations to start when the entity is spawned. */
    get modelLoopedAnimations(): ReadonlySet<string>;
    /** The scale of the entity's model. */
    get modelScale(): number | undefined;
    /** The name of the entity. */
    get name(): string;
    /** The character controller for the entity. */
    get characterController(): BaseCharacterController | undefined;
    /** Whether the entity is spawned. */
    get isSpawned(): boolean;
    /** The world the entity is in. */
    get world(): World | undefined;
    /**
     * Spawns the entity in the world.
     * @param world - The world to spawn the entity in.
     * @param coordinate - The coordinate to spawn the entity at.
     */
    spawn(world: World, coordinate: Vector3): void;
    /**
     * Despawns the entity from the world.
     */
    despawn(): void;
    /**
     * Sets the character controller for the entity.
     * @param characterController - The character controller to set.
     */
    setCharacterController(characterController: BaseCharacterController): void;
    /**
     * Starts looped animations for the entity, blending with
     * other animations currently playing.
     * @param animations - The animations to start.
     */
    startModelLoopedAnimations(animations: string[]): void;
    /**
     * Starts a oneshot animation for the entity, blending with
     * other animations currently playing.
     * @param animations - The animations to start.
     */
    startModelOneshotAnimations(animations: string[]): void;
    /**
     * Stops the provided model animations for the entity.
     * @param animations - The animations to stop.
     */
    stopModelAnimations(animations: string[]): void;







}

/** Payloads for events an Entity instance can emit. @public */
export declare namespace EntityEventPayload {
    export interface Despawn {
        entity: Entity;
    }
    export interface Spawn {
        entity: Entity;
    }
    export interface StartModelLoopedAnimations {
        entity: Entity;
        animations: Set<string>;
    }
    export interface StartModelOneshotAnimations {
        entity: Entity;
        animations: Set<string>;
    }
    export interface StopModelAnimations {
        entity: Entity;
        animations: Set<string>;
    }
    export interface UpdateRotation {
        entity: Entity;
        rotation: Rotation;
    }
    export interface UpdateTranslation {
        entity: Entity;
        translation: Vector3;
    }
}

/** Event types an Entity instance can emit. @public */
export declare enum EntityEventType {
    DESPAWN = "ENTITY.DESPAWN",
    SPAWN = "ENTITY.SPAWN",
    START_MODEL_LOOPED_ANIMATIONS = "ENTITY.UPDATE_MODEL_LOOPED_ANIMATIONS",
    START_MODEL_ONESHOT_ANIMATIONS = "ENTITY.START_MODEL_ONESHOT_ANIMATIONS",
    STOP_MODEL_ANIMATIONS = "ENTITY.STOP_MODEL_ANIMATIONS",
    UPDATE_ROTATION = "ENTITY.UPDATE_ROTATION",
    UPDATE_TRANSLATION = "ENTITY.UPDATE_TRANSLATION"
}

/**
 * Manages entities in a world.
 *
 * @remarks
 * The EntityManager is created internally as a singleton
 * for each {@link World} instance in a game server.
 * It allows retrieval of all entities, player entities,
 * and more.
 *
 * @example
 * ```typescript
 * // Get all entities in the world
 * const entityManager = world.entityManager;
 * const entities = entityManager.getAllEntities();
 * ```
 *
 * @public
 */
export declare class EntityManager {




    /** The world the entity manager is for. */
    get world(): World;


    /**
     * Gets all spawned entities in the world.
     * @returns All spawned entities in the world.
     */
    getAllEntities(): Entity[];
    /**
     * Gets all spawned entities in the world assigned to a player.
     * @param player - The player to get the entities for.
     * @returns All spawned entities in the world assigned to the player.
     */
    getAllPlayerEntities(player: Player): PlayerEntity[];
    /**
     * Gets a spawned entity in the world by its id.
     * @param id - The id of the entity to get.
     * @returns The spawned entity with the provided id, or undefined if no entity is found.
     */
    getEntity<T extends Entity>(id: number): T | undefined;


}

/** Options for creating an Entity instance. @public */
export declare interface EntityOptions {
    /** The URI or path to the .gltf model asset to be used for the entity. */
    modelUri?: string;
    /** The looped animations to start when the entity is spawned. */
    modelLoopedAnimations?: string[];
    /** The scale of the entity's model. */
    modelScale?: number;
    /** The name of the entity. */
    name?: string;
    /** The rigid body options for the entity. */
    rigidBodyOptions?: RigidBodyOptions;
}

/** An EventRouter event. @public */
declare interface Event_2<TPayload> {
    /** The type of event */
    type: string;
    /** The payload of the event, passed to listeners */
    payload: TPayload;
}
export { Event_2 as Event }

/**
 * Manages event emission and assigned listener callbacks.
 *
 * @remarks
 * This class is used as a singleton for global server events via
 * {@link EventRouter.serverInstance}. For individual worlds, an
 * internal EventRouter instance is instantiated per world. EventRouters
 * only have visibility of events emitted and subscribed to relative to
 * their unique instances.
 *
 * @public
 */
export declare class EventRouter {
    /** The singleton instance for global server events. */
    static readonly serverInstance: EventRouter;
    private _emitter;
    private _wrappedListenerMap;
    private _tag;
    /** Enable logging of all events. Default: false */
    logAllEvents: boolean;
    /** Enable logging of event payloads. Default: false */
    logEventsPayloads: boolean;
    /** Enable logging of events with no listeners. Default: false */
    logUnlistenedEvents: boolean;
    /** Array of events to exclude from logging */
    logIgnoreEvents: string[];
    /** Array of event prefixes to exclude from logging */
    logIgnoreEventPrefixes: string[];
    /** @param tag - Tag for logging, used to identify EventRouter instances in logs. */
    constructor(tag: string);
    /**
     * Register a listener for a specific event type.
     *
     * @remarks
     * When the same event router instance used to register a listener
     * emits an event a listener was registered for, the listener will
     * be invoked with the event payload. Listeners are called in the order
     * they are registered.
     *
     * @param eventType - The type of event to listen for.
     * @param listener - The listener function to invoke when the event is emitted.
     */
    on<TPayload>(eventType: string, listener: (payload: TPayload) => void): void;
    /**
     * Remove a listener for a specific event type.
     *
     * @param eventType - The type of event to remove the listener from.
     * @param listener - The listener function to remove.
     */
    off<TPayload>(eventType: string, listener: (payload: TPayload) => void): void;
    /**
     * Remove all listeners for a specific event type.
     *
     * @param eventType - The type of event to remove all listeners from.
     */
    offAll(eventType: string): void;
    /**
     * Emit an event, invoking all registered listeners for the event type.
     *
     * @param event - The event to emit.
     * @returns `true` if listeners were found and invoked, `false` otherwise.
     */
    emit<TPayload>(event: Event_2<TPayload>): boolean;
}

/**
 * Manages the game and associated worlds and systems.
 *
 * @remarks
 * This class is used as a singleton and should be
 * accessed via the `instance` property
 *
 * @public
 */
export declare class GameServer {






    /** The singleton instance of the game server. */
    static get instance(): GameServer;
    /** The player manager for the game server. */
    get playerManager(): PlayerManager;

    /** The web server for the game server. */
    get webServer(): WebServer;
    /** The worlds managed by the game server. */
    get worlds(): {
        [id: string]: World;
    };


}

/** Payloads for events emitted by a GameServer instance. @public */
export declare namespace GameServerEventPayload {
    export interface Start {
        startedAtMs: number;
    }
    export interface Stop {
        stoppedAtMs: number;
    }
}

/** Event types a GameServer instance can emit. @public */
export declare enum GameServerEventType {
    START = "GAMESERVER.START",
    STOP = "GAMESERVER.STOP"
}

declare namespace HYTOPIA {
    export {
        Audio,
        AudioEventType,
        AudioOptions,
        AudioEventPayload,
        AudioManager,
        BaseCharacterController,
        Block,
        BlockType,
        BlockTypeOptions,
        BlockTypeRegistry,
        BlockTypeRegistryEventType,
        BlockTypeRegistryEventPayload,
        ChatManager,
        ChatEventType,
        CommandCallback,
        ChatEventPayload,
        Chunk,
        ChunkEventType,
        ChunkEventPayload,
        ChunkLattice,
        Collider,
        ColliderShape,
        ColliderOptions,
        CollisionCallback,
        CollisionGroupsBuilder,
        CollisionGroup,
        CollisionGroups,
        DecodedCollisionGroups,
        RawCollisionGroups,
        DefaultCharacterController,
        DefaultCharacterControllerOptions,
        Entity,
        EntityEventType,
        DEFAULT_ENTITY_RIGID_BODY_OPTIONS,
        EntityOptions,
        EntityEventPayload,
        EntityManager,
        EventRouter,
        Event_2 as Event,
        GameServer,
        GameServerEventType,
        startServer,
        GameServerEventPayload,
        Rotation,
        SpdMatrix3,
        Vector3,
        Vector3Boolean,
        Player,
        PlayerEventType,
        SUPPORTED_INPUT_KEYS,
        PlayerInputState,
        PlayerOrientationState,
        PlayerEventPayload,
        PlayerEntity,
        PlayerEntityOptions,
        PlayerManager,
        RigidBody,
        RigidBodyType,
        RigidBodyAdditionalMassProperties,
        RigidBodyOptions,
        Simulation,
        WebServer,
        WEB_SERVER_PORT,
        World,
        WorldMap,
        WorldOptions,
        WorldLoop
    }
}
export default HYTOPIA;

/**
 * A player in the game.
 *
 * @remarks
 * Players are automatically created when they connect and
 * authenticate with the game server. This is all handled
 * internally.
 *
 * @public
 */
export declare class Player {
    /** The unique identifier for the player. */
    readonly id: number;
    /** The username for the player. */
    readonly username: string;





    /** The current {@link PlayerInputState} of the player. */
    get inputState(): Readonly<PlayerInputState>;
    /** The current {@link PlayerOrientationState} of the player. */
    get orientationState(): Readonly<PlayerOrientationState>;
    /** The current {@link World} the player is in. */
    get world(): World | undefined;
    /**
     * Joins a player to a world.
     *
     * @remarks
     * If the player is already in a {@link World}, they
     * will be removed from their current world before joining
     * the new world.
     *
     * @param world - The world to join the player to.
     */
    joinWorld(world: World): void;
    /**
     * Removes the player from the current {@link World} they are in.
     */
    leaveWorld(): void;
    /**
     * Disconnects the player from the game server.
     */
    disconnect(): void;




}

/**
 * Represents an entity controlled by a player in a world.
 *
 * @remarks
 * Player entities extend the {@link Entity} class.
 * They can be created and assigned to a player when
 * a player joins a world. PlayerEntity automatically
 * handles mapping player inputs to the associated
 * character controller of the entity, calling the
 * character controller's onTickPlayerMovement method
 * when player input has changed.
 *
 * @example
 * ```typescript
 * world.onPlayerJoin = player => {
 *   const playerEntity = new PlayerEntity({
 *     player,
 *     name: 'Player',
 *     modelUri: 'models/player-with-gun.gltf',
 *     modelLoopedAnimations: [ 'idle' ],
 *     modelScale: 0.5,
 *   });
 *
 *   playerEntity.spawn(world, { x: 10, y: 20, z: 15 });
 * };
 * ```
 *
 * @public
 */
export declare class PlayerEntity extends Entity {
    /** The player the player entity is assigned to and controlled by. */
    readonly player: Player;
    /**
     * @param options - The options for the player entity.
     */
    constructor(options: PlayerEntityOptions);

}

/** Options for creating a PlayerEntity instance. @public */
export declare interface PlayerEntityOptions extends EntityOptions {
    /** The player the player entity is assigned to. */
    player: Player;
}

/** Payloads for events a Player can emit. @public */
export declare namespace PlayerEventPayload {
    export interface ChatMessageSend {
        player: Player;
        message: protocol.ChatMessageSchema;
    }
    export interface JoinedWorld {
        player: Player;
        world: World;
    }
    export interface LeftWorld {
        player: Player;
        world: World;
    }
    export interface RequestSync {
        player: Player;
        receivedAt: number;
        receivedAtMs: number;
    }
}

/** Event types a Player can emit. @public */
export declare enum PlayerEventType {
    CHAT_MESSAGE_SEND = "PLAYER.CHAT_MESSAGE_SEND",
    JOINED_WORLD = "PLAYER.JOINED_WORLD",
    LEFT_WORLD = "PLAYER.LEFT_WORLD",
    REQUEST_SYNC = "PLAYER.REQUEST_SYNC"
}

/** The input state of a Player; keys from SUPPORTED_INPUT_KEYS. @public */
export declare type PlayerInputState = Partial<Record<keyof InputSchema, boolean>>;

/**
 * Manages all connected players in a game server.
 *
 * @remarks
 * The PlayerManager is created internally as a global
 * singleton accessible with the static property
 * `PlayerManager.instance`.
 *
 * @example
 * ```typescript
 * import { PlayerManager } from 'hytopia';
 *
 * const playerManager = PlayerManager.instance;
 * const connectedPlayers = playerManager.getConnectedPlayers();
 * ```
 *
 * @public
 */
export declare class PlayerManager {
    /** The global PlayerManager instance as a singleton. */
    static readonly instance: PlayerManager;




    /**
     * Get all connected players.
     * @returns An array of all connected players.
     */
    getConnectedPlayers(): Player[];
    /**
     * Get a connected player by their username (case insensitive).
     * @param username - The username of the player to get.
     * @returns The connected player with the given username or undefined if not found.
     */
    getConnectedPlayerByUsername(username: string): Player | undefined;


}

/** The camera orientation state of a Player. @public */
export declare type PlayerOrientationState = {
    pitch: number;
    yaw: number;
};

/** A raw set of collision groups represented as a 32-bit number. @public */
export declare type RawCollisionGroups = RAPIER.InteractionGroups;

/** Options for raycasting. @public */
declare type RayCastOptions = {
    /** Whether to ignore sensor colliders. */
    ignoresSensors?: boolean;
    /** The query filter flags. */
    filterFlags?: RAPIER.QueryFilterFlags;
    /** The collision group to filter by. */
    filterGroups?: number;
    /** The collider to exclude. */
    filterExcludeCollider?: RAPIER.Collider;
    /** The rigid body to exclude. */
    filterExcludeRigidBody?: RAPIER.RigidBody;
    /** The predicate to filter by. */
    filterPredicate?: (collider: RAPIER.Collider) => boolean;
};

/**
 * Represents a rigid body in a world's physics simulation.
 *
 * @remarks
 * Rigid bodies are the core of the physics simulation. They are
 * used to represent physical objects (IE: entities) that can
 * interact with each other.
 *
 * @public
 */
export declare class RigidBody {










    /**
     * @param options - The options for the rigid body instance.
     */
    constructor(options: RigidBodyOptions);
    /** The colliders of the rigid body. */
    get colliders(): Set<Collider>;
    /** Whether the rigid body has continuous collision detection enabled. */
    get isCcdEnabled(): boolean;
    /** Whether the rigid body is dynamic. */
    get isDynamic(): boolean;
    /** Whether the rigid body is enabled. */
    get isEnabled(): boolean;
    /** Whether the rigid body is fixed. */
    get isFixed(): boolean;
    /** Whether the rigid body is kinematic. */
    get isKinematic(): boolean;
    /** Whether the rigid body is kinematic position based. */
    get isKinematicPositionBased(): boolean;
    /** Whether the rigid body is kinematic velocity based. */
    get isKinematicVelocityBased(): boolean;
    /** Whether the rigid body is moving. */
    get isMoving(): boolean;
    /** Whether the rigid body has been removed from the simulation. */
    get isRemoved(): boolean;
    /** Whether the rigid body is simulated. */
    get isSimulated(): boolean;
    /** Whether the rigid body is sleeping. */
    get isSleeping(): boolean;
    /** The number of colliders in the rigid body. */
    get numColliders(): number;
    /** The raw RAPIER rigid body instance. */
    get rawRigidBody(): RAPIER.RigidBody | undefined;
    /** An arbitrary identifier tag of the rigid body. Useful for your own logic. */
    get tag(): string | undefined;
    /**
     * Gets the additional mass of the rigid body.
     * @returns The additional mass of the rigid body.
     */
    getAdditionalMass(): number;
    /**
     * Gets the additional solver iterations of the rigid body.
     * @returns The additional solver iterations of the rigid body.
     */
    getAdditionalSolverIterations(): number;
    /**
     * Gets the angular damping of the rigid body.
     * @returns The angular damping of the rigid body.
     */
    getAngularDamping(): number;
    /**
     * Gets the angular velocity of the rigid body.
     * @returns The angular velocity of the rigid body.
     */
    getAngularVelocity(): Vector3;
    /**
     * Gets the colliders of the rigid body by tag.
     * @param tag - The tag to filter by.
     * @returns The colliders of the rigid body with the given tag.
     */
    getCollidersByTag(tag: string): Collider[];
    /**
     * Gets the dominance group of the rigid body.
     * @returns The dominance group of the rigid body.
     */
    getDominanceGroup(): number;
    /**
     * Gets the direction from the rotation of the rigid body.
     * @returns The direction from the rotation of the rigid body.
     */
    getDirectionFromRotation(): Vector3;
    /**
     * Gets the effective angular inertia of the rigid body.
     * @returns The effective angular inertia of the rigid body.
     */
    getEffectiveAngularInertia(): SpdMatrix3 | undefined;
    /**
     * Gets the effective inverse mass of the rigid body.
     * @returns The effective inverse mass of the rigid body.
     */
    getEffectiveInverseMass(): Vector3 | undefined;
    /**
     * Gets the effective world inverse principal angular inertia square root of the rigid body.
     * @returns The effective world inverse principal angular inertia square root of the rigid body.
     */
    getEffectiveWorldInversePrincipalAngularInertiaSqrt(): SpdMatrix3 | undefined;
    /**
     * Gets the enabled rotations of the rigid body.
     * @returns The enabled rotations of the rigid body.
     */
    getEnabledRotations(): Vector3Boolean;
    /**
     * Gets the enabled translations of the rigid body.
     * @returns The enabled translations of the rigid body.
     */
    getEnabledTranslations(): Vector3Boolean;
    /**
     * Gets the gravity scale of the rigid body.
     * @returns The gravity scale of the rigid body.
     */
    getGravityScale(): number;
    /**
     * Gets the inverse mass of the rigid body.
     * @returns The inverse mass of the rigid body.
     */
    getInverseMass(): number | undefined;
    /**
     * Gets the inverse principal angular inertia square root of the rigid body.
     * @returns The inverse principal angular inertia square root of the rigid body.
     */
    getInversePrincipalAngularInertiaSqrt(): Vector3 | undefined;
    /**
     * Gets the linear damping of the rigid body.
     * @returns The linear damping of the rigid body.
     */
    getLinearDamping(): number;
    /**
     * Gets the linear velocity of the rigid body.
     * @returns The linear velocity of the rigid body.
     */
    getLinearVelocity(): Vector3;
    /**
     * Gets the local center of mass of the rigid body.
     * @returns The local center of mass of the rigid body.
     */
    getLocalCenterOfMass(): Vector3;
    /**
     * Gets the mass of the rigid body.
     * @returns The mass of the rigid body.
     */
    getMass(): number;
    /**
     * Gets the next kinematic rotation of the rigid body.
     * @returns The next kinematic rotation of the rigid body.
     */
    getNextKinematicRotation(): Rotation;
    /**
     * Gets the next kinematic translation of the rigid body.
     * @returns The next kinematic translation of the rigid body.
     */
    getNextKinematicTranslation(): Vector3;
    /**
     * Gets the principal angular inertia of the rigid body.
     * @returns The principal angular inertia of the rigid body.
     */
    getPrincipalAngularInertia(): Vector3;
    /**
     * Gets the principal angular inertia local frame of the rigid body.
     * @returns The principal angular inertia local frame of the rigid body.
     */
    getPrincipalAngularInertiaLocalFrame(): Rotation | undefined;
    /**
     * Gets the rotation of the rigid body.
     * @returns The rotation of the rigid body.
     */
    getRotation(): Rotation;
    /**
     * Gets the soft ccd prediction of the rigid body.
     * @returns The soft ccd prediction of the rigid body.
     */
    getSoftCcdPrediction(): number;
    /**
     * Gets the translation of the rigid body.
     * @returns The translation of the rigid body.
     */
    getTranslation(): Vector3;
    /**
     * Gets the type of the rigid body.
     * @returns The type of the rigid body.
     */
    getType(): RigidBodyType;
    /**
     * Gets the world center of mass of the rigid body.
     * @returns The world center of mass of the rigid body.
     */
    getWorldCenterOfMass(): Vector3 | undefined;
    /**
     * Sets the additional mass of the rigid body.
     * @param additionalMass - The additional mass of the rigid body.
     */
    setAdditionalMass(additionalMass: number): void;
    /**
     * Sets the additional mass properties of the rigid body.
     * @param additionalMassProperties - The additional mass properties of the rigid body.
     */
    setAdditionalMassProperties(additionalMassProperties: RigidBodyAdditionalMassProperties): void;
    /**
     * Sets the additional solver iterations of the rigid body.
     * @param solverIterations - The additional solver iterations of the rigid body.
     */
    setAdditionalSolverIterations(solverIterations: number): void;
    /**
     * Sets the angular damping of the rigid body.
     * @param angularDamping - The angular damping of the rigid body.
     */
    setAngularDamping(angularDamping: number): void;
    /**
     * Sets the angular velocity of the rigid body.
     * @param angularVelocity - The angular velocity of the rigid body.
     */
    setAngularVelocity(angularVelocity: Vector): void;
    /**
     * Sets whether the rigid body has continuous collision detection enabled.
     * @param ccdEnabled - Whether the rigid body has continuous collision detection enabled.
     */
    setCcdEnabled(ccdEnabled: boolean): void;
    /**
     * Sets the dominance group of the rigid body.
     * @param dominanceGroup - The dominance group of the rigid body.
     */
    setDominanceGroup(dominanceGroup: number): void;
    /**
     * Sets whether the rigid body is enabled.
     * @param enabled - Whether the rigid body is enabled.
     */
    setEnabled(enabled: boolean): void;
    /**
     * Sets whether the rigid body has enabled rotations.
     * @param enabledRotations - Whether the rigid body has enabled rotations.
     */
    setEnabledRotations(enabledRotations: Vector3Boolean): void;
    /**
     * Sets whether the rigid body has enabled translations.
     * @param enabledTranslations - Whether the rigid body has enabled translations.
     */
    setEnabledTranslations(enabledTranslations: Vector3Boolean): void;
    /**
     * Sets the gravity scale of the rigid body.
     * @param gravityScale - The gravity scale of the rigid body.
     */
    setGravityScale(gravityScale: number): void;
    /**
     * Sets the linear damping of the rigid body.
     * @param linearDamping - The linear damping of the rigid body.
     */
    setLinearDamping(linearDamping: number): void;
    /**
     * Sets the linear velocity of the rigid body.
     * @param linearVelocity - The linear velocity of the rigid body.
     */
    setLinearVelocity(linearVelocity: Vector): void;
    /**
     * Sets the next kinematic rotation of the rigid body.
     * @param nextKinematicRotation - The next kinematic rotation of the rigid body.
     */
    setNextKinematicRotation(nextKinematicRotation: Rotation): void;
    /**
     * Sets the next kinematic translation of the rigid body.
     * @param nextKinematicTranslation - The next kinematic translation of the rigid body.
     */
    setNextKinematicTranslation(nextKinematicTranslation: Vector): void;
    /**
     * Sets the rotation of the rigid body.
     * @param rotation - The rotation of the rigid body.
     */
    setRotation(rotation: Rotation): void;
    /**
     * Sets whether the rigid body is sleeping.
     * @param sleeping - Whether the rigid body is sleeping.
     */
    setSleeping(sleeping: boolean): void;
    /**
     * Sets the soft ccd prediction of the rigid body.
     * @param softCcdPrediction - The soft ccd prediction of the rigid body.
     */
    setSoftCcdPrediction(softCcdPrediction: number): void;
    /**
     * Sets the collision groups for solid colliders (non-sensor) of the rigid body.
     * @param collisionGroups - The collision groups for solid colliders of the rigid body.
     */
    setCollisionGroupsForSolidColliders(collisionGroups: CollisionGroups): void;
    /**
     * Sets the tag of the rigid body.
     * @param tag - The tag of the rigid body.
     */
    setTag(tag: string): void;
    /**
     * Sets the translation of the rigid body.
     * @param translation - The translation of the rigid body.
     */
    setTranslation(translation: Vector): void;
    /**
     * Sets the type of the rigid body.
     * @param type - The type of the rigid body.
     */
    setType(type: RigidBodyType): void;
    /**
     * Adds a force to the rigid body.
     * @param force - The force to add to the rigid body.
     */
    addForce(force: Vector): void;
    /**
     * Adds a torque to the rigid body.
     * @param torque - The torque to add to the rigid body.
     */
    addTorque(torque: Vector): void;
    /**
     * Adds an unsimulated child collider to the rigid body for the simulation it belongs to.
     * @param collider - The child collider to add to the rigid body for the simulation it belongs to.
     */
    addChildColliderToSimulation(collider: Collider): void;
    /**
     * Adds the rigid body to a simulation.
     * @param simulation - The simulation to add the rigid body to.
     */
    addToSimulation(simulation: Simulation): void;
    /**
     * Applies an impulse to the rigid body.
     * @param impulse - The impulse to apply to the rigid body.
     */
    applyImpulse(impulse: Vector): void;
    /**
     * Applies an impulse to the rigid body at a point.
     * @param impulse - The impulse to apply to the rigid body.
     * @param point - The point at which to apply the impulse.
     */
    applyImpulseAtPoint(impulse: Vector, point: Vector): void;
    /**
     * Applies a torque impulse to the rigid body.
     * @param impulse - The torque impulse to apply to the rigid body.
     */
    applyTorqueImpulse(impulse: Vector): void;
    /**
     * Creates and adds a child collider to the rigid body for the simulation it belongs to.
     * @param colliderOptions - The options for the child collider to add.
     * @returns The child collider that was added to the rigid body.
     */
    createAndAddChildColliderToSimulation(colliderOptions: ColliderOptions): Collider;
    /**
     * Creates and adds multiple child colliders to the rigid body for the simulation it belongs to.
     * @param colliderOptions - The options for the child colliders to add to the rigid body.
     * @returns The child colliders that were added to the rigid body.
     */
    createAndAddChildCollidersToSimulation(colliderOptions: ColliderOptions[]): Collider[];

    /**
     * Locks all rotations of the rigid body.
     */
    lockAllRotations(): void;
    /**
     * Locks all translations of the rigid body.
     */
    lockAllTranslations(): void;
    /**
     * Removes the rigid body from the simulation it belongs to.
     */
    removeFromSimulation(): void;

    /**
     * Explicitly puts the rigid body to sleep. Physics otherwise optimizes sleeping.
     */
    sleep(): void;
    /**
     * Wakes up the rigid body. Physics otherwise optimizes waking it when necessary.
     */
    wakeUp(): void;














}

/** Additional mass properties for a RigidBody. @public */
export declare type RigidBodyAdditionalMassProperties = {
    additionalMass: number;
    centerOfMass: Vector3;
    principalAngularInertia: Vector3;
    principalAngularInertiaLocalFrame: Rotation;
};

/** Options for creating a RigidBody instance. @public */
export declare interface RigidBodyOptions {
    /** The type of the rigid body. */
    type: RigidBodyType;
    /** The additional mass of the rigid body. */
    additionalMass?: number;
    /** The additional mass properties of the rigid body. */
    additionalMassProperties?: RigidBodyAdditionalMassProperties;
    /** The additional solver iterations of the rigid body. */
    additionalSolverIterations?: number;
    /** The angular damping of the rigid body. */
    angularDamping?: number;
    /** The angular velocity of the rigid body. */
    angularVelocity?: Vector3;
    /** Whether the rigid body has continuous collision detection enabled. */
    ccdEnabled?: boolean;
    /** The colliders of the rigid body, provided as {@link ColliderOptions}. */
    colliders?: ColliderOptions[];
    /** The dominance group of the rigid body. */
    dominanceGroup?: number;
    /** Whether the rigid body is enabled. */
    enabled?: boolean;
    /** The enabled rotations of the rigid body. */
    enabledRotations?: Vector3Boolean;
    /** The enabled translations of the rigid body. */
    enabledTranslations?: Vector3Boolean;
    /** The gravity scale of the rigid body. */
    gravityScale?: number;
    /** The linear damping of the rigid body. */
    linearDamping?: number;
    /** The linear velocity of the rigid body. */
    linearVelocity?: Vector3;
    /** The rotation of the rigid body. */
    rotation?: Rotation;
    /** The simulation the rigid body is in. If provided, the rigid body will be automatically added to the simulation. */
    simulation?: Simulation;
    /** Whether the rigid body is sleeping. */
    sleeping?: boolean;
    /** The soft continuous collision detection prediction of the rigid body. */
    softCcdPrediction?: number;
    /** The tag of the rigid body. */
    tag?: string;
    /** The translation of the rigid body. */
    translation?: Vector3;
}

/** The types a RigidBody can be. @public */
export declare enum RigidBodyType {
    DYNAMIC = "dynamic",
    FIXED = "fixed",
    KINEMATIC_POSITION = "kinematic_position",
    KINEMATIC_VELOCITY = "kinematic_velocity"
}

/** A rotation in quaternion form. @public */
export declare interface Rotation {
    x: number;
    y: number;
    z: number;
    w: number;
}

/**
 * Represents the physics simulation for a world.
 *
 * @remarks
 * The simulation internally and automatically handles the physical
 * interactions, collisions, contact forces, and events for all aspects
 * of the world. Most methods are not often used directly, but are
 * provided for advanced usage.
 *
 * @public
 */
export declare class Simulation {







    /** Whether the simulation has debug rendering enabled. */
    get isDebugRenderingEnabled(): boolean;
    /** The gravity vector for the simulation. */
    get gravity(): RAPIER.Vector3;
    /** The fixed timestep for the simulation. */
    get timestepS(): number;
    /** The world the simulation is for. */
    get world(): World;
    /**
     * Casts a ray through the simulation.
     * @param origin - The origin of the ray.
     * @param direction - The direction of the ray.
     * @param length - The length of the ray.
     * @param options - The options for the raycast.
     * @returns The first block or entity hit by the ray, or null if no hit.
     */
    castRay(origin: RAPIER.Vector3, direction: RAPIER.Vector3, length: number, options?: RayCastOptions): Block | Entity | null;


    /**
     * Enables or disables debug rendering for the simulation.
     * When enabled, all colliders, rigid body and raycast outlines
     * will be rendered in the world. Do not enable this in production.
     * In large worlds enabling this can cause noticable lag and RTT spikes.
     * @param enabled - Whether to enable debug rendering.
     */
    enableDebugRendering(enabled: boolean): void;






}

/** A 3x3 symmetric positive-definite matrix for spatial dynamics. @public */
export declare interface SpdMatrix3 extends SdpMatrix3 {
}

/**
 * The entry point for running game setup and starting the game server.
 *
 * @remarks
 * This function should always be called first when initializing your
 * game. It will internally handle initialization of the physics engine
 * and other systems required systems. All of your game setup logic
 * should be executed in the init function.
 *
 * @param init - A function that initializes the world.
 *
 * @public
 */
export declare function startServer(init: (world: World) => void): void;

/** The input keys included in the PlayerInputState. @public */
export declare const SUPPORTED_INPUT_KEYS: string[];

/** A 3-dimensional vector. @public */
export declare interface Vector3 {
    x: number;
    y: number;
    z: number;
}

/** A 3-dimensional vector of boolean values. @public */
export declare interface Vector3Boolean {
    x: boolean;
    y: boolean;
    z: boolean;
}

/** The port the server will listen on. You can override this in your .env by setting WEB_SERVER_PORT. */
export declare const WEB_SERVER_PORT: string | number;

/**
 * Manages the internal HTTP server for the game server.
 *
 * @remarks
 * This class is used as a singleton and should be
 * accessed via the GameServer.webServer property.
 *
 * @public
 */
export declare class WebServer implements Readyable {









    /**
     * Enables SSL for local development. The server will be
     * available at https://localhost:8080. This is intended
     * for local development without a reverse proxy. Don't
     * use it when using tunnels like ngrok.com that already
     * handle SSL. Usage of this method will be ignored
     * in production. Must be called in init function of
     * {@link startServer}.
     */
    enableLocalSSL(): void;






}

/**
 * Represents a world in the game server.
 *
 * @remarks
 * Worlds are the primary container for game objects
 * and interactions. A game can have multiple worlds running
 * simultaneously, each uniquely isolated from each other.
 * Players who have joined your server can be assigned to a world
 * programmatically by your game logic if desired. This is useful
 * for things like mini-games, or complex dungeons with multiple
 * floors that can be optimized by splitting them into seperate
 * world or "room" simulations, etc. In most cases, the single
 * automatically created default world is all you need, but
 * this flexibility is available for more complex games.
 *
 * @example
 * ```typescript
 * const world = new World({
 *   id: 1,
 *   name: 'My World',
 *   skyboxUri: 'textures/skyboxes/default.png',
 * });
 * ```
 *
 * @public
 */
export declare class World implements protocol.Serializable {
    /**
     * A function that is called when a player joins the world.
     * @param player - The player that joined the world.
     */
    onPlayerJoin?: (player: Player) => void;
    /**
     * A function that is called when a player leaves the world.
     * @param player - The player that left the world.
     */
    onPlayerLeave?: (player: Player) => void;












    /**
     * @param options - The options for the world.
     */
    constructor(options: WorldOptions);
    /** The unique ID of the world. */
    get id(): number;
    /** The name of the world. */
    get name(): string;
    /** The URI of the skybox cubemap for the world. */
    get skyboxUri(): string;
    /** The audio manager for the world. */
    get audioManager(): AudioManager;
    /** The block type registry for the world. */
    get blockTypeRegistry(): BlockTypeRegistry;
    /** The chat manager for the world. */
    get chatManager(): ChatManager;
    /** The chunk lattice for the world. */
    get chunkLattice(): ChunkLattice;
    /** The entity manager for the world. */
    get entityManager(): EntityManager;
    /** The event router for the world. */
    get eventRouter(): EventRouter;
    /** The world loop for the world. */
    get loop(): WorldLoop;

    /** The simulation for the world. */
    get simulation(): Simulation;
    /**
     * Loads a map into the world.
     * @param map - The map to load.
     */
    loadMap(map: WorldMap): void;
    /**
     * Starts the world loop, which begins ticking physics, entities, etc.
     */
    start(): void;
    /**
     * Stops the world loop, which stops ticking physics, entities, etc.
     */
    stop(): void;

}

/**
 * Manages the tick loop for a world.
 *
 * @remarks
 * The world loop automatically handles ticking physics,
 * entities, and other world logic.
 *
 * The internal order of tick operations is as follows:
 *
 * 1. Update chunks and meshing
 *
 * 2. Tick entity logic
 *
 * 3. Step physics
 *
 * 4. Check and emit entity updates
 *
 * 5. Synchronize network packets with player clients
 *
 * @public
 */
export declare class WorldLoop {




    /** The current tick of the world loop. */
    get currentTick(): number;
    /** The next tick time in milliseconds. */
    get nextTickMs(): number;
    /** The fixed timestep of the world loop in seconds. */
    get timestepS(): number;
    /** The world that the loop manages. */
    get world(): World;




}

/** A map representation for a world. @public */
export declare interface WorldMap {
    /** The block types in the map. */
    blockTypes: {
        /** The ID of the block type. */
        id: number;
        /** The name of the block type. */
        name: string;
        /** The URI of the texture for the block type. */
        textureUri: string;
    }[];
    /** The blocks in the map */
    blocks: {
        /** The global coordinate to block type id mapping. */
        [coordinate: string]: number;
    };
}

/** Options for creating a World instance. @public */
export declare interface WorldOptions {
    /** The unique ID of the world. */
    id: number;
    /** The name of the world. */
    name: string;
    /** The URI of the skybox cubemap for the world. */
    skyboxUri: string;
    /** The tick rate for the world. */
    tickRate?: number;
    /** The gravity vector for the world. */
    gravity?: Vector3;
}

export { }
