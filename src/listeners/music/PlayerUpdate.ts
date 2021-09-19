import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { IncomingPlayerUpdatePayload } from '@skyra/audio';

@ApplyOptions<ListenerOptions>({ event: 'playerUpdate' })
export class UserAudioListener extends Listener {
	public async run(payload: IncomingPlayerUpdatePayload) {
		this.container.logger.debug(`player update`);
		this.container.logger.debug(payload);

		const queue = this.container.client.music.queues.get(payload.guildId);
		if (payload.state.position === 0) {
			queue.store.position = 0;
		} else {
			queue.store.position = payload.state.position;
		}
	}
}
