import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';

import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	requiredClientPermissions: ['SEND_MESSAGES'],
	description: 'ShareX Premium'
})
export class UserCommand extends Command {
	public async messageRun(message: Message) {
		return message.channel.send('https://getsharex.com/premium');
	}
}
