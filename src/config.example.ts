import { LogLevel } from '@sapphire/framework';
import type { Snowflake } from 'discord-api-types';
import type { ClientOptions } from 'discord.js';
import type { EqualizerBand, NodeOptions } from '@skyra/audio';

export interface WoofEqualizerBandsInterface {
	[name: string]: EqualizerBand[];
}

export const WoofEqualizerBands: WoofEqualizerBandsInterface = {
	low: [
		{ band: 0, gain: 0.05 },
		{ band: 1, gain: 0.05 },
		{ band: 2, gain: 0.05 },
		{ band: 3, gain: 0.05 }
	],
	medium: [
		{ band: 1, gain: 0.1 },
		{ band: 1, gain: 0.1 },
		{ band: 2, gain: 0.1 },
		{ band: 3, gain: 0.1 }
	],
	high: [
		{ band: 1, gain: 0.25 },
		{ band: 1, gain: 0.25 },
		{ band: 2, gain: 0.25 },
		{ band: 3, gain: 0.25 }
	],
	default: [
		{ band: 1, gain: -0.25 },
		{ band: 1, gain: -0.25 },
		{ band: 2, gain: -0.25 },
		{ band: 3, gain: -0.25 },
		{ band: 11, gain: 0.25 },
		{ band: 12, gain: 0.25 },
		{ band: 13, gain: 0.25 },
		{ band: 14, gain: 0.25 }
	]
};

// export const DEFAULT_GUILD_CONFIG: WoofGuildConfig = {
// 	prefix: 'woof',
// 	tags: [],
// 	messages: {
// 		leave: "It's sad to see you leave **{name}**, hope to see you again.",
// 		join: 'Welcome **{mention}** to {guild}, we hope you enjoy your stay!'
// 	},
// 	mods: {
// 		users: [],
// 		roles: []
// 	},
// 	modlogs: [],
// 	levels: {
// 		enabled: false,
// 		message: 'GG {mention}, you have ranked up to **level {level}**!',
// 		levelroles: [],
// 		embed: false,
// 		multiplier: 1,
// 		announce: 'current'
// 	},
// 	music: {
// 		enabled: true,
// 		announce: false,
// 		djonly: true,
// 		djroles: [],
// 		djbulkqueue: false,
// 		preventdupe: false,
// 		volume: 100,
// 		maxusersongs: 10,
// 		queuelength: 100,
// 		parties: true
// 	},
// 	automod: {
// 		invites: false,
// 		links: {
// 			enabled: false,
// 			strict: false,
// 			overrides: []
// 		},
// 		emojis: {
// 			enabled: false,
// 			max: 7
// 		},
// 		mentions: {
// 			enabled: false,
// 			max: 7
// 		},
// 		caps: false,
// 		cencorlist: [],
// 		nsfw: false,
// 		overrides: {
// 			roles: [],
// 			channels: []
// 		},
// 		ignoremods: true
// 	},
// 	channels: {
// 		logging: {
// 			modlogs: undefined,
// 			raidalerts: undefined,
// 			memberlogs: undefined,
// 			channelchanges: undefined,
// 			censoredmessages: undefined,
// 			rolechanges: undefined,
// 			userupdates: undefined,
// 			voicechanges: undefined,
// 			misc: undefined,
// 			messagelogs: undefined,
// 			spamlogs: undefined
// 		},
// 		noxp: [],
// 		communitychannels: {
// 			category: undefined
// 		}
// 	},
// 	toggles: {
// 		autoroles: false,
// 		staffbypass: false,
// 		communitychannels: false,
// 		selfroles: false,
// 		afk: true,
// 		reactionroles: false,
// 		logging: {
// 			modlogs: false,
// 			raidalerts: false,
// 			memberlogs: false,
// 			channelchanges: false,
// 			censoredmessages: false,
// 			rolechanges: false,
// 			userupdates: false,
// 			voicechanges: false,
// 			misc: false,
// 			messageedit: false,
// 			messagedelete: false,
// 			messagebulkdelete: false,
// 			spamlogs: false,
// 			ignorebots: false
// 		}
// 	},
// 	users: {
// 		admin: [],
// 		mod: [],
// 		staff: []
// 	},
// 	roles: {
// 		autoroles: [],
// 		selfroles: [],
// 		admin: undefined,
// 		mod: undefined,
// 		staff: undefined,
// 		muted: undefined,
// 		noxp: []
// 	},
// 	rolemenus: [],
// 	autosetupcomplete: false,
// 	mod: {
// 		punishments: {
// 			thresholds: {
// 				mute: -1,
// 				ban: -1,
// 				tempmute: -1,
// 				tempban: -1
// 			},
// 			durations: {
// 				mute: -1,
// 				tempban: -1
// 			}
// 		}
// 	},
// 	communitychannels: []
// };

export const isDEV = process.env.NODE_ENV !== 'production';
export const DEFAULT_PREFIX = isDEV ? 'dd!' : 'd!';
export const TOKEN = isDEV ? 'dev token' : 'production token';
export const OWNERS = ['213247101314924545', '840191074428649472', '328653504694583296'];
export const SYSTEM_SERVER = '881879124841463829';
export const SYSTEM_CHANNEL = '881990028673290270';
export const BRANDING_COLOR = '#F0803D';
export const BRANDING_WEBSITE = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
export const BRANDING_SERVER = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
export const YOUTUBE_API_KEY = 'AIzaSyBrGbYim-1y8KJIc7Au826uiYhcYI4-Buw';
export const MUSIXMATCH_API_KEY = 'a5be7585171e72879e51a9848d121854';
export const CLIENT_ID = isDEV ? '888955146019672114' : '882507946595061821';
export const CLIENT_SECRET = isDEV ? 'dev client secret' : 'production client secret';
export const FORUMS_URL = 'https://spipo.redaam.net/forums/';
export const FORUMS_API_KEY = 'wP3kc7SwJ5FIOdEFkVWvnehYbmEMcaoU';
export const BASE_URL = isDEV ? 'localhost' : 'ip of the production host';

export const MONGODB_OPTIONS = {
	connectionURI: isDEV ? 'mongo connection url for dev' : 'mongodb connection url for production',
	db: isDEV ? 'woofdev' : 'woof'
};

export const AUDIO_HOST = 'lavalink host';
export const AUDIO_PORT = 2333;

export const MUSIC_OPTIONS: NodeOptions = {
	userID: CLIENT_ID,
	password: 'lavalink password',
	hosts: {
		rest: `http://${AUDIO_HOST}:${AUDIO_PORT}`,
		ws: {
			url: `ws://${AUDIO_HOST}:${AUDIO_PORT}`,
			options: {
				resumeKey: isDEV ? 'woofdevresumekey' : 'woofresumekey',
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
	// mention prefix
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
