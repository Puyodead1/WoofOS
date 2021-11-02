import type { Store, Piece } from '@sapphire/framework';
import type { Track } from '@skyra/audio';
import type { WoofEqualizerBand } from '../../config';

declare module '@sapphire/framework' {
	interface ArgType {
		song: Track[];
		store: Store<Piece>;
		piece: Piece;
		eqPreset: WoofEqualizerBand;
	}
}
