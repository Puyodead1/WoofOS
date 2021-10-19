import { ApplyOptions } from '@sapphire/decorators';
import type { Args, CommandOptions } from '@sapphire/framework';
import { reply } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';
import { WoofCommand } from '../../lib/Structures/WoofCommand';

@ApplyOptions<CommandOptions>({
	description: 'dbtest',
	preconditions: ['BotOwner'],
	requiredClientPermissions: ['SEND_MESSAGES'],
	runIn: ['GUILD_TEXT']
})
export class UserCommand extends WoofCommand {
	public async messageRun(message: Message, _args: Args) {
		// const settings = await message.client.getSettings(message);
		// if (!settings) return reply(message, 'settingsmanager was null');

		// await message.channel.send(settings.settings.prefix);

		// return;
		return reply(message, '501');
	}
}
