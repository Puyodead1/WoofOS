import { Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class UserPrecondition extends Precondition {
	public async run(message: Message) {
		if (!message.member?.voice.channel)
			return this.error({
				message: 'You must be in a voice channel :thinking:'
			});

		if (message.guild?.me?.voice.channel && message.member.voice.channel.id !== message.guild?.me?.voice.channel?.id)
			return this.error({
				message: "I'm already playing music in another channel!"
			});

		return this.ok();
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		MusicCheck: never;
	}
}
