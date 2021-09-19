import { PreconditionContainerArray } from '@sapphire/framework';
import { Args, CommandContext, PieceContext, UserError } from '@sapphire/framework';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import { OWNERS } from '../../config';
import { PermissionLevels } from '../../Enums';
import { seconds } from '../../utils';

export abstract class WoofCommand extends SubCommandPluginCommand<Args, WoofCommand> {
	public readonly guarded: boolean;
	public readonly hidden: boolean;
	public readonly permissionLevel: PermissionLevels;
	public readonly description: string;

	public constructor(context: PieceContext, options: WoofCommand.Options) {
		super(context, { cooldownDelay: seconds(10), cooldownLimit: 2, cooldownFilteredUsers: OWNERS, generateDashLessAliases: true, ...options });

		this.guarded = options.guarded ?? false;
		this.hidden = options.hidden ?? false;
		this.permissionLevel = options.permissionLevel ?? PermissionLevels.Everyone;
		this.description = options.description;
	}

	protected error(identifier: string | UserError, context?: unknown): never {
		throw typeof identifier === 'string' ? new UserError({ identifier, context }) : identifier;
	}

	protected parseConstructorPreConditions(options: WoofCommand.Options): void {
		super.parseConstructorPreConditions(options);
		//this.parseConstructorPreConditionsSpam(options);
		this.parseConstructorPreConditionsPermissionLevel(options);
	}

	// protected parseConstructorPreConditionsSpam(options: WoofCommand.Options): void {
	// 	if (options.spam) this.preconditions.append('Spam');
	// }

	protected parseConstructorPreConditionsPermissionLevel(options: WoofCommand.Options): void {
		if (options.permissionLevel === PermissionLevels.BotOwner) {
			this.preconditions.append('BotOwner');
			return;
		}

		const container = new PreconditionContainerArray(['BotOwner'], this.preconditions);
		switch (options.permissionLevel ?? PermissionLevels.Everyone) {
			case PermissionLevels.Everyone:
				container.append('Everyone');
				break;
			case PermissionLevels.Moderator:
				container.append('Moderator');
				break;
			case PermissionLevels.Admin:
				container.append('Admin');
				break;
			case PermissionLevels.ServerOwner:
				container.append('ServerOwner');
				break;
			default:
				throw new Error(
					`SkyraCommand[${this.name}]: "permissionLevel" was specified as an invalid permission level (${options.permissionLevel}).`
				);
		}

		this.preconditions.append(container);
	}
}

export namespace WoofCommand {
	/**
	 * The SkyraCommand Options
	 */
	export type Options = SubCommandPluginCommand.Options & {
		description: string;
		detailedDescription: string;
		guarded?: boolean;
		hidden?: boolean;
		permissionLevel?: number;
		spam?: boolean;
	};

	export type Context = CommandContext;
}
