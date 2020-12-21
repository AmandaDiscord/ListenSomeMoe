export interface Track {
	id: number;
	title: string;
	sources: Array<Source>;
	artists: Array<Artist>;
	characters: Array<Source>;
	albums: Array<Source>;
	duration: number;
}

export interface Source {
	id: number;
	name: string | null;
	nameRomaji: string | null;
	image: string | null;
}

export interface Artist extends Source {
	characters: Array<{ id: number; }>;
}

export interface Packet {
	op: number;
	d: {
		[key: string]: any
	};
}

export interface InboundPacket extends Packet {
	t: keyof typeof import("./Constants").internalEvents;
}
