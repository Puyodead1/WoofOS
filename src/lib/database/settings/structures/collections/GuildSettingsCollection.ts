import { container } from '@sapphire/framework';
import { GuildEntity } from '../../../entities/GuildEntity';
import { SettingsCollectionCallback, SettingsCollection } from '../../base/SettingsCollection';

export interface GuildSettingsCollectionCallback<R> extends SettingsCollectionCallback<GuildEntity, R> {}

export class GuildSettingsCollection extends SettingsCollection<GuildEntity> {
	public async fetch(key: string): Promise<GuildEntity> {
		const { guilds } = container.db;
		const existing = await guilds.findOne({ id: key });
		if (existing) {
			this.set(key, existing);
			return existing;
		}

		const created = new GuildEntity();
		created.id = key;
		this.set(key, created);
		return created;
	}
}
