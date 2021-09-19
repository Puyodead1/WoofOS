import { ApplyOptions } from '@sapphire/decorators';
import { CommandOptions, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { reply } from '@skyra/editable-commands';
import { EMOJIS } from '../../config';
import { WoofCommand } from '../../lib/Structures/WoofCommand';
import type { GuildMessage } from 'lib/types/Discord';

@ApplyOptions<CommandOptions>({
	description: '',
	requiredClientPermissions: ['SEND_MESSAGES'],
	runIn: CommandOptionsRunTypeEnum.GuildText,
	aliases: ['ms']
})
export class UserCommand extends WoofCommand {
	public async run(message: GuildMessage) {
		const { users } = this.container.db;

		const user = await users.ensure(message.author.id);
		if (!user.spotify) return reply(message, `You haven't connected a Spotify account yet! ${EMOJIS.SPOTIFY}`);

		return reply(message, `wazzup ${user.spotify}`);
	}
}
