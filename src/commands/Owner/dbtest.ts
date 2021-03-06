import { ApplyOptions } from '@sapphire/decorators';
import type { Args, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { WoofCommand } from '../../lib/Structures/WoofCommand';

@ApplyOptions<CommandOptions>({
	description: 'dbtest',
	preconditions: ['BotOwner'],
	requiredClientPermissions: ['SEND_MESSAGES'],
	runIn: ['GUILD_TEXT']
})
export class UserCommand extends WoofCommand {
	public async run(_message: Message, _args: Args) {
		// const hasGuild = await message.client.provider.has('guilds', message.guild!.id);
		// const msg = await reply(message, `has: ${hasGuild}`);
		// if (!hasGuild) {
		// 	await message.client.provider.create('guilds', message.guild!.id, DEFAULT_GUILD_CONFIG);
		// 	return await msg.edit('created');
		// }
		// const settings = await message.client.getSettings(message);
		// return msg.edit(settings?.levels.message ?? 'a');
	}
}
