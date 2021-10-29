import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import { WoofCommand } from '../../lib/Structures/WoofCommand';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	requiredClientPermissions: ['SEND_MESSAGES'],
	description: 'ShareX Premium'
})
export class UserCommand extends WoofCommand {
	public async messageRun(message: Message) {
		return message.channel.send("https://getsharex.com/premium")
	}
}
