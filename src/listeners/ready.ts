import type { ListenerOptions, PieceContext } from '@sapphire/framework';
import { Listener, Store } from '@sapphire/framework';
import { blue, gray, green, magenta, magentaBright, white, yellow } from 'colorette';
import { isDEV } from '../config';

export class UserEvent extends Listener {
	private readonly style = isDEV ? yellow : blue;

	public constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, {
			...options,
			once: true
		});
	}

	public async run() {
		this.printBanner();
		this.printStoreDebugInformation();

		// const taskStore = this.container.client.stores.get('tasks');

		// if (taskStore.has('spotifyToken')) {
		// 	const task = taskStore.get('spotifyToken');
		// 	task!.run(null);
		// }
	}

	private printBanner() {
		const success = green('+');

		const llc = isDEV ? magentaBright : white;
		const blc = isDEV ? magenta : blue;

		const line01 = llc('');
		const line02 = llc('');
		const line03 = llc('');

		// Offset Pad
		const pad = ' '.repeat(7);

		console.log(
			String.raw`
${line01} ${pad}${blc('Woof 2.0.0')}
${line02} ${pad}[${success}] Gateway
${line03}${isDEV ? ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}
		`.trim()
		);
	}

	private printStoreDebugInformation() {
		const { client, logger } = this.container;
		const stores = [...client.stores.values()];
		const last = stores.pop()!;

		for (const store of stores) logger.info(this.styleStore(store, false));
		logger.info(this.styleStore(last, true));
	}

	private styleStore(store: Store<any>, last: boolean) {
		return gray(`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${store.name}.`);
	}
}
