import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { joinVoiceChannel } from '@discordjs/voice';

@ApplyOptions<CommandOptions>({
	name: 'Join',
	description: 'Join a voice channel',
	requiredClientPermissions: ['CONNECT'],
	aliases: ['summon', 'connect']
})
export class UserCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		// TODO: check if bot is already in a channel and ask for confirmation to switch channels
		if (!interaction.guild) return interaction.reply('This command can only be used in a guild.');
		const member = interaction.guild.members.cache.get(interaction.member.user.id);
		let channel = interaction.options.getChannel('channel_to_join', false);
		if (channel && channel.type !== 'GUILD_VOICE') return interaction.reply('The channel you specified is not a voice channel.');

		if (!channel) {
			if (!member) return interaction.reply('Failed to get guild member.');
			channel = member.voice.channel;
			if (!channel) return interaction.reply('You are not in a voice channel.');
		}

		const connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guildId,
			adapterCreator: channel.guild.voiceAdapterCreator
		});
		return interaction.reply(`Joined <#${channel.id}>`);
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			{
				name: this.name,
				description: this.description,
				options: [
					{
						name: 'channel_to_join',
						description: 'The voice channel to join (optional)',
						type: 'CHANNEL'
					}
				]
			},
			{
				guildIds: ['638455519652085780'],
				idHints: ['918590464377114664'],
				registerCommandIfMissing: true,
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite
			}
		);
	}
}
