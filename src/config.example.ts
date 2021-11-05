import { LogLevel } from '@sapphire/framework';
import type { ClientOptions } from 'discord.js';
import type { EqualizerBand, NodeOptions } from '@skyra/audio';
import type { RedisOptions } from 'ioredis';

export interface WoofEqualizerBand {
	name: string;
	bands: EqualizerBand[];
}

export const WoofEqualizerBands: WoofEqualizerBand[] = [
	{
		name: 'low',
		bands: [
			{ band: 0, gain: 0.05 },
			{ band: 1, gain: 0.05 },
			{ band: 2, gain: 0.05 },
			{ band: 3, gain: 0.05 }
		]
	},
	{
		name: 'medium',
		bands: [
			{ band: 1, gain: 0.1 },
			{ band: 1, gain: 0.1 },
			{ band: 2, gain: 0.1 },
			{ band: 3, gain: 0.1 }
		]
	},
	{
		name: 'high',
		bands: [
			{ band: 1, gain: 0.25 },
			{ band: 1, gain: 0.25 },
			{ band: 2, gain: 0.25 },
			{ band: 3, gain: 0.25 }
		]
	},
	{
		name: 'default',
		bands: [
			{ band: 1, gain: -0.25 },
			{ band: 1, gain: -0.25 },
			{ band: 2, gain: -0.25 },
			{ band: 3, gain: -0.25 },
			{ band: 11, gain: 0.25 },
			{ band: 12, gain: 0.25 },
			{ band: 13, gain: 0.25 },
			{ band: 14, gain: 0.25 }
		]
	}
];

export const isDEV = process.env.NODE_ENV !== 'production';
export const DEFAULT_PREFIX = isDEV ? 'dd!' : 'd!';
export const TOKEN = isDEV ? 'replace me' : 'replace me';
export const OWNERS = ['213247101314924545', '840191074428649472', '328653504694583296'];
export const SYSTEM_SERVER = 'replace me';
export const SYSTEM_CHANNEL = 'replace me';
export const BRANDING_COLOR = '#F0803D';
export const BRANDING_WEBSITE = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
export const BRANDING_SERVER = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
export const MUSIXMATCH_API_KEY = 'replace me';
export const SPOTIFY_CLIENT_ID = 'replace me';
export const SPOTIFY_CLIENT_SECRET = 'replace me';
export const CLIENT_ID = isDEV ? 'dev client id' : 'prod client id';
export const CLIENT_SECRET = isDEV ? 'dev client secret' : 'prod client secret';
export const BASE_URL = isDEV ? 'localhost' : '84.252.121.222';

export const MONGODB_OPTIONS = {
	connectionURI: isDEV ? 'dev mongodb' : 'production mongodb',
	db: isDEV ? 'woofdev' : 'woof'
};

export const AUDIO_HOST = 'replace me';
export const AUDIO_PORT = 2333;

export const MUSIC_OPTIONS: NodeOptions = {
	userID: CLIENT_ID,
	password: 'password',
	hosts: {
		rest: `http://${AUDIO_HOST}:${AUDIO_PORT}`,
		ws: {
			url: `ws://${AUDIO_HOST}:${AUDIO_PORT}`,
			options: {
				resumeKey: isDEV ? 'replace me' : 'replace me',
				resumeTimeout: 60
			}
		}
	}
};

export const INVITE_URL = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&permissions=276391325126&scope=bot`;

// if discord volume is 100, lavalink match is about 10
export const VOLUME_DIVISION = 10;
export const DEFAULT_VOLUME = 100 / VOLUME_DIVISION;
export const VOLUME_MAX = 500 / VOLUME_DIVISION;
export const EMOJIS = {
	SPOTIFY: '<:SpotifyLogo:888948621251321866>'
};

export const CLIENT_OPTIONS: ClientOptions = {
	intents: 4047,
	presence: {
		activities: [
			{
				name: '@Woof help',
				type: 'LISTENING'
			}
		]
	},
	defaultPrefix: DEFAULT_PREFIX,
	caseInsensitiveCommands: true,
	caseInsensitivePrefixes: true,
	logger: {
		level: isDEV ? LogLevel.Debug : LogLevel.Info
	},
	shards: 'auto',
	enableLoaderTraceLoggings: true,
	loadDefaultErrorListeners: true,
	// @woof
	regexPrefix: new RegExp(`^@<${CLIENT_ID}>`),
	api: {
		auth: {
			id: CLIENT_ID,
			secret: CLIENT_SECRET,
			cookie: 'WOOF_AUTH',
			redirect: '',
			scopes: ['identify'],
			transformers: []
		},
		prefix: 'api/v1/',
		origin: '*',
		listenOptions: {
			port: 8088
		}
	}
};

export const REDIS_OPTIONS: RedisOptions = {
	host: 'replace me',
	password: 'woof',
	port: 6379
};
export const SPOTIFY_CACHE_EXPIRE_TIME = 604800;
