import { CLIENT_OPTIONS, TOKEN, DEEZER_ARL } from './config';
import WoofClient from './lib/WoofClient';

const client = new WoofClient(CLIENT_OPTIONS);

client.on('ready', () => {
	console.log('Ready!');
});

(async () => {
	console.log('[Startup] Connecting to Discord...');
	await client.login(TOKEN);
	console.log('[Startup] Connected to Discord');

	console.log(`[Startup] Logging in to Deezer`);
	try {
		await client.deezer.login_via_arl(DEEZER_ARL);
		console.log(`[Startup] Logged in to Deezer`);
	} catch (e) {
		console.error(`[Startup] Failed to login to Deezer`, e);
	}
})();

process.on('SIGTERM', () => {
	console.log('[Shutdown] Received SIGTERM, shutting down...');
	console.log('[Shutdown] Disconnecting from Discord...');
	client.destroy();
	client.login('[Shutdown] Goodbye!');
});
