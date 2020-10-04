import { Database, DatabaseHandler } from "@service-gui/core";
import { readFileSync } from "fs";
import { getTargetDatabaseFile } from "./getTargetDir";

export const getDatabase = async (): Promise<[boolean, Database]> => {
  const database = readFileSync(getTargetDatabaseFile()).toString();

  if (database) {
    return [true, JSON.parse(database)];
  }
  return [
    false,
    {
      environments: {},
      events: {},
      services: {},
    },
  ];
};
