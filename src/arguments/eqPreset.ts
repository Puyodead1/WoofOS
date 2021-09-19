import { Argument, ArgumentContext } from '@sapphire/framework';
import type { EqualizerBand } from '@skyra/audio';
import { WoofEqualizerBands } from '../config';

export class UserArgument extends Argument<EqualizerBand[]> {
	public async run(parameter: string, context: ArgumentContext) {
		const band = WoofEqualizerBands[parameter.toLowerCase()];
		if (band) return this.ok(band);
		return this.error({ parameter, identifier: 'arguments:eqPreset', context });
	}
}
