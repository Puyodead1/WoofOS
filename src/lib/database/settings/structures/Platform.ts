import { Piece, PieceOptions } from '@sapphire/framework';
import type { Awaited } from 'discord.js';

export abstract class Platform extends Piece {
	/**
	 * The run method to be overwritten in actual Platform pieces
	 * @param data The data
	 */
	// TODO: add a proper return type
	public abstract getUser(id: string, options?: Platform.Options): Awaited<any | null>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Platform {
	export type Options = PieceOptions;
}
