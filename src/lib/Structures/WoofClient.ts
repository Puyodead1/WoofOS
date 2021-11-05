import { SapphireClient, container } from '@sapphire/framework';
import type { ClientOptions } from 'discord.js';
import { MUSIC_OPTIONS, REDIS_OPTIONS, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '../../config';
import { SettingsManager } from '../database/settings/SettingsManager';
import type { DbSet } from '../database/utils/DbSet';
import { QueueClient } from '../Music/QueueClient';
import { ScheduleManager } from './ScheduleManager';
import SpotifyWebApi from 'spotify-web-api-node';
import type { PlatformStore } from '../database/settings/structures/PlatformStore';
import type { TaskStore } from '../database/settings/structures/TaskStore';
import Redis from 'ioredis';
import { SpotifyUtils } from '../Music/Spotify';

export default class WoofClient extends SapphireClient {
	public MUSIC_ENABLED = true;
	public voteMutes = new Set<string>();
	public readonly music: QueueClient;
	public readonly redis: Redis.Redis;
	public readonly spotifyUtils: SpotifyUtils;

	constructor(options: ClientOptions) {
		super(options);
		this.music = new QueueClient(MUSIC_OPTIONS, (guildId, packet) => {
			const guild = this.guilds.cache.get(guildId);
			return Promise.resolve(guild?.shard.send(packet));
		});

		this.spotifyAPI = new SpotifyWebApi({
			clientId: SPOTIFY_CLIENT_ID,
			clientSecret: SPOTIFY_CLIENT_SECRET
		});

		this.redis = new Redis(REDIS_OPTIONS);
		this.spotifyUtils = new SpotifyUtils(this);

		container.settings = new SettingsManager(this);
		container.client = this;
		container.schedule = new ScheduleManager();
	}

	setupSpotify(): Promise<number> {
		return new Promise((resolve, reject) => {
			this.spotifyAPI
				.clientCredentialsGrant()
				.then((res) => {
					this.spotifyAPI.setAccessToken(res.body.access_token);
					resolve(res.body.expires_in);
				})
				.catch(reject);
		});
	}
}

declare module 'discord.js' {
	interface Message {
		client: WoofClient;
	}

	interface Client {
		MUSIC_ENABLED: boolean;
		voteMutes: Set<string>;
		music: QueueClient;
		spotifyAPI: SpotifyWebApi;
		setupSpotify(): Promise<number>;
		redis: Redis.Redis;
	}
}

declare module '@sapphire/framework' {
	interface StoreRegistryEntries {
		tasks: TaskStore;
		platforms: PlatformStore;
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		settings: SettingsManager;
		db: DbSet;
		schedule: ScheduleManager;
	}
}
