import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import { WoofCommand } from '../../lib/Structures/WoofCommand';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	requiredClientPermissions: ['SEND_MESSAGES'],
	description: 'Sends a link informing the user to read the error'
})
export class UserCommand extends WoofCommand {
	public async messageRun(message: Message) {
		return message.channel.send("https://just-read.it/")
	}
}
