import { Database, DatabaseHandler } from "@sextant/core";
import { readFileSync } from "fs";
import { getTargetDatabaseFile } from "./getTargetDir";

export const getDatabase = async (): Promise<[boolean, Database]> => {
  try {
    const database = readFileSync(getTargetDatabaseFile()).toString();

    if (database) {
      return [true, JSON.parse(database)];
    }
  } catch (e) {}
  return [
    false,
    {
      environments: {},
      events: {},
      services: {},
    },
  ];
};
