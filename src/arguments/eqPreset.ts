import { Argument, ArgumentContext } from '@sapphire/framework';
import { WoofEqualizerBands, WoofEqualizerBand } from '../config';

export class UserArgument extends Argument<WoofEqualizerBand> {
	public async run(parameter: string, context: ArgumentContext) {
		const band = WoofEqualizerBands.find((x) => x.name.toLowerCase() === parameter.toLowerCase());
		if (band) return this.ok(band);
		return this.error({ parameter, identifier: 'arguments:eqPreset', context });
	}
}
