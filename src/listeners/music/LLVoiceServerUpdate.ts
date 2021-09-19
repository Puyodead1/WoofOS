import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { VoiceServerUpdate } from '@skyra/audio';
import { GatewayDispatchEvents } from 'discord-api-types/v9';

@ApplyOptions<ListenerOptions>({ event: GatewayDispatchEvents.VoiceServerUpdate, emitter: 'ws' })
export class UserAudioListener extends Listener {
	public async run(payload: VoiceServerUpdate) {
		try {
			await this.container.client.music.voiceServerUpdate(payload);
		} catch (e) {
			this.container.logger.error(e);
		}
	}
}
