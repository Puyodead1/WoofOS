import { ApplyOptions } from '@sapphire/decorators';
import { Args, CommandOptions, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { reply } from '@skyra/editable-commands';
import { RequireBotInVoiceChannel, RequireDj } from '../../lib/Music/Decorators';
import type { GuildMessage } from '../../lib/types/Discord';
import { WoofCommand } from '../../lib/Structures/WoofCommand';
import { getAudio } from '../../utils';

@ApplyOptions<CommandOptions>({
	description: '',
	requiredClientPermissions: ['SEND_MESSAGES'],
	runIn: [CommandOptionsRunTypeEnum.GuildText]
})
export class UserCommand extends WoofCommand {
	@RequireBotInVoiceChannel()
	@RequireDj()
	public async messageRun(message: GuildMessage, args: Args) {
		const audio = getAudio(message.guild);
		audio.shuffleTracks();

		const amount = audio.count();
		await reply(message, `🔹 Shuffled **${amount}** songs.`);
	}
}
