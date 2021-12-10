import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import {
	createAudioResource,
	getVoiceConnection,
	demuxProbe,
	CreateAudioResourceOptions,
	createAudioPlayer,
	NoSubscriberBehavior
} from '@discordjs/voice';
// @ts-expect-error
import deemix from 'deemix';
import { PassThrough } from 'stream';
const {
	types: { Track }
} = deemix;

@ApplyOptions<CommandOptions>({
	name: 'Play',
	description: 'Play something',
	requiredClientPermissions: ['SPEAK']
})
export class UserCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		if (!interaction.guild) return interaction.reply('This command can only be used in a guild.');
		const connection = getVoiceConnection(interaction.guild.id);
		if (!connection) return interaction.reply('I am not currently connected to a voice channel.');

		const query = interaction.options.getString('query');
		if (!query) return interaction.reply('What do you want to play?');
		await interaction.deferReply();

		try {
			await interaction.editReply('Searching for song...');
			const results = await this.container.deezer.api.search_track(query);
			if (!results.data.length) return interaction.reply('No results found.');

			const listener = {
				send(key: string, data?: any) {
					console.debug(key, data);
				}
			};

			await interaction.editReply('Generating Download Object');
			const downloadObj = await deemix.generateDownloadObject(this.container.deezer, results.data[0].link, 'FLAC', {}, listener);
			const track = new Track();
			const {
				single: { trackAPI_gw, trackAPI, albumAPI, playlistAPI }
			} = downloadObj;
			await interaction.editReply('Parsing data...');
			await track.parseData(this.container.deezer, trackAPI_gw.SNG_ID, trackAPI_gw, trackAPI, null, albumAPI, playlistAPI);
			const selectedFormat = await deemix.downloader.getPreferredBitrate(
				this.container.deezer,
				track,
				downloadObj.bitrate,
				deemix.settings.DEFAULTS.fallbackBitrate,
				downloadObj.uuid,
				listener
			);
			track.bitrate = selectedFormat;
			track.album.bitrate = selectedFormat;
			track.downloadURL = track.urls[this.container.deezerFormats[track.bitrate]];

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
			connection.subscribe(player);

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
		} catch (e) {
			console.error(e);
			interaction.editReply('Something went wrong. x.x');
			return;
		}
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
