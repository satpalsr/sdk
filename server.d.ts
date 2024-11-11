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

export declare class Audio implements protocol.Serializable {
    private _id;
    private _attachedToEntity;
    private _duration;
    private _detune;
    private _distortion;
    private _loop;
    private _offset;
    private _position;
    private _playbackRate;
    private _playing;
    private _referenceDistance;
    private _startTick;
    private _uri;
    private _volume;
    private _world;
    constructor(audioData: AudioData);
    get id(): number | undefined;
    get attachedToEntity(): Entity | undefined;
    get duration(): number | undefined;
    get detune(): number | undefined;
    get distortion(): number | undefined;
    get loop(): boolean;
    get offset(): number | undefined;
    get isLoaded(): boolean;
    get isPlaying(): boolean;
    get isPositional(): boolean;
    get position(): Vector3 | undefined;
    get playbackRate(): number | undefined;
    get referenceDistance(): number | undefined;
    get startTick(): number | undefined;
    get uri(): string;
    get volume(): number | undefined;
    get world(): World | undefined;
    play(world: World, restart?: boolean): void;
    pause(): void;
    setAttachedToEntity(entity: Entity): void;
    setDetune(detune: number): void;
    setDistortion(distortion: number): void;
    setPosition(position: Vector3): void;
    setPlaybackRate(playbackRate: number): void;
    setReferenceDistance(referenceDistance: number): void;
    setVolume(volume: number): void;
    serialize(): protocol.AudioSchema;
    private _requirePositional;
}

export declare interface AudioData {
    attachedToEntity?: Entity;
    duration?: number;
    detune?: number;
    distortion?: number;
    loop?: boolean;
    offset?: number;
    position?: Vector3;
    playbackRate?: number;
    referenceDistance?: number;
    uri: string;
    volume?: number;
}

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

export declare class AudioManager {
    private _audios;
    private _nextAudioId;
    private _world;
    constructor(world: World);
    get world(): World;
    registerAudio(audio: Audio): number;
    unregisterAudio(audio: Audio): void;
    getAllAudios(): Audio[];
    getAllEntityAttachedAudios(entity: Entity): Audio[];
    getAllLoopedAudios(): Audio[];
    getAllOneshotAudios(): Audio[];
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

export declare class Block {
    readonly globalCoordinate: Vector3;
    readonly blockType: BlockType;
    constructor(coordinate: Vector3, blockType: BlockType);
    static fromGlobalCoordinate(globalCoordinate: Vector3, blockType: BlockType): Block;
}

export declare class BlockType implements protocol.Serializable {
    onEntityCollision?: (this: BlockType, entity: Entity, started: boolean) => void;
    onEntityContactForce?: (this: BlockType, entity: Entity, contactForceData: ContactForceData) => void;
    private readonly _id;
    private _textureUri;
    private _name;
    private _customColliderOptions;
    private _isSolid;
    private _world;
    constructor(world: World, blockTypeData?: BlockTypeData);
    get id(): number;
    get colliderOptions(): ColliderOptions;
    get textureUri(): string;
    get name(): string;
    get world(): World;
    get isSolid(): boolean;
    get isMeshable(): boolean;
    createCollider(halfExtents?: Vector3): Collider;
    serialize(): protocol.BlockTypeSchema;
}

export declare interface BlockTypeData {
    id: number;
    textureUri: string;
    name: string;
    customColliderOptions?: ColliderOptions;
    isSolid?: boolean;
}

export declare class BlockTypeRegistry implements protocol.Serializable {
    private _blockTypes;
    private _world;
    constructor(world: World);
    get world(): World;
    getAllBlockTypes(): BlockType[];
    getBlockType(id: number): BlockType;
    registerGenericBlockType(blockTypeData: BlockTypeData): BlockType;
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

declare class Connection {
    private _ws;
    readonly id: string;
    constructor(ws: WebSocket_2, req: IncomingMessage);
    send(packet: AnyPacket): void;
    close(): void;
    on<TConnectionEventPayload>(event: ConnectionEventType, callback: (payload: TConnectionEventPayload) => void): void;
    onPacket<T extends AnyPacket>(id: T[0], callback: (packet: T) => void): void;
    off<TConnectionEventPayload>(event: ConnectionEventType, callback: (payload: TConnectionEventPayload) => void): void;
    offAll(): void;
    offPacket<T extends AnyPacket>(id: T[0], callback: (packet: T) => void): void;
    private _onClose;
    private _onError;
    private _onMessage;
    private _serialize;
    private _deserialize;
    private _instanceEventType;
}

declare enum ConnectionEventType {
    OPENED = "CONNECTION.OPENED",
    CLOSED = "CONNECTION.CLOSED",
    PACKET_RECEIVED = "CONNECTION.PACKET_RECEIVED",
    PACKET_SENT = "CONNECTION.PACKET_SENT",
    ERROR = "CONNECTION.ERROR"
}

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

declare interface Event_2<TPayload> {
    type: string;
    payload: TPayload;
}
export { Event_2 as Event }

export declare class EventRouter {
    static readonly serverInstance: EventRouter;
    private _emitter;
    private _wrappedListenerMap;
    private _tag;
    logAllEvents: boolean;
    logEventsPayloads: boolean;
    logUnlistenedEvents: boolean;
    logIgnoreEvents: string[];
    logIgnoreEventPrefixes: string[];
    constructor(tag: string);
    on<TPayload>(eventType: string, listener: (payload: TPayload) => void): void;
    off<TPayload>(eventType: string, listener: (payload: TPayload) => void): void;
    offAll(eventType: string): void;
    emit<TPayload>(event: Event_2<TPayload>): boolean;
}

declare namespace HYTOPIA {
    export {
        Audio,
        AudioEventType,
        AudioData,
        AudioEventPayload,
        AudioManager,
        BaseCharacterController,
        Block,
        BlockType,
        BlockTypeData,
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
        PlayerInputState,
        PlayerOrientationState,
        PlayerEventPayload,
        PlayerEntity,
        PlayerEntityOptions,
        PlayerManager,
        PlayerManagerEventType,
        PlayerManagerEventPayload,
        RigidBody,
        RigidBodyType,
        RigidBodyAdditionalMassProperties,
        RigidBodyOptions,
        Simulation,
        Ticker,
        World,
        WorldData,
        WorldLoop
    }
}
export default HYTOPIA;

declare class NetworkSynchronizer {
    private _queuedBroadcasts;
    private _queuedAudioSynchronizations;
    private _queuedBlockSynchronizations;
    private _queuedBlockTypeSynchronizations;
    private _queuedChunkSynchronizations;
    private _queuedDebugRaycastSynchronizations;
    private _queuedEntitySynchronizations;
    private _queuedPlayerPackets;
    private _spawnedChunks;
    private _spawnedEntities;
    private _world;
    constructor(world: World);
    synchronize(): void;
    private _subscribeToAudioEvents;
    private _subscribeToBlockTypeRegistryEvents;
    private _subscribeToChatEvents;
    private _subscribeToChunkEvents;
    private _subscribeToEntityEvents;
    private _subscribeToPlayerEvents;
    private _subscribeToSimulationEvents;
    private _onAudioPause;
    private _onAudioPlay;
    private _onAudioPlayRestart;
    private _onAudioSetAttachedToEntity;
    private _onAudioSetDetune;
    private _onAudioSetDistortion;
    private _onAudioSetPosition;
    private _onAudioSetPlaybackRate;
    private _onAudioSetReferenceDistance;
    private _onAudioSetVolume;
    private _onBlockTypeRegistryRegisterBlockType;
    private _onChatSendBroadcastMessage;
    private _onChatSendPlayerMessage;
    private _onChunkSpawn;
    private _onChunkDespawn;
    private _onChunkSetBlock;
    private _onEntitySpawn;
    private _onEntityDespawn;
    private _onEntityStartModelLoopedAnimations;
    private _onEntityStartModelOneshotAnimations;
    private _onEntityStopModelAnimations;
    private _onEntityUpdateRotation;
    private _onEntityUpdateTranslation;
    private _onPlayerJoinedWorld;
    private _onPlayerLeftWorld;
    private _onPlayerRequestSync;
    private _onSimulationDebugRaycast;
    private _onSimulationDebugRender;
    private _createOrGetQueuedAudioSync;
    private _createOrGetQueuedBlockSync;
    private _createOrGetQueuedChunkSync;
    private _createOrGetQueuedEntitySync;
}

export declare class Player {
    readonly id: number;
    readonly username: string;
    readonly connection: Connection;
    private _inputState;
    private _orientationState;
    private _world;
    constructor(connection: Connection);
    get inputState(): Readonly<PlayerInputState>;
    get orientationState(): Readonly<PlayerOrientationState>;
    get world(): World | undefined;
    joinWorld(world: World): void;
    leaveWorld(): void;
    disconnect(): void;
    private _onChatMessageSendPacket;
    private _onDebugPacket;
    private _onInputPacket;
    private _onSyncRequestPacket;
}

export declare class PlayerEntity extends Entity {
    player: Player;
    constructor(options: PlayerEntityOptions);
    tick(tickDeltaMs: number): void;
}

export declare interface PlayerEntityOptions extends EntityOptions {
    player: Player;
}

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

export declare enum PlayerEventType {
    CHAT_MESSAGE_SEND = "PLAYER.CHAT_MESSAGE_SEND",
    JOINED_WORLD = "PLAYER.JOINED_WORLD",
    LEFT_WORLD = "PLAYER.LEFT_WORLD",
    REQUEST_SYNC = "PLAYER.REQUEST_SYNC"
}

export declare type PlayerInputState = Partial<Record<keyof InputSchema, boolean>>;

export declare class PlayerManager {
    static readonly instance: PlayerManager;
    private _connectionPlayers;
    private constructor();
    broadcast(packet: IPacket<number, any>): void;
    broadcastForWorld(worldId: number, packet: IPacket<number, any>): void;
    private _onConnectionOpened;
    private _onConnectionClosed;
}

export declare namespace PlayerManagerEventPayload {
    export interface PlayerConnected {
        player: Player;
    }
    export interface PlayerDisconnected {
        player: Player;
    }
}

export declare enum PlayerManagerEventType {
    PLAYER_CONNECTED = "PLAYER_MANAGER.PLAYER_CONNECTED",
    PLAYER_DISCONNECTED = "PLAYER_MANAGER.PLAYER_DISCONNECTED"
}

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

export declare interface SpdMatrix3 extends SdpMatrix3 {
}

export declare function startServer(init: (world: World) => Promise<void>): Promise<void>;

export declare class Ticker {
    private _accumulatorMs;
    private _targetTicksPerSecond;
    private _fixedTimestepMs;
    private _fixedTimestepS;
    private _nextTickMs;
    private _lastLoopTimeMs;
    private _tickFunction;
    private _tickErrorCallback?;
    private _tickHandle;
    constructor(ticksPerSecond: number, tickFunction: (tickDeltaMs: number) => void, tickErrorCallback?: (error: Error) => void);
    get targetTicksPerSecond(): number;
    get fixedTimestepMs(): number;
    get fixedTimestepS(): number;
    get nextTickMs(): number;
    start(): void;
    stop(): void;
    private _tick;
}

export declare const TRANSLATION_UPDATE_THRESHOLD_SQ: number;

export declare interface Vector3 {
    x: number;
    y: number;
    z: number;
}

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
