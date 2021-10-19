import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import { WoofCommand } from '../../lib/Structures/WoofCommand';
import { reply } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	requiredClientPermissions: ['SEND_MESSAGES'],
	description: 'Runs a connection test to Discord.'
})
export class UserCommand extends WoofCommand {
	public async messageRun(message: Message) {
		const msg = await reply(message, 'Ping?');
		return reply(
			message,
			`Pong! (Roundtrip took: \`\`${
				(msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)
			}ms\`\`. Heartbeat: \`\`${Math.round(message.client.ws.ping)}ms\`\`.)`
		);
	}
}
