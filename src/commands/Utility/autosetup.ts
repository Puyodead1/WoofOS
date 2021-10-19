import { reply } from '@skyra/editable-commands';
import type { Message } from 'discord.js';
import { WoofCommand } from '../../lib/Structures/WoofCommand';

export class UserCommand extends WoofCommand {
	public async messageRun(message: Message) {
		return reply(message, '501 - Under construction');
	}
}
