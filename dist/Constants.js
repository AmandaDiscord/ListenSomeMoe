"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseJPOPGatewayURL = "wss://listen.moe/gateway_v2";
exports.baseKPOPGatewayURL = "wss://listen.moe/kpop/gateway_v2";
const WELCOME = 0;
const RECEIVE_PLAYBACK_INFO = 1;
const HEARTBEAT = 9;
const HEARTBEAT_ACK = 10;
exports.OP_CODES = {
    WELCOME,
    RECEIVE_PLAYBACK_INFO,
    HEARTBEAT,
    HEARTBEAT_ACK
};
exports.STREAM_URLS = {
    JPOP: {
        vorbis: "https://listen.moe/stream",
        opus: "https://listen.moe/opus",
        mp3: "https://listen.moe/fallback"
    },
    KPOP: {
        vorbis: "https://listen.moe/kpop/stream",
        opus: "https://listen.moe/kpop/opus",
        mp3: "https://listen.moe/kpop/fallback"
    }
};
const TRACK_UPDATE_REQUEST = "trackUpdateRequest";
const TRACK_UPDATE = "trackUpdate";
const QUEUE_UPDATE = "queueUpdate";
const NOTIFICATION = "notification";
exports.internalEvents = {
    TRACK_UPDATE_REQUEST,
    TRACK_UPDATE,
    QUEUE_UPDATE,
    NOTIFICATION
};
exports.default = { baseJPOPGatewayURL: exports.baseJPOPGatewayURL, baseKPOPGatewayURL: exports.baseKPOPGatewayURL, OP_CODES: exports.OP_CODES, STREAM_URLS: exports.STREAM_URLS, internalEvents: exports.internalEvents };
