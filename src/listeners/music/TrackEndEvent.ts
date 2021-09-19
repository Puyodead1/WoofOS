import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { IncomingEventTrackEndPayload } from '@skyra/audio';

@ApplyOptions<ListenerOptions>({ event: 'TrackEndEvent' })
export class UserAudioListener extends Listener {
	public async run(payload: IncomingEventTrackEndPayload) {
		const queue = this.container.client.music.queues.get(payload.guildId);

		// If the track wasn't replaced nor stopped, play next track:
		if (payload.reason !== 'REPLACED' && payload.reason !== 'STOPPED') {
			await queue.next();
		}
	}
}
