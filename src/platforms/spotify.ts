import { fetch } from '@sapphire/fetch';
import { SpotifyAPIRoutes, SpotifyPublicUserObject } from '../lib/types/Spotify';
import { container } from '@sapphire/framework';
import { Platform } from '../lib/database/settings/structures/Platform';

export class UserPlatform extends Platform {
	getUser(id: string): unknown {
		if (!container.SPOTIFY_TOKEN) throw new Error('spotify token is missing');
		container.client.stores.get('platforms').entries;
		return fetch<SpotifyPublicUserObject>(SpotifyAPIRoutes.USER(id), {
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${container.SPOTIFY_TOKEN.access_token}`,
				'Content-Type': 'application/json'
			}
		});
	}
}
