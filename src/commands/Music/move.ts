import { ApplyOptions } from '@sapphire/decorators';
import { container } from '@sapphire/pieces';
import { Args, CommandOptions, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { reply } from '@skyra/editable-commands';
import { RequireBotInVoiceChannel, RequireDj, RequireSameVoiceChannel, RequireUserInVoiceChannel } from '../../lib/Music/Decorators';
import type { GuildMessage } from '../../lib/types/Discord';
import { WoofCommand } from '../../lib/Structures/WoofCommand';
import { getAudio } from '../../utils';

@ApplyOptions<CommandOptions>({
	description: '',
	requiredClientPermissions: ['SEND_MESSAGES'],
	aliases: [],
	runIn: [CommandOptionsRunTypeEnum.GuildText],
	enabled: container.client.MUSIC_ENABLED
})
export class UserCommand extends WoofCommand {
	@RequireBotInVoiceChannel()
	@RequireUserInVoiceChannel()
	@RequireDj()
	public async messageRun(message: GuildMessage) {
		const currentChannel = message.guild.me!.voice.channel;
		const newChannel = message.member.voice.channel;
		const audio = getAudio(message.guild);

		await audio.pause();
		await audio.player.join(newChannel!.id, { deaf: true, mute: false });
		// FIXME: bot won't resume until the user runs resume command, if we put resume here, it still won't work until the user pauses and then resumes

		return reply(message, `:white_check_mark: I have moved from ${currentChannel} to ${message.member.voice.channel}`);
	}
}
