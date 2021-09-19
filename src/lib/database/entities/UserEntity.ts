import { BaseEntity, Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity('user', { schema: 'public' })
export class UserEntity extends BaseEntity {
	@ObjectIdColumn()
	public id!: string;

	@Column('varchar', { name: 'spotify', nullable: true })
	public spotify?: string | null;
}
