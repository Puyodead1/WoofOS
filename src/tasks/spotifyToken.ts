import { PartialResponseValue, ResponseType } from '../lib/database/entities/ScheduleEntity';
import { Task } from '../lib/database/settings/structures/Task';

export class UserTask extends Task {
	public async run(): Promise<PartialResponseValue | null> {
		await this.container.client
			.setupSpotify()
			.then((expires_in) => {
				this.container.logger.info('[Spotify] Token refreshed');
				// schedule the next run
				setTimeout(() => this.run(), expires_in * 1000);

				// print to console when the next run is scheduled
				const seconds = (expires_in - 60) * 1000;
				const futureDate = new Date(new Date().getTime() + seconds);
				this.container.logger.info(`[Spotify] Next token refresh at ${futureDate.toLocaleString()}`);
			})
			.catch((e) => {
				this.container.logger.error(`[Spotify] Failed to refresh token: ${e}`);
				this.container.logger.error(`[Spotify] Token refresh retry in 60 seconds`);
				// schedule a retry in 1 minute
				setTimeout(() => this.run(), 60 * 1000);
			});
		return { type: ResponseType.Finished };
	}
}
