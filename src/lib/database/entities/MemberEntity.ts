import { Entity, BaseEntity, PrimaryColumn, Column } from 'typeorm';

@Entity('member', { schema: 'public' })
export class MemberEntity extends BaseEntity {
	@PrimaryColumn('varchar', { length: 19 })
	public guildId!: string;

	@PrimaryColumn('varchar', { length: 19 })
	public userId!: string;
}
