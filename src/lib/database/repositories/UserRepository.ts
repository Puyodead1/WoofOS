import Collection from '@discordjs/collection';
import { AsyncQueue } from '@sapphire/async-queue';
import { EntityRepository, Repository, FindOneOptions } from 'typeorm';
import { UserEntity } from '../entities/UserEntity';
import { container } from '@sapphire/pieces';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
	public async ensure(id: string, options?: FindOneOptions<UserEntity>) {
		const previous = await this.findOne({ id }, options);
		if (previous) return previous;

		const data = new UserEntity();
		data.id = id;
		return data;
	}

	public async lock<T>(targets: readonly string[], cb: (...targets: readonly string[]) => Promise<T>): Promise<T> {
		if (targets.length !== new Set(targets).size) {
			throw new Error(`Duplicated targets detected: '${targets.join("', '")}'`);
		}

		const queues = targets.map((target) => {
			const existing = UserRepository.queues.get(target);
			if (existing) return existing;

			const created = new AsyncQueue();
			UserRepository.queues.set(target, created);
			return created;
		});

		await Promise.all(queues.map((queue) => queue.wait()));

		try {
			return await cb(...targets);
		} finally {
			for (const queue of queues) queue.shift();
		}
	}

	private static interval = setInterval(() => {
		UserRepository.queues.sweep((value) => value.remaining === 0);
	}, 60000).unref();

	private static queues = new Collection<string, AsyncQueue>();

	public static destroy() {
		if (UserRepository.interval) clearInterval(UserRepository.interval);
	}
}
