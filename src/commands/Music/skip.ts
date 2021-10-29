import { ApplyOptions } from '@sapphire/decorators';
import { container } from '@sapphire/pieces';
import { Args, CommandOptions, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { WoofCommand } from '../../lib/Structures/WoofCommand';
import { RequireSameVoiceChannel, RequireSongPresent } from '../../lib/Music/Decorators';
import { canManage, getAudio, getListenerCount } from '../../utils';
import type { GuildMessage } from '../../lib/types/Discord';
import { reply, send } from '@sapphire/plugin-editable-commands';
import type { Queue } from '../../lib/Music/Queue';

const flags = ['force'];

@ApplyOptions<CommandOptions>({
	description: '',
	requiredClientPermissions: ['SEND_MESSAGES'],
	aliases: [],
	runIn: [CommandOptionsRunTypeEnum.GuildText],
	flags,
	enabled: container.client.MUSIC_ENABLED
})
export class UserCommand extends WoofCommand {
	@RequireSongPresent()
	@RequireSameVoiceChannel()
	public async messageRun(message: GuildMessage, args: Args) {
		const audio = getAudio(message.guild);
		const { voiceChannel } = audio;

		const listeners = getListenerCount(voiceChannel);
		const arg = args.nextMaybe();
		const shouldForce = arg.exists ? flags.includes(arg.value.toLowerCase()) : args.getFlags(...flags);

		if (listeners >= 4) {
			const response = shouldForce ? await this.canSkipWithForce(message) : await this.canSkipWithoutForce(message, audio, listeners);

			if (response !== null) return send(message, response);
		}

		const track = await audio.nowPlaying();
		await audio.next({ skipped: true });
		// TODO:
		// this.container.client.emit(Events.MusicSongSkipNotify, message, track);
		return reply(message, `:small_blue_diamond: Skipped song  \`🎵　${track?.entry.info.title}\``);
	}

	private async canSkipWithForce(message: GuildMessage): Promise<string | null> {
		return (await canManage(message.guild, message.member)) ? null : 'commands/music:skipPermissions';
	}

	private async canSkipWithoutForce(message: GuildMessage, audio: Queue, listeners: number): Promise<string | null> {
		const added = await audio.addSkipVote(message.author.id);
		if (!added) return ":octagonal_sign: You've already voted to skip this song.";

		const amount = await audio.countSkipVotes();
		if (amount <= 3) return null;

		const needed = Math.ceil(listeners * 0.4);
		if (needed <= amount) return null;

		return `You have voted to skip the current song, **${needed} more vote${needed === 1 ? '' : ''}`;
	}
}
