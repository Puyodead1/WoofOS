import { Args, Argument, ArgumentContext } from '@sapphire/framework';
import type { Track } from '@skyra/audio';
import { getUserRemainingEntries, handleURL, handleSoundCloud, handleYouTube, downloadResults, handleSpotifySong } from '../lib/Music/MusicUtils';
import type { GuildMessage } from '../lib/types/Discord';

export class UserArgument extends Argument<Track[]> {
	public async run(parameter: string, context: ArgumentContext) {
		const message = context.message as GuildMessage;
		const remaining = await getUserRemainingEntries(message);
		if (remaining === 0) return this.error({ parameter, identifier: 'musicManager:tooManySongs', context });

		let tracks: Track[] | null = [];

		if (parameter.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+).*/)) {
			tracks = await handleYouTube(message, remaining, parameter);
		} else if (parameter.match(/youtube\.com\/.*\?.*\blist=([a-zA-Z0-9_-]+).*$/)) {
			// TODO: handle youtube playlist
			return this.error({
				parameter,
				identifier: 'musicManager:featureNotImplemented',
				context,
				message: ':partying_face: Woo! You found a unfinished feature, check back later!'
			});
		} else if (parameter.match(/(open.spotify.com\/playlist\/)([a-zA-Z0-9_-]+).*$/)) {
			// TODO: handle spotify playlist
			return this.error({
				parameter,
				identifier: 'musicManager:featureNotImplemented',
				context,
				message: ':partying_face: Woo! You found a unfinished feature, check back later!'
			});
		} else if (parameter.match(/open.spotify.com\/track\/([a-zA-Z0-9_-]+).*$/)) {
			tracks = await handleSpotifySong(message, remaining, parameter);
		} else if (parameter.match(/(open.spotify.com\/album\/)([a-zA-Z0-9_-]+).*$/)) {
			// TODO: handle spotify albumn
			return this.error({
				parameter,
				identifier: 'musicManager:featureNotImplemented',
				context,
				message: ':partying_face: Woo! You found a unfinished feature, check back later!'
			});
		} else if (parameter.match(/soundcloud\.com(?:\/[a-zA-Z0-9_-]+)+/)) {
			tracks = await downloadResults(message, remaining, parameter);
		} else {
			if (context.args.getFlags('sc', 'soundcloud')) tracks = await handleSoundCloud(message, remaining, parameter);
			else tracks = await handleURL(message, remaining, parameter, context.args);
		}

		// const tracks =
		// 	(await handleURL(message, remaining, parameter, context.args)) ??
		// 	(await handleSoundCloud(message, remaining, parameter, context.args)) ??
		// 	(await handleYouTube(message, remaining, parameter));

		if (tracks === null || tracks.length === 0) {
			return this.error({
				parameter,
				identifier: 'musicManager:fetchNoMatches',
				context,
				message: ':zzz: There were no matches for your search.'
			});
		}

		return this.ok(tracks);
	}
}
