import { ApplyOptions } from '@sapphire/decorators';
import type { Args, CommandOptions, PieceContext } from '@sapphire/framework';
import { reply } from '@sapphire/plugin-editable-commands';
import { RateLimitManager } from '@sapphire/ratelimits';
import { DurationFormatter } from '@sapphire/time-utilities';
import { readSettings } from '../../lib/database/settings/functions';
import { GuildSettings } from '../../lib/database/keys';
import type { Message } from 'discord.js';
import { WoofCommand } from '../../lib/Structures/WoofCommand';

@ApplyOptions<CommandOptions>({
	requiredClientPermissions: ['SEND_MESSAGES', 'MANAGE_ROLES'],
	description: 'Creates a vote to mute somebody for 30 minutes.',
	detailedDescription: 'Can only be used once every 24 hours.',
	aliases: ['vm']
})
export class UserCommand extends WoofCommand {
	private manager: RateLimitManager;
	private vmCreators: Set<string>;
	private vmTargets: Set<string>;
	constructor(context: PieceContext, options: WoofCommand.Options) {
		super(context, options);

		this.manager = new RateLimitManager(8.64e7, 1);
		this.vmCreators = new Set();
		this.vmTargets = new Set();
	}

	public async run(message: Message, args: Args) {
		// if (!message.guild) return reply(message, 'No guild');
		// const member = await args.pick('member').catch(() => null);
		// if (!member) return reply(message, 'No member specified');

		// const guild = await message.client.settings.guild(message.guild.id);
		// const mutedRoleId = guild.get('roles.muted');
		const [prefix] = await readSettings(message.guild!, (settings) => [settings[GuildSettings.Prefix]]);
		return reply(message, prefix);
		// if (!mutedRole) return reply(message, 'Muted role not set');

		// if (this.vmTargets.has(member.id)) return reply(message, `Sorry, there is already a votemute for **${member.user.tag}**`);
		// if (this.vmCreators.has(message.author.id)) return reply(message, `Sorry, you already have an on-going vote mute!`);

		// const senderRatelimit = this.manager.acquire(message.author.id);
		// if (senderRatelimit.limited) {
		// 	return reply(message, `You cannot create a vote mute for \`\`${new DurationFormatter().format(senderRatelimit.remainingTime)}\`\`.`);
		// }
		// const srl = senderRatelimit.consume();

		// const targetRatelimit = this.manager.acquire(member.id);
		// if (targetRatelimit.limited) {
		// 	return reply(
		// 		message,
		// 		`**${member.user.tag}** cannot be vote muted for \`\`${new DurationFormatter().format(targetRatelimit.remainingTime)}\`\`.`
		// 	);
		// }
		// const trl = targetRatelimit.consume();

		// message.client.voteMutes.add(member.id);

		// const row = new MessageActionRow()
		// 	.addComponents(new MessageButton().setCustomId('yes').setLabel('Mute Them!').setStyle('PRIMARY').setEmoji('👍'))
		// 	.addComponents(new MessageButton().setCustomId('no').setLabel('Nah').setStyle('PRIMARY').setEmoji('👎'));

		// const msg = await message.channel.send({
		// 	content: `**${message.author.tag}** has started a vote mute against **${member.user.tag}**! It requires **5** votes and will be active for the next **5 minutes**.`,
		// 	components: [row]
		// });

		// const votes = new Collection<string, MessageComponentInteraction>();

		// const collector = msg.createMessageComponentCollector({
		// 	componentType: 'BUTTON',
		// 	time: 300000, // 5 minutes
		// 	filter: (interaction) => interaction.customId === 'no' || interaction.customId === 'yes'
		// });

		// collector.on('collect', async (interaction) => {
		// 	votes.set(interaction.user.id, interaction);

		// 	const yes = votes.filter((interaction) => interaction.customId === 'yes');
		// 	const no = votes.filter((interaction) => interaction.customId === 'no');

		// 	if (yes.size >= 5 || no.size >= 5) {
		// 		collector.stop();
		// 	}

		// 	await interaction.reply({
		// 		content: `Thank you! I have recorded your vote.`,
		// 		ephemeral: true
		// 	});

		// 	await msg.edit({
		// 		content: `**${message.author.tag}** has started a vote mute against **${member.user.tag}**! It requires **5** votes and will be active for the next **5 minutes**.\nThere are currently \`\`${votes.size}\`\` votes.`
		// 	});
		// });

		// collector.on('end', async (collected, _) => {
		// 	message.client.voteMutes.delete(member.id);

		// 	await msg.edit({
		// 		content: '**The vote has ended!**\nLoading results...'
		// 	});

		// 	const yes = votes.filter((interaction) => interaction.customId === 'yes');
		// 	const no = votes.filter((interaction) => interaction.customId === 'no');

		// 	if (yes.size < 5 && no.size < 5) {
		// 		await msg
		// 			.edit({
		// 				content: `**The vote has ended!**\nThere were not enough votes! At least **5** are required but only **${
		// 					yes.size + no.size
		// 				}** were recorded!`,
		// 				components: []
		// 			})
		// 			.catch(console.error);
		// 		return;
		// 	}

		// 	if (yes.size >= 5) {
		// 		await member.roles.add(mutedRoleId, 'vote mute').catch((e) => {
		// 			return reply(msg, e);
		// 		});

		// 		setTimeout(async () => {
		// 			await member.roles
		// 				.remove(mutedRoleId)
		// 				.then(() => console.log(`${member.user.tag} has been unmuted`))
		// 				.catch(console.error);
		// 		}, 1.8e6);

		// 		await msg
		// 			.edit({
		// 				content: `**The vote has ended!**\n**${member.user.tag}** has been muted for 30 minutes!`,
		// 				components: []
		// 			})
		// 			.catch(console.error);
		// 		return;
		// 	} else if (no.size >= 5) {
		// 		await msg
		// 			.edit({
		// 				content: `**The vote has ended!**\n**${member.user.tag}** was not muted!`,
		// 				components: []
		// 			})
		// 			.catch(console.error);
		// 		return;
		// 	} else {
		// 		await msg
		// 			.edit({
		// 				content: "**The vote has ended!**\nWe got to a place we shouldn't have gotten to!",
		// 				components: []
		// 			})
		// 			.catch(console.error);
		// 		console.debug(yes.size, no.size, collected.size, member.id);
		// 		trl.reset();
		// 		srl.reset();
		// 		return;
		// 	}
		// });
	}
}
