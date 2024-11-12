/// <reference types="node" />

import type { AnyPacket } from '@hytopia.com/server-protocol';
import type { IncomingMessage } from 'http';
import type { InputSchema } from '@hytopia.com/server-protocol';
import type { IPacket } from '@hytopia.com/server-protocol';
import protocol from '@hytopia.com/server-protocol';
import RAPIER from '@dimforge/rapier3d-compat';
import { SdpMatrix3 } from '@dimforge/rapier3d-compat';
import { Vector } from '@dimforge/rapier3d-compat';
import { WebSocket as WebSocket_2 } from 'ws';

/**
 * An instance of audio, supporting a variety of configuration options.
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
 * An instance of a block type, supporting a variety of configuration options.
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

export declare class Collider {
    private _collider;
    private _colliderDesc;
    private _onCollision;
    private _parentRigidBody;
    private _simulation;
    private _tag;
    constructor(colliderOptions: ColliderOptions);
    get isEnabled(): boolean;
    get isRemoved(): boolean;
    get isSensor(): boolean;
    get isSimulated(): boolean;
    get parentRigidBody(): RigidBody | undefined;
    get rawCollider(): RAPIER.Collider | undefined;
    get tag(): string | undefined;
    getCollisionGroups(): CollisionGroups;
    getFriction(): number;
    getRestitution(): number;
    getRelativeRotation(): Rotation;
    getRelativeTranslation(): Vector3;
    setBounciness(bounciness: number): void;
    setOnCollision(callback: CollisionCallback | undefined): void;
    setCollisionGroups(collisionGroups: CollisionGroups): void;
    setEnabled(enabled: boolean): void;
    setFriction(friction: number): void;
    setMass(mass: number): void;
    setRelativeRotation(rotation: Rotation): void;
    setRelativeTranslation(translation: Vector3): void;
    setSensor(sensor: boolean): void;
    setTag(tag: string): void;
    addToSimulation(simulation: Simulation, parentRigidBody?: RigidBody): void;
    enableCollisionEvents(enabled: boolean): void;
    enableContactForceEvents(enabled: boolean): void;
    removeFromSimulation(): void;
    private _applyColliderOptions;
    private _autoAddToSimulation;
    private _createColliderDesc;
    private _requireNotRemoved;
    private _setActiveCollisionTypes;
}

export declare class ColliderMap {
    private _rawColliderBlockTypeMap;
    private _rawColliderCollisionCallbackMap;
    private _rawRigidBodyEntityMap;
    getRawColliderBlockType(collider: RAPIER.Collider): BlockType | undefined;
    getColliderBlockType(collider: Collider): BlockType | undefined;
    setColliderBlockType(collider: Collider, block: BlockType): void;
    removeColliderBlockType(collider: Collider): void;
    getRawColliderCollisionCallback(collider: RAPIER.Collider): CollisionCallback | undefined;
    getColliderCollisionCallback(collider: Collider): CollisionCallback | undefined;
    setColliderCollisionCallback(collider: Collider, callback: CollisionCallback): void;
    removeColliderCollisionCallback(collider: Collider): void;
    getRawRigidBodyEntity(rigidBody: RAPIER.RigidBody): Entity | undefined;
    setRawRigidBodyEntity(rigidBody: RAPIER.RigidBody, entity: Entity): void;
    removeRawRigidBodyEntity(rigidBody: RAPIER.RigidBody): void;
    private _requireSimulatedCollider;
    private _requireSimulatedRigidBody;
}

export declare interface ColliderOptions {
    shape: ColliderShape;
    borderRadius?: number;
    bounciness?: number;
    collisionGroups?: CollisionGroups;
    enabled?: boolean;
    friction?: number;
    halfExtents?: Vector3;
    halfHeight?: number;
    isSensor?: boolean;
    mass?: number;
    onCollision?: CollisionCallback;
    parentRigidBody?: RigidBody;
    radius?: number;
    relativeRotation?: Rotation;
    relativeTranslation?: Vector3;
    simulation?: Simulation;
    tag?: string;
}

export declare enum ColliderShape {
    BALL = "ball",
    BLOCK = "block",
    CAPSULE = "capsule",
    CONE = "cone",
    CYLINDER = "cylinder",
    ROUND_CYLINDER = "round-cylinder"
}

export declare type CollisionCallback = (other: BlockType | Entity, started: boolean) => void;

export declare enum CollisionGroup {
    BLOCK = 1,
    ENTITY = 2,
    ENTITY_SENSOR = 4,
    PLAYER = 8,
    ALL = 65535
}

export declare type CollisionGroups = {
    belongsTo: CollisionGroup[];
    collidesWith: CollisionGroup[];
};

export declare class CollisionGroupsBuilder {
    private static readonly BELONGS_TO_SHIFT;
    private static readonly COLLIDES_WITH_MASK;
    static buildRawCollisionGroups(collisionGroups: CollisionGroups): RawCollisionGroups;
    static decodeRawCollisionGroups(groups: RawCollisionGroups): CollisionGroups;
    static decodeCollisionGroups(collisionGroups: CollisionGroups): DecodedCollisionGroups;
    static isDefaultCollisionGroups(collisionGroups: CollisionGroups): boolean;
    private static combineGroups;
    private static bitsToGroups;
    private static groupToName;
}

export declare type CollisionObject = BlockType | Entity | CollisionCallback;

/**
 * A callback function for a chat command.
 * @param player - The player that sent the command.
 * @param args - An array of arguments, comprised of all space separated text after the command.
 * @param message - The full message of the command.
 * @public
 */
export declare type CommandCallback = (player: Player, args: string[], message: string) => void;

declare type ContactForceData = {
    totalForce: RAPIER.Vector;
    totalForceMagnitude: number;
    maxForceDirection: RAPIER.Vector;
    maxForceMagnitude: number;
};

export declare type DecodedCollisionGroups = {
    belongsTo: string[];
    collidesWith: string[];
};

/** The default rigid body options when EntityOptions.rigidBodyOptions is not provided. */
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
     * @param options - The options for the entity instance.
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
        ColliderMap,
        CollisionCallback,
        CollisionObject,
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
        startServer,
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
        World,
        WorldData,
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

export declare class PlayerEntity extends Entity {
    player: Player;
    constructor(options: PlayerEntityOptions);
    tick(tickDeltaMs: number): void;
}

export declare interface PlayerEntityOptions extends EntityOptions {
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

export declare type RawCollisionGroups = RAPIER.InteractionGroups;

declare type RayCastOptions = {
    ignoresSensors?: boolean;
    filterFlags?: RAPIER.QueryFilterFlags;
    filterGroups?: number;
    filterExcludeCollider?: RAPIER.Collider;
    filterExcludeRigidBody?: RAPIER.RigidBody;
    filterPredicate?: (collider: RAPIER.Collider) => boolean;
};

export declare class RigidBody {
    private _additionalMass;
    private _colliders;
    private _explicitSleep;
    private _enabledRotations;
    private _enabledTranslations;
    private _rigidBody;
    private _rigidBodyDesc;
    private _rigidBodyType;
    private _simulation;
    private _tag;
    constructor(options: RigidBodyOptions);
    get colliders(): Set<Collider>;
    get isCcdEnabled(): boolean;
    get isDynamic(): boolean;
    get isEnabled(): boolean;
    get isFixed(): boolean;
    get isKinematic(): boolean;
    get isKinematicPositionBased(): boolean;
    get isKinematicVelocityBased(): boolean;
    get isMoving(): boolean;
    get isRemoved(): boolean;
    get isSimulated(): boolean;
    get isSleeping(): boolean;
    get numColliders(): number;
    get rawRigidBody(): RAPIER.RigidBody | undefined;
    get tag(): string | undefined;
    getAdditionalMass(): number;
    getAdditionalSolverIterations(): number;
    getAngularDamping(): number;
    getAngularVelocity(): Vector3;
    getCollidersByTag(tag: string): Collider[];
    getDominanceGroup(): number;
    getDirectionFromRotation(): Vector3;
    getEffectiveAngularInertia(): SpdMatrix3 | undefined;
    getEffectiveInverseMass(): Vector3 | undefined;
    getEffectiveWorldInversePrincipalAngularInertiaSqrt(): SpdMatrix3 | undefined;
    getEnabledRotations(): Vector3Boolean;
    getEnabledTranslations(): Vector3Boolean;
    getGravityScale(): number;
    getInverseMass(): number | undefined;
    getInversePrincipalAngularInertiaSqrt(): Vector3 | undefined;
    getLinearDamping(): number;
    getLinearVelocity(): Vector3;
    getLocalCenterOfMass(): Vector3;
    getMass(): number;
    getNextKinematicRotation(): Rotation;
    getNextKinematicTranslation(): Vector3;
    getPrincipalAngularInertia(): Vector3;
    getPrincipalAngularInertiaLocalFrame(): Rotation | undefined;
    getRotation(): Rotation;
    getSoftCcdPrediction(): number;
    getTranslation(): Vector3;
    getType(): RigidBodyType;
    getWorldCenterOfMass(): Vector3 | undefined;
    setAdditionalMass(additionalMass: number): void;
    setAdditionalMassProperties(additionalMassProperties: RigidBodyAdditionalMassProperties): void;
    setAdditionalSolverIterations(solverIterations: number): void;
    setAngularDamping(angularDamping: number): void;
    setAngularVelocity(angularVelocity: Vector): void;
    setCcdEnabled(ccdEnabled: boolean): void;
    setDominanceGroup(dominanceGroup: number): void;
    setEnabled(enabled: boolean): void;
    setEnabledRotations(enabledRotations: Vector3Boolean): void;
    setEnabledTranslations(enabledTranslations: Vector3Boolean): void;
    setGravityScale(gravityScale: number): void;
    setLinearDamping(linearDamping: number): void;
    setLinearVelocity(linearVelocity: Vector): void;
    setNextKinematicRotation(nextKinematicRotation: Rotation): void;
    setNextKinematicTranslation(nextKinematicTranslation: Vector): void;
    setRotation(rotation: Rotation): void;
    setSleeping(sleeping: boolean): void;
    setSoftCcdPrediction(softCcdPrediction: number): void;
    setCollisionGroupsForSolidColliders(collisionGroups: CollisionGroups): void;
    setTag(tag: string): void;
    setTranslation(translation: Vector): void;
    setType(type: RigidBodyType): void;
    addForce(force: Vector): void;
    addTorque(torque: Vector): void;
    addChildColliderToSimulation(collider: Collider): void;
    addToSimulation(simulation: Simulation): void;
    applyImpulse(impulse: Vector): void;
    applyImpulseAtPoint(impulse: Vector, point: Vector): void;
    applyTorqueImpulse(impulse: Vector): void;
    createAndAddPendingChildCollider(colliderOptions: ColliderOptions): Collider;
    createAndAddPendingChildColliders(colliderOptions: ColliderOptions[]): Collider[];
    createAndAddChildColliderToSimulation(colliderOptions: ColliderOptions): Collider;
    createAndAddChildCollidersToSimulation(colliderOptions: ColliderOptions[]): Collider[];
    linkCollider(collider: Collider): void;
    lockAllRotations(): void;
    lockAllTranslations(): void;
    removeFromSimulation(): void;
    unlinkCollider(collider: Collider): void;
    sleep(): void;
    wakeUp(): void;
    private _applyRigidBodyOptions;
    private _autoAddToSimulation;
    private _createRigidBodyDesc;
    private _requireCreated;
    private _requireDynamic;
    private _requireKinematic;
    private _requireNotKinematicPositionBased;
    private _requireNotRemoved;
    private _requireNotSimulated;
    private _isEqualVectors;
    private _isEqualRotations;
    private _isNegligibleVector;
}

export declare type RigidBodyAdditionalMassProperties = {
    additionalMass: number;
    centerOfMass: Vector3;
    principalAngularInertia: Vector3;
    principalAngularInertiaLocalFrame: Rotation;
};

export declare interface RigidBodyOptions {
    type: RigidBodyType;
    additionalMass?: number;
    additionalMassProperties?: RigidBodyAdditionalMassProperties;
    additionalSolverIterations?: number;
    angularDamping?: number;
    angularVelocity?: Vector3;
    ccdEnabled?: boolean;
    colliders?: ColliderOptions[];
    dominanceGroup?: number;
    enabled?: boolean;
    enabledRotations?: Vector3Boolean;
    enabledTranslations?: Vector3Boolean;
    gravityScale?: number;
    linearDamping?: number;
    linearVelocity?: Vector3;
    rotation?: Rotation;
    simulation?: Simulation;
    sleeping?: boolean;
    softCcdPrediction?: number;
    tag?: string;
    translation?: Vector3;
}

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

export declare class Simulation {
    private _colliderMap;
    private _rapierEventQueue;
    private _rapierSimulation;
    private _world;
    constructor(world: World, tickRate?: number, gravity?: RAPIER.Vector3);
    get colliderMap(): ColliderMap;
    get gravity(): RAPIER.Vector3;
    get timestepS(): number;
    get world(): World;
    castRay(origin: RAPIER.Vector3, direction: RAPIER.Vector3, length: number, options?: RayCastOptions): Block | Entity | null;
    createRawCollider(rawColliderDesc: RAPIER.ColliderDesc, rawParent?: RAPIER.RigidBody): RAPIER.Collider;
    createRawRigidBody(rawRigidBodyDesc: RAPIER.RigidBodyDesc): RAPIER.RigidBody;
    removeRawCollider(rawCollider: RAPIER.Collider): void;
    removeRawRigidBody(rawRigidBody: RAPIER.RigidBody): void;
    step: (tickDeltaMs: number) => void;
    private _onCollisionEvent;
    private _onContactForceEvent;
    private _getCollisionObjects;
}

/** A 3x3 symmetric positive-definite matrix for spatial dynamics. @public */
export declare interface SpdMatrix3 extends SdpMatrix3 {
}

export declare function startServer(init: (world: World) => Promise<void>): Promise<void>;

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

export declare class World implements protocol.Serializable {
    onPlayerJoin?: (player: Player) => void;
    onPlayerLeave?: (player: Player) => void;
    private _id;
    private _name;
    private _skyboxUri;
    private _audioManager;
    private _blockTypeRegistry;
    private _chatManager;
    private _chunkLattice;
    private _entityManager;
    private _eventRouter;
    private _loop;
    private _networkSynchronizer;
    private _simulation;
    constructor(worldData: WorldData);
    get id(): number;
    get name(): string;
    get skyboxUri(): string;
    get audioManager(): AudioManager;
    get blockTypeRegistry(): BlockTypeRegistry;
    get chatManager(): ChatManager;
    get chunkLattice(): ChunkLattice;
    get entityManager(): EntityManager;
    get eventRouter(): EventRouter;
    get loop(): WorldLoop;
    get networkSynchronizer(): NetworkSynchronizer;
    get simulation(): Simulation;
    start(): void;
    stop(): void;
    serialize(): protocol.WorldSchema;
}

export declare interface WorldData {
    id: number;
    name: string;
    skyboxUri: string;
    tickRate?: number;
    gravity?: Vector3;
}

export declare class WorldLoop {
    private _currentTick;
    private _ticker;
    private _world;
    constructor(world: World, tickRate?: number);
    get currentTick(): number;
    get nextTickMs(): number;
    get timestepS(): number;
    get world(): World;
    start(): void;
    stop(): void;
    protected _tick: (tickDeltaMs: number) => void;
    protected _onTickError: (error: Error) => void;
}

export { }
