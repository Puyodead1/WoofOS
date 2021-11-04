import { fetch, FetchResultTypes } from '@sapphire/fetch';
import { LoadType, Track } from '@skyra/audio';
import { reply } from '@sapphire/plugin-editable-commands';
import { deserialize } from 'binarytf';
import { parseURL } from '@sapphire/utilities';
import { GuildSettings } from '..//database/keys';
import type { GuildMessage } from '../types/Discord';
import type { Args } from '@sapphire/framework';
import { getAudio, count, readSettings, isDJ, take, filter as utilFilter } from '../../utils';

/**
 * Retrieves how many new tracks the user can queue.
 * @param message The message that ran the argument.
 */
export async function getUserRemainingEntries(message: GuildMessage): Promise<number> {
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
export async function parseAttachment(message: GuildMessage, binary: Uint8Array): Promise<Track[]> {
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
export async function downloadAttachment(message: GuildMessage, url: string): Promise<Uint8Array> {
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
export async function handleURL(message: GuildMessage, remaining: number, argument: string, args: Args): Promise<Track[] | null> {
	// Remove `<...>` escape characters.
	const url = parseURL(argument.replace(/^<(.+)>$/g, '$1'));
	if (url === null) return null;

	// If the argument was run with an `--import` flag, download the data as a squeue.
	if (args.getFlags('import')) {
		const binary = await downloadAttachment(message, url.href);
		const data = await parseAttachment(message, binary);
		return filter(message, remaining, data);
	}

	// Download the results from the URL. e.g.
	// - https://www.youtube.com/watch?v=J9Q3i5w6-Ug
	// - https://soundcloud.com/user-417823582/twrp-starlight-brigade-feat-1
	// - https://www.twitch.tv/monstercat
	return downloadResults(message, remaining, url.href);
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
export async function handleSoundCloud(message: GuildMessage, remaining: number, argument: string): Promise<Track[] | null> {
	return downloadResults(message, remaining, `scsearch: ${argument}`);
}

/**
 * Parses a possible track or playlist of tracks from YouTube.
 * @param message The message that ran the argument.
 * @param remaining The amount of entries the user can add.
 * @param arg The argument to parse.
 * @returns Always `Track[]`.
 */
export async function handleYouTube(message: GuildMessage, remaining: number, arg: string): Promise<Track[] | null> {
	return downloadResults(message, remaining, `ytsearch: ${arg}`);
}

export async function handleSpotifySong(message: GuildMessage, remaining: number, arg: string): Promise<Track[] | null> {
	const matches = arg.match(/open.spotify.com\/track\/(?<trackid>[a-zA-Z0-9_-]+).*$/);
	const trackId = matches?.groups?.trackid;
	if (!trackId) return null;
	const { body: track } = await message.client.spotifyAPI.getTrack(trackId);
	return downloadResults(message, remaining, `ytsearch: ${track.name}`);
}

/**
 * Downloads the tracks from the audio server, then filters them.
 * @param message The message that ran the argument.
 * @param remainingUserEntries The amount of entries the user can add.
 * @param search The search argument.
 * @returns Always `Track[]`.
 */
export async function downloadResults(message: GuildMessage, remainingUserEntries: number, search: string): Promise<Track[]> {
	try {
		// Load the data from the node:
		const response = await getAudio(message.guild).player.node.load(search);

		// No matches: throw.
		if (response.loadType === LoadType.NoMatches) throw await reply(message, "Oops, There weren't any results :zzz:");

		// Load failed: throw.
		if (response.loadType === LoadType.LoadFailed) throw await reply(message, 'musicManager:fetchLoadFailed');

		// Loaded playlist: filter all tracks.
		if (response.loadType === LoadType.PlaylistLoaded) return filter(message, remainingUserEntries, response.tracks);

		// Loaded track, retrieve the first one that can be loaded.
		const tracks = await filter(message, remainingUserEntries, response.tracks);

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
export async function filter(message: GuildMessage, remaining: number, tracks: Track[]): Promise<Track[]> {
	if (await isDJ(message.member)) return [...utilFilter(take(tracks.values(), remaining), (track) => track.track !== null)];

	const [maximumDuration, allowStreams] = await readSettings(message.guild, [GuildSettings.Music.MaxDuration, GuildSettings.Music.AllowStreams]);
	const filteredStreams = allowStreams ? tracks.values() : utilFilter(tracks.values(), (track) => !track.info.isStream);
	const filteredDuration = utilFilter(filteredStreams, (track) => track.info.length <= maximumDuration);
	const mappedTracks = utilFilter(filteredDuration, (track) => track.track !== null);
	return [...take(mappedTracks, remaining)];
}
