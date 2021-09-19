import { ApplyOptions } from '@sapphire/decorators';
import type { Args, Command, CommandOptions } from '@sapphire/framework';
import { reply } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import { codeBlock } from '@sapphire/utilities';
import { WoofCommand } from '../../lib/Structures/WoofCommand';

const execAsync = promisify(exec);

@ApplyOptions<CommandOptions>({
	description: 'Execute commands in the terminal, use with EXTREME CAUTION.',
	detailedDescription: 'Times out in 60 seconds by default. This can be changed with --timeout=TIME_IN_MILLISECONDS',
	quotes: [],
	preconditions: ['BotOwner'],
	options: ['timeout'],
	aliases: ['exec'],
	requiredClientPermissions: ['SEND_MESSAGES']
})
export class UserCommand extends WoofCommand {
	public async run(message: Message, args: Args) {
		const cmd = await args.rest('string');

		await reply(message, 'Executing command...');

		const result = await execAsync(cmd, {
			timeout: Number(args.getOption('timeout')) ?? 60000
		}).catch((error) => ({ stdout: null, stderr: error }));
		const output = result.stdout ? `**Output**:\n${codeBlock('prolog', result.stdout)}` : '';
		const outerr = result.stderr ? `**Error:**\n${codeBlock('prolog', result.stderr)}` : '';

		return reply(message, [output, outerr].join('\n') || 'Done, There was no output.');
	}
}
