import { ApplyOptions } from '@sapphire/decorators';
import { container } from '@sapphire/pieces';
import { Args, ArgumentError, Command, CommandOptions, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { DurationFormatter } from '@sapphire/time-utilities';
import { reply } from '@skyra/editable-commands';
import { MessageEmbed } from 'discord.js';
import { RequireUserInVoiceChannel } from '../../lib/Music/Decorators';
import type { GuildMessage } from '../../lib/types/Discord';

import { getAudio } from '../../utils';

@ApplyOptions<CommandOptions>({
	description: '',
	requiredClientPermissions: ['SEND_MESSAGES'],
	aliases: [],
	runIn: [CommandOptionsRunTypeEnum.GuildText],
	flags: ['sc', 'soundcloud', 'shuffle', 's'],
	enabled: container.client.MUSIC_ENABLED
})
export class UserCommand extends Command {
	@RequireUserInVoiceChannel()
	public async messageRun(message: GuildMessage, args: Args) {
		try {
			const songs = await args.rest('song');

			const tracks = songs.map((track) => ({ author: message.author.id, track }));
			const audio = await getAudio(message.guild);
			audio.add(...tracks);

			if (args.getFlags('shuffle', 's')) {
				audio.shuffleTracks();
			}

			if (songs.length === 1) {
				const total = audio.store.songs.reduce((a, b) => a + (b.track.info.length || 0), 0);
				let expected = new DurationFormatter().format(total - audio.store.position);

				const embed = new MessageEmbed()
					.setAuthor('Added to queue', message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 2048 }))
					.setDescription(
						`\`${new DurationFormatter().format(tracks[0].track.info.length)}\` [${tracks[0].track.info.title}](${
							tracks[0].track.info.uri
						})`
					)
					.setColor('RANDOM')
					.addField('Uploaded by', tracks[0].track.info.author, true)
					.addField('Estimated wait', expected, true)
					.addField('Queue position', `${audio.count()}`, true)
					.setTimestamp();

				return reply(message, {
					embeds: [embed]
				});
			} else {
				// this is for playlists

				const embed = new MessageEmbed()
					.setAuthor('Added to queue', message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 2048 }))
					.setDescription(`**${songs.length}** songs have been added to the queue!`)
					.setColor('RANDOM')
					.setTimestamp();

				return reply(message, {
					embeds: [embed]
				});
			}
		} catch (e) {
			if (e instanceof ArgumentError) {
				return reply(message, (e as ArgumentError).message);
			}
			return reply(message, `:octagonal_sign: Oops, an error occurred! ${e}`);
		}
	}
}
