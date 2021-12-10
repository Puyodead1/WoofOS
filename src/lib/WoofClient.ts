import { container, SapphireClient } from '@sapphire/framework';
import type { ClientOptions } from 'discord.js';
// @ts-expect-error
import { Deezer, TrackFormats } from '@puyodead1/deezer-js';

const formatsName = {
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
	constructor(options: ClientOptions) {
		super(options);

		container.deezer = new Deezer();
		container.deezerFormats = formatsName;
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		deezer: Deezer;
		deezerFormats: typeof formatsName;
	}
}
