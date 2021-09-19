import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { VoiceStateUpdate } from '@skyra/audio';
import { GatewayDispatchEvents } from 'discord-api-types/v9';

@ApplyOptions<ListenerOptions>({ event: GatewayDispatchEvents.VoiceStateUpdate, emitter: 'ws' })
export class UserAudioListener extends Listener {
	public async run(payload: VoiceStateUpdate) {
		try {
			await this.container.client.music.voiceStateUpdate(payload);
		} catch (e) {
			this.container.logger.error(e);
		}
	}
}
