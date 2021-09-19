import type { PieceContext } from '@sapphire/framework';
import { ApiRequest, ApiResponse, methods, Route, RouteOptions } from '@sapphire/plugin-api';
import { CLIENT_ID } from '../config';

export class UserRoute extends Route {
	public constructor(context: PieceContext, options?: RouteOptions) {
		super(context, {
			...options,
			route: 'spotify/link'
		});
	}

	public [methods.GET](request: ApiRequest, response: ApiResponse) {
		const REDIRECT_URL = `http://${request.headers.host}/api/v1/spotify/link/callback`;
		response.writeHead(301, {
			Location: `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&response_type=code&scope=connections%20identify`
		});
		return response.end();
	}
}
