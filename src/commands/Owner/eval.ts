import { ApplyOptions } from '@sapphire/decorators';
import type { Args, CommandOptions } from '@sapphire/framework';
import { reply, send } from '@sapphire/plugin-editable-commands';
import { Stopwatch } from '@sapphire/stopwatch';
import { Type } from '@sapphire/type';
import { codeBlock, isThenable } from '@sapphire/utilities';
import type { Message } from 'discord.js';
import { inspect } from 'util';
import { WoofCommand } from '../../lib/Structures/WoofCommand';

@ApplyOptions<CommandOptions>({
	description: 'Evaluates arbitrary Javascript. Reserved for bot owner.',
	quotes: [],
	preconditions: ['BotOwner'],
	flags: ['async', 'hidden', 'showHidden', 'silent', 's'],
	options: ['depth'],
	requiredClientPermissions: ['SEND_MESSAGES']
})
export class UserCommand extends WoofCommand {
	public async run(message: Message, args: Args) {
		const code = await args.rest('string');

		const { result, success, type, time } = await this.eval(message, code, {
			async: args.getFlags('async'),
			depth: Number(args.getOption('depth')) ?? 0,
			showHidden: args.getFlags('hidden', 'showHidden')
		});

		const output = success ? `**Output:** ${codeBlock('js', result)}` : `**Error:** ${codeBlock('bash', result)}`;
		if (args.getFlags('silent', 's')) return null;

		const typeFooter = `**Type**: ${codeBlock('typescript', type)}`;

		if (output.length > 2000) {
			return send(message, {
				content: `**Output:**\nOutput was too long... sent the result as a file.\n\n${time}\n${typeFooter}`,
				files: [{ attachment: Buffer.from(result), name: 'output.txt' }]
			});
		}

		return reply(message, `${output}\n${time}\n${typeFooter}`);
	}

	private async eval(message: Message, code: string, flags: { async: boolean; depth: number; showHidden: boolean }) {
		code = code.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
		if (flags.async) code = `(asyn c() => {\n${code}\n})();`;

		const stopwatch = new Stopwatch();

		const msg = message;

		let success = true;
		let result = null;
		let syncTime,
			asyncTime = null;

		try {
			result = eval(code);
		} catch (error: any) {
			if (!syncTime) syncTime = stopwatch.toString();
			if (error && error.stack) {
				message.client.logger.error(error);
			}

			result = error;
			success = false;
		}

		syncTime = stopwatch.toString();

		const type = new Type(result).toString();
		if (isThenable(result)) {
			stopwatch.restart();
			result = await result;
			asyncTime = stopwatch.toString();
		}

		stopwatch.stop();

		if (typeof result !== 'string') {
			result = inspect(result, {
				depth: flags.depth,
				showHidden: flags.showHidden
			});
		}

		return {
			result,
			success,
			type,
			time: this.formatTime(syncTime, asyncTime)
		};
	}

	formatTime(syncTime: string, asyncTime: string | null) {
		return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`;
	}
}
