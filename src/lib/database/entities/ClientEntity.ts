import { Entity, BaseEntity, PrimaryColumn, Column } from 'typeorm';
import { CLIENT_ID } from '../../../config';

@Entity('client', { schema: 'public' })
export class ClientEntity extends BaseEntity {
	@PrimaryColumn('varchar', { length: 19, default: process.env.CLIENT_ID })
	public id: string = CLIENT_ID;

	@Column('varchar', { array: true, default: () => 'ARRAY[]::VARCHAR[]' })
	public userBlocklist: string[] = [];

	@Column('varchar', { array: true, default: () => 'ARRAY[]::VARCHAR[]' })
	public guildBlocklist: string[] = [];
}
