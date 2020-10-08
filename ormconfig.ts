import { ormConfig } from './server/ormconfig';

// This needs to use module.exports for the typeorm scripts to understand it.
module.exports = {
  ...ormConfig,
  migrations: ['server/migration/*.ts'],
  cli: {
    migrationsDir: 'server/migration',
  },
};
