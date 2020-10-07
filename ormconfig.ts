import { TlsOptions } from 'tls';
import { ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { User } from './server/api/user/user.model';
import { Role } from './server/api/role/role.model';
import { Org } from './server/api/org/org.model';
import { Roster } from './server/api/roster/roster.model';
import { AccessRequest } from './server/api/access-request/access-request.model';

let ssl: TlsOptions | undefined;

if (process.env.SQL_CERT) {
  ssl = {
    rejectUnauthorized: false,
    ca: process.env.SQL_CERT,
  };
}

const config: ConnectionOptions = {
  type: 'postgres',
  host: process.env.SQL_HOST || 'localhost',
  port: parseInt(process.env.SQL_PORT || '5432'),
  username: process.env.SQL_USER || 'postgres',
  password: process.env.SQL_PASSWORD || 'postgres',
  database: process.env.SQL_DATABASE || 'dds',
  entities: [User, Role, Org, Roster, AccessRequest],
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: (process.env.NODE_ENV === 'development' && process.env.SYNC_DATABASE === 'true'),
  logging: false,
  migrationsTableName: 'migration',
  migrations: ['server/migration/*.ts'],
  cli: {
    migrationsDir: 'server/migration',
  },
  ssl,
};

module.exports = config;
export default config;
