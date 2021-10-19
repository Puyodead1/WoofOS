import { AliasPiece, UserError, ArgumentError, AliasPieceOptions, Args } from '@sapphire/framework';
import type { Awaitable, Guild } from 'discord.js';
import type { GuildEntity } from '../../entities/GuildEntity';
import type { SchemaKey } from '../schema/SchemaKey';

export interface Ok<T> {
	success: true;
	value: T;
}

export interface Err<E> {
	success: false;
	error: E;
}

export type Result<T, E> = Ok<T> | Err<E>;

export type SerializerResult<T> = Result<T, Error>;
export type AsyncSerializerResult<T> = Promise<Result<T, Error>>;

export abstract class Serializer<T> extends AliasPiece {
	/**
	 * Resolves a string into a value.
	 * @param value The value to parsed.
	 * @param context The context for the key.
	 */
	public abstract parse(args: Args, context: SerializerUpdateContext): SerializerResult<T> | AsyncSerializerResult<T>;

	/**
	 * Check whether or not the value is valid.
	 * @param value The value to check.
	 */
	public abstract isValid(value: T, context: SerializerUpdateContext): Awaitable<boolean>;

	/**
	 * The stringify method to be overwritten in actual Serializers
	 * @param data The data to stringify
	 * @param guild The guild given for context in this call
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public stringify(data: T, _context: SerializerUpdateContext): string {
		return String(data);
	}

	/**
	 * Check if two entries are equals.
	 * @param left The left value to check against.
	 * @param right The right value to check against.
	 */
	public equals(left: T, right: T): boolean {
		return left === right;
	}

	/**
	 * Returns a SerializerResult<T> from a Result<T, UserError>.
	 * @param args The Args parser.
	 * @param value The result to handle.
	 */
	protected result(args: Args, value: Result<T, UserError>): SerializerResult<T> {
		return value.success ? value : this.errorFromArgument(args, value.error);
	}

	/**
	 * Returns a successful result.
	 * @param value The value to return.
	 */
	protected ok<T>(value: T): SerializerResult<T> {
		return { success: true, value };
	}

	/**
	 * Returns an erroneous result.
	 * @param error The message of the error.
	 */
	protected error(error: string): SerializerResult<T> {
		return { success: false, error: new Error(error) };
	}

	protected errorFromArgument(args: Args, error: UserError): SerializerResult<T>;
	/**
	 * Returns an erroneous result given an ArgumentError.
	 * @param args The Args parser.
	 * @param error The error returned by the Argument.
	 */
	protected errorFromArgument<E>(args: Args, error: ArgumentError<E>): SerializerResult<T>;
	protected errorFromArgument<E>(args: Args, error: UserError | ArgumentError<E>): SerializerResult<T> {
		return this.error(error.message);
	}

	/**
	 * Check the boundaries of a key's minimum or maximum.
	 * @param length The value to check
	 * @param entry The schema entry that manages the key
	 * @param language The language that is used for this context
	 */
	protected minOrMax(value: T, length: number, { entry: { minimum, maximum, inclusive, name } }: SerializerUpdateContext): SerializerResult<T> {
		if (minimum !== null && maximum !== null) {
			if ((length >= minimum && length <= maximum && inclusive) || (length > minimum && length < maximum && !inclusive)) {
				return this.ok(value);
			}

			if (minimum === maximum) {
				return this.error(inclusive ? 'serializers:minMaxExactlyInclusive' : 'serializers:minMaxExactlyExclusive');
			}

			return this.error(inclusive ? 'serializers:minMaxBothInclusive' : 'serializers:minMaxBothExclusive');
		}

		if (minimum !== null) {
			if ((length >= minimum && inclusive) || (length > minimum && !inclusive)) {
				return this.ok(value);
			}

			return this.error(inclusive ? 'serializers:minMaxMinInclusive' : 'serializers:minMaxMinExclusive');
		}

		if (maximum !== null) {
			if ((length <= maximum && inclusive) || (length < maximum && !inclusive)) {
				return this.ok(value);
			}

			return this.error(inclusive ? 'serializers:minMaxMaxInclusive' : 'serializers:minMaxMaxExclusive');
		}

		return this.ok(value);
	}
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Serializer {
	export type Options = AliasPieceOptions;
}

export interface SerializerUpdateContext {
	entry: SchemaKey;
	entity: GuildEntity;
	guild: Guild;
}
