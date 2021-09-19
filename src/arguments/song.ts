import { fetch, FetchResultTypes } from '@sapphire/fetch';
import { Args, Argument, ArgumentContext } from '@sapphire/framework';
import { GuildSettings } from '../lib/database/keys';
import type { GuildMessage } from '../lib/types/Discord';
import { getAudio, readSettings, isDJ, count, take, filter } from '../utils';
import { LoadType, Track } from '@skyra/audio';
import { reply } from '@sapphire/plugin-editable-commands';
import { deserialize } from 'binarytf';
import { parseURL } from '@sapphire/utilities';

export class UserArgument extends Argument<Track[]> {
	public async run(parameter: string, context: ArgumentContext) {
		const message = context.message as GuildMessage;
		const remaining = await this.getUserRemainingEntries(message);
		if (remaining === 0) return this.error({ parameter, identifier: 'musicManager:tooManySongs', context });

		const tracks =
			(await this.handleURL(message, remaining, parameter, context.args)) ??
			(await this.handleSoundCloud(message, remaining, parameter, context.args)) ??
			(await this.handleYouTube(message, remaining, parameter));

		if (tracks === null || tracks.length === 0) {
			return this.error({ parameter, identifier: 'musicManager:fetchNoMatches', context });
		}

		return this.ok(tracks);
	}

	/**
	 * Retrieves how many new tracks the user can queue.
	 * @param message The message that ran the argument.
	 */
	private async getUserRemainingEntries(message: GuildMessage): Promise<number> {
		const tracks = await getAudio(message.guild).tracks();
		const { id } = message.author;
		const entries = count(tracks.values(), (track) => track.author === id);
		const maximum = await readSettings(message.guild, GuildSettings.Music.MaxSongsPerUser);
		return Math.max(0, maximum - entries);
	}

	/**
	 * Parses and decodes the response from a buffer.
	 * @param message The message that ran the argument.
	 * @param binary The binary data to parse.
	 */
	private async parseAttachment(message: GuildMessage, binary: Uint8Array): Promise<Track[]> {
		try {
			const tracks = deserialize<string[]>(binary);
			return await getAudio(message.guild).player.node.decode(tracks);
		} catch {
			throw await reply(message, 'musicManager:importQueueError');
		}
	}

	/**
	 * Downloads an attachment by its URL.
	 * @param message The message that ran the argument.
	 * @param url The URL of the file to download.
	 */
	private async downloadAttachment(message: GuildMessage, url: string): Promise<Uint8Array> {
		try {
			return await fetch(url, FetchResultTypes.Buffer);
		} catch {
			throw await reply(message, 'musicManager:importQueueNotFound');
		}
	}

	/**
	 * Parses a possible URL argument.
	 * @param message The message that ran the argument.
	 * @param remaining The amount of entries the user can add.
	 * @param argument The argument to parse.
	 * @returns
	 * - `null` when the argument is not a valid URL.
	 * - `Track[]` otherwise.
	 */
	private async handleURL(message: GuildMessage, remaining: number, argument: string, args: Args): Promise<Track[] | null> {
		// Remove `<...>` escape characters.
		const url = parseURL(argument.replace(/^<(.+)>$/g, '$1'));
		if (url === null) return null;

		// If the argument was run with an `--import` flag, download the data as a squeue.
		if (args.getFlags('import')) {
			const binary = await this.downloadAttachment(message, url.href);
			const data = await this.parseAttachment(message, binary);
			return this.filter(message, remaining, data);
		}

		// Download the results from the URL. e.g.
		// - https://www.youtube.com/watch?v=J9Q3i5w6-Ug
		// - https://soundcloud.com/user-417823582/twrp-starlight-brigade-feat-1
		// - https://www.twitch.tv/monstercat
		return this.downloadResults(message, remaining, url.href);
	}

	/**
	 * Parses a possible track or playlist of tracks from SoundCloud.
	 * @param message The message that ran the argument.
	 * @param remaining The amount of entries the user can add.
	 * @param argument The argument to parse.
	 * @returns
	 * - `null` if neither `--sc` nor `--soundcloud` flags were provided.
	 * - `Track[]` otherwise.
	 */
	private handleSoundCloud(message: GuildMessage, remaining: number, argument: string, args: Args): Promise<Track[] | null> {
		if (args.getFlags('sc', 'soundcloud')) {
			return this.downloadResults(message, remaining, `scsearch: ${argument}`);
		}

		return Promise.resolve(null);
	}

	/**
	 * Parses a possible track or playlist of tracks from YouTube.
	 * @param message The message that ran the argument.
	 * @param remaining The amount of entries the user can add.
	 * @param arg The argument to parse.
	 * @returns Always `Track[]`.
	 */
	private handleYouTube(message: GuildMessage, remaining: number, arg: string): Promise<Track[] | null> {
		return this.downloadResults(message, remaining, `ytsearch: ${arg}`);
	}

	/**
	 * Downloads the tracks from the audio server, then filters them.
	 * @param message The message that ran the argument.
	 * @param remainingUserEntries The amount of entries the user can add.
	 * @param search The search argument.
	 * @returns Always `Track[]`.
	 */
	private async downloadResults(message: GuildMessage, remainingUserEntries: number, search: string): Promise<Track[]> {
		try {
			// Load the data from the node:
			const response = await getAudio(message.guild).player.node.load(search);

			// No matches: throw.
			if (response.loadType === LoadType.NoMatches) throw await reply(message, "Oops, There weren't any results :zzz:");

			// Load failed: throw.
			if (response.loadType === LoadType.LoadFailed) throw await reply(message, 'musicManager:fetchLoadFailed');

			// Loaded playlist: filter all tracks.
			if (response.loadType === LoadType.PlaylistLoaded) return this.filter(message, remainingUserEntries, response.tracks);

			// Loaded track, retrieve the first one that can be loaded.
			const tracks = await this.filter(message, remainingUserEntries, response.tracks);

			// If there was no available track, return empty array.
			if (tracks.length === 0) return tracks;

			// Else return an array with only the first track.
			return [tracks[0]];
		} catch {
			return [];
		}
	}

	/**
	 * Filters the tracks by whether the server allows streams, their duration, and trims the entries by `remaining`.
	 * @param message The message that ran the argument.
	 * @param remaining The amount of entries the user can add.
	 * @param tracks The downloaded tracks to filter.
	 */
	private async filter(message: GuildMessage, remaining: number, tracks: Track[]): Promise<Track[]> {
		if (await isDJ(message.member)) return [...filter(take(tracks.values(), remaining), (track) => track.track !== null)];

		const [maximumDuration, allowStreams] = await readSettings(message.guild, [
			GuildSettings.Music.MaxDuration,
			GuildSettings.Music.AllowStreams
		]);
		const filteredStreams = allowStreams ? tracks.values() : filter(tracks.values(), (track) => !track.info.isStream);
		const filteredDuration = filter(filteredStreams, (track) => track.info.length <= maximumDuration);
		const mappedTracks = filter(filteredDuration, (track) => track.track !== null);
		return [...take(mappedTracks, remaining)];
	}
}
