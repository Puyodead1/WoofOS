import type { Client } from 'discord.js';
import { GuildSettingsCollection } from './structures/collections/GuildSettingsCollection';
import { SerializerStore } from './structures/SerializerStore';

export class SettingsManager {
	public readonly client: Client;
	public readonly guilds: GuildSettingsCollection;
	public readonly serializers: SerializerStore;

	constructor(client: Client) {
		this.client = client;
		this.guilds = new GuildSettingsCollection(client);
		this.serializers = new SerializerStore();
	}
	// public readonly tasks = new TaskStore();
}
