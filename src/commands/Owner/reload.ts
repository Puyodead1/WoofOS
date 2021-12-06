import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions, Piece, Store } from '@sapphire/framework';
import { reply } from '@sapphire/plugin-editable-commands';
import { Stopwatch } from '@sapphire/stopwatch';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	description: 'Reloads a piece or all pieces',
	preconditions: ['BotOwner'],
	requiredClientPermissions: ['SEND_MESSAGES'],
	aliases: ['r']
})
export class UserCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		const content = await this.reloadAny(args);
		return reply(message, content);
	}

	private async reloadAny(args: Args) {
		const everything = await args.pickResult(UserCommand.everything);
		if (everything.success) return this.reloadEverything();

		const store = await args.pickResult('store');
		if (store.success) return this.reloadStore(store.value);

		const piece = await args.pick('piece');
		return this.reloadPiece(piece);
	}

	private async reloadPiece(piece: Piece): Promise<string> {
		const timer = new Stopwatch();
		await piece.reload();
		const type = piece.store.name.slice(0, -1);

		// return t(LanguageKeys.Commands.System.Reload, { type, name: piece.name, time: timer.stop().toString() });
		return 'commands/system:reload';
	}

	private async reloadStore(store: Store<Piece>): Promise<string> {
		const timer = new Stopwatch();
		await store.loadAll();

		// return t(LanguageKeys.Commands.System.ReloadAll, { type: store.name, time: timer.stop().toString() });
		return 'commands/system:reloadAll';
	}

	private async reloadEverything(): Promise<string> {
		const timer = new Stopwatch();

		await this.container.client.stores.map(async (store) => {
			await store.loadAll();
		});

		//return t(LanguageKeys.Commands.System.ReloadEverything, { time: timer.stop().toString() });
		return 'commands/system:reloadEverything';
	}

	private static everything = Args.make((parameter, { argument }) => {
		if (parameter.toLowerCase() === 'everything') return Args.ok('everything');
		return Args.error({ parameter, argument, identifier: 'commands/system:reloadInvalidEverything' });
	});
}
