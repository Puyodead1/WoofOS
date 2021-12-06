import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { reply } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	description: 'Reboots the bot',
	preconditions: ['BotOwner'],
	requiredClientPermissions: ['SEND_MESSAGES']
})
export class UserCommand extends Command {
	public async messageRun(message: Message, _args: Args) {
		return reply(message, '501 - Under construction');
	}
}
