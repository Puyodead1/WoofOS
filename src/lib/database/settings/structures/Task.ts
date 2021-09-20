import { Piece, PieceOptions } from '@sapphire/framework';
import type { Awaited } from 'discord.js';
import type { PartialResponseValue } from 'lib/database/entities/ScheduleEntity';

export abstract class Task extends Piece {
	/**
	 * The run method to be overwritten in actual Task pieces
	 * @param data The data
	 */
	public abstract run(data: unknown): Awaited<PartialResponseValue | null>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Task {
	export type Options = PieceOptions;
}
