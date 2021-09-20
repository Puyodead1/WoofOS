import { fetch, FetchResultTypes } from '@sapphire/fetch';
import { container } from '@sapphire/framework';
import { Cron } from '@sapphire/time-utilities';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '../config';
import { PartialResponseValue, ResponseType } from '../lib/database/entities/ScheduleEntity';
import { Task } from '../lib/database/settings/structures/Task';
import { SpotifyTokenJSONResponse, SpotifyAPIRoutes } from '../lib/types/Spotify';

export class UserTask extends Task {
	public SPOTIFY_BASIC_CREDENTIALS = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

	public async run(): Promise<PartialResponseValue | null> {
		const tokenResponse = await fetch<SpotifyTokenJSONResponse>(
			SpotifyAPIRoutes.TOKEN,
			{
				method: 'POST',
				body: new URLSearchParams({
					grant_type: 'client_credentials'
				}),
				headers: {
					Authorization: `Basic ${this.SPOTIFY_BASIC_CREDENTIALS}`,
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			},
			FetchResultTypes.JSON
		).catch((e) => {
			container.logger.error(e.message);
			return null;
		});

		if (!tokenResponse) {
			return { type: ResponseType.Finished };
		}
		// if (tokenResponse.kind === SpotifyTaggedUnions.SPOTIFY_AUTH_ERROR_OBJECT) {
		// 	container.logger.error(`[Spotify] Auth Error: ${tokenResponse.error}; ${tokenResponse.error_description}`);
		// 	return { type: ResponseType.Finished };
		// } else if (tokenResponse.kind === SpotifyTaggedUnions.SPOTIFY_ERROR_OBJECT) {
		// 	container.logger.error(`[Spotify] Error: ${tokenResponse.error.status}; ${tokenResponse.error.message}`);
		// 	return { type: ResponseType.Finished };
		// }

		container.SPOTIFY_TOKEN = tokenResponse;
		container.logger.info('[Spotify] Successfully fetched token!');

		const seconds = (tokenResponse.expires_in - 60) * 1000; // this is the seconds from now when the token expires (-1 minute)
		const futureDate = new Date(new Date().getTime() + seconds);
		container.logger.info(`[Spotify] Next token refresh at ${futureDate.toLocaleString()}`);

		return { type: ResponseType.Finished };
	}
}
