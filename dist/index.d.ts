/// <reference types="node" />
import WS from "ws";
import { EventEmitter } from "events";
interface publicEvents {
    trackUpdateRequest: [any];
    trackUpdate: [import("./Types").Track];
    queueUpdate: [any];
    notification: [any];
    error: [Error];
    raw: [import("./Types").InboundPacket];
    unknown: [import("./Types").InboundPacket];
    disconnected: [boolean];
}
declare class ListenSomeMoe extends EventEmitter {
    wsURL: string;
    heartbeatInterval: number;
    heartbeatTimeout: NodeJS.Timeout | null;
    lastACKAt: number;
    lastHeartbeatSend: number;
    latency: number;
    ws: WS | null;
    wsStatus: "ready" | "disconnected" | "connecting";
    tracks: Array<import("./Types").Track>;
    maxTrackCache: number;
    lastTrackStartedAt: number;
    constructor(wsURL: string, maxTrackCache?: number);
    static get Constants(): {
        baseJPOPGatewayURL: string;
        baseKPOPGatewayURL: string;
        OP_CODES: {
            WELCOME: 0;
            RECEIVE_PLAYBACK_INFO: 1;
            HEARTBEAT: 9;
            HEARTBEAT_ACK: 10;
        };
        STREAM_URLS: {
            JPOP: {
                vorbis: string;
                opus: string;
                mp3: string;
            };
            KPOP: {
                vorbis: string;
                opus: string;
                mp3: string;
            };
        };
        internalEvents: {
            TRACK_UPDATE_REQUEST: "trackUpdateRequest";
            TRACK_UPDATE: "trackUpdate";
            QUEUE_UPDATE: "queueUpdate";
            NOTIFICATION: "notification";
        };
    };
    get Constants(): {
        baseJPOPGatewayURL: string;
        baseKPOPGatewayURL: string;
        OP_CODES: {
            WELCOME: 0;
            RECEIVE_PLAYBACK_INFO: 1;
            HEARTBEAT: 9;
            HEARTBEAT_ACK: 10;
        };
        STREAM_URLS: {
            JPOP: {
                vorbis: string;
                opus: string;
                mp3: string;
            };
            KPOP: {
                vorbis: string;
                opus: string;
                mp3: string;
            };
        };
        internalEvents: {
            TRACK_UPDATE_REQUEST: "trackUpdateRequest";
            TRACK_UPDATE: "trackUpdate";
            QUEUE_UPDATE: "queueUpdate";
            NOTIFICATION: "notification";
        };
    };
    get lastTrackStartedTimestamp(): Date;
    get nowPlaying(): import("./Types").Track;
    on<E extends keyof publicEvents>(event: E, listener: (...args: publicEvents[E]) => any): this;
    once<E extends keyof publicEvents>(event: E, listener: (...args: publicEvents[E]) => any): this;
    off<E extends keyof publicEvents>(event: E, listener: (...args: publicEvents[E]) => any): this;
    emit<E extends keyof publicEvents>(event: E, ...args: publicEvents[E]): boolean;
    private _heartbeat;
    private _onWSMessage;
    private _disconnect;
    private _reset;
    private _connect;
    private _onWSClose;
    private _send;
}
export = ListenSomeMoe;
