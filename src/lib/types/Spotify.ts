export interface SpotifyPublicUserObject {
	kind: SpotifyTaggedUnions.SPOTIFY_PUBLIC_UESR_OBJECT;
	display_name: string;
	external_urls: {
		spotify: string;
	};
	followers: {
		herf: string;
		total: number;
	};
	id: string;
	images: {
		height: number;
		url: string;
		width: number;
	}[];
	type: string;
	uri: string;
}

export interface SpotifyPlaylistTracksRefObject {
	href: string;
	total: number;
}

export interface SpotifySimplifiedPlaylistObject {
	kind: SpotifyTaggedUnions.SPOTIFY_SIMPLIFIED_PLAYLIST_OBJECT;
	collaborative: boolean;
	description: string | null;
	external_urls: {
		spotify: string;
	};
	href: string;
	id: string;
	images: {
		height: number;
		url: string;
		width: number;
	}[];
	name: string;
	owner: SpotifyPublicUserObject;
	public: boolean | null;
	snapshot_id: string;
	tracks: SpotifyPlaylistTracksRefObject;
	type: string;
	uri: string;
}

export interface SpotifyAuthErrorObject {
	kind: SpotifyTaggedUnions.SPOTIFY_AUTH_ERROR_OBJECT;
	error: string;
	error_description: string;
}

export interface SpotifyErrorObject {
	kind: SpotifyTaggedUnions.SPOTIFY_ERROR_OBJECT;
	error: {
		status: number;
		message: string;
	};
}

export interface SpotifyUserPlaylistsObject {
	kind: SpotifyTaggedUnions.SPOTIFY_USER_PLAYLISTS_OBJECT;
	href: string;
	items: SpotifySimplifiedPlaylistObject[];
	limit: number;
	next: string;
	offset: number;
	previous: string;
	total: number;
}

export interface SpotifyTokenResponseObject {
	kind: SpotifyTaggedUnions.SPOTIFY_TOKEN_RESPONSE_OBJECT;
	access_token: string;
	token_type: string;
	expires_in: number;
}

export enum SpotifyTaggedUnions {
	SPOTIFY_TOKEN_RESPONSE_OBJECT = 'SpotifyTokenResponseObject',
	SPOTIFY_USER_PLAYLISTS_OBJECT = 'SpotifyUserPlaylistsObject',
	SPOTIFY_ERROR_OBJECT = 'SpotifyErrorObject',
	SPOTIFY_AUTH_ERROR_OBJECT = 'SpotifyAuthErrorObject',
	SPOTIFY_SIMPLIFIED_PLAYLIST_OBJECT = 'SpotifySimplifiedPlaylistObject',
	SPOTIFY_PUBLIC_UESR_OBJECT = 'SpotifyPublicUserObject'
}

export type SpotifyUserPlaylistsJSONResponse = SpotifyUserPlaylistsObject;
export type SpotifyUserProfileJSONResponse = SpotifyPublicUserObject;
export type SpotifyTokenJSONResponse = SpotifyTokenResponseObject;

export const SpotifyAPIRoutes = {
	TOKEN: 'https://accounts.spotify.com/api/token',
	USER: (id: string) => `https://api.spotify.com/v1/users/${id}`,
	USER_PLAYLISTS: (id: string) => `https://api.spotify.com/v1/users/${id}/playlists`
};
