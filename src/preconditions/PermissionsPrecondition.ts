import {
	Precondition,
	PieceContext,
	Identifiers,
	PreconditionContext,
	PreconditionResult,
	AsyncPreconditionResult,
	PreconditionOptions
} from '@sapphire/framework';
import { PermissionLevels } from '../Enums';
import type { GuildMessage } from '../lib/types/Discord';
import type { WoofCommand } from '../lib/Structures/WoofCommand';
import { isAdmin, isGuildOwner } from '../utils';
import { readSettings } from '../lib/database/settings/functions';

export abstract class PermissionsPrecondition extends Precondition {
	private readonly guildOnly: boolean;

	public constructor(context: PieceContext, options: PermissionsPrecondition.Options = {}) {
		super(context, options);
		this.guildOnly = options.guildOnly ?? true;
	}

	public async run(message: GuildMessage, command: WoofCommand, context: PermissionsPrecondition.Context): PermissionsPrecondition.AsyncResult {
		// If not in a guild, resolve on an error:
		if (message.guild === null || message.member === null) {
			return this.guildOnly ? this.error({ identifier: Identifiers.PreconditionGuildOnly }) : this.ok();
		}

		// If it should skip, go directly to handle:
		if (await this.shouldRun(message, command)) {
			const nodes = await readSettings(message.guild, (settings) => settings.permissionNodes);
			const result = nodes.run(message.member, command);
			if (result) return this.ok();
			if (result === false) return this.error({ identifier: 'preconditions:permissionNodes' });
		}

		// Run the specific precondition's logic:
		return this.handle(message, command, context);
	}

	public abstract handle(message: GuildMessage, command: WoofCommand, context: PermissionsPrecondition.Context): PermissionsPrecondition.Result;

	private async shouldRun(message: GuildMessage, command: WoofCommand) {
		// Guarded commands cannot be modified:
		if (command.guarded) return false;
		// Bot-owner commands cannot be modified:
		if (command.permissionLevel === PermissionLevels.BotOwner) return false;
		// If the author is owner of the guild, skip:
		if (isGuildOwner(message.member)) return false;
		// If the author is administrator of the guild, skip:
		if (await isAdmin(message.member)) return false;
		// In any other case, permission nodes should always run:
		return true;
	}
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace PermissionsPrecondition {
	export type Context = PreconditionContext;
	export type Result = PreconditionResult;
	export type AsyncResult = AsyncPreconditionResult;
	export interface Options extends PreconditionOptions {
		guildOnly?: boolean;
	}
}
