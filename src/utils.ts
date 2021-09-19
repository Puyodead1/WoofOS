import { Time } from '@sapphire/time-utilities';
import { Guild, GuildMember, GuildResolvable, Message, MessageEmbed, Permissions } from 'discord.js';
import { BRANDING_COLOR, OWNERS } from './config';
import { hasAtLeastOneKeyInMap } from '@sapphire/utilities';
import { container } from '@sapphire/framework';
import type { GuildEntity } from './lib/database/entities/GuildEntity';
import { GuildSettings } from './lib/database/keys';
import type { VoiceBasedChannelTypes } from '@sapphire/discord.js-utilities';
import { isNullish, Nullish } from '@sapphire/utilities';
import type { WoofCommand } from './lib/Structures/WoofCommand';

export const WoofEmbed = (message: Message, authorTitle: string, footerTitle: string | null | undefined = null) => {
	const embed = new MessageEmbed()
		.setAuthor(
			authorTitle,
			message.client.user!.avatarURL({
				format: 'png',
				dynamic: true,
				size: 2048
			})!
		)
		.setColor(BRANDING_COLOR)
		.setTimestamp();

	if (footerTitle) {
		embed.setFooter(
			footerTitle,
			message.author.avatarURL({
				format: 'png',
				dynamic: true,
				size: 2048
			})!
		);
	}

	return embed;
};

export const formatTime = (ms: number) => {
	let seconds: any = (ms / 1000).toFixed(0);
	let minutes: any = Math.floor(seconds / 60);
	let hours: any = '';

	if (minutes > 59) {
		hours = Math.floor(minutes / 60);
		hours = hours >= 10 ? hours : '0' + hours;
		minutes = minutes - hours * 60;
		minutes = minutes >= 10 ? minutes : '0' + minutes;
	}

	seconds = Math.floor(seconds % 60);
	seconds = seconds >= 10 ? seconds : '0' + seconds;

	if (hours !== '') return hours + ':' + minutes + ':' + seconds;

	return minutes + ':' + seconds;
};

/**
 * Converts a number of seconds to milliseconds.
 * @param seconds The amount of seconds
 * @returns The amount of milliseconds `seconds` equals to.
 */
export function seconds(seconds: number): number {
	return seconds * Time.Second;
}

function checkDj(member: GuildMember, settings: GuildEntity) {
	const roles = settings[GuildSettings.Roles.Dj];
	return roles.length === 0 ? member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) : hasAtLeastOneKeyInMap(member.roles.cache, roles);
}

function checkModerator(member: GuildMember, settings: GuildEntity) {
	const roles = settings[GuildSettings.Roles.Moderator];
	return roles.length === 0 ? member.permissions.has(Permissions.FLAGS.BAN_MEMBERS) : hasAtLeastOneKeyInMap(member.roles.cache, roles);
}

function checkAdministrator(member: GuildMember, settings: GuildEntity) {
	const roles = settings[GuildSettings.Roles.Admin];
	return roles.length === 0 ? member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) : hasAtLeastOneKeyInMap(member.roles.cache, roles);
}

export function getAudio(resolvable: GuildResolvable) {
	return container.client.music!.queues.get(container.client.guilds.resolveId(resolvable)!);
}

export function isDJ(member: GuildMember) {
	return (
		isGuildOwner(member) ||
		isOnlyListener(member) ||
		readSettings(
			member,
			(settings: GuildEntity) => checkDj(member, settings) || checkModerator(member, settings) || checkAdministrator(member, settings)
		)
	);
}

export function isModerator(member: GuildMember) {
	return (
		isGuildOwner(member) ||
		readSettings(member, (settings: GuildEntity) => checkModerator(member, settings) || checkAdministrator(member, settings))
	);
}

export function isAdminByRole(member: GuildMember, roles: readonly string[]): boolean {
	return roles.length === 0 ? member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) : hasAtLeastOneKeyInMap(member.roles.cache, roles);
}

export function isAdmin(member: GuildMember) {
	return isGuildOwner(member) || readSettings(member, (settings: GuildEntity) => checkAdministrator(member, settings));
}

export function isGuildOwner(member: GuildMember) {
	return member.id === member.guild.ownerId;
}

export async function canManage(guild: Guild, member: GuildMember): Promise<boolean> {
	if (guild.ownerId === member.id) return true;

	const [roles, pnodes] = await readSettings(guild, (settings: GuildEntity) => [settings[GuildSettings.Roles.Admin], settings.permissionNodes]);

	return isAdminByRole(member, roles) && (pnodes.run(member, container.stores.get('commands').get('conf') as WoofCommand) ?? true);
}

export function getListeners(channel: VoiceBasedChannelTypes | Nullish): string[] {
	if (isNullish(channel)) return [];

	const members: string[] = [];
	for (const [id, member] of channel.members.entries()) {
		if (member.user.bot || member.voice.deaf) continue;
		members.push(id);
	}

	return members;
}

export function getListenerCount(channel: VoiceBasedChannelTypes | Nullish): number {
	if (isNullish(channel)) return 0;

	let count = 0;
	for (const member of channel.members.values()) {
		if (!member.user.bot && !member.voice.deaf) ++count;
	}

	return count;
}

export function isOnlyListener(member: GuildMember) {
	const { voiceChannel } = getAudio(member);
	if (voiceChannel === null) return false;

	const listeners = getListeners(voiceChannel);
	return listeners.length === 1 && listeners[0] === member.id;
}

export function isOwner(member: GuildMember) {
	return OWNERS.includes(member.id);
}

export function readSettings(guild: GuildResolvable, paths?: any) {
	const resolved = container.client.guilds.resolveId(guild);
	if (resolved === null) throw new TypeError(`Cannot resolve "guild" to a Guild instance.`);
	return container.settings.guilds.read(resolved, paths);
}

/**
 * Converts a number of days to milliseconds.
 * @param days The amount of days
 * @returns The amount of milliseconds `days` equals to.
 */
export function days(days: number): number {
	return days * Time.Day;
}

/**
 * Converts a number of hours to milliseconds.
 * @param hours The amount of hours
 * @returns The amount of milliseconds `hours` equals to.
 */
export function hours(hours: number): number {
	return hours * Time.Hour;
}

export function* map<T, R>(iterator: IterableIterator<T>, cb: (value: T) => R): IterableIterator<R> {
	let result: IteratorResult<T> | null = null;
	while (!(result = iterator.next()).done) {
		yield cb(result.value);
	}
}

export function* reverse<T>(array: readonly T[]): IterableIterator<T> {
	for (let i = array.length - 1; i >= 0; i--) {
		yield array[i];
	}
}

export function count<T>(iterator: IterableIterator<T>, cb: (value: T) => boolean): number {
	let n = 0;
	for (const value of iterator) {
		if (cb(value)) ++n;
	}

	return n;
}

export function* take<T>(iterator: IterableIterator<T>, amount: number): IterableIterator<T> {
	let i = 0;
	let result: IteratorResult<T> | null = null;
	while (i++ < amount && !(result = iterator.next()).done) {
		yield result.value;
	}
}

export function* filter<T>(iterator: IterableIterator<T>, cb: (value: T) => boolean): IterableIterator<T> {
	let result: IteratorResult<T> | null = null;
	while (!(result = iterator.next()).done) {
		if (cb(result.value)) yield result.value;
	}
}

export function reduceLeft(array: number[], start: number = 0) {
	const n: number[] = [];
	for (var i = 0; i < array.length; i++) {
		n.push((n[n.length - 1] ?? start) + array[i]);
	}

	return n;
}
