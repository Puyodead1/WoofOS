import { ApplyOptions } from '@sapphire/decorators';
import type { Args, CommandOptions } from '@sapphire/framework';
import { reply } from '@skyra/editable-commands';
import { Message, MessageEmbed } from 'discord.js';
import { BRANDING_COLOR } from '../../config';
import { WoofCommand } from '../../lib/Structures/WoofCommand';

@ApplyOptions<CommandOptions>({
	description: 'Quotes a message',
	requiredClientPermissions: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS']
})
export class UserCommand extends WoofCommand {
	public async messageRun(message: Message, args: Args) {
		const msg = await args.pick('message');

		const embed = new MessageEmbed()
			.setColor(BRANDING_COLOR)
			.setAuthor(msg.author.username, msg.author.avatarURL({ dynamic: true, format: 'png', size: 2048 })!)
			.setDescription(msg.cleanContent)
			.setTimestamp(msg.editedTimestamp ?? msg.createdTimestamp)
			.setFooter(`Quoted by ${message.author.username}`, message.author.avatarURL({ dynamic: true, format: 'png', size: 2048 })!)
			.addField('Jump Link', `[Jump to Message](${msg.url})`)
			.setImage(msg.attachments.first()?.proxyURL ?? '');

		return reply(message, {
			embeds: [embed]
		});
	}
}
