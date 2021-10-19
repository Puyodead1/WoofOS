import { ApplyOptions } from '@sapphire/decorators';
import type { Args, CommandOptions } from '@sapphire/framework';
import { reply } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';
import { WoofCommand } from '../../lib/Structures/WoofCommand';
import { codeBlock } from '@sapphire/utilities';

@ApplyOptions<CommandOptions>({
	description: 'Disables a piece',
	preconditions: ['BotOwner'],
	requiredClientPermissions: ['SEND_MESSAGES']
})
export class UserCommand extends WoofCommand {
	public async messageRun(message: Message, args: Args) {
		const piece = await args.pick('piece');

		if (piece.store.name === 'event' && piece.name === 'CoreMessage') {
			this.error('commands/system:disableWarn');
		}

		piece.enabled = false;

		const content = codeBlock('diff', 'commands/system:disable');
		return reply(message, content);
	}
}
