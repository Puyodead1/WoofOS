import { ApplyOptions } from '@sapphire/decorators';
import { Args, CommandOptions, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { reply } from '@skyra/editable-commands';
import { RequireUserInVoiceChannel } from '../../lib/Music/Decorators';
import type { GuildMessage } from '../../lib/types/Discord';
import { WoofCommand } from '../../lib/Structures/WoofCommand';
import { getAudio } from '../../utils';

@ApplyOptions<CommandOptions>({
	description: '',
	quotes: [],
	requiredClientPermissions: ['SEND_MESSAGES'],
	aliases: ['p', 'addsong', 'playsong', 'playtrack'],
	runIn: [CommandOptionsRunTypeEnum.GuildText],
	flags: ['sc', 'soundcloud', 's', 'shuffle']
})
export class UserCommand extends WoofCommand {
	private get add(): WoofCommand {
		return this.store.get('add') as WoofCommand;
	}

	private get join(): WoofCommand {
		return this.store.get('summon') as WoofCommand;
	}

	@RequireUserInVoiceChannel()
	public async run(message: GuildMessage, args: Args, context: WoofCommand.Context) {
		const audio = getAudio(message.guild);

		if (!audio.voiceChannelId) {
			await this.join.run(message, args, context);
		}

		await reply(message, 'Please wait...');

		if (!args.finished) {
			await this.add.run(message, args, context);
			if (audio.playing) return;
		}

		const current = await audio.getCurrentTrack();
		if (!current && audio.count() === 0) {
			return reply(message, 'The queue is empty!');
		}

		if (audio.playing) {
			return reply(message, 'The queue has been resumed!');
		}

		if (current && audio.paused) {
			await audio.resume();
			const track = await audio.player.node.decode(current.track.track);
			return reply(message, 'commands/music:playQueuePaused');
		} else {
			audio.setTextChannelId(message.channel.id);
			await audio.start();
		}

		return null;

		// const music = message.client.music;
		// const query = await args.rest('string');
		// if (!query) return reply(message, 'What do you want to play? :thinking:');
		// if (!music.players.has(message.guild!.id)) await message.client.stores.get('commands').get('summon')?.run(message, args, context);
		// const settings = music.players.get(message.guild!.id);
		// if (query.match(/^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/)) return reply(message, '501 - youtube playlist'); // YouTube Playlist
		// if (query.match(/^(https:\/\/open.spotify.com\/playlist\/)([a-zA-Z0-9]+)(.*)$/)) return reply(message, '501 - spotify playlist');
		// if (query.match(/^(https:\/\/open.spotify.com\/track\/)([a-zA-Z0-9]+)(.*)$/)) return reply(message, '501 - spotify song');
		// if (query.match(/^(https:\/\/open.spotify.com\/album\/)([a-zA-Z0-9]+)(.*)$/)) return reply(message, '501 - album');
		// const songs = await music.getSongs(`ytsearch: ${query}`);
		// if (!songs.tracks.length) return reply(message, `Oops, There weren't any results :zzz:`);
		// const song = songs.tracks[0];
		// song.requester = message.author;
		// if (!settings!.player!.playing || (settings!.player!.playing && !settings!.songs[0])) {
		// 	// nothing is playing
		// 	settings!.songs.push(song);
		// 	await settings!.play(song);
		// 	await settings!.setBass(Band.DEFAULT);
		// 	return;
		// } else {
		// 	const total = settings!.songs.reduce((a, b) => a + (b.info.length || 0), 0);
		// 	let expected = new DurationFormatter().format(total - settings!.player!.state!.position!);
		// 	const embed = new MessageEmbed()
		// 		.setAuthor('Added to queue', message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 2048 }))
		// 		.setDescription(`\`${new DurationFormatter().format(song.info.length)}\` [${song.info.title}](${song.info.uri})`)
		// 		.setColor('RANDOM')
		// 		.addField('Uploaded by', song.info.author, true)
		// 		.addField('Estimated wait', expected, true)
		// 		.setTimestamp()
		// 		.addField('Queue position', `${settings!.songs.length}`, true);
		// 	settings!.songs.push(song);
		// 	return reply(message, {
		// 		embeds: [embed]
		// 	});
		// }
	}
}
