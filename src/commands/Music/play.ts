import {
	createAudioPlayer,
	createAudioResource,
	CreateAudioResourceOptions,
	demuxProbe,
	getVoiceConnection,
	joinVoiceChannel,
	NoSubscriberBehavior,
	VoiceConnection
} from '@discordjs/voice';
// @ts-ignore: 7016
import { TrackFormats } from '@puyodead1/deezer-js';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { DurationFormatter } from '@sapphire/time-utilities';
// @ts-ignore: 7016
import deemix from 'deemix';
import { CommandInteraction, GuildMember, Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from 'discord.js';
import { PassThrough } from 'stream';
import { BRANDING_COLOR } from '../../config';
import type { DeezerTrackSearchResults, DeezerTrackSearchResults_TrackResult } from '../../lib/Deezer.interface';
import { getExplicitLyricsStatus, TrackFormatNames } from '../../lib/WoofClient';
const {
	types: { Track }
} = deemix;

@ApplyOptions<CommandOptions>({
	name: 'Play',
	description: 'Play something',
	requiredClientPermissions: ['SPEAK']
})
export class UserCommand extends Command {
	private connection?: VoiceConnection;

	public override async chatInputRun(interaction: CommandInteraction) {
		if (!interaction.guild || !interaction.member) return interaction.reply('This command can only be used in a guild.');

		this.connection = getVoiceConnection(interaction.guild.id);

		if (!this.connection) {
			const member = interaction.member;
			if (member instanceof GuildMember) {
				if (!member.voice.channel) return interaction.reply('You need to be in a voice channel to use this command.');
				this.connection = await joinVoiceChannel({
					adapterCreator: interaction.guild.voiceAdapterCreator as any,
					channelId: member.voice.channel.id,
					guildId: member.guild.id
				});
			} else return interaction.reply('Please use join first');
		}

		const query = interaction.options.getString('query');
		if (!query) return interaction.reply('What do you want to play?');
		await interaction.deferReply();

		try {
			await interaction.editReply('Searching for song...');
			const results: DeezerTrackSearchResults = await this.container.client.deezer.api.search_track(query);
			if (!results.data.length) return interaction.reply('No results found.');

			const pages: { id: number; pageNumber: number; embed: MessageEmbed; track: DeezerTrackSearchResults_TrackResult }[] = [];

			for (const result of results.data) {
				const baseEmbed = new MessageEmbed()
					.setColor(BRANDING_COLOR)
					.setTimestamp()
					.setAuthor(
						this.container.client.user!.username,
						this.container.client.user!.displayAvatarURL({
							dynamic: true,
							format: 'png',
							size: 2048
						})
					)
					.setTitle('🎵 Search Results')
					.setDescription(`Found ${results.data.length} results.`);

				pages.push({
					id: result.id,
					pageNumber: pages.length,
					embed: baseEmbed
						.setThumbnail(result.album.cover_medium)
						.addField('Title', result.title, true)
						.addField('Artist', result.artist.name, true)
						.addField('Album', result.album.title, true)
						.addField('Duration', `${new DurationFormatter().format(result.duration * 1000)} seconds`, true)
						.addField('Explicit', getExplicitLyricsStatus(result.explicit_content_lyrics), true),
					track: result
				});
			}

			const prevButton = new MessageButton().setCustomId('prevBtn').setLabel('Previous').setStyle('PRIMARY').setEmoji('⬅️');
			const nextButton = new MessageButton().setCustomId('nextBtn').setLabel('Next').setStyle('PRIMARY').setEmoji('➡️');
			const queueButton = new MessageButton().setCustomId('queueBtn').setLabel('Queue').setStyle('SECONDARY').setEmoji('▶️');

			let page = 0;
			const row = new MessageActionRow().addComponents(prevButton, nextButton, queueButton);
			const curPage = await interaction.editReply({
				content: null,
				embeds: [pages[page].embed.setFooter(`Page ${page + 1} / ${pages.length}`)],
				components: [row]
			});

			const filter = (i: MessageComponentInteraction) => row.components.some((x) => x.customId === i.customId);

			const collector = await (curPage as Message).createMessageComponentCollector({
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
					collector.stop('queued');
					await this.play(i, pages[page].track);
				} else {
					await i.editReply({
						content: null,
						embeds: [pages[page].embed.setFooter(`Page ${page + 1} / ${pages.length}`)],
						components: [row]
					});
					collector.resetTimer();
				}
			});

			collector.on('end', async (_, reason) => {
				if (reason !== 'queue') {
					row.components.forEach((x) => x.setDisabled(true));
					await interaction.editReply({
						embeds: [pages[page].embed.setFooter(`Page ${page + 1} / ${pages.length}`)],
						components: [row]
					});
				}
			});
		} catch (e) {
			console.error(e);
			interaction.editReply('Something went wrong. x.x');
			return;
		}
	}

	public async play(interaction: MessageComponentInteraction, result: any) {
		const listener = {
			send(key: string, data?: any) {
				console.debug(key, data);
			}
		};

		await interaction.editReply('Generating Download Object');
		const downloadObj = await deemix.generateDownloadObject(
			this.container.client.deezer,
			result.link,
			TrackFormatNames[TrackFormats.MP3_128],
			{},
			listener
		);
		const track = new Track();
		const {
			single: { trackAPI_gw, trackAPI, albumAPI, playlistAPI }
		} = downloadObj;
		await interaction.editReply('Parsing data...');
		await track.parseData(this.container.client.deezer, trackAPI_gw.SNG_ID, trackAPI_gw, trackAPI, null, albumAPI, playlistAPI);
		const selectedFormat = await deemix.downloader.getPreferredBitrate(
			this.container.client.deezer,
			track,
			downloadObj.bitrate,
			deemix.settings.DEFAULTS.fallbackBitrate,
			downloadObj.uuid,
			listener
		);
		track.bitrate = selectedFormat;
		track.album.bitrate = selectedFormat;
		track.downloadURL = track.urls[TrackFormatNames[track.bitrate]];
		if (!track.downloadURL) {
			await interaction.editReply({
				content: `Failed to obtain stream URL for bitrate: ${TrackFormatNames[track.bitrate]}. Please try again later.`
			});
			return;
		}

		const player = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Pause
			}
		});
		player.on('error', console.error);
		player.on('debug', console.debug);
		player.on('stateChange', (oldState, newState) => {
			console.log(newState);
		});
		this.connection?.subscribe(player);

		const transform = new PassThrough();
		// transform.on('close', () => console.log('close'));
		// transform.on('data', () => console.log('data'));
		// transform.on('end', () => console.log('end'));
		// transform.on('error', console.error);
		// transform.on('pause', () => console.log('pause'));
		// transform.on('readable', () => {
		// 	let chunk;
		// 	console.log('Stream is readable (new data received in buffer)');
		// 	// Use a loop to make sure we read all currently available data
		// 	while (null !== (chunk = transform.read())) {
		// 		console.log(`Read ${chunk.length} bytes of data...`);
		// 	}
		// });

		await interaction.editReply('Decoding and streaming...');
		const audioResource = createAudioResource(transform);
		deemix.decryption.streamTrack(transform, track, 0, downloadObj, listener).then(async () => {
			await interaction.editReply('Decoding finished');
		});
		player.play(audioResource);
	}

	public async probeAndCreateResource(readableStream: any, options?: Omit<CreateAudioResourceOptions<null | undefined>, 'metadata'>) {
		const { stream, type } = await demuxProbe(readableStream);
		return createAudioResource(stream, { ...options, inputType: type });
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			{
				name: this.name,
				description: this.description,
				options: [
					{
						name: 'query',
						description: 'What to play',
						type: 'STRING',
						required: true
					}
				]
			},
			{
				guildIds: ['638455519652085780'],
				idHints: ['918610228872876074'],
				registerCommandIfMissing: true,
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite
			}
		);
	}
}
