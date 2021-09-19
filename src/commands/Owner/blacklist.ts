import { ApplyOptions } from '@sapphire/decorators';
import type { Args } from '@sapphire/framework';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import { reply } from '@skyra/editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<SubCommandPluginCommandOptions>({
	description: 'Blacklists or un-blacklists users and guilds from the bot.',
	aliases: ['bban'],
	preconditions: ['BotOwner'],
	requiredClientPermissions: ['SEND_MESSAGES'],
	subCommands: ['user', 'guild']
})
export class UserCommand extends SubCommandPluginCommand {
	public async user(message: Message, args: Args) {
		const user = await args.pick('user');
		return reply(message, `501 - blacklist user ${user.username}`);
	}
	public async guild(message: Message, args: Args) {
		// TODO: create guild argument
		const guildId = await args.pick('string');
		return reply(message, `501 blacklist guild ${guildId}`);
	}
}
