import { Command } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { BRANDING_WEBSITE } from '../../config';
import { WoofEmbed } from '../../utils';

export class UserComamnd extends Command {
	public constructor(context: Command.Context) {
		super(context, {
			description: 'Commands',
			chatInputCommand: {
				register: true,
				idHints: ['917480775891427398'],
				guildIds: ['638455519652085780']
			}
		});
	}

	public chatInputRun(interaction: CommandInteraction) {
		return interaction.reply('hi');
	}
}
