import type { GuildTextBasedChannelTypes } from '@sapphire/discord.js-utilities';
import { container } from '@sapphire/framework';
import type { Player, Track, TrackInfo, EqualizerBand, OutgoingEqualizerPayload } from '@skyra/audio';
import type { Guild, VoiceChannel } from 'discord.js';
import { reverse } from '../../utils';
import type { QueueStore } from './QueueStore';
import { isNullish } from '@sapphire/utilities';
import { DEFAULT_VOLUME } from '../../config';

export interface QueueEntry {
	author: string;
	track: Track;
}

export interface NP {
	entry: NowPlayingEntry;
	position: number;
}

export interface NowPlayingEntry extends QueueEntry {
	info: TrackInfo;
}

export class Queue {
	public constructor(public readonly store: QueueStore, public readonly guildId: string) {}

	public get player(): Player {
		return this.store.client.players.get(this.guildId);
	}

	public get playing(): boolean {
		return this.player.playing;
	}

	public get paused(): boolean {
		return this.player.paused;
	}

	public get guild(): Guild {
		return container.client.guilds.cache.get(this.guildId)!;
	}

	public get voiceChannel(): VoiceChannel | null {
		const id = this.voiceChannelId;
		return id ? (this.guild.channels.cache.get(id) as VoiceChannel) ?? null : null;
	}

	public get voiceChannelId(): string | null {
		return this.guild.me?.voice.channel?.id ?? null;
	}

	/**
	 * Starts the queue.
	 */
	public async start(replaying = false): Promise<boolean> {
		const np = await this.nowPlaying();
		if (!np) return this.next();

		// Play next song.
		await this.player.play(np.entry.track);

		// TODO:
		// container.client.emit(replaying ? Events.MusicSongReplay : Events.MusicSongPlay, this, np);
		return true;
	}

	/**
	 * Returns whether or not there are songs that can be played.
	 */
	public async canStart(): Promise<boolean> {
		return (await this.store.songs.length) > 0;
	}

	/**
	 * Adds tracks to the end of the queue.
	 * @param tracks The tracks to be added.
	 */
	public add(...tracks: readonly QueueEntry[]): number {
		if (!tracks.length) return 0;
		this.store.songs.push(...tracks);
		// TODO:
		// container.client.emit(Events.MusicQueueSync, this);
		return tracks.length;
	}

	public async pause({ system = false } = {}) {
		await this.player.pause(true);
		this.setSystemPaused(system);
		// TODO:
		// container.client.emit(Events.MusicSongPause, this);
	}

	public async resume() {
		await this.player.pause(false);
		this.setSystemPaused(false);
		// TODO:
		// container.client.emit(Events.MusicSongResume, this);
	}

	/**
	 * Retrieves all the skip votes.
	 * @returns Number of vote skips
	 */
	public countSkipVotes(): number {
		return this.store.skipVotes.size;
	}

	/**
	 * Empties the skip list.
	 * @param value The value to add.
	 */
	public resetSkipVotes(): void {
		return this.store.skipVotes.clear();
	}

	/**
	 * Adds a vote.
	 * @param value The value to add to the skip list.
	 * @returns Whether or not the vote was added.
	 */
	public addSkipVote(value: string): boolean {
		if (this.store.skipVotes.has(value)) return false;
		this.store.skipVotes.add(value);
		return true;
	}

	/**
	 * Retrieves whether or not the queue was paused automatically.
	 * @returns Whether the queue was paused automatically
	 */
	public getSystemPaused(): boolean {
		return this.store.isSystemPaused;
	}

	/**
	 * Sets the system pause mode.
	 * @param value Whether or not the queue should be paused automatically.
	 */
	public setSystemPaused(value: boolean): boolean {
		this.store.isSystemPaused = value;
		// TODO:
		// container.client.emit(Events.MusicSongPause, this, value);
		return value;
	}

	/**
	 * Retrieves whether or not the system should repeat the current track.
	 */
	public getLoop(): boolean {
		return this.store.isLoopEnabled;
	}

	/**
	 * Sets the repeat mode.
	 * @param value Whether or not the system should repeat the current track.
	 */
	public setLoop(value: boolean): boolean {
		this.store.isLoopEnabled = true;
		// TODO:
		// container.client.emit(Events.MusicReplayUpdate, this, value);
		return value;
	}

	/**
	 * Retrieves the volume of the track in the queue.
	 * @returns the current volume
	 */
	public getVolume(): number {
		return this.store.volume;
	}

	/**
	 * Sets the volume.
	 * @param value The new volume for the queue.
	 */
	public async setVolume(value: number): Promise<{ previous: number; next: number }> {
		await this.player.setVolume(value);
		const previous = this.getVolume();

		// TODO:
		// container.client.emit(Events.MusicSongVolumeUpdate, this, value);
		return { previous: previous === null ? DEFAULT_VOLUME : Number(previous), next: value };
	}

	/**
	 * Sets the seek position in the track.
	 * @param position The position in milliseconds in the track.
	 */
	public async seek(position: number): Promise<void> {
		await this.player.seek(position);
		// TODO:
		// container.client.emit(Events.MusicSongSeekUpdate, this, position);
	}

	/**
	 * Connects to a voice channel.
	 * @param channelId The [[VoiceChannel]] to connect to.
	 */
	public async connect(channelId: string): Promise<void> {
		await this.player.join(channelId, { deaf: true, mute: false });
		await this.setVolume(DEFAULT_VOLUME);
		// TODO:
		// container.client.emit(Events.MusicConnect, this, channelId);
	}

	/**
	 * Leaves the voice channel.
	 */
	public async leave(): Promise<void> {
		await this.player.leave();
		this.clear();
		await this.player.destroy();
		// TODO:
		// container.client.emit(Events.MusicLeave, this);
	}

	/**
	 * Gets the text channel from cache.
	 * @returns the text channel or null
	 */
	public getTextChannel(): GuildTextBasedChannelTypes | null {
		const id = this.getTextChannelId();
		if (id === null) return null;

		const channel = this.guild.channels.cache.get(id) ?? null;
		if (channel === null) {
			this.setTextChannelId(null);
			return null;
		}

		return channel as GuildTextBasedChannelTypes;
	}

	/**
	 * Gets the text channel id
	 * @returns the channel id or null
	 */
	public getTextChannelId(): string | null {
		return this.store.textChannelId;
	}

	/**
	 * Unsets the notifications channel.
	 */
	public setTextChannelId(channelId: null): null;

	/**
	 * Sets a text channel to send notifications to.
	 * @param channelId The text channel to set.
	 */
	public setTextChannelId(channelId: string): string;
	public setTextChannelId(channelId: string | null): string | null {
		if (channelId === null) {
			this.store.textChannelId = null;
		} else {
			this.store.textChannelId = channelId;
		}

		return channelId;
	}

	/**
	 * Retrieves the current track.
	 */
	public getCurrentTrack(): QueueEntry | null {
		return this.store.currentSong;
	}

	/**
	 * Retrieves an element from the queue.
	 * @param index The index at which to retrieve the element.
	 */
	public getAt(index: number): QueueEntry | null {
		return this.store.songs[index];
	}

	/**
	 * Removes a track at the specified index.
	 * @param position The position of the element to remove.
	 */
	public removeAt(position: number): void {
		this.store.songs.splice(position - 1, 1);
		// TODO:
		// container.client.emit(Events.MusicQueueSync, this);
	}

	/**
	 * Skips to the next song, pass negatives to advance in reverse, or 0 to repeat.
	 * @returns Whether or not the queue is not empty.
	 */
	public async next({ skipped = false } = {}): Promise<boolean> {
		// Sets the current position to 0.
		// await this.store.redis.del(this.keys.position);
		this.store.position = this.store.songs.length > 1 ? this.store.songs.length - 1 : 0;

		// Get whether or not the queue is on replay mode.
		const replaying = this.getLoop();

		// If not skipped (song ended) and is replaying, replay.
		if (!skipped && replaying) {
			return this.start(true);
		}

		// If it was skipped, set replay back to false.
		if (replaying) await this.setLoop(false);

		// Removes the next entry from the list and sets it as the current track.
		// const entry = await this.store.redis.rpopset(this.keys.next, this.keys.current);
		const nextSong = this.store.songs.pop();

		// If there was an entry to play, start playing.
		if (nextSong) {
			this.store.currentSong = nextSong;
			// TODO:
			// if (skipped) container.client.emit(Events.MusicSongSkip, this, deserializeEntry(entry));
			await this.resetSkipVotes();
			return this.start(false);
		}

		// We're at the end of the queue, so clear everything out.
		this.clear();
		// TODO:
		// container.client.emit(Events.MusicFinish, this);
		return false;
	}

	/**
	 * Retrieves the length of the queue.
	 */
	public count(): number {
		return this.store.songs.length;
	}

	/**
	 * Moves a track by index from a position to another.
	 * @param from The position of the track to move.
	 * @param to The position of the new position for the track.
	 */
	public moveTracks(from: number, to: number): void {
		// await this.store.redis.lmove(this.keys.next, -from - 1, -to - 1); // work from the end of the list, since it's reversed
		this.store.songs.move(from, to);
		// TODO:
		// container.client.emit(Events.MusicQueueSync, this);
	}

	/**
	 * Shuffles the queue.
	 */
	public shuffleTracks(): void {
		this.store.songs.shuffle();

		// TODO:
		// container.client.emit(Events.MusicQueueSync, this);
	}

	/**
	 * Stops the playback.
	 */
	public async stop(): Promise<void> {
		await this.player.stop();
	}

	/**
	 * Clear all the tracks from the queue.
	 */
	public async clearTracks(): Promise<void> {
		this.store.songs = [];
		// TODO:
		// container.client.emit(Events.MusicQueueSync, this);
	}

	/**
	 * Clears the entire queue's state.
	 */
	// TODO:
	public clear(): void {
		// return this.store.redis.del(
		// 	this.keys.next,
		// 	this.keys.position,
		// 	this.keys.current,
		// 	this.keys.skips,
		// 	this.keys.systemPause,
		// 	this.keys.replay,
		// 	this.keys.volume,
		// 	this.keys.text
		// );
		this.store.songs = [];
		this.store.nextSong = null;
		this.store.position = 0;
		this.store.currentSong = null;
		this.store.skipVotes.clear();
		this.store.isSystemPaused = false;
		this.store.isLoopEnabled = false;
		this.store.volume = DEFAULT_VOLUME;
		this.store.textChannelId = null;
	}

	/**
	 * Gets the current track and position.
	 */
	public async nowPlaying(): Promise<NP | null> {
		const [entry, position] = [this.getCurrentTrack(), this.store.position];
		if (entry === null) return null;

		const info = await this.player.node.decode(entry.track.track);

		return { entry: { ...entry, info }, position: isNullish(position) ? 0 : position };
	}

	public async tracks(start = 0, end = -1): Promise<QueueEntry[]> {
		if (end === Infinity) end = -1;

		const tracks = this.store.songs.slice(start, end);
		return [...reverse(tracks)];
	}

	public async decodedTracks(start = 0, end = -1): Promise<Track[]> {
		const tracks = await this.tracks(start, end);
		return this.player.node.decode(tracks.map((track) => track.track.track));
	}
}
