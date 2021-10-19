import { Piece, PieceOptions } from '@sapphire/framework';
import type { Awaitable } from 'discord.js';
import type { SpotifyUserPlaylistsJSONResponse, SpotifyUserProfileJSONResponse } from 'lib/types/Spotify';

export abstract class Platform extends Piece {
	public abstract getUser(id: string, options?: Platform.Options): Awaitable<SpotifyUserProfileJSONResponse | null>;

	public abstract getUserPlaylists(id: string, options?: Platform.Options): Awaitable<SpotifyUserPlaylistsJSONResponse | null>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Platform {
	export type Options = PieceOptions;
}
