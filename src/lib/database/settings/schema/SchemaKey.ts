import { Args, container } from '@sapphire/framework';
import type { GuildEntity } from '../../entities/GuildEntity';
import type { ISchemaValue } from '../base/ISchemaValue';
import type { Serializer, SerializerUpdateContext } from '../structures/Serializer';
import type { SchemaGroup } from './SchemaGroup';
import { isNullish, NonNullObject } from '@sapphire/utilities';

export class SchemaKey<K extends keyof GuildEntity = keyof GuildEntity> implements ISchemaValue {
	/**
	 * The i18n key for the configuration key.
	 */
	public description: string;

	/**
	 * The maximum value for the configuration key.
	 */
	public maximum: number | null;

	/**
	 * The minimum value for the configuration key.
	 */
	public minimum: number | null;

	/**
	 * Whether or not the range checks are inclusive.
	 */
	public inclusive: boolean;

	/**
	 * The visible name of the configuration key.
	 */
	public name: string;

	/**
	 * The property from the TypeORM entity.
	 */
	public property: K;

	/**
	 * The class this targets.
	 */
	public target: NonNullObject;

	/**
	 * The type of the value this property accepts.
	 */
	public type: string;

	/**
	 * Whether or not this accepts multiple values.
	 */
	public array: boolean;

	/**
	 * The default value for this key.
	 */
	public default: unknown;

	/**
	 * Whether this key should only be configurable on the dashboard
	 */
	public dashboardOnly: boolean;

	/**
	 * The parent group that holds this key.
	 */
	public parent: SchemaGroup | null = null;

	public constructor(options: ConfigurableKeyValueOptions) {
		this.description = options.description;
		this.maximum = options.maximum;
		this.minimum = options.minimum;
		this.inclusive = options.inclusive ?? false;
		this.name = options.name;
		this.property = options.property as K;
		this.target = options.target;
		this.type = options.type;
		this.array = options.array;
		this.default = options.default;
		this.dashboardOnly = options.dashboardOnly ?? false;
	}

	public get serializer(): Serializer<GuildEntity[K]> {
		const value = container.settings.serializers.get(this.type);
		if (typeof value === 'undefined') throw new Error(`The serializer for '${this.type}' does not exist.`);
		return value as Serializer<GuildEntity[K]>;
	}

	public async parse(settings: GuildEntity, args: Args): Promise<GuildEntity[K]> {
		const { serializer } = this;
		const context = this.getContext(settings);

		const result = await serializer.parse(args, context);
		if (result.success) return result.value;
		throw result.error.message;
	}

	public stringify(settings: GuildEntity, value: GuildEntity[K]): string {
		const { serializer } = this;
		const context = this.getContext(settings);
		return serializer.stringify(value, context);
	}

	public display(settings: GuildEntity): string {
		const { serializer } = this;
		const context = this.getContext(settings);

		if (this.array) {
			const values = settings[this.property] as unknown as readonly any[];
			return isNullish(values) || values.length === 0
				? 'None'
				: `[ ${values.map((value) => serializer.stringify(value, context)).join(' | ')} ]`;
		}

		const value = settings[this.property];
		return isNullish(value) ? 'commands/admin:confSettingNotSet' : serializer.stringify(value, context);
	}

	public getContext(settings: GuildEntity): SerializerUpdateContext {
		const context: SerializerUpdateContext = {
			entity: settings,
			guild: settings.guild,
			entry: this
		};

		return context;
	}
}

export type ConfigurableKeyValueOptions = Pick<
	SchemaKey,
	'description' | 'maximum' | 'minimum' | 'inclusive' | 'name' | 'property' | 'target' | 'type' | 'array' | 'default' | 'dashboardOnly'
>;
