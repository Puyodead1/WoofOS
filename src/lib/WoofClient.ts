import { SapphireClient } from '@sapphire/framework';
import type { ClientOptions } from 'discord.js';

export default class WoofClient extends SapphireClient {
	constructor(options: ClientOptions) {
		super(options);
	}
}
