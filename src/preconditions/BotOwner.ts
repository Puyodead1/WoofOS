import { AsyncPreconditionResult, Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { OWNERS } from '../config';

export class UserPrecondition extends Precondition {
	public async run(message: Message): AsyncPreconditionResult {
		return OWNERS.includes(message.author.id) ? this.ok() : this.error({ context: { silent: true } });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		BotOwner: never;
	}
}
