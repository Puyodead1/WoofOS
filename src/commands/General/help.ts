import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import { WoofCommand } from '../../lib/Structures/WoofCommand';
import { reply } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';
import { BRANDING_SERVER, BRANDING_WEBSITE } from '../../config';
import { WoofEmbed } from '../../utils';

@ApplyOptions<CommandOptions>({
	requiredClientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
	description: 'A help command',
	aliases: ['info', 'about']
})
export class UserCommand extends WoofCommand {
	public async run(message: Message) {
		const embed = WoofEmbed(message, 'Woof  ━  The Discord Dream')
			.setFooter('Made possible by the team at Chat & Share 💛')
			.addField('> Perfected Music System', '_ _　− Crystal clear \n_ _　− Spotify support', true)
			.addField('> Server Customizability', '_ _　− Levels system \n_ _　− Moderation & auto-mod', true)
			.addField(
				'_ _　',
				`For a list of all my commands, run \`${message.client.options.defaultPrefix}commands\`\n \nVisit [my website](${BRANDING_WEBSITE}) for more information!\nJoin my [Discord server](https://${BRANDING_SERVER}) for community events, a great hangout, and bot support! \n \n:gem:　Premium unlocks great things! [Learn more](${BRANDING_WEBSITE})`
			);
		return reply(message, { embeds: [embed] });
	}
}
