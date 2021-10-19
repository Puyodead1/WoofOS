import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import { WoofCommand } from '../../lib/Structures/WoofCommand';
import { reply } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';
import { BRANDING_WEBSITE } from '../../config';
import { WoofEmbed } from '../../utils';

@ApplyOptions<CommandOptions>({
	requiredClientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
	description: 'Commands',
	aliases: ['cmds']
})
export class UserCommand extends WoofCommand {
	public async messageRun(message: Message) {
		const embed = WoofEmbed(message, 'Woof  ━  My Features')
			.setDescription(`For a full list of all my features & their commands, [**click here**](${BRANDING_WEBSITE})`)
			.setURL(BRANDING_WEBSITE);

		return reply(message, { embeds: [embed] });
	}
}
