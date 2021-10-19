import { ApplyOptions } from '@sapphire/decorators';
import { CommandOptions, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { reply } from '@skyra/editable-commands';
import { BASE_URL, CLIENT_OPTIONS, EMOJIS } from '../../config';
import { WoofCommand } from '../../lib/Structures/WoofCommand';
import type { GuildMessage } from 'lib/types/Discord';

@ApplyOptions<CommandOptions>({
	description: '',
	requiredClientPermissions: ['SEND_MESSAGES'],
	runIn: CommandOptionsRunTypeEnum.GuildText,
	aliases: ['ls']
})
export class UserCommand extends WoofCommand {
	public async messageRun(message: GuildMessage) {
		const { users } = this.container.db;

		const user = await users.ensure(message.author.id);
		if (user.spotify) return reply(message, `${EMOJIS.SPOTIFY} You have already connected a Spotify account!`);

		try {
			const LINK_URL = `http://${BASE_URL}:${CLIENT_OPTIONS.api!.listenOptions!.port}/api/v1/spotify/link`;
			const dmChannel = await message.author.createDM();
			await dmChannel.send(
				`👋 Hey there!\n\nTo link your Spotify account, you will need to authorize me to access your Discord connections. You can do so by visiting the link below.\n\n${LINK_URL}\n\n*This is only to verify you are the owner of the account, only your Spotify ID will be saved. We check your Discord connections to verify you are the eowner of the Spotify account.*`
			);
			return reply(message, "👋 Hey there! Check your DMs for the setup instructions that I've just sent you!");
		} catch (err) {
			return reply(
				message,
				"👋 Hey there! I wasn't able to DM you the instructions to link your account! Please ensure you have your DMs open and re-run this command."
			);
		}
	}
}
