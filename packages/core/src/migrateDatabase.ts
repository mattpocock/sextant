import { DatabaseV1 } from './databaseMigrations';
import {
  Database,
  DatabaseV2,
  DatabaseOfUnknownVersion,
  Feature,
} from './types';

export const migrateDatabase = (
  database: DatabaseOfUnknownVersion,
): Database => {
  switch (database.version) {
    case 2:
      return database;
    default:
      return migrations[0](database);
  }
};

const migrations = [
  (database: DatabaseV1): DatabaseV2 => {
    const features: Record<string, Feature> = {};

    Object.values(database.services).forEach((service) => {
      features[service.id] = {
        ...service,
        actors: service.environments,
        scenarios: service.sequences,
      };
    });
    return {
      version: 2,
      features,
    };
  },
];
