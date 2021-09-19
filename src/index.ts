import '@sapphire/plugin-editable-commands/register';
import '@sapphire/plugin-api/register';
import '@sapphire/plugin-logger/register';
import WoofClient from './lib/Structures/WoofClient';
import { options as coloretteOptions } from 'colorette';
import { container } from '@sapphire/framework';
import { DbSet } from './lib/database/utils/DbSet';
import { CLIENT_OPTIONS, TOKEN } from './config';

coloretteOptions.enabled = true;

const client = new WoofClient(CLIENT_OPTIONS);

const main = async () => {
	try {
		container.db = await DbSet.connect();
		await client.music.connect();
		await client.login(TOKEN);
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

main();

declare global {
	interface Array<T> {
		move(oldIndex: number, newIndex: number): Array<T>;
		shuffle(): Array<T>;
	}
}

Array.prototype.move = function (oldIndex: number, newIndex: number) {
	if (newIndex >= this.length) {
		var k = newIndex - this.length + 1;
		while (k--) {
			this.push(undefined as any);
		}
	}
	this.splice(newIndex, 0, this.splice(oldIndex, 1)[0]);
	return this;
};

Array.prototype.shuffle = function () {
	let currentIndex = this.length,
		randomIndex;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[this[currentIndex], this[randomIndex]] = [this[randomIndex], this[currentIndex]];
	}

	return this;
};
