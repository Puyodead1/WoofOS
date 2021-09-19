import { container } from '@sapphire/framework';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import type { IBaseEntity } from '../settings/base/IBaseEntity';
import { ConfigurableKey, configurableKeys } from '../settings/ConfigurableKey';
import type { NonNullObject } from '@sapphire/utilities';
import { DEFAULT_PREFIX, DEFAULT_VOLUME, VOLUME_MAX } from '../../../config';
import { PermissionNodeManager } from '../settings/structures/PermissionNodeManager';
import { hours } from '../../../utils';

@Entity('guilds', { schema: 'public' })
export class GuildEntity extends BaseEntity implements IBaseEntity {
	@PrimaryColumn('varchar', { name: 'id', length: 19 })
	public id!: string;

	@ConfigurableKey({ description: 'settings:prefix', minimum: 1, maximum: 10 })
	@Column('varchar', { name: 'prefix', length: 10, default: DEFAULT_PREFIX })
	public prefix = DEFAULT_PREFIX;

	@ConfigurableKey({ description: 'channelsLogsModeration', type: 'textchannel' })
	@Column('varchar', { name: 'channels.logs.moderation', nullable: true, length: 19 })
	public channelsLogsModeration?: string | null;

	@ConfigurableKey({ description: 'channelsLogsRaidAlerts', type: 'textchannel' })
	@Column('varchar', { name: 'channels.logs.raidAlerts', nullable: true, length: 19 })
	public channelsLogsRaidAlerts?: string | null;

	@ConfigurableKey({ description: 'channelsLogsMember', type: 'textchannel' })
	@Column('varchar', { name: 'channels.logs.member', nullable: true, length: 19 })
	public channelsLogsMember?: string | null;

	@ConfigurableKey({ description: 'channelsLogsChannelChanges', type: 'textchannel' })
	@Column('varchar', { name: 'channels.logs.channelChanges', nullable: true, length: 19 })
	public channelsLogsChannelChanges?: string | null;

	@ConfigurableKey({ description: 'channelsLogsCensoredMessages', type: 'textchannel' })
	@Column('varchar', { name: 'channels.logs.censoredMessages', nullable: true, length: 19 })
	public channelsLogsCensoredMessages?: string | null;

	@ConfigurableKey({ description: 'channelsLogsRoleChanges', type: 'textchannel' })
	@Column('varchar', { name: 'channels.logs.roleChanges', nullable: true, length: 19 })
	public channelsLogsRoleChanges?: string | null;

	@ConfigurableKey({ description: 'channelsLogsUserUpdates', type: 'textchannel' })
	@Column('varchar', { name: 'channels.logs.userUpdates', nullable: true, length: 19 })
	public channelsLogsUserUpdates?: string | null;

	@ConfigurableKey({ description: 'channelsLogsVoiceChanges', type: 'textchannel' })
	@Column('varchar', { name: 'channels.logs.voiceChanges', nullable: true, length: 19 })
	public channelsLogsVoiceChanges?: string | null;

	@ConfigurableKey({ description: 'channelsLogsMisc', type: 'textchannel' })
	@Column('varchar', { name: 'channels.logs.misc', nullable: true, length: 19 })
	public channelsLogsMisc?: string | null;

	@ConfigurableKey({ description: 'channelsLogsMessage', type: 'textchannel' })
	@Column('varchar', { name: 'channels.logs.messages', nullable: true, length: 19 })
	public channelsLogsMessage?: string | null;

	@ConfigurableKey({ description: 'channelsLogsSpam', type: 'textchannel' })
	@Column('varchar', { name: 'channels.logs.spam', nullable: true, length: 19 })
	public channelsLogsSpam?: string | null;

	@ConfigurableKey({ description: 'channelsNoXP', type: 'textchannel' })
	@Column('varchar', { name: 'channels.noXP', nullable: true, length: 19 })
	public channelsNoXP?: string | null;

	@ConfigurableKey({ description: 'channelsCommunityChannelsCategory', type: 'textchannel' })
	@Column('varchar', { name: 'channels.communityChannelsCategory', nullable: true, length: 19 })
	public channelsCommunityChannelsCategory?: string | null;

	@ConfigurableKey({ description: 'musicEnabled' })
	@Column('boolean', { name: 'music.enabled', default: true })
	public musicEnabled = true;

	@ConfigurableKey({ description: 'musicDefaultVolume', minimum: 0, maximum: VOLUME_MAX })
	@Column('smallint', { name: 'music.defaultVolume', default: DEFAULT_VOLUME })
	public musicDefaultVolume = DEFAULT_VOLUME;

	@ConfigurableKey({ description: 'musicAnnounce' })
	@Column('boolean', { name: 'music.announce', default: false })
	public musicAnnounce = false;

	@ConfigurableKey({ description: 'musicDjOnly' })
	@Column('boolean', { name: 'music.djOnly', default: true })
	public musicDjOnly = true;

	@ConfigurableKey({ description: 'musicDjRoles', type: 'role' })
	@Column('varchar', { name: 'music.djRoles', length: 19, array: true, default: () => 'ARRAY[]::VARCHAR[]' })
	public musicDjRoles: string[] = [];

	@ConfigurableKey({ description: 'musicDjBulkQueue' })
	@Column('boolean', { name: 'music.bulkQueue', default: false })
	public musicDjBulkQueue = false;

	@ConfigurableKey({ description: 'musicPreventDupe' })
	@Column('boolean', { name: 'music.preventDupe', default: false })
	public musicPreventDupe = false;

	@ConfigurableKey({ description: 'musicMaxSongsPerUser', minimum: 1, maximum: 100 })
	@Column('integer', { name: 'music.maxSongsPerUser', default: 100 })
	public musicMaxSongsPerUser = 100;

	@ConfigurableKey({ description: 'musicMaxQueueLength', minimum: 1, maximum: 1000 })
	@Column('integer', { name: 'music.maxSongsPerUser', default: 1000 })
	public musicMaxQueueLength = 1000;

	@ConfigurableKey({ description: 'musicPartiesEnabled' })
	@Column('boolean', { name: 'music.partiesEnabled', default: false })
	public musicPartiesEnabled = false;

	@ConfigurableKey({ description: 'musicMaxDuration', minimum: 0, maximum: hours(12) })
	@Column('integer', { name: 'music.maxDuration', default: hours(2) })
	public musicMaxDuration = hours(2);

	@ConfigurableKey({ description: 'musicAllowStreams' })
	@Column('boolean', { name: 'music.allowStreams', default: true })
	public musicAllowStreams = true;

	@Column('jsonb', { name: 'permissions.users', default: () => "'[]'::JSONB" })
	public permissionsUsers: PermissionsNode[] = [];

	@Column('jsonb', { name: 'permissions.roles', default: () => "'[]'::JSONB" })
	public permissionsRoles: PermissionsNode[] = [];

	@ConfigurableKey({ description: 'rolesModerator', type: 'role' })
	@Column('varchar', { name: 'roles.moderator', length: 19, array: true, default: () => 'ARRAY[]::VARCHAR[]' })
	public rolesModerator: string[] = [];

	@ConfigurableKey({ description: 'rolesAdmin', type: 'role' })
	@Column('varchar', { name: 'roles.admin', length: 19, array: true, default: () => 'ARRAY[]::VARCHAR[]' })
	public rolesAdmin: string[] = [];

	@ConfigurableKey({ description: 'rolesMuted', type: 'role' })
	@Column('varchar', { name: 'roles.muted', length: 19, nullable: true })
	public rolesMuted: string[] = [];

	public readonly permissionNodes = new PermissionNodeManager(this);

	public get guild() {
		return container.client.guilds.cache.get(this.id)!;
	}

	/**
	 * Gets the bare representation of the entity.
	 */
	public toJSON(): NonNullObject {
		return Object.fromEntries(configurableKeys.map((v) => [v.property, this[v.property] ?? v.default]));
	}

	public resetAll(): this {
		for (const value of configurableKeys.values()) {
			Reflect.set(this, value.property, value.default);
		}

		// this.entityRemove();
		return this;
	}

	// @AfterLoad()
	// protected entityLoad() {
	// 	this.adders.refresh();
	// 	this.permissionNodes.refresh();
	// 	this.nms = new RateLimitManager(this.noMentionSpamTimePeriod * 1000, this.noMentionSpamMentionsAllowed);
	// 	this.wordFilterRegExp = this.selfmodFilterRaw.length ? new RegExp(create(this.selfmodFilterRaw), 'gi') : null;
	// 	this.#words = this.selfmodFilterRaw.slice();
	// }

	// @AfterInsert()
	// @AfterUpdate()
	// protected entityUpdate() {
	// 	this.adders.refresh();
	// 	this.permissionNodes.onPatch();

	// 	if (!arrayStrictEquals(this.#words, this.selfmodFilterRaw)) {
	// 		this.#words = this.selfmodFilterRaw.slice();
	// 		this.wordFilterRegExp = this.selfmodFilterRaw.length ? new RegExp(create(this.selfmodFilterRaw), 'gi') : null;
	// 	}
	// }

	// @AfterRemove()
	// protected entityRemove() {
	// 	this.adders.onRemove();
	// 	this.permissionNodes.onRemove();
	// 	this.wordFilterRegExp = null;
	// 	this.#words = [];
	// }
}

export interface PermissionsNode {
	allow: string[];

	deny: string[];

	id: string;
}
