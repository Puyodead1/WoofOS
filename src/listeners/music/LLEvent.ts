import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { IncomingEventPayload } from '@skyra/audio';

@ApplyOptions<ListenerOptions>({ emitter: 'music', event: 'event' })
export class UserAudioListener extends Listener {
	public run(payload: IncomingEventPayload) {
		this.container.client.emit(payload.type, payload);
	}
}
