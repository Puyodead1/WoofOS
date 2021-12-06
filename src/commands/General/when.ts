import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';

import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	requiredClientPermissions: ['SEND_MESSAGES'],
	description: 'Sends a link to an image asking when did I ask'
})
export class UserCommand extends Command {
	public async messageRun(message: Message) {
		message.channel.send('https://when.lol/');
	}
}
