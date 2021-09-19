import { ApplyOptions } from '@sapphire/decorators';
import type { Args } from '@sapphire/framework';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import { reply } from '@skyra/editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<SubCommandPluginCommandOptions>({
	description: 'Base command for Community Channels',
	requiredClientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
	subCommands: [{ input: 'help', default: true }, 'create', 'assign', { input: 'setname', output: 'setName' }],
	aliases: ['cc']
})
export class UserCommand extends SubCommandPluginCommand {
	public async help(message: Message, _args: Args) {
		return reply(message, '501 - help');
	}

	public async create(message: Message, _args: Args) {
		return reply(message, '501 - create');
	}

	public async assign(message: Message, _args: Args) {
		return reply(message, '501 - assign');
	}

	public async setName(message: Message, _args: Args) {
		return reply(message, '501 - setName');
	}
}
