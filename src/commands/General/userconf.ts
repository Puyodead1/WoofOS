import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import { WoofCommand } from '../../lib/Structures/WoofCommand';
import { reply } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	requiredClientPermissions: ['SEND_MESSAGES'],
	description: 'Define per-user settings.'
})
export class UserCommand extends WoofCommand {
	public async run(message: Message) {
		return reply(message, '501 - Under Construction');
	}
}
