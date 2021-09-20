import { Store } from '@sapphire/framework';
import { Platform } from './Platform';

export class PlatformStore extends Store<Platform> {
	/**
	 * Constructs our PlatformStore
	 * @param client The client that instantiates this store
	 */
	public constructor() {
		super(Platform as any, { name: 'platforms' });
		this.container.client.stores.register(this);
	}
}
