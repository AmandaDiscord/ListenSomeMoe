import WS from "ws";
import { EventEmitter } from "events";

import Constants from "./Constants";

const { OP_CODES, internalEvents } = Constants;

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

class ListenSomeMoe extends EventEmitter {
	public wsURL: string;
	public heartbeatInterval = 0;
	public heartbeatTimeout: NodeJS.Timeout | null = null;
	public lastACKAt = 0;
	public lastHeartbeatSend = 0;
	public latency = 0;
	public ws: WS | null = null;
	public wsStatus: "ready" | "disconnected" | "connecting" = "disconnected";
	public tracks: Array<import("./Types").Track> = [];
	public maxTrackCache : number;
	public lastTrackStartedAt = 0;

	public constructor(wsURL: string, maxTrackCache = 5) {
		super()
		this.wsURL = wsURL
		this.maxTrackCache = maxTrackCache;

		this._connect();
	}

	public static get Constants() {
		return Constants;
	}

	public get Constants() {
		return Constants;
	}

	public get lastTrackStartedTimestamp() {
		return new Date(this.lastTrackStartedAt);
	}

	public get nowPlaying() {
		return this.tracks[0];
	}

	public on<E extends keyof publicEvents>(event: E, listener: (...args: publicEvents[E]) => any): this {
		// @ts-ignore
		return super.on(event, listener);
	}

	public once<E extends keyof publicEvents>(event: E, listener: (...args: publicEvents[E]) => any): this {
		// @ts-ignore
		return super.once(event, listener);
	}

	public off<E extends keyof publicEvents>(event: E, listener: (...args: publicEvents[E]) => any): this {
		// @ts-ignore
		return super.off(event, listener);
	}

	public emit<E extends keyof publicEvents>(event: E, ...args: publicEvents[E]): boolean {
		return super.emit(event, ...args);
	}

	private _heartbeat() {
		this.lastHeartbeatSend = Date.now();
		return this._send({ op: OP_CODES.HEARTBEAT, d: { message: "owo?" } });
	}

	private _onWSMessage(raw: WS.Data) {
		let data: import("./Types").InboundPacket;
		try {
			data = JSON.parse(raw as string);
		} catch {
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
				} else {
					this._heartbeat();
				}
			}, this.heartbeatInterval);
			break;

		case OP_CODES.RECEIVE_PLAYBACK_INFO:
			if (!internalEvents[data.t]) return this.emit("unknown", data);

			// All of the other events, I haven't seen, personally, so I can't properly process them.
			if (data.t === "TRACK_UPDATE") {
				this.tracks.unshift(data.d.song);
				if (this.tracks.length > this.maxTrackCache) this.tracks.pop();
				this.emit(internalEvents.TRACK_UPDATE, this.nowPlaying);
				this.lastTrackStartedAt = Date.now();
			} else this.emit(internalEvents[data.t], data.d)
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

	private _disconnect() {
		if (this.ws) {
			this.ws.close(1000, "Disconnected by user");
			this.ws.removeAllListeners();
		}
		this.ws = null;
		this._reset();
	}

	private _reset() {
		if (this.heartbeatTimeout) clearInterval(this.heartbeatTimeout);
		this.heartbeatTimeout = null;
		this.heartbeatInterval = 0;
		this.lastACKAt = 0;
		this.lastHeartbeatSend = 0;
	}

	private _connect() {
		if (this.ws) this._disconnect();
		this.ws = new WS(this.wsURL);
		this.wsStatus = "connecting";

		this.ws.once("open", () => this.wsStatus = "ready");
		this.ws.on("message", (data) => this._onWSMessage(data));
		this.ws.on("close", (code, reason) => this._onWSClose(code, reason));
		this.ws.on("error", (error) => this.emit("error", error));
	}

	private _onWSClose(code: number, reason: string) {
		this.wsStatus = "disconnected";
		let shouldReconnect = false;

		if ((code === 1000 && reason !== "Disconnected by user") || code !== 1000) shouldReconnect = true;


		if (shouldReconnect) this._connect();
		else this._disconnect();

		this.emit("disconnected", shouldReconnect);
	}

	private _send(data: import("./Types").Packet) {
		return this.ws?.send(JSON.stringify(data), (err) => {
			if (err) this.emit("error", err);
		});
	}
}

export = ListenSomeMoe;
