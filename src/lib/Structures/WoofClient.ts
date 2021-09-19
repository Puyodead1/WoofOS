import { SapphireClient, container } from '@sapphire/framework';
import type { ClientOptions } from 'discord.js';
import { MUSIC_OPTIONS } from '../../config';
import { SettingsManager } from '../database/settings/SettingsManager';
import type { DbSet } from '../database/utils/DbSet';
import { QueueClient } from '../Music/QueueClient';

export default class WoofClient extends SapphireClient {
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
	}
}

declare module 'discord.js' {
	interface Message {
		client: WoofClient;
	}

	interface Client {
		voteMutes: Set<string>;
		music: QueueClient;
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		settings: SettingsManager;
		db: DbSet;
	}
}
