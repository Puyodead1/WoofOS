import { ApplyOptions } from '@sapphire/decorators';
import type { Args } from '@sapphire/framework';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import { reply } from '@skyra/editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<SubCommandPluginCommandOptions>({
	description: 'Base command for reaction roles',
	requiredClientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
	aliases: ['rr'],
	subCommands: [{ input: 'list', default: true }, 'add', 'remove', 'update']
})
export class UserCommand extends SubCommandPluginCommand {
	public async list(message: Message, _args: Args) {
		return reply(message, '501 - list');
	}

	public async add(message: Message, _args: Args) {
		return reply(message, '501 - add');
	}

	public async remove(message: Message, _args: Args) {
		return reply(message, '501 - remove');
	}

	public async update(message: Message, _args: Args) {
		return reply(message, '501 - update');
	}
}
