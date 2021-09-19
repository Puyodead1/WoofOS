import type { GuildMessage } from '../lib/types/Discord';
import { isModerator } from '../utils';
import { PermissionsPrecondition } from './PermissionsPrecondition';

export class UserPermissionsPrecondition extends PermissionsPrecondition {
	public async handle(message: GuildMessage): PermissionsPrecondition.AsyncResult {
		return (await isModerator(message.member)) ? this.ok() : this.error({ identifier: 'preconditions:moderator' });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		Moderator: never;
	}
}
