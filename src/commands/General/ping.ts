import { ApplyOptions } from '@sapphire/decorators';
import { CommandOptions, RegisterBehavior } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { WoofCommand } from '../../lib/WoofCommand';

@ApplyOptions<CommandOptions>({
	name: 'Ping',
	description: 'Ping',
	requiredClientPermissions: ['SEND_MESSAGES'],
	chatInputCommand: {
		register: true,
		guildIds: ['638455519652085780'],
		idHints: ['917821506401210458'],
		behaviorWhenNotIdentical: RegisterBehavior.Overwrite
	}
})
export class UserCommand extends WoofCommand {
	public override async chatInputRun(interaction: CommandInteraction) {
		return interaction.reply(`Pong! Heartbeat: \`\`${Math.round(this.container.client.ws.ping)}ms\`\``);
	}
}
