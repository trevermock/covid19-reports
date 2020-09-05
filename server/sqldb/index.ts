import {createConnection} from 'typeorm';
import {User} from "../api/user/user.model";
import {Role} from "../api/role/role.model";
import {Org} from "../api/org/org.model";

export default createConnection({
  type: 'postgres',
  host: process.env.SQL_HOST || 'localhost',
  port: parseInt(process.env.SQL_PORT || '5432'),
  username: process.env.SQL_USER || 'postgres',
  password: process.env.SQL_PASSWORD || 'postgres',
  database: process.env.SQL_DATABASE || 'dds',
  entities: [User, Role, Org],
  synchronize: true,
  logging: true
});
