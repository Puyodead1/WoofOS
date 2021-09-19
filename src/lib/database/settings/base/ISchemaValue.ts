import type { GuildEntity } from '../../entities/GuildEntity';
import type { SchemaGroup } from '../schema/SchemaGroup';

export interface ISchemaValue {
	readonly type: string;
	readonly name: string;
	readonly dashboardOnly: boolean;
	readonly parent: SchemaGroup | null;
	display(settings: GuildEntity): string;
}
