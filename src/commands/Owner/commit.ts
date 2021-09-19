import { ApplyOptions } from '@sapphire/decorators';
import type { Args, CommandOptions } from '@sapphire/framework';
import { reply } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import { WoofCommand } from '../../lib/Structures/WoofCommand';

const execAsync = promisify(exec);

@ApplyOptions<CommandOptions>({
	description: 'Gets the current commit hash',
	preconditions: ['BotOwner'],
	requiredClientPermissions: ['SEND_MESSAGES']
})
export class UserCommand extends WoofCommand {
	public async run(message: Message, args: Args) {
		const result = await execAsync('git rev-parse HEAD', {
			timeout: Number(args.getOption('timeout')) ?? 60000
		}).catch((error) => ({ stdout: null, stderr: error }));
		if (result.stderr) return message.channel.send(`**Error:**\n\`\`\`${result.stderr}\`\`\``);
		if (result.stdout) return message.channel.send(`${message.client.user!.username} is currently on commit hash: \`\`\`${result.stdout}\`\`\``);
		return reply(message, 'No output x_x');
	}
}
