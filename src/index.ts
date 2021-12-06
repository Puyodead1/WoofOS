import { CLIENT_OPTIONS, TOKEN } from './config';
import WoofClient from './lib/WoofClient';

const client = new WoofClient(CLIENT_OPTIONS);

client.on('ready', () => {
	console.log('Ready!');
});

(async () => {
	console.log('[Startup] Connecting to Discord...');
	await client.login(TOKEN);
	console.log('[Startup] Connected to Discord');
})();

process.on('SIGTERM', () => {
	console.log('[Shutdown] Received SIGTERM, shutting down...');
	console.log('[Shutdown] Disconnecting from Discord...');
	client.destroy();
	client.login('[Shutdown] Goodbye!');
});
