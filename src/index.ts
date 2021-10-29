import '@sapphire/plugin-editable-commands/register';
import '@sapphire/plugin-api/register';
import '@sapphire/plugin-logger/register';
import './lib/misc';
import betterLogging from 'better-logging';
import { Command } from 'commander';
import WoofClient from './lib/Structures/WoofClient';
import { container } from '@sapphire/framework';
import { DbSet } from './lib/database/utils/DbSet';
import { CLIENT_OPTIONS, TOKEN } from './config';

betterLogging(console);
const program = new Command();

program.option('--disable-music', 'Disable music systems', false);
program.parse(process.argv);

const options = program.opts();

(async () => {
	const client = new WoofClient(CLIENT_OPTIONS);
	client.MUSIC_ENABLED = !options.disableMusic;
	try {
		console.info('[Database] Connecting to database...');
		container.db = await DbSet.connect();
		console.info('[Database] Database connected');
		if (client.MUSIC_ENABLED) {
			console.info('[Music] Connecting to music nodes...');
			await client.music.connect();
			console.info('[Music] Music nodes connected');
		} else {
			console.info('[Music] Music systems are disabled');
		}

		console.info('[Client] Connecting to Discord...');
		await client.login(TOKEN);
		console.info('[Client] Discord connected');
	} catch (error) {
		console.error(error);
		client.destroy();
		process.exit(1);
	}
})();

declare global {
	interface Array<T> {
		move(oldIndex: number, newIndex: number): Array<T>;
		shuffle(): Array<T>;
	}
}
