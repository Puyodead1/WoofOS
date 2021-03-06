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
	public async messageRun(message: Message) {
		const embed = WoofEmbed(message, 'Woof  β  The Discord Dream')
			.setFooter('Made possible by the team at Chat & Share π')
			.addField('> Perfected Music System', '_ _γβ Crystal clear \n_ _γβ Spotify support', true)
			.addField('> Server Customizability', '_ _γβ Levels system \n_ _γβ Moderation & auto-mod', true)
			.addField(
				'_ _γ',
				`For a list of all my commands, run \`${message.client.options.defaultPrefix}commands\`\n \nVisit [my website](${BRANDING_WEBSITE}) for more information!\nJoin my [Discord server](https://${BRANDING_SERVER}) for community events, a great hangout, and bot support! \n \n:gem:γPremium unlocks great things! [Learn more](${BRANDING_WEBSITE})`
			);
		return reply(message, { embeds: [embed] });
	}
}
