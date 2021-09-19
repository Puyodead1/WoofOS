import { EntityRepository, Repository, FindOneOptions } from 'typeorm';
import { MemberEntity } from '../entities/MemberEntity';

@EntityRepository(MemberEntity)
export class MemberRepository extends Repository<MemberEntity> {
	public async ensure(userId: string, guildId: string, options: FindOneOptions<MemberEntity> = {}) {
		const previous = await this.findOne({ where: { userId, guildId }, ...options });
		if (previous) return previous;

		const data = new MemberEntity();
		data.userId = userId;
		data.guildId = guildId;
		return data;
	}
}
