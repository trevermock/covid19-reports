import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { AccessRequest } from './api/access-request/access-request.model';
import { Org } from './api/org/org.model';
import { Role } from './api/role/role.model';
import { Roster } from './api/roster/roster.model';
import { User } from './api/user/user.model';

export const ormConfig: PostgresConnectionOptions = {
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
};
