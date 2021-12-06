import { Command } from '@sapphire/framework';
import { reply } from '@skyra/editable-commands';
import type { Message } from 'discord.js';

export class UserCommand extends Command {
	public async messageRun(message: Message) {
		return reply(message, '501 - Under construction');
	}
}
