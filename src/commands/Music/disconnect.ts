import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';

@ApplyOptions<CommandOptions>({
	name: 'Disconnect',
	description: 'Leave active voice channel',
	aliases: ['leave'],
	chatInputCommand: {
		register: true,
		guildIds: ['638455519652085780'],
		idHints: ['918603001608949770'],
		behaviorWhenNotIdentical: RegisterBehavior.Overwrite
	}
})
export class UserCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		if (!interaction.guild) return interaction.reply('This command can only be used in a guild.');
		const me = interaction.guild.members.cache.get(this.container.client.id!);

		if (!me) return interaction.reply('Failed to get guild member.');
		const voiceChannel = me.voice.channel;
		if (!voiceChannel) return interaction.reply("I'm not in a voice channel.");
		const connection = getVoiceConnection(interaction.guild.id);
		connection?.disconnect();
		return interaction.reply(`Disconnected from <#${voiceChannel.id}>`);
	}
}
