import { ApplyOptions } from '@sapphire/decorators';
import { container } from '@sapphire/pieces';
import { Command, CommandOptions, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { reply } from '@skyra/editable-commands';
import { RequireBotInVoiceChannel, RequireDj, RequireSameVoiceChannel, RequireUserInVoiceChannel } from '../../lib/Music/Decorators';
import type { GuildMessage } from '../../lib/types/Discord';

import { getAudio } from '../../utils';

@ApplyOptions<CommandOptions>({
	description: '',
	requiredClientPermissions: ['SEND_MESSAGES'],
	aliases: [],
	runIn: [CommandOptionsRunTypeEnum.GuildText],
	enabled: container.client.MUSIC_ENABLED
})
export class UserCommand extends Command {
	@RequireBotInVoiceChannel()
	@RequireUserInVoiceChannel()
	@RequireSameVoiceChannel()
	@RequireDj()
	public async messageRun(message: GuildMessage) {
		await getAudio(message.guild).pause();

		return reply(message, ':pause_button: The queue has been paused!');
	}
}
