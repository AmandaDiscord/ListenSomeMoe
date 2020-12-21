export declare const baseJPOPGatewayURL = "wss://listen.moe/gateway_v2";
export declare const baseKPOPGatewayURL = "wss://listen.moe/kpop/gateway_v2";
export declare const OP_CODES: {
    WELCOME: 0;
    RECEIVE_PLAYBACK_INFO: 1;
    HEARTBEAT: 9;
    HEARTBEAT_ACK: 10;
};
export declare const STREAM_URLS: {
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
export declare const internalEvents: {
    TRACK_UPDATE_REQUEST: "trackUpdateRequest";
    TRACK_UPDATE: "trackUpdate";
    QUEUE_UPDATE: "queueUpdate";
    NOTIFICATION: "notification";
};
declare const _default: {
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
export default _default;
