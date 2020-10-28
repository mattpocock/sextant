import { Database } from "@sextant-tools/core";
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
      services: {},
    },
  ];
};
