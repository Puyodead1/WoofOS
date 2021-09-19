import { ApplyOptions } from '@sapphire/decorators';
import type { Args, CommandOptions } from '@sapphire/framework';
import { reply } from '@skyra/editable-commands';
import type { Message } from 'discord.js';
import { WoofCommand } from '../../lib/Structures/WoofCommand';

@ApplyOptions<CommandOptions>({
	description: 'Searches YouTube for a video link',
	requiredClientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
	aliases: ['yt']
})
export class UserCommand extends WoofCommand {
	public async run(message: Message, args: Args) {
		const query = await args.pick('string');
		return reply(message, `501 - search youtube for ${query}`);
	}
}
