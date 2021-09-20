import { IPieceError, Listener } from '@sapphire/framework';
import type { ScheduleEntity } from 'lib/database/entities/ScheduleEntity';
import type { Task } from 'lib/database/settings/structures/Task';

export interface TaskErrorPayload extends IPieceError {
	piece: Task;
	entity: ScheduleEntity;
}

export class UserListener extends Listener<'taskError'> {
	public run(error: Error, context: TaskErrorPayload) {
		this.container.logger.fatal(`[TASK] ${context.piece.name}\n${error.stack || error.message}`);
	}
}
