import { fetch } from '@sapphire/fetch';
import type { PieceContext } from '@sapphire/framework';
import { ApiRequest, ApiResponse, methods, Route, RouteOptions } from '@sapphire/plugin-api';
import {
	RESTPostOAuth2AccessTokenResult,
	OAuth2Routes,
	RESTGetAPIUserResult,
	RESTGetAPICurrentUserConnectionsResult,
	Routes,
	RouteBases
} from 'discord-api-types/v9';
import { CLIENT_ID, CLIENT_SECRET } from '../config';

export class UserRoute extends Route {
	public constructor(context: PieceContext, options?: RouteOptions) {
		super(context, {
			...options,
			route: 'spotify/link/callback'
		});
	}

	public async [methods.GET](request: ApiRequest, response: ApiResponse) {
		const REDIRECT_URL = `http://${request.headers.host}/api/v1/spotify/link/callback`;
		const code = request.query.code;
		if (!code) {
			response.json({ error: true, message: 'Missing Code' });
			return response.end();
		}
		if (typeof code !== 'string') {
			response.json({ error: true, message: 'Code should be of type string' });
			return response.end();
		}
		try {
			// exchange the code for an access token
			const tokenResult = await fetch<RESTPostOAuth2AccessTokenResult>(OAuth2Routes.tokenURL, {
				method: 'POST',
				body: new URLSearchParams({
					client_id: CLIENT_ID,
					client_secret: CLIENT_SECRET,
					grant_type: 'authorization_code',
					code,
					redirect_uri: REDIRECT_URL
				}),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});

			// fetch the users profile
			const user = await fetch<RESTGetAPIUserResult>(RouteBases.api + Routes.user(), {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${tokenResult.access_token}`
				}
			});

			// fetch the users connections
			const connections = await fetch<RESTGetAPICurrentUserConnectionsResult>(RouteBases.api + Routes.userConnections(), {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${tokenResult.access_token}`
				}
			});

			// check if they have a spotify connection
			const spotifyConnection = connections.find((x) => x.type === 'spotify');
			if (!spotifyConnection) {
				response.write(
					"Oops! You don't have a Spotify account linked to your Discord account! You will need to add this connection and retry the linking process."
				);
				return response.end();
			}

			// we can now update the user in the database

			const { users } = this.container.db;
			const { error, message } = await users.lock([user.id], async (id) => {
				const settings = await users.ensure(id);

				const { spotify } = settings;
				if (spotify) {
					if (spotify === spotifyConnection.id) {
						return { error: true, message: 'Uh oh! It seems you have already linked this account!' };
					} else {
						// they have linked an account, but we need to change it
						settings.spotify = spotifyConnection.id;
						await settings.save();
						return {
							error: false,
							message: `Your linked Spotify account has been changed to ${spotifyConnection.id} (Previously ${spotify})!`
						};
					}
				}

				settings.spotify = spotifyConnection.id;
				await settings.save();

				return { error: false, message: `Congradulations! You may now load playlists from your Spotify account, ${spotifyConnection.name}` };
			});

			response.write(message);
			return response.end();
		} catch (e) {
			this.container.logger.error(e);
			response.json({ error: true, message: e });
			return response.end();
		}
	}
}
