import { PieceContext, UserError } from '@sapphire/framework';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';

export class WoofSubCommandPluginCommand extends SubCommandPluginCommand {
	constructor(context: PieceContext, options: SubCommandPluginCommandOptions) {
		super(context, options);
	}

	protected error(identifier: string | UserError, context?: unknown): never {
		throw typeof identifier === 'string' ? new UserError({ identifier, context }) : identifier;
	}
}
