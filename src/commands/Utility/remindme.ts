import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { reply } from '@skyra/editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	description: 'Creates a reminder',
	requiredClientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
	aliases: ['remind'],
	detailedDescription: 's = seconds, m = minutes, h = hours, d = days'
})
export class UserCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		const when = await args.pick('string');
		const reminder = await args.pick('string');

		return reply(message, `501 - remind you in ${when} '${reminder}'`);
	}
}
