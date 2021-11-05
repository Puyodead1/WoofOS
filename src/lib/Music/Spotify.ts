import type { Client } from 'discord.js';
import { SPOTIFY_CACHE_EXPIRE_TIME } from '../../config';

export class SpotifyUtils {
	constructor(private readonly _client: Client) {}

	public async getTrack(id: string, force: boolean = false): Promise<SpotifyApi.SingleTrackResponse> {
		return new Promise(async (resolve, reject) => {
			if (!force) {
				const track = await this._client.redis.get(`spotify:track:${id}`);
				if (track) return resolve(track as unknown as SpotifyApi.SingleTrackResponse);
			}
			this._client.spotifyAPI
				.getTrack(id)
				.then(({ body: track }) => {
					this._client.redis
						// expire in 24 hours
						.set(`spotify:track:${track.id}`, JSON.stringify(track), 'EX', SPOTIFY_CACHE_EXPIRE_TIME)
						.then(() => resolve(track))
						.catch((e) => {
							console.error(`[Redis] Error storing Spotify track in cache!`, e);
							resolve(track);
						});
				})
				.catch(reject);
		});
	}

	public async getPlaylist(id: string, force: boolean = false): Promise<SpotifyApi.SinglePlaylistResponse> {
		return new Promise(async (resolve, reject) => {
			if (!force) {
				const playlist = await this._client.redis.get(`spotify:playlist:${id}`);
				if (playlist) return resolve(playlist as unknown as SpotifyApi.SinglePlaylistResponse);
			}
			this._client.spotifyAPI
				.getPlaylist(id)
				.then(({ body: playlist }) => {
					this._client.redis
						// expire in 24 hours
						.set(`spotify:playlist:${playlist.id}`, JSON.stringify(playlist), 'EX', SPOTIFY_CACHE_EXPIRE_TIME)
						.then(() => resolve(playlist))
						.catch((e) => {
							console.error(`[Redis] Error storing Spotify playlist in cache!`, e);
							resolve(playlist);
						});
				})
				.catch(reject);
		});
	}
}
