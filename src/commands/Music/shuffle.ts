import { ApplyOptions } from '@sapphire/decorators';
import { container } from '@sapphire/pieces';
import { Args, Command, CommandOptions, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { reply } from '@skyra/editable-commands';
import { RequireBotInVoiceChannel, RequireDj } from '../../lib/Music/Decorators';
import type { GuildMessage } from '../../lib/types/Discord';

import { getAudio } from '../../utils';

@ApplyOptions<CommandOptions>({
	description: '',
	requiredClientPermissions: ['SEND_MESSAGES'],
	runIn: [CommandOptionsRunTypeEnum.GuildText],
	enabled: container.client.MUSIC_ENABLED
})
export class UserCommand extends Command {
	@RequireBotInVoiceChannel()
	@RequireDj()
	public async messageRun(message: GuildMessage, args: Args) {
		const audio = getAudio(message.guild);
		audio.shuffleTracks();

		const amount = audio.count();
		await reply(message, `:small_blue_diamond: Shuffled **${amount}** songs.`);
	}
}
