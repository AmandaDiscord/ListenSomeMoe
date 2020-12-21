export const baseJPOPGatewayURL = "wss://listen.moe/gateway_v2";
export const baseKPOPGatewayURL = "wss://listen.moe/kpop/gateway_v2";

const WELCOME = 0 as const;
const RECEIVE_PLAYBACK_INFO = 1 as const;
const HEARTBEAT = 9 as const;
const HEARTBEAT_ACK = 10 as const;

export const OP_CODES = {
	/**
	 * Receive
	 */
	WELCOME,
	/**
	 * Receive
	 */
	RECEIVE_PLAYBACK_INFO,
	/**
	 * Send
	 */
	HEARTBEAT,
	/**
	 * Receive
	 */
	HEARTBEAT_ACK
};

export const STREAM_URLS = {
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

const TRACK_UPDATE_REQUEST = "trackUpdateRequest" as const;
const TRACK_UPDATE = "trackUpdate" as const;
const QUEUE_UPDATE = "queueUpdate" as const;
const NOTIFICATION = "notification" as const;

export const internalEvents = {
	TRACK_UPDATE_REQUEST,
	TRACK_UPDATE,
	QUEUE_UPDATE,
	NOTIFICATION
};

export default { baseJPOPGatewayURL, baseKPOPGatewayURL, OP_CODES, STREAM_URLS, internalEvents };
