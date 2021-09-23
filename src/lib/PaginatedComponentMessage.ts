/*
MIT License

Copyright (c) 2021 Ryzyx

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from 'discord.js';

/**
 * Creates a pagination embed
 * @param {Message} msg
 * @param {MessageEmbed[]} pages
 * @param {MessageButton[]} buttonList
 * @param {number} timeout
 * @returns
 */
const paginatedComponentMessage = async (msg: Message, pages: MessageEmbed[], buttonList: MessageButton[], timeout = 120000) => {
	if (!msg || !msg.channel) throw new Error('Channel is inaccessible.');
	if (!pages) throw new Error('No pages');
	if (!buttonList) throw new Error('No buttons');
	if (buttonList[0].style === 'LINK' || buttonList[1].style === 'LINK') throw new Error('Link buttons are not supported');
	if (buttonList.length !== 2) throw new Error('Not enough buttons');

	let page = 0;

	const row = new MessageActionRow().addComponents(buttonList);
	const curPage = await msg.edit({
		content: null,
		embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
		components: [row]
	});

	const filter = (i: MessageComponentInteraction) => i.customId === buttonList[0].customId || i.customId === buttonList[1].customId;

	const collector = await curPage.createMessageComponentCollector({
		filter,
		time: timeout
	});

	collector.on('collect', async (i) => {
		switch (i.customId) {
			case buttonList[0].customId:
				page = page > 0 ? --page : pages.length - 1;
				break;
			case buttonList[1].customId:
				page = page + 1 < pages.length ? ++page : 0;
				break;
			default:
				break;
		}
		await i.deferUpdate();
		await i.editReply({
			content: null,
			embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
			components: [row]
		});
		collector.resetTimer();
	});

	collector.on('end', () => {
		if (!curPage.deleted) {
			const disabledRow = new MessageActionRow().addComponents(buttonList[0].setDisabled(true), buttonList[1].setDisabled(true));
			curPage.edit({
				content: null,
				embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
				components: [disabledRow]
			});
		}
	});

	return curPage;
};
export { paginatedComponentMessage };
