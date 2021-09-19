import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import { WoofCommand } from '../../lib/Structures/WoofCommand';
import { reply } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';
import { BRANDING_SERVER } from '../../config';
import { WoofEmbed } from '../../utils';

@ApplyOptions<CommandOptions>({
	requiredClientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
	description: 'Displays the invite link of the bot, to invite it to your guild.',
	aliases: ['add']
})
export class UserCommand extends WoofCommand {
	public async run(message: Message) {
		const embed = WoofEmbed(message, 'Invite Woof').setDescription(
			`Want my sweet features on your own server? [**Invite me**](${BRANDING_SERVER})`
		);

		return reply(message, { embeds: [embed] });
	}
}
