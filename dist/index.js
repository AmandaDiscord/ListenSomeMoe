"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const ws_1 = __importDefault(require("ws"));
const events_1 = require("events");
const Constants_1 = __importDefault(require("./Constants"));
const { OP_CODES, internalEvents } = Constants_1.default;
class ListenSomeMoe extends events_1.EventEmitter {
    constructor(wsURL, maxTrackCache = 5) {
        super();
        this.heartbeatInterval = 0;
        this.heartbeatTimeout = null;
        this.lastACKAt = 0;
        this.lastHeartbeatSend = 0;
        this.latency = 0;
        this.ws = null;
        this.wsStatus = "disconnected";
        this.tracks = [];
        this.lastTrackStartedAt = 0;
        this.wsURL = wsURL;
        this.maxTrackCache = maxTrackCache;
        this._connect();
    }
    static get Constants() {
        return Constants_1.default;
    }
    get Constants() {
        return Constants_1.default;
    }
    get lastTrackStartedTimestamp() {
        return new Date(this.lastTrackStartedAt);
    }
    get nowPlaying() {
        return this.tracks[0];
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    once(event, listener) {
        return super.once(event, listener);
    }
    off(event, listener) {
        return super.off(event, listener);
    }
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
    _heartbeat() {
        this.lastHeartbeatSend = Date.now();
        return this._send({ op: OP_CODES.HEARTBEAT, d: { message: "owo?" } });
    }
    _onWSMessage(raw) {
        let data;
        try {
            data = JSON.parse(raw);
        }
        catch {
            this.emit("error", new Error(`Could not parse message: ${raw}`));
            return;
        }
        this.emit("raw", data);
        switch (data.op) {
            case OP_CODES.WELCOME:
                this.heartbeatInterval = data.d.heartbeat;
                this._heartbeat();
                this.heartbeatTimeout = setInterval(() => {
                    if (this.lastACKAt <= Date.now() - (this.heartbeatInterval + 5000)) {
                        this.emit("error", new Error(`Websocket has not received a heartbeat ACK within ${this.heartbeatInterval + 5000}ms.`));
                        this._disconnect();
                        setTimeout(() => this._connect(), 5000);
                    }
                    else {
                        this._heartbeat();
                    }
                }, this.heartbeatInterval);
                break;
            case OP_CODES.RECEIVE_PLAYBACK_INFO:
                if (!internalEvents[data.t])
                    return this.emit("unknown", data);
                if (data.t === "TRACK_UPDATE") {
                    this.tracks.unshift(data.d.song);
                    if (this.tracks.length > this.maxTrackCache)
                        this.tracks.pop();
                    this.emit(internalEvents.TRACK_UPDATE, this.nowPlaying);
                    this.lastTrackStartedAt = Date.now();
                }
                else
                    this.emit(internalEvents[data.t], data.d);
                break;
            case OP_CODES.HEARTBEAT_ACK:
                this.lastACKAt = Date.now();
                this.latency = this.lastACKAt - this.lastHeartbeatSend;
                break;
            default:
                this.emit("unknown", data);
                break;
        }
    }
    _disconnect() {
        if (this.ws) {
            this.ws.close(1000, "Disconnected by user");
            this.ws.removeAllListeners();
        }
        this.ws = null;
        this._reset();
    }
    _reset() {
        if (this.heartbeatTimeout)
            clearInterval(this.heartbeatTimeout);
        this.heartbeatTimeout = null;
        this.heartbeatInterval = 0;
        this.lastACKAt = 0;
        this.lastHeartbeatSend = 0;
    }
    _connect() {
        if (this.ws)
            this._disconnect();
        this.ws = new ws_1.default(this.wsURL);
        this.wsStatus = "connecting";
        this.ws.once("open", () => this.wsStatus = "ready");
        this.ws.on("message", (data) => this._onWSMessage(data));
        this.ws.on("close", (code, reason) => this._onWSClose(code, reason));
        this.ws.on("error", (error) => this.emit("error", error));
    }
    _onWSClose(code, reason) {
        this.wsStatus = "disconnected";
        let shouldReconnect = false;
        if ((code === 1000 && reason !== "Disconnected by user") || code !== 1000)
            shouldReconnect = true;
        if (shouldReconnect)
            this._connect();
        else
            this._disconnect();
        this.emit("disconnected", shouldReconnect);
    }
    _send(data) {
        var _a;
        return (_a = this.ws) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify(data), (err) => {
            if (err)
                this.emit("error", err);
        });
    }
}
module.exports = ListenSomeMoe;
