export interface SpotifyUserProfileJSONResponse {
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
