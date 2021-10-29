import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import { WoofCommand } from '../../lib/Structures/WoofCommand';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	requiredClientPermissions: ['SEND_MESSAGES'],
	description: 'Sends a link to an image asking when did I ask'
})
export class UserCommand extends WoofCommand {
	public async messageRun(message: Message) {
		message.channel.send("https://when.lol/")
	}
}
