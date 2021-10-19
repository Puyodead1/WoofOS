import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import { WoofCommand } from '../../lib/Structures/WoofCommand';
import { reply } from '@skyra/editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	description: 'Automatically setup channels such as Mod Logs, Channels, Etc',
	requiredClientPermissions: ['SEND_MESSAGES']
})
export class UserCommand extends WoofCommand {
	public async messageRun(message: Message) {
		return reply(message, '501 - Under construction');
	}
}
