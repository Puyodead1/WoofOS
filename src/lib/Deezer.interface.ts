export interface DeezerTrackSearchResults {
	data: DeezerTrackSearchResults_TrackResult[];
	total: number;
	next: string;
}
export interface DeezerTrackSearchResults_TrackResult {
	id: number;
	readable: boolean;
	title: string;
	title_short: string;
	title_version: string;
	link: string;
	duration: number;
	rank: number;
	explicit_lyrics: boolean;
	explicit_content_lyrics: number;
	explicit_content_cover: number;
	preview: string;
	md5_image: string;
	artist: DeezerTrackSearchResults_Artist;
	album: DeezerTrackSearchResults_Album;
	type: string;
}
export interface DeezerTrackSearchResults_Artist {
	id: number;
	name: string;
	link: string;
	picture: string;
	picture_small: string;
	picture_medium: string;
	picture_big: string;
	picture_xl: string;
	tracklist: string;
	type: string;
}
export interface DeezerTrackSearchResults_Album {
	id: number;
	title: string;
	cover: string;
	cover_small: string;
	cover_medium: string;
	cover_big: string;
	cover_xl: string;
	md5_image: string;
	tracklist: string;
	type: string;
}
