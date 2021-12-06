import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';

import { reply } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	requiredClientPermissions: ['SEND_MESSAGES'],
	description: 'Define per-user settings.'
})
export class UserCommand extends Command {
	public async messageRun(message: Message) {
		return reply(message, '501 - Under Construction');
	}
}
