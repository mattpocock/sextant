import {
  Database,
  executeConfigFile,
  getTargetDatabaseFile,
  getTargetDir,
  ensureConfigFileExists,
} from '@sextant-tools/core';
import { writeFileSync } from 'fs';
import * as fsExtra from 'fs-extra';

export const saveDatabase = async (database: Database): Promise<Database> => {
  const targetDir = getTargetDir();

  fsExtra.ensureDirSync(targetDir);

  writeFileSync(getTargetDatabaseFile(), JSON.stringify(database, null, 2));

  ensureConfigFileExists();

  executeConfigFile(database);

  return Promise.resolve(database);
};
