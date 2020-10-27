import { Database, flattenDatabase } from "@sextant/core";
import { buildCodeForCreateService } from "@sextant/adapter-typescript";
import { writeFileSync } from "fs";
import { getTargetDatabaseFile, getTargetDir } from "./getTargetDir";
import * as path from "path";

export const saveDatabase = async (database: Database): Promise<Database> => {
  writeFileSync(getTargetDatabaseFile(), JSON.stringify(database, null, 2));

  const filesToWrite = buildCodeForCreateService(flattenDatabase(database));

  filesToWrite.forEach((file) => {
    writeFileSync(file.filename, file.content);
  });

  return Promise.resolve(database);
};
