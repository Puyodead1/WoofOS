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

// betterLogging(console);
const program = new Command();

program.option('--disable-music', 'Disable music systems', false);
program.parse(process.argv);

const options = program.opts();

const client = new WoofClient(CLIENT_OPTIONS);
(async () => {
	// client.redis.on('connect', () => console.info(`[Redis] Connection established.`));
	// client.redis.on('ready', () => console.info(`[Redis] Ready!`));
	// client.redis.on('error', (e) => console.error(`[Redis] Error!`, e));
	// client.redis.on('close', () => console.warn(`[Redis] Connection closed.`));
	// client.redis.on('reconnecting', () => console.warn(`[Redis] Reconnecting...`));

	// client.MUSIC_ENABLED = !options.disableMusic;

	// startup
	// try {
	// 	console.log('[Database] Connecting to database...');
	// 	container.db = await DbSet.connect();
	// 	console.info('[Database] Database connection successful');
	// } catch (e) {
	// 	console.error('[Database] Failed to connect to database! This is a fatal error, cannot continue!', e);
	// 	process.exit(1);
	// }

	// if (client.MUSIC_ENABLED) {
	// 	try {
	// 		console.log('[Music] Connecting to music nodes...');
	// 		await client.music.connect();
	// 		console.info('[Music] Music nodes connected');
	// 	} catch (e) {
	// 		console.error(`[Music] Connection to music nodes failed!`, e);
	// 		console.error(`[Music] Music systems will be disabled due to connection error`, e);
	// 		client.MUSIC_ENABLED = false;
	// 	}
	// } else {
	// 	console.info('[Music] Music systems are disabled');
	// }

	try {
		console.log('[Discord] Connecting to Discord...');
		await client.login(TOKEN);
		console.info('[Discord] Connected to Discord');
	} catch (e) {
		console.error('[Discord] Failed to connect to Discord! This is a fatal error, cannot continue!', e);
		process.exit(1);
	}
})();

// process.on('uncaughtException', function (err) {
// 	console.error(`[UncaughtException]`, err);
// });

process.on('SIGTERM', async () => {
	console.log('[Shutdown] Received SIGTERM, shutting down...');
	console.log('[Shutdown] Shutting down Redis...');
	// client.redis.disconnect();
	// try {
	// 	console.log('[Shutdown] Shutting down Music...');
	// 	await client.music.disconnect();
	// } catch (e) {
	// 	console.error(`[Shutdown] Error while disconnecting from Music nodes!`, e);
	// }
	console.log('[Shutdown] Disconnecting from Discord...');
	client.destroy();
	console.log('[Shutdown] Goodbye!');
	process.exit(0);
});

declare global {
	interface Array<T> {
		move(oldIndex: number, newIndex: number): Array<T>;
		shuffle(): Array<T>;
	}
}
