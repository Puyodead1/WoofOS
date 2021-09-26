import { ApplyOptions } from '@sapphire/decorators';
import { Args, CommandOptions, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { reply, send } from '@skyra/editable-commands';
import { RequireUserInVoiceChannel } from '../../lib/Music/Decorators';
import type { GuildMessage } from '../../lib/types/Discord';
import { WoofCommand } from '../../lib/Structures/WoofCommand';
import { createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior } from '@discordjs/voice';
import fetch from 'node-fetch';

@ApplyOptions<CommandOptions>({
	description: '',
	quotes: [],
	requiredClientPermissions: ['SEND_MESSAGES'],
	aliases: ['pf'],
	runIn: [CommandOptionsRunTypeEnum.GuildText]
})
export class UserCommand extends WoofCommand {
	@RequireUserInVoiceChannel()
	public async run(message: GuildMessage, args: Args, context: WoofCommand.Context) {
		// no attachment and no links
		if (!message.attachments.size && args.finished) return reply(message, "You didn't tell me what to play! :zzz:");

		// attachment but no link
		if (message.attachments.size && args.finished) {
			if (message.attachments.size > 1)
				await send(message, 'It looks like you uploaded multiple files, unfortunatly this feature will only play the first attachment.');
			const link = message.attachments.first()!.url;
			this.play(message, link);
			return reply(message, 'playing');
		}

		if (!message.attachments.size && !args.finished) {
			const link = await args.rest('string');
			this.play(message, link);
			return reply(message, 'playing');
		}

		return reply(message, 'Im not sure what you wanted me to do.. :thinking:');
	}

	async play(message: GuildMessage, link: string) {
		const connection = joinVoiceChannel({
			channelId: message.member.voice.channelId!,
			guildId: message.guildId!,
			adapterCreator: message.guild!.voiceAdapterCreator
		});

		const player = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Pause
			}
		});

		connection.subscribe(player);

		player.on('error', (e: any) => {
			console.error(`Error: ${e.message} with resource ${e.resource.metadata.title}`);
			player.stop();
			connection.disconnect();
		});

		const res = await fetch(link);
		const resource = createAudioResource(res.body as any);
		player.play(resource);
	}
}
