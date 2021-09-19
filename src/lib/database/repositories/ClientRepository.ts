import { EntityRepository, Repository, FindOneOptions } from 'typeorm';
import { ClientEntity } from '../entities/ClientEntity';

@EntityRepository(ClientEntity)
export class ClientRepository extends Repository<ClientEntity> {
	public async ensure(options?: FindOneOptions<ClientEntity>) {
		return (await this.findOne(process.env.CLIENT_ID, options)) ?? new ClientEntity();
	}
}
