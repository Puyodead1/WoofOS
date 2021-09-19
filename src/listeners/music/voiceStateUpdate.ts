import { Listener } from '@sapphire/framework';
import type { VoiceState } from 'discord.js';
import { CLIENT_ID } from '../../config';
import { getAudio, getListenerCount } from '../../utils';

export class UserAudioListener extends Listener {
	public async run(oldState: VoiceState, newState: VoiceState) {
		const audio = getAudio(newState.guild);

		if (newState.id === CLIENT_ID) {
			if (oldState.channelId === newState.channelId) return;

			if (newState.channel === null) {
				// TODO:
				// this.container.client.emit(Events.MusicVoiceChannelLeave, audio, oldState.channel);
			} else {
				// TODO:
				// this.container.client.emit(Events.MusicVoiceChannelJoin, audio, newState.channel);
			}
		} else if (audio.voiceChannelId) {
			if (audio.playing) {
				if (getListenerCount(audio.voiceChannel) === 0) await audio.pause({ system: true });
			} else if (audio.getSystemPaused()) {
				if (getListenerCount(audio.voiceChannel) !== 0) await audio.resume();
			}
		}
	}
}
