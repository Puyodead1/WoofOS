import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';

import { reply } from '@skyra/editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	description: 'Automatically setup channels such as Mod Logs, Channels, Etc',
	requiredClientPermissions: ['SEND_MESSAGES']
})
export class UserCommand extends Command {
	public async messageRun(message: Message) {
		return reply(message, '501 - Under construction');
	}
}
