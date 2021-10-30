import { Piece, PieceOptions } from '@sapphire/framework';
import type { Awaitable } from 'discord.js';

export abstract class Platform extends Piece {}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Platform {
	export type Options = PieceOptions;
}
