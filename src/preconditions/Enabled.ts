import { Precondition, Identifiers } from '@sapphire/framework';
import type { PieceContext } from '@sapphire/pieces';
import type { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class CorePrecondition extends Precondition {
	public constructor(context: PieceContext) {
		super(context, { position: 10 });
	}

	public run(_: Message, command: Command, context: Precondition.Context): Precondition.Result {
		return command.enabled
			? this.ok()
			: this.error({
					identifier: Identifiers.CommandDisabled,
					message: command.category === 'Music' ? 'Music has been disabled on this instance.' : 'This command is disabled.',
					context
			  });
	}
}
