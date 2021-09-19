import type { GuildMessage } from '../lib/types/Discord';
import { isAdmin } from '../utils';
import { PermissionsPrecondition } from './PermissionsPrecondition';

export class UserPermissionsPrecondition extends PermissionsPrecondition {
	public async handle(message: GuildMessage): PermissionsPrecondition.AsyncResult {
		return (await isAdmin(message.member)) ? this.ok() : this.error({ identifier: 'preconditions:administrator' });
	}
}
declare module '@sapphire/framework' {
	interface Preconditions {
		Admin: never;
	}
}
