import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions, version as SAPPHIRE_VERSION } from '@sapphire/framework';
import { reply } from '@sapphire/plugin-editable-commands';
import { Message, version as DJS_VERSION } from 'discord.js';
import { DurationFormatter } from '@sapphire/time-utilities';
import { WoofEmbed } from '../../utils';
import { WoofCommand } from '../../lib/Structures/WoofCommand';

@ApplyOptions<CommandOptions>({
	requiredClientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
	description: 'Provides some details about the bot and stats.'
})
export class UserCommand extends WoofCommand {
	public async messageRun(message: Message) {
		let [users, guilds, memory] = [0, 0, 0, 0];

		if (message.client.shard) {
			const results = await message.client.shard.broadcastEval((client) => {
				return [client.users.cache.size, client.guilds.cache.size, process.memoryUsage().heapUsed / 1024 / 1024];
			});
			for (const result of results) {
				users += result[0];
				guilds += result[1];
				memory += result[2];
			}
		}

		const embed = WoofEmbed(message, 'Woof  ━  Statistics')
			.setDescription('Woof, the Discord dream. Music, levels, role menu, and more')
			.addField('Mem. Usage', (memory || process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + ' MB', true)
			.addField('Uptime', new DurationFormatter().format(process.uptime() * 1000), true)
			.addField(
				'Version Information',
				`Node: \`\`${process.version}\`\`\nDiscord.JS: \`\`v${DJS_VERSION}\`\`\nSapphire: \`\`v${SAPPHIRE_VERSION}\`\``,
				true
			)
			.addField('Servers', (guilds || message.client.guilds.cache.size).toLocaleString() + ' servers', true)
			.addField('Shards', `${(message.guild ? message.guild.shardId : 0) + 1} / ${message.client.options.shardCount || 1} shards`, true)
			.addField('User', (users || message.client.users.cache.size).toLocaleString() + ' users', true)
			.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ format: 'png', size: 2048, dynamic: true }));

		return reply(message, { embeds: [embed] });
	}
}
