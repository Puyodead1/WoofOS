import { createFunctionPrecondition } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { getAudio, isDJ } from '../../utils';
import type { GuildMessage } from '../types/Discord';
import { isNullish } from '@sapphire/utilities';

export function RequireMusicPlaying(): MethodDecorator {
	return createFunctionPrecondition(
		(message: GuildMessage) => getAudio(message.guild).playing,
		(message: GuildMessage) => send(message, 'preconditions:musicNotPlaying')
	);
}

export function RequireMusicPaused(): MethodDecorator {
	return createFunctionPrecondition(
		(message: GuildMessage) => getAudio(message.guild).paused,
		(message: GuildMessage) => send(message, 'preconditions:musicPaused')
	);
}

export function RequireSongPresent(): MethodDecorator {
	return createFunctionPrecondition(
		async (message: GuildMessage) => {
			const track = await getAudio(message.guild).getCurrentTrack();
			return !isNullish(track);
		},
		(message: GuildMessage) => send(message, 'preconditions:musicNothingPlaying')
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
		(message: GuildMessage) => send(message, 'preconditions:musicQueueEmpty')
	);
}

export function RequireUserInVoiceChannel(): MethodDecorator {
	return createFunctionPrecondition(
		(message: GuildMessage) => message.member.voice.channel !== null,
		(message: GuildMessage) => send(message, 'preconditions:musicUserVoiceChannel')
	);
}

export function RequireBotInVoiceChannel(): MethodDecorator {
	return createFunctionPrecondition(
		(message: GuildMessage) => getAudio(message.guild).voiceChannelId !== null,
		(message: GuildMessage) => send(message, 'preconditions:musicBotVoiceChannel')
	);
}

export function RequireSameVoiceChannel(): MethodDecorator {
	return createFunctionPrecondition(
		(message: GuildMessage) => message.member.voice.channelId === getAudio(message.guild).voiceChannelId,
		(message: GuildMessage) => send(message, 'preconditions:musicBothVoiceChannel')
	);
}
