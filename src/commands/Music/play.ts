import { ApplyOptions } from '@sapphire/decorators';
import { container } from '@sapphire/pieces';
import { Args, Command, CommandOptions, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { reply } from '@skyra/editable-commands';
import { RequireUserInVoiceChannel } from '../../lib/Music/Decorators';
import type { GuildMessage } from '../../lib/types/Discord';

import { getAudio } from '../../utils';

@ApplyOptions<CommandOptions>({
	description: '',
	quotes: [],
	requiredClientPermissions: ['SEND_MESSAGES'],
	aliases: ['p', 'addsong', 'playsong', 'playtrack'],
	runIn: [CommandOptionsRunTypeEnum.GuildText],
	flags: ['sc', 'soundcloud', 's', 'shuffle'],
	enabled: container.client.MUSIC_ENABLED
})
export class UserCommand extends Command {
	private get add(): Command {
		return this.store.get('add') as Command;
	}

	private get join(): Command {
		return this.store.get('summon') as Command;
	}

	// @RequireUserInVoiceChannel()
	// public async messageRun(message: GuildMessage, args: Args, context: Command.Context) {
	// 	const audio = getAudio(message.guild);

	// 	if (!audio.voiceChannelId) {
	// 		await this.join.messageRun(message, args, context);
	// 	}

	// 	await reply(message, 'Please wait...');

	// 	if (!args.finished) {
	// 		await this.add.messageRun(message, args, context);
	// 		if (audio.playing) return;
	// 	}

	// 	const current = await audio.getCurrentTrack();
	// 	// if (!current && audio.count() === 0) {
	// 	// 	return reply(message, ':zzz: The queue is empty!');
	// 	// }

	// 	if (audio.playing) {
	// 		return reply(message, ':white_check_mark: The queue has been resumed!');
	// 	}

	// 	if (current && audio.paused) {
	// 		await audio.resume();
	// 		const track = await audio.player.node.decode(current.track.track);
	// 		return reply(message, 'commands/music:playQueuePaused');
	// 	} else {
	// 		audio.setTextChannelId(message.channel.id);
	// 		await audio.start();
	// 	}

	// 	return null;
	// }
}
