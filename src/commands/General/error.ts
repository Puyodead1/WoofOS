import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';

import type { CommandInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
	requiredClientPermissions: ['SEND_MESSAGES'],
	description: 'Sends a link informing the user to read the error',
	chatInputCommand: {
		register: true,
		guildIds: ['638455519652085780']
		// idHints: ['917486943191838790']
	}
})
export class UserCommand extends Command {
	public async chatInputRun(interaction: CommandInteraction) {
		return interaction.reply('https://just-read.it/');
	}
}
