import { ApplyOptions } from '@sapphire/decorators';
import { container } from '@sapphire/pieces';
import { Args, Command, CommandOptions, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { reply } from '@skyra/editable-commands';
import type { GuildMessage } from '../../lib/types/Discord';

import { MessageEmbed } from 'discord.js';
import { EMOJIS } from '../../config';

@ApplyOptions<CommandOptions>({
	description: '',
	requiredClientPermissions: ['SEND_MESSAGES'],
	runIn: [CommandOptionsRunTypeEnum.GuildText],
	enabled: container.client.MUSIC_ENABLED,
	quotes: []
})
export class UserCommand extends Command {
	public async messageRun(message: GuildMessage, args: Args) {
		const artistName = await args.rest('string').catch(() => null);
		if (!artistName) return reply(message, ':zzz: Please specify an artist.');

		const searchRes = await this.container.client.spotifyAPI.searchArtists(artistName);
		if (!searchRes) return reply(message, 'Search Error!');

		if (!searchRes.body.artists!.items.length) return reply(message, `:zzz: I didn't find any artist named \`${artistName}\`.`);

		const artist = searchRes.body.artists!.items[0];

		const topTracks = await message.client.spotifyAPI.getArtistTopTracks(artist.id, 'US');
		if (!topTracks) return reply(message, ":zzz: I couldn't get the top tracks for this artist.");

		const embed = new MessageEmbed()
			.setAuthor(
				this.container.client.user!.username,
				this.container.client.user!.displayAvatarURL({ dynamic: true, format: 'png', size: 2048 })
			)
			.setTitle(`${EMOJIS.SPOTIFY} Artist | ${artist.name}`)
			.setTimestamp()
			.setURL(artist.external_urls.spotify)
			.setThumbnail(artist.images[0].url)
			.setColor('RANDOM')
			.addField('Genres', artist.genres.join(', '), true)
			.addField('Followers', artist.followers.total.toLocaleString(), true)
			.addField('Popularity', artist.popularity.toLocaleString(), true)
			.addField(
				'Top Tracks',
				topTracks.body.tracks
					.slice(0, 5)
					.map((track) => `[${track.name}](${track.external_urls.spotify})`)
					.join('\n')
			)
			.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 2048 }));

		return reply(message, {
			embeds: [embed]
		});
	}
}
