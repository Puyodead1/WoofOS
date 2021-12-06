import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { reply } from '@skyra/editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	description: 'Shows all of some ones reminders',
	requiredClientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS']
})
export class UserCommand extends Command {
	public async messageRun(message: Message, _args: Args) {
		return reply(message, '501 - your reminders');
	}
}
