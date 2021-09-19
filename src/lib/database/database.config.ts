import { join } from 'path';
import { Connection, ConnectionOptions, createConnection, getConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { MONGODB_OPTIONS } from '../../config';
import './repositories/ClientRepository';
import './repositories/MemberRepository';
import './repositories/UserRepository';

export const config: ConnectionOptions = {
	type: 'mongodb',
	url: MONGODB_OPTIONS.connectionURI,
	entities: [join(__dirname, 'entities/*Entity.js')],
	migrations: [join(__dirname, 'migrations/*.js')],
	cli: {
		entitiesDir: 'src/lib/database/entities',
		migrationsDir: 'src/lib/database/migrations',
		subscribersDir: 'src/lib/database/subscribers'
	},
	namingStrategy: new SnakeNamingStrategy(),
	logging: true,
	useUnifiedTopology: true
};

export const connect = (): Promise<Connection> => {
	try {
		return Promise.resolve(getConnection());
	} catch {
		return createConnection(config);
	}
};
