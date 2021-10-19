import { ApplyOptions } from '@sapphire/decorators';
import type { Args, CommandOptions } from '@sapphire/framework';
import { reply } from '@skyra/editable-commands';
import type { Message } from 'discord.js';
import { WoofCommand } from '../../lib/Structures/WoofCommand';
import { WoofEmbed } from '../../utils';

@ApplyOptions<CommandOptions>({
	description: 'Displays a users avatar',
	requiredClientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS']
})
export class UserCommand extends WoofCommand {
	public async messageRun(message: Message, args: Args) {
		const user = await args.pick('user').catch(() => message.author);
		return reply(message, {
			embeds: [WoofEmbed(message, `${user.username}'s Avatar`).setImage(user!.avatarURL({ dynamic: true, format: 'png', size: 2048 })!)]
		});
	}
}
