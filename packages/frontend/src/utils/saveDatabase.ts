import { Database } from "@service-gui/core";
import { writeFileSync } from "fs";
import { getTargetDatabaseFile } from "./getTargetDir";

export const saveDatabase = async (database: Database): Promise<Database> => {
  writeFileSync(getTargetDatabaseFile(), JSON.stringify(database, null, 2));
  return Promise.resolve(database);
};
