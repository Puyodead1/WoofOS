import { createFunctionPrecondition } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { getAudio, isDJ } from '../../utils';
import type { GuildMessage } from '../types/Discord';
import { isNullish } from '@sapphire/utilities';

export function RequireMusicPlaying(): MethodDecorator {
	return createFunctionPrecondition(
		(message: GuildMessage) => getAudio(message.guild).playing,
		(message: GuildMessage) => send(message, 'The queue is currently paused, play something and try again! :zzz:')
	);
}

export function RequireMusicPaused(): MethodDecorator {
	return createFunctionPrecondition(
		(message: GuildMessage) => getAudio(message.guild).paused,
		(message: GuildMessage) => send(message, 'The queue is currently playing, pause it and try again! :zzz:')
	);
}

export function RequireSongPresent(): MethodDecorator {
	return createFunctionPrecondition(
		async (message: GuildMessage) => {
			const track = await getAudio(message.guild).getCurrentTrack();
			return !isNullish(track);
		},
		(message: GuildMessage) => send(message, 'There is nothing currently playing :thinking:')
	);
}

export function RequireDj(): MethodDecorator {
	return createFunctionPrecondition(
		(message: GuildMessage) => isDJ(message.member),
		(message: GuildMessage) => send(message, 'preconditions:musicDjMember')
	);
}

export function RequireQueueNotEmpty(): MethodDecorator {
	return createFunctionPrecondition(
		(message: GuildMessage) => getAudio(message.guild).canStart(),
		(message: GuildMessage) => send(message, 'The queue is currently empty :zzz:')
	);
}

export function RequireUserInVoiceChannel(): MethodDecorator {
	return createFunctionPrecondition(
		(message: GuildMessage) => message.member.voice.channel !== null,
		(message: GuildMessage) => send(message, 'You must be in a Voice Channel :thinking:')
	);
}

export function RequireBotInVoiceChannel(): MethodDecorator {
	return createFunctionPrecondition(
		(message: GuildMessage) => getAudio(message.guild).voiceChannelId !== null,
		(message: GuildMessage) => send(message, "Oops, I'm not in a Voice Channel :thinking:")
	);
}

export function RequireSameVoiceChannel(): MethodDecorator {
	return createFunctionPrecondition(
		(message: GuildMessage) => message.member.voice.channelId === getAudio(message.guild).voiceChannelId,
		(message: GuildMessage) => send(message, 'Oops, The bot must be in the same Voice Channel')
	);
}
