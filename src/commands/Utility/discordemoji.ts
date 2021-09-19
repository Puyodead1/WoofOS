import { ApplyOptions } from '@sapphire/decorators';
import type { Args, CommandOptions } from '@sapphire/framework';
import { reply } from '@skyra/editable-commands';
import type { Message } from 'discord.js';
import { fetch, FetchResultTypes } from '@sapphire/fetch';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { WoofEmbed } from '../../utils';
import { WoofCommand } from '../../lib/Structures/WoofCommand';

interface JsonEmojiResponse {
	id: number;
	title: string;
	slug: string;
	image: string;
	description: string;
	category: number;
	license: string;
	source: string;
	faves: number;
	submitted_by: string;
	width: number;
	height: number;
	filesize: number;
}

interface JsonCategoriesResponse {
	[id: string]: string;
}

@ApplyOptions<CommandOptions>({
	description: 'Searches discordemoji.com for an emoji.',
	requiredClientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
	aliases: ['de'],
	enabled: false
})
export class UserCommand extends WoofCommand {
	public API_URL = 'https://emoji.gg/api/';

	public async run(message: Message, args: Args) {
		const query = await args.pick('string');
		const count = await args.pick('number').catch(() => 10);

		const response = await reply(message, 'Loading...');
		const emojis = await fetch<JsonEmojiResponse[]>(this.API_URL, FetchResultTypes.JSON);
		const categories = await fetch<JsonCategoriesResponse[]>(this.API_URL + '?request=categories', FetchResultTypes.JSON);

		const emojisMapped = emojis.map((emoji) => ({
			...emoji,
			category: categories[emoji.category],
			nsfw: (categories[emoji.category] as unknown as string) === 'NSFW'
		}));

		const matches = emojisMapped.filter(({ nsfw, title }) => {
			if (message.channel.type === 'GUILD_TEXT' && !message.channel.nsfw && nsfw) return false;
			return title.toUpperCase().includes(query.toUpperCase());
		});

		if (!matches.length) return reply(message, `**${message.author.username}**, I didn't find any results  :thinking:`);

		const paginatedMessage = new PaginatedMessage({
			template: WoofEmbed(message, 'Emoji Picker')
		});

		matches
			.sort(() => Math.random() - 0.5)
			.slice(0, count)
			.forEach((emoji) => {
				paginatedMessage.addPageEmbed((embed) => {
					return embed.setImage(emoji.image).setTitle(emoji.title);
				});
			});

		await paginatedMessage.run(response, message.author);
		return response;
	}
}
