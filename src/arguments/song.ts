import { Argument, ArgumentContext } from '@sapphire/framework';
import type { Track } from '@skyra/audio';
import { getUserRemainingEntries, handleURL, handleSoundCloud, handleYouTube } from '../lib/Music/MusicUtils';
import type { GuildMessage } from '../lib/types/Discord';

export class UserArgument extends Argument<Track[]> {
	public async run(parameter: string, context: ArgumentContext) {
		const message = context.message as GuildMessage;
		const remaining = await getUserRemainingEntries(message);
		if (remaining === 0) return this.error({ parameter, identifier: 'musicManager:tooManySongs', context });

		const tracks =
			(await handleURL(message, remaining, parameter, context.args)) ??
			(await handleSoundCloud(message, remaining, parameter, context.args)) ??
			(await handleYouTube(message, remaining, parameter));

		if (tracks === null || tracks.length === 0) {
			return this.error({ parameter, identifier: 'musicManager:fetchNoMatches', context });
		}

		return this.ok(tracks);
	}
}
