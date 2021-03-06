import { Store } from '@sapphire/framework';
import { Task } from './Task';

export class TaskStore extends Store<Task> {
	/**
	 * Constructs our TaskStore
	 * @param client The client that instantiates this store
	 */
	public constructor() {
		super(Task as any, { name: 'tasks' });
		this.container.client.stores.register(this);
	}
}
