import type { Args } from '@sapphire/framework';
import type { Awaitable } from 'discord.js';
import { Serializer, SerializerUpdateContext } from '../lib/database/settings/structures/Serializer';

export class UserSerializer extends Serializer<string> {
	public async parse(args: Args, { entry }: SerializerUpdateContext) {
		return this.result(args, await args.restResult('string', { minimum: entry.minimum, maximum: entry.maximum }));
	}

	public isValid(value: string, context: SerializerUpdateContext): Awaitable<boolean> {
		return this.minOrMax(value, value.length, context).success;
	}
}
