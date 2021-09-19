import { ApplyOptions } from '@sapphire/decorators';
import type { Args, CommandOptions } from '@sapphire/framework';
import { reply } from '@skyra/editable-commands';
import type { Message } from 'discord.js';
import { WoofCommand } from '../../lib/Structures/WoofCommand';

@ApplyOptions<CommandOptions>({
	description: 'Shows all of some ones reminders',
	requiredClientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS']
})
export class UserCommand extends WoofCommand {
	public async run(message: Message, _args: Args) {
		return reply(message, '501 - your reminders');
	}
}
