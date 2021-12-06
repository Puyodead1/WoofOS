// import { ApplyOptions } from '@sapphire/decorators';
// import type { Args } from '@sapphire/framework';
// import { reply, send } from '@sapphire/plugin-editable-commands';
// import type { SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
// import { toTitleCase } from '@sapphire/utilities';
// import type { Message } from 'discord.js';
// import type { GuildEntity } from '../../lib/database/entities/GuildEntity';
// import { configurableGroups } from '../../lib/database/settings/ConfigurableKey';
// import { isSchemaKey, isSchemaGroup } from '../../lib/database/settings/functions';
// import type { SchemaKey } from '../../lib/database/settings/schema/SchemaKey';
// import type { GuildMessage } from '../../lib/types/Discord';
// import { WoofSubCommandPluginCommand } from '../../lib/Structures/WoofSubCommandPluginCommand';
// import { readSettings, map, filter } from '../../utils';

// @ApplyOptions<SubCommandPluginCommandOptions>({
// 	description: 'Define per-guild settings.',
// 	subCommands: [{ input: 'show', default: true }, 'set', 'reset'],
// 	runIn: ['GUILD_ANY'],
// 	preconditions: ['Admin']
// })
// export class UserCommand extends WoofSubCommandPluginCommand {
// 	public async show(message: GuildMessage, args: Args) {
// 		const key = args.finished ? '' : await args.pick('string');
// 		const schemaValue = configurableGroups.getPathString(key.toLowerCase());
// 		if (schemaValue === null) this.error('commands/admin:confGetNoExt');

// 		const output = await readSettings(message.guild, (settings: GuildEntity) => {
// 			return schemaValue.display(settings);
// 		});

// 		if (isSchemaKey(schemaValue)) {
// 			return send(message, {
// 				content: `commands/admin:confGet ${schemaValue.name}:${output}`,
// 				allowedMentions: { users: [], roles: [] }
// 			});
// 		}

// 		const title = key ? `: ${key.split('.').map(toTitleCase).join('/')}` : '';
// 		return reply(message, {
// 			content: `commands/admin:confServer ${title}:${output}`,
// 			allowedMentions: { users: [], roles: [] }
// 		});
// 	}

// 	public async set(message: Message, args: Args) {
// 		// if (!message.guild) return reply(message, 'no guild');
// 		// const guild = await message.client.settings.guild(message.guild.id);
// 		// const key = await args.pickResult('string');
// 		// const val = await args.repeatResult('string');

// 		// if (key.value && val.value) {
// 		// 	guild.set(key.value, val.value.join(' '));
// 		// 	await guild.save();
// 		// 	return reply(message, `Updated \`\`${key.value}\`\` to \`\`${val.value.join(' ')}\`\``);
// 		// }
// 		// let out;
// 		// out = '```md';
// 		// out += this.format(guild.toObject(), 0);
// 		// out += '```';
// 		// return message.channel.send(out);
// 		return reply(message, '501 - set');
// 	}

// 	public async reset(message: Message, args: Args) {
// 		return reply(message, '501 - reset');
// 	}

// 	private async fetchKey(args: Args) {
// 		const key = await args.pick('string');
// 		const value = configurableGroups.getPathString(key.toLowerCase());
// 		if (value === null) this.error('commands/admin:confGetNoExt');
// 		if (value.dashboardOnly) this.error('commands/admin:confDashboardOnlyKey');
// 		if (isSchemaGroup(value)) {
// 			this.error(
// 				`choose key ${map(
// 					filter(value.childValues(), (value) => !value.dashboardOnly),
// 					(value) => `\`${value.name}\``
// 				)}`
// 			);
// 		}

// 		return [value.name, value as SchemaKey] as const;
// 	}
// }
