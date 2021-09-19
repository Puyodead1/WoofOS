import type { GuildMessage } from '../lib/types/Discord';
import { PermissionsPrecondition } from './PermissionsPrecondition';

export class UserPermissionsPrecondition extends PermissionsPrecondition {
	public handle(message: GuildMessage): PermissionsPrecondition.Result {
		return message.author.id === message.guild.ownerId ? this.ok() : this.error({ identifier: 'preconditions:serverOwner' });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		ServerOwner: never;
	}
}
