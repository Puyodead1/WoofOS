import { ApplyOptions } from '@sapphire/decorators';
import { CommandOptions, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { reply, send } from '@skyra/editable-commands';
import { EMOJIS } from '../../config';
import { WoofCommand } from '../../lib/Structures/WoofCommand';
import type { GuildMessage } from '../../lib/types/Discord';
import { MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from 'discord.js';

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

		const pages: MessageEmbed[] = [];
		for (const playlist of playlists.items) {
			const description = playlist.description
				? playlist.description.length > 4096
					? playlist.description.substring(0, 4093) + '...'
					: playlist.description
				: 'No Description';
			pages.push(
				new MessageEmbed()
					.setAuthor(`Your Spotify Playlists`, this.container.client.user!.displayAvatarURL({ dynamic: true, format: 'png', size: 2048 }))
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

		const prevButton = new MessageButton().setCustomId('prevBtn').setLabel('Previous').setStyle('PRIMARY').setEmoji('⬅️');
		const nextButton = new MessageButton().setCustomId('nextBtn').setLabel('Next').setStyle('PRIMARY').setEmoji('➡️');
		const queueButton = new MessageButton().setCustomId('queueBtn').setLabel('Queue').setStyle('SECONDARY').setEmoji('▶️');

		let page = 0;

		const row = new MessageActionRow().addComponents(prevButton, nextButton, queueButton);
		const curPage = await msg.edit({
			content: null,
			embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
			components: [row]
		});

		const filter = (i: MessageComponentInteraction) => row.components.some((x) => x.customId === i.customId);

		const collector = await curPage.createMessageComponentCollector({
			filter,
			time: 120000
		});

		collector.on('collect', async (i) => {
			switch (i.customId) {
				case prevButton.customId:
					page = page > 0 ? --page : pages.length - 1;
					break;
				case nextButton.customId:
					page = page + 1 < pages.length ? ++page : 0;
					break;
				default:
					break;
			}

			// show loading
			await i.deferUpdate();

			if (i.customId === queueButton.customId) {
				//
				const playlist = playlists.items[page];
				row.components.forEach((x) => x.setDisabled(true));
				await i.editReply({
					content: `🔎   Loading your playlist \`${playlist.name.length ? playlist.name : playlist.id}\`  −  This may take a minute..`,
					embeds: [],
					components: [new MessageActionRow().addComponents(row.components)]
				});
				collector.stop('queue');
			} else {
				await i.editReply({
					content: null,
					embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
					components: [row]
				});
				collector.resetTimer();
			}
		});

		collector.on('end', (_, reason) => {
			if (!curPage.deleted && reason !== 'queue') {
				row.components.forEach((x) => x.setDisabled(true));
				curPage.edit({
					content: null,
					embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
					components: [new MessageActionRow().addComponents(row.components)]
				});
			}
		});

		return null;

		// await paginatedComponentMessage(msg, pages, [prevButton, nextButton, queueButton]);
		// return null;
	}
}
