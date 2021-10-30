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

	// startup
	try {
		console.info('[Database] Connecting to database...');
		container.db = await DbSet.connect();
		console.info('[Database] Database connected');
	} catch (e) {
		console.error('[Database] Failed to connect to database! This is a fatal error, cannot continue!');
		process.exit(1);
	}

	if (client.MUSIC_ENABLED) {
		try {
			console.info('[Music] Connecting to music nodes...');
			await client.music.connect();
			console.info('[Music] Music nodes connected');
		} catch (e) {
			console.error(`[Music] Connection to music nodes failed: ${e}`);
			console.error(`[Music] Music systems will be disabled due to connection error`);
			client.MUSIC_ENABLED = false;
		}
	} else {
		console.info('[Music] Music systems are disabled');
	}

	try {
		console.info('[Discord] Connecting to Discord...');
		await client.login(TOKEN);
		console.info('[Discord] Discord connected');
	} catch (e) {
		console.error('[Discord] Failed to connect to Discord! This is a fatal error, cannot continue!');
		process.exit(1);
	}
})();

process.on('uncaughtException', function (err) {
	console.error(err);
});

declare global {
	interface Array<T> {
		move(oldIndex: number, newIndex: number): Array<T>;
		shuffle(): Array<T>;
	}
}
