import { ApplyOptions } from '@sapphire/decorators';
import type { Args } from '@sapphire/framework';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import { reply } from '@skyra/editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<SubCommandPluginCommandOptions>({
	description: 'Base command for reaction roles',
	requiredClientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
	detailedDescription: `Possible options: \n
	- {allargs} - Get Everything that a person has written after a tag in a String format.
	- {args} or {arguments} - Whatever the person has written after the tag in an Array format. (i.e. {arg1}, {arg2} for the placement of the argument given by the executor)
	- {choices}, {choose} or {choice} - To choose from different options provided by users. (i.e. {choices:{args1}|{args2}})
	- {argslen} - Return the number of arguments supplied by the executor.
	- {roleadd:RoleName/ID} or {addrole:RoleName/ID} - Give the person executing the command a role if bot has permissions.
	- {roleremove:RoleName/ID} or {removerole:RoleName/ID} - Takes away an existing role from the command executor.
	- {username} or {authorname} - Will return the username of the person executing the command.
	- {usertag} or {authortag} - This will return the Tag of a person (i.e. Woof#1234)
	- {userid} or {authorid} - Get the Author ID of the User (i.e. 395782478192836608)
	- {dmuser} or {userdm} - Direct msg whoever executes the tag.
	- {usermention}, {user} or {author} - Tag the person who executes the tag.
	- {server}, {servername}, {guild} or {guildname} - To get Guild/Server's Name
	- {serverid} or {guildid}\` - Gives you the Guild/Server's ID
	- {servercount}, {membercount} or {guildcount} - Get how many members there are in your guild/server.`,
	subCommands: [{ input: 'list', default: true }, 'add', 'remove', 'update', 'view'],
	aliases: ['t']
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

	public async view(message: Message, _args: Args) {
		return reply(message, '501 - view');
	}
}
