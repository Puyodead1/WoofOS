import { ApplyOptions } from '@sapphire/decorators';
import { container } from '@sapphire/pieces';
import { Args, CommandOptions, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { reply } from '@skyra/editable-commands';
import { RequireBotInVoiceChannel, RequireDj } from '../../lib/Music/Decorators';
import type { GuildMessage } from '../../lib/types/Discord';
import { WoofCommand } from '../../lib/Structures/WoofCommand';
import { getAudio } from '../../utils';
import { WoofEqualizerBand } from '../../lib/Enums';

@ApplyOptions<CommandOptions>({
	description: '',
	requiredClientPermissions: ['SEND_MESSAGES'],
	aliases: ['sb', 'bb'],
	runIn: [CommandOptionsRunTypeEnum.GuildText],
	enabled: container.client.MUSIC_ENABLED
})
export class UserCommand extends WoofCommand {
	@RequireBotInVoiceChannel()
	@RequireDj()
	public async messageRun(message: GuildMessage, args: Args) {
		const band = await args.pick('eqPreset').catch(() => null);
		if (!band)
			return reply(message, `:octagonal_sign: Invalid EQ Preset! Valid presets are: ${Object.keys(WoofEqualizerBand).map((x) => `\`${x}\``)}`);
		const audio = getAudio(message.guild);

		await audio.player.setEqualizer(band);

		return reply(message, `:white_check_mark: Bass has been set to \`${band}\``);
	}
}
