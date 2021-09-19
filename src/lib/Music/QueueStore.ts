import Collection from '@discordjs/collection';
import { container } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import type { UserResolvable } from 'discord.js';
import { Queue, QueueEntry } from './Queue';
import type { QueueClient } from './QueueClient';

export class QueueStore extends Collection<string, Queue> {
	public songs: QueueEntry[];
	public currentSong: QueueEntry | null = null;
	public nextSong: QueueEntry | null = null;
	public skipVotes: Set<UserResolvable>;
	public playing: boolean = false;
	public isSystemPaused: boolean = false;
	public isLoopEnabled: boolean = false;
	public volume: number = 100;
	public textChannelId: string | null = null;
	public position: number = 0;

	public constructor(public readonly client: QueueClient) {
		super();

		this.songs = [];
		this.skipVotes = new Set();
	}

	public get(key: string): Queue {
		let queue = super.get(key);
		if (!queue) {
			queue = new Queue(this, key);
			this.set(key, queue);
		}

		return queue;
	}

	public async start() {
		for (const guild of container.client.guilds.cache.values()) {
			const { channelId } = guild.me!.voice;
			if (isNullish(channelId)) continue;

			await this.get(guild.id).player.join(channelId, { deaf: true });
		}
	}
}
