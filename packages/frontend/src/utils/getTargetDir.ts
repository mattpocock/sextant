import * as path from "path";

export const getTargetDir = () => {
  return process.cwd();
};

export const getTargetDatabaseFile = () => {
  return path.resolve(getTargetDir(), "database.json");
};
