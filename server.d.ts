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
 * for each {@link World} instance in a game server
 * and should never be instantiated directly. It allows
 * retrieval of all loaded audio, entity attached audio,
 * looped audio, and more.
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

export declare class BaseCharacterController {
    readonly entity: Entity;
    onTickPlayerMovement?: (inputState: PlayerInputState, orientationState: PlayerOrientationState, deltaTimeMs: number) => void;
    onTickPathfindingMovement?: (destination: Vector3, deltaTimeMs: number) => void;
    constructor(entity: Entity, _options?: Record<string, unknown>);
    createSensorColliders(): Collider[];
    tickPlayerMovement(inputState: PlayerInputState, orientationState: PlayerOrientationState, deltaTimeMs: number): void;
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
 * const blockTypeId = 10;
 * world.blockTypeRegistry.registerBlockType(blockTypeId, new BlockType(world, {
 *   id: blockTypeId,
 *   textureUri: 'assets/textures/stone.png',
 *   name: 'Stone',
 * }));
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
    constructor(world: World, options?: BlockTypeOptions);
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
    /** The world the block type is for. */
    get world(): World;


}

/** Options for creating a block type instance. @public */
export declare interface BlockTypeOptions {
    id: number;
    textureUri: string;
    name: string;
    customColliderOptions?: ColliderOptions;
}

export declare class BlockTypeRegistry implements protocol.Serializable {
    private _blockTypes;
    private _world;
    constructor(world: World);
    get world(): World;
    getAllBlockTypes(): BlockType[];
    getBlockType(id: number): BlockType;
    registerGenericBlockType(blockTypeOptions: BlockTypeOptions): BlockType;
    registerBlockType(id: number, blockTypeReference: BlockType): void;
    serialize(): protocol.BlockTypesSchema;
}

export declare namespace BlockTypeRegistryEventPayload {
    export interface RegisterBlockType {
        blockTypeRegistry: BlockTypeRegistry;
        id: number;
        blockType: BlockType;
    }
}

export declare enum BlockTypeRegistryEventType {
    REGISTER_BLOCK_TYPE = "BLOCK_TYPE_REGISTRY.REGISTER_BLOCK_TYPE"
}

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

export declare enum ChatEventType {
    SEND_BROADCAST_MESSAGE = "CHAT.SEND_BROADCAST_MESSAGE",
    SEND_PLAYER_MESSAGE = "CHAT.SEND_PLAYER_MESSAGE"
}

export declare class ChatManager {
    private _commandCallbacks;
    private _world;
    constructor(world: World);
    registerCommand(command: string, callback: CommandCallback): void;
    unregisterCommand(command: string): void;
    sendBroadcastMessage(message: string, color?: string): void;
    sendPlayerMessage(player: Player, message: string, color?: string): void;
    private _subscribeToPlayerEvents;
    private _onPlayerChatMessage;
}

export declare class Chunk implements protocol.Serializable {
    private _blocks;
    private _originCoordinate;
    private _requiresUpdate;
    private _rigidBody;
    private _world;
    constructor();
    get blocks(): Readonly<Uint8Array>;
    get requiresUpdate(): boolean;
    get isSimulated(): boolean;
    get isSpawned(): boolean;
    get originCoordinate(): Vector3 | undefined;
    get world(): World | undefined;
    static blockIndexToLocalCoordinate(index: number): Vector3;
    static globalCoordinateToLocalCoordinate(globalCoordinate: Vector3): Vector3;
    static globalCoordinateToOriginCoordinate(globalCoordinate: Vector3): Vector3;
    static isValidOriginCoordinate(coordinate: Vector3): boolean;
    spawn(world: World, originCoordinate: Vector3): void;
    despawn(): void;
    setBlock(localCoordinate: Vector3, blockTypeId: number): void;
    update(): void;
    serialize(): protocol.ChunkSchema;
    private _meshColliders;
    private _removeFromSimulation;
    private _getGlobalCoordinate;
    private _getIndex;
    private _isValidLocalCoordinate;
}

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

export declare enum ChunkEventType {
    DESPAWN = "CHUNK.DESPAWN",
    SET_BLOCK = "CHUNK.SET_BLOCK",
    SPAWN = "CHUNK.SPAWN"
}

export declare class ChunkLattice {
    private _chunks;
    private _world;
    constructor(world: World);
    registerChunk(chunk: Chunk): void;
    unregisterChunk(chunk: Chunk): void;
    getChunk(originCoordinate: Vector3): Chunk | undefined;
    getAllChunks(): Chunk[];
    hasChunk(originCoordinate: Vector3): boolean;
    setBlock(globalCoordinate: Vector3, blockTypeId: number): void;
    updateChunks(): void;
    private _getChunkKey;
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

export declare const DEFAULT_ENTITY_RIGID_BODY_OPTIONS: RigidBodyOptions;

export declare class DefaultCharacterController extends BaseCharacterController {
    jumpVelocity: number;
    runVelocity: number;
    walkVelocity: number;
    canWalk: (this: DefaultCharacterController) => boolean;
    canRun: (this: DefaultCharacterController) => boolean;
    canJump: (this: DefaultCharacterController) => boolean;
    private _stepAudio;
    private _groundContactCount;
    private _platform;
    constructor(entity: Entity, options?: DefaultCharacterControllerOptions);
    get isGrounded(): boolean;
    get isOnPlatform(): boolean;
    get platform(): Entity | undefined;
    createSensorColliders(): Collider[];
    tickPlayerMovement(inputState: PlayerInputState, orientationState: PlayerOrientationState, deltaTimeMs: number): void;
    tickPathfindingMovement(destination: Vector3, deltaTimeMs: number): void;
}

export declare interface DefaultCharacterControllerOptions {
    jumpVelocity?: number;
    runVelocity?: number;
    walkVelocity?: number;
    canJump?: () => boolean;
    canWalk?: () => boolean;
    canRun?: () => boolean;
}

export declare class Entity extends RigidBody implements protocol.Serializable {
    createCustomCharacterController?: (this: Entity) => BaseCharacterController;
    onBlockCollision?: (this: Entity, block: BlockType, started: boolean) => void;
    onBlockContactForce?: (this: Entity, block: BlockType, contactForceData: ContactForceData) => void;
    onEntityCollision?: (this: Entity, entity: Entity, started: boolean) => void;
    onEntityContactForce?: (this: Entity, entity: Entity, contactForceData: ContactForceData) => void;
    onSpawn?: (this: Entity) => void;
    onDespawn?: (this: Entity) => void;
    onTick?: (this: Entity, tickDeltaMs: number) => void;
    private _id;
    private _modelUri;
    private _modelLoopedAnimations;
    private _modelOneshotAnimations;
    private _modelScale;
    private _name;
    private _characterController;
    private _lastUpdatedRotation;
    private _lastUpdatedTranslation;
    private _world;
    constructor(options: EntityOptions);
    get id(): number | undefined;
    get modelUri(): string | undefined;
    get modelLoopedAnimations(): ReadonlySet<string>;
    get modelScale(): number | undefined;
    get name(): string;
    get characterController(): BaseCharacterController | undefined;
    get isSpawned(): boolean;
    get world(): World | undefined;
    spawn(world: World, coordinate: Vector3): void;
    despawn(): void;
    setCharacterController(characterController: BaseCharacterController): void;
    startModelLoopedAnimations(animations: string[]): void;
    startModelOneshotAnimations(animations: string[]): void;
    stopModelAnimations(animations: string[]): void;
    serialize(): protocol.EntitySchema;
    tick(tickDeltaMs: number): void;
    checkAndEmitUpdates(): void;
    private _requireSpawned;
    private _requireModelUri;
    private _rotationExceedsThreshold;
    private _translationExceedsThreshold;
}

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

export declare enum EntityEventType {
    DESPAWN = "ENTITY.DESPAWN",
    SPAWN = "ENTITY.SPAWN",
    START_MODEL_LOOPED_ANIMATIONS = "ENTITY.UPDATE_MODEL_LOOPED_ANIMATIONS",
    START_MODEL_ONESHOT_ANIMATIONS = "ENTITY.START_MODEL_ONESHOT_ANIMATIONS",
    STOP_MODEL_ANIMATIONS = "ENTITY.STOP_MODEL_ANIMATIONS",
    UPDATE_ROTATION = "ENTITY.UPDATE_ROTATION",
    UPDATE_TRANSLATION = "ENTITY.UPDATE_TRANSLATION"
}

export declare class EntityManager {
    private _entities;
    private _nextEntityId;
    private _world;
    constructor(world: World);
    get world(): World;
    registerEntity(entity: Entity): number;
    unregisterEntity(entity: Entity): void;
    getAllEntities(): Entity[];
    getAllPlayerEntities(player: Player): PlayerEntity[];
    getEntity<T extends Entity>(id: number): T | undefined;
    tickEntities(tickDeltaMs: number): void;
    checkAndEmitUpdates(): void;
}

export declare interface EntityOptions {
    modelUri?: string;
    modelLoopedAnimations?: string[];
    modelScale?: number;
    name?: string;
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
        ROTATION_UPDATE_THRESHOLD,
        TRANSLATION_UPDATE_THRESHOLD_SQ,
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
 * internally. Player instances should never be instantiated
 * directly.
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

export declare const ROTATION_UPDATE_THRESHOLD: number;

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

export declare const TRANSLATION_UPDATE_THRESHOLD_SQ: number;

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
