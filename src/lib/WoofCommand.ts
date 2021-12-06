import { Command, PieceContext, UserError } from '@sapphire/framework';
import { PermissionLevel } from './enums';

export abstract class WoofCommand extends Command {
	public readonly guarded: boolean;
	public readonly permissionLevel: PermissionLevel;

	public constructor(context: PieceContext, options: WoofCommand.Options) {
		super(context, options);

		this.guarded = options.guarded ?? false;
		this.permissionLevel = options.permissionLevel ?? PermissionLevel.Everyone;
	}

	protected error(identifier: string | UserError, context?: unknown): never {
		throw typeof identifier === 'string' ? new UserError({ identifier, context }) : identifier;
	}
}

export namespace WoofCommand {
	export type Options = Command.Options & {
		guarded?: boolean;
		permissionLevel?: PermissionLevel;
	};
}
