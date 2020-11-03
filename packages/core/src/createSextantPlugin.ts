import { flattenDatabase } from './databaseUtilities';
import { Database, FlattenedDatabase } from './types';
import * as fs from 'fs';
import * as path from 'path';
import { getTargetDir } from './fileSaveUtilities';

export interface SextantContext {
  /**
   * The entire database, for your perusal
   */
  database: FlattenedDatabase;
  /**
   * Write to a file. Relative paths will be resolved
   * within the target directory
   */
  writeFileSync: (relativePath: string, contents: string) => void;
}

export type SextantPlugin = (database: Database) => void;

export type SextantPluginImplementation = (
  sextantContext: SextantContext,
) => void;

export const createSextantPlugin = (
  implementation: SextantPluginImplementation,
) =>
  function plugin(database: Database) {
    implementation({
      database: flattenDatabase(database),
      writeFileSync: (relativePath, contents) => {
        const targetDir = getTargetDir();
        fs.writeFileSync(path.resolve(targetDir, relativePath), contents);
      },
    });
  };
