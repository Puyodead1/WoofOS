import { ApplyOptions } from '@sapphire/decorators';
import { CommandOptions, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { reply } from '@skyra/editable-commands';
import { RequireBotInVoiceChannel, RequireDj } from '../../lib/Music/Decorators';
import type { GuildMessage } from '../../lib/types/Discord';
import { WoofCommand } from '../../lib/Structures/WoofCommand';
import { getAudio } from '../../utils';

@ApplyOptions<CommandOptions>({
	description: '',
	requiredClientPermissions: ['SEND_MESSAGES'],
	aliases: ['disconnect', 'dc', 'quit', 'stop'],
	runIn: [CommandOptionsRunTypeEnum.GuildText]
})
export class UserCommand extends WoofCommand {
	@RequireBotInVoiceChannel()
	@RequireDj()
	public async run(message: GuildMessage) {
		const audio = getAudio(message.guild);
		const channelId = audio.voiceChannelId;

		await audio.stop();
		await audio.leave();

		return reply(message, 'commands/music:leaveSuccess');
	}
}
