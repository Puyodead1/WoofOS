import { ApplyOptions } from '@sapphire/decorators';
import { CommandOptions, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { Permissions } from 'discord.js';
import { RequireUserInVoiceChannel } from '../../lib/Music/Decorators';
import type { Queue } from '../../lib/Music/Queue';
import { WoofCommand } from '../../lib/Structures/WoofCommand';
import { getAudio } from '../../utils';
import type { VoiceBasedChannelTypes } from '@sapphire/discord.js-utilities';
import type { GuildMessage } from '../../lib/types/Discord';
import { reply } from '@sapphire/plugin-editable-commands';

@ApplyOptions<CommandOptions>({
	description: '',
	requiredClientPermissions: ['SEND_MESSAGES'],
	aliases: ['join', 'connect'],
	runIn: [CommandOptionsRunTypeEnum.GuildText]
})
export class UserCommand extends WoofCommand {
	@RequireUserInVoiceChannel()
	public async messageRun(message: GuildMessage) {
		// Get the voice channel the member is in
		const { channel } = message.member.voice;

		// If the member is not in a voice channel then throw
		if (!channel) this.error('commands/music:joinNoVoicechannel');

		const audio = getAudio(message.guild!);

		// Check if the bot is already playing in this guild
		this.checkBotPlaying(audio, channel);

		// Ensure bot has the correct permissions to play music
		this.resolvePermissions(message, channel);

		audio.setTextChannelId(message.channel.id);

		try {
			await audio.connect(channel.id);
		} catch {
			return reply(message, 'commands/music:joinFailed');
		}

		return reply(message, 'commands/music:joinSuccess');
	}

	private resolvePermissions(message: GuildMessage, voiceChannel: VoiceBasedChannelTypes): void {
		const permissions = voiceChannel.permissionsFor(message.guild.me!)!;

		// Administrators can join voice channels even if they are full
		if (voiceChannel.full && !permissions.has(Permissions.FLAGS.ADMINISTRATOR)) this.error('commands/music:joinVoiceFull');
		if (!permissions.has(Permissions.FLAGS.CONNECT)) this.error('commands/music:joinVoiceNoConnect');
		if (!permissions.has(Permissions.FLAGS.SPEAK)) this.error('commands/music:joinVoiceNoSpeak');
	}

	private checkBotPlaying(audio: Queue, voiceChannel: VoiceBasedChannelTypes): void {
		const selfVoiceChannel = audio.player.playing ? audio.voiceChannelId : null;
		if (selfVoiceChannel === null) return;

		this.error(voiceChannel.id === selfVoiceChannel ? 'commands/music:joinVoiceSame' : 'commands/music:joinVoiceDifferent');
	}
}
