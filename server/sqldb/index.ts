import { TlsOptions } from 'tls';
import { createConnection } from 'typeorm';
import { ormConfig } from '../ormconfig';

let ssl: TlsOptions | undefined;

if (process.env.SQL_CERT) {
  ssl = {
    rejectUnauthorized: false,
    ca: process.env.SQL_CERT,
  };
}

export default createConnection({
  ...ormConfig,
  ssl,
});
