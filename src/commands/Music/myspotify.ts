import { ApplyOptions } from '@sapphire/decorators';
import { CommandOptions, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { reply } from '@skyra/editable-commands';
import { EMOJIS } from '../../config';
import { WoofCommand } from '../../lib/Structures/WoofCommand';
import type { GuildMessage } from '../../lib/types/Discord';
import { MessageButton, MessageEmbed } from 'discord.js';
import { paginatedComponentMessage } from '../../lib/PaginatedComponentMessage';

@ApplyOptions<CommandOptions>({
	description: '',
	requiredClientPermissions: ['SEND_MESSAGES'],
	runIn: CommandOptionsRunTypeEnum.GuildText,
	aliases: ['ms', 'mys']
})
export class UserCommand extends WoofCommand {
	public async run(message: GuildMessage) {
		const { users } = this.container.db;

		const user = await users.ensure(message.author.id);
		if (!user.spotify) return reply(message, `You haven't connected a Spotify account yet! ${EMOJIS.SPOTIFY}`);

		const msg = await reply(message, `${EMOJIS.SPOTIFY} Loading your playlists...`);

		const playlists = await this.container.stores.get('platforms').get('spotify')!.getUserPlaylists(user.spotify);
		if (!playlists) return reply(message, ":zzz: Uh oh! Either you don't have any playlists or something went wrong while trying to load them!");

		if (!playlists.items.length) return reply(message, "Looks like you don't have any playlists.. Maybe they are private?");

		const pages = [];
		for (const playlist of playlists.items) {
			const description = playlist.description
				? playlist.description.length > 4096
					? playlist.description.substring(0, 4093) + '...'
					: playlist.description
				: 'No Description';
			pages.push(
				new MessageEmbed()
					.setAuthor(`Your Spotify account`, this.container.client.user!.displayAvatarURL({ dynamic: true, format: 'png', size: 2048 }))
					.setTimestamp()
					.setTitle(playlist.name.length ? playlist.name : 'No Title')
					.setDescription(description)
					.setThumbnail(playlist.images.length ? playlist.images[0].url : '')
					.setURL(playlist.href)
					.addField('Owner', playlist.owner.display_name, true)
					.addField('Tracks', playlist.tracks.total.toString(), true)
					.addField('Public', playlist.public ? 'Yes' : 'No' ?? 'Unknown', true)
					.addField('Collaborative', playlist.collaborative ? 'Yes' : 'No' ?? 'Unknown', true)
				// TODO: get tracks and show the playlists total duration
			);
		}

		const prevButton = new MessageButton().setCustomId('previousbtn').setLabel('Previous').setStyle('PRIMARY').setEmoji('⬅️');

		const nextButton = new MessageButton().setCustomId('nextbtn').setLabel('Next').setStyle('PRIMARY').setEmoji('➡️');

		await paginatedComponentMessage(msg, pages, [prevButton, nextButton]);
		return null;
	}
}
