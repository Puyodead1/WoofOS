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
	aliases: ['sb', 'bb'],
	runIn: [CommandOptionsRunTypeEnum.GuildText]
})
export class UserCommand extends WoofCommand {
	@RequireBotInVoiceChannel()
	@RequireDj()
	public async run(message: GuildMessage, args: Args) {
		const band = await args.pick('eqPreset');
		if (!band) return reply(message, 'Invalid EQ Preset');
		const audio = getAudio(message.guild);

		await audio.player.setEqualizer(band);

		return reply(message, 'commands/music:setBass');
	}
}
