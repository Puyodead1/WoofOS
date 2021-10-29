import { SapphireClient, container } from '@sapphire/framework';
import type { ClientOptions } from 'discord.js';
import type { PlatformStore } from 'lib/database/settings/structures/PlatformStore';
import type { TaskStore } from 'lib/database/settings/structures/TaskStore';
import type { SpotifyTokenJSONResponse } from 'lib/types/Spotify';
import { MUSIC_OPTIONS } from '../../config';
import { SettingsManager } from '../database/settings/SettingsManager';
import type { DbSet } from '../database/utils/DbSet';
import { QueueClient } from '../Music/QueueClient';
import { ScheduleManager } from './ScheduleManager';

export default class WoofClient extends SapphireClient {
	public MUSIC_ENABLED = true;
	public voteMutes = new Set<string>();
	public readonly music: QueueClient;

	constructor(options: ClientOptions) {
		super(options);
		this.music = new QueueClient(MUSIC_OPTIONS, (guildId, packet) => {
			const guild = this.guilds.cache.get(guildId);
			return Promise.resolve(guild?.shard.send(packet));
		});

		container.settings = new SettingsManager(this);
		container.client = this;
		container.SPOTIFY_TOKEN = null;
		container.schedule = new ScheduleManager();
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
		SPOTIFY_TOKEN: SpotifyTokenJSONResponse | null;
	}
}
