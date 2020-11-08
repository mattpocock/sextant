import {
  Database,
  DatabaseOfUnknownVersion,
  getTargetDatabaseFile,
  migrateDatabase,
} from '@sextant-tools/core';
import { readFileSync } from 'fs';

export const getDatabase = async (): Promise<[boolean, Database]> => {
  try {
    const database: DatabaseOfUnknownVersion = JSON.parse(
      readFileSync(getTargetDatabaseFile()).toString(),
    );

    if (database) {
      return [true, migrateDatabase(database)];
    }
  } catch (e) {}
  return [
    false,
    {
      version: 2,
      features: {},
    },
  ];
};
