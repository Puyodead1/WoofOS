import { ApplyOptions } from '@sapphire/decorators';
import { container } from '@sapphire/pieces';
import { CommandOptions, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { reply } from '@skyra/editable-commands';
import { EMOJIS } from '../../config';
import { WoofCommand } from '../../lib/Structures/WoofCommand';
import type { GuildMessage } from '../../lib/types/Discord';
import { MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed, MessageSelectMenu, SelectMenuInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
	description: '',
	requiredClientPermissions: ['SEND_MESSAGES'],
	runIn: CommandOptionsRunTypeEnum.GuildText,
	aliases: ['ms', 'mys'],
	enabled: container.client.MUSIC_ENABLED
})
export class UserCommand extends WoofCommand {
	public async messageRun(message: GuildMessage) {
		const { users } = this.container.db;

		const user = await users.ensure(message.author.id);
		if (!user.spotify) return reply(message, `${EMOJIS.SPOTIFY} You haven't connected a Spotify account yet!`);

		const msg = await reply(message, `${EMOJIS.SPOTIFY} Loading your playlists...`);

		const playlists = await this.container.stores.get('platforms').get('spotify')!.getUserPlaylists(user.spotify);
		if (!playlists)
			return reply(message, ":octagonal_sign: Uh oh! Either you don't have any playlists or something went wrong while trying to load them!");

		if (!playlists.items.length) return reply(message, ":thinking: Looks like you don't have any playlists.. Maybe they are private?");

		const pages: { playlistId: string; pageNumber: number; embed: MessageEmbed }[] = [];
		for (const playlist of playlists.items) {
			const description = playlist.description
				? playlist.description.length > 4096
					? playlist.description.substring(0, 4093) + '...'
					: playlist.description
				: 'No Description';
			pages.push(
				{
					playlistId: playlist.id,
					pageNumber: pages.length,
					embed: new MessageEmbed()
						.setAuthor(
							`Your Spotify Playlists`,
							this.container.client.user!.displayAvatarURL({ dynamic: true, format: 'png', size: 2048 })
						)
						.setTimestamp()
						.setTitle(playlist.name.length ? playlist.name : 'No Title')
						.setDescription(description)
						.setThumbnail(playlist.images.length ? playlist.images[0].url : '')
						.setURL(playlist.href)
						.addField('Owner', playlist.owner.display_name, true)
						.addField('Tracks', playlist.tracks.total.toString(), true)
						.addField('Public', playlist.public ? 'Yes' : 'No' ?? 'Unknown', true)
						.addField('Collaborative', playlist.collaborative ? 'Yes' : 'No' ?? 'Unknown', true)
				}
				// TODO: get tracks and show the playlists total duration
			);
		}

		const buildSelectMenuOptions = (page?: number) => {
			return playlists.items
				.filter((x) => pages.some((y) => y.playlistId === x.id))
				.map((x) => {
					const thePage = pages.find((y) => y.playlistId == x.id);
					return {
						label: x.name.length ? x.name : 'No Title',
						value: thePage!.pageNumber.toString(),
						default: page && page === thePage!.pageNumber ? true : false
					};
				});
		};

		const prevButton = new MessageButton().setCustomId('prevBtn').setLabel('Previous').setStyle('PRIMARY').setEmoji('⬅️');
		const nextButton = new MessageButton().setCustomId('nextBtn').setLabel('Next').setStyle('PRIMARY').setEmoji('➡️');
		const queueButton = new MessageButton().setCustomId('queueBtn').setLabel('Queue').setStyle('SECONDARY').setEmoji('▶️');
		const selectMenu = new MessageSelectMenu()
			.setCustomId('playlistSelect')
			.setPlaceholder('Quick Select Playlist')
			.addOptions(buildSelectMenuOptions());

		let page = 0;

		const row = new MessageActionRow().addComponents(selectMenu);
		const row2 = new MessageActionRow().addComponents(prevButton, nextButton, queueButton);
		const curPage = await msg.edit({
			content: null,
			embeds: [pages[page].embed.setFooter(`Page ${page + 1} / ${pages.length}`)],
			components: [row, row2]
		});

		const filter = (i: MessageComponentInteraction) =>
			row.components.some((x) => x.customId === i.customId || row2.components.some((x) => x.customId === i.customId));

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
				case selectMenu.customId:
					page = parseInt((i as SelectMenuInteraction).values[0]);
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
				row2.components.forEach((x) => x.setDisabled(true));
				await i.editReply({
					content: `🔎   Loading your playlist \`${playlist.name.length ? playlist.name : playlist.id}\`  −  This may take a minute..`,
					embeds: [],
					components: [row.setComponents((row.components[0] as MessageSelectMenu).setOptions(buildSelectMenuOptions(page))), row2]
				});
				collector.stop('queue');
			} else {
				await i.editReply({
					content: null,
					embeds: [pages[page].embed.setFooter(`Page ${page + 1} / ${pages.length}`)],
					components: [row.setComponents((row.components[0] as MessageSelectMenu).setOptions(buildSelectMenuOptions(page))), row2]
				});
				collector.resetTimer();
			}
		});

		collector.on('end', (_, reason) => {
			if (!curPage.deleted && reason !== 'queue') {
				row.components.forEach((x) => x.setDisabled(true));
				row2.components.forEach((x) => x.setDisabled(true));
				curPage.edit({
					content: null,
					embeds: [pages[page].embed.setFooter(`Page ${page + 1} / ${pages.length}`)],
					components: [row.setComponents((row.components[0] as MessageSelectMenu).setOptions(buildSelectMenuOptions(page))), row2]
				});
			}
		});

		return null;
	}
}
