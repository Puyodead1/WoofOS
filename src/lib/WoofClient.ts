// @ts-ignore: 7016
import { Deezer, TrackFormats } from '@puyodead1/deezer-js';
import { SapphireClient } from '@sapphire/framework';
import type { ClientOptions } from 'discord.js';

export const getExplicitLyricsStatus = (x: number): ExplicitContentLyricsStatus => {
	switch (x) {
		case 0:
			return ExplicitContentLyricsStatus.NOT_EXPLICIT;
		case 1:
			return ExplicitContentLyricsStatus.EXPLICIT;
		case 2:
			return ExplicitContentLyricsStatus.UNKNOWN;
		case 3:
			return ExplicitContentLyricsStatus.EDITED;
		case 4:
			return ExplicitContentLyricsStatus.PARTIALLY_EXPLICIT;
		case 5:
			return ExplicitContentLyricsStatus.PARTIALLY_UNKNOWN;
		case 6:
			return ExplicitContentLyricsStatus.NO_ADVICE;
		case 7:
			return ExplicitContentLyricsStatus.PARTIALLY_NO_ADVICE;
		default:
			return ExplicitContentLyricsStatus.UNKNOWN;
	}
};

export enum ExplicitContentLyricsStatus {
	NOT_EXPLICIT = 'NOT_EXPLICIT',
	EXPLICIT = 'EXPLICIT',
	UNKNOWN = 'UNKNOWN',
	EDITED = 'EDITED',
	PARTIALLY_EXPLICIT = 'PARTIALLY_EXPLICIT',
	PARTIALLY_UNKNOWN = 'PARTIALLY_UNKNOWN',
	NO_ADVICE = 'NO_ADVICE',
	PARTIALLY_NO_ADVICE = 'PARTIALLY_NO_ADVICE'
}

export const ExplicitContentLyricsInfo = {
	[ExplicitContentLyricsStatus.NOT_EXPLICIT]: 'Not Explicit',
	[ExplicitContentLyricsStatus.EXPLICIT]: 'Explicit',
	[ExplicitContentLyricsStatus.UNKNOWN]: 'Unknown',
	[ExplicitContentLyricsStatus.EDITED]: 'Edited',
	[ExplicitContentLyricsStatus.PARTIALLY_EXPLICIT]: 'Partially Explicit (Album "Lyrics" Only)',
	[ExplicitContentLyricsStatus.PARTIALLY_UNKNOWN]: 'Partially Unknown (Album "Lyrics" Only)',
	[ExplicitContentLyricsStatus.NO_ADVICE]: 'No Advice',
	[ExplicitContentLyricsStatus.PARTIALLY_NO_ADVICE]: 'Partially No Advice (Album "Lyrics" Only)'
};

export const TrackFormatNames = {
	[TrackFormats.FLAC]: 'FLAC',
	[TrackFormats.LOCAL]: 'MP3_MISC',
	[TrackFormats.MP3_320]: 'MP3_320',
	[TrackFormats.MP3_128]: 'MP3_128',
	[TrackFormats.DEFAULT]: 'MP3_MISC',
	[TrackFormats.MP4_RA3]: 'MP4_RA3',
	[TrackFormats.MP4_RA2]: 'MP4_RA2',
	[TrackFormats.MP4_RA1]: 'MP4_RA1'
};

export default class WoofClient extends SapphireClient {
	public deezer: Deezer;

	constructor(options: ClientOptions) {
		super(options);

		this.deezer = new Deezer();
	}
}

declare module 'discord.js' {
	interface Client {
		readonly deezer: Deezer;
	}
}
