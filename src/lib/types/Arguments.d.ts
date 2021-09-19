import type { Store, Piece } from '@sapphire/framework';
import type { EqualizerBand, Track } from '@skyra/audio';

declare module '@sapphire/framework' {
	interface ArgType {
		song: Track[];
		store: Store<Piece>;
		piece: Piece;
		eqPreset: EqualizerBand[];
	}
}
