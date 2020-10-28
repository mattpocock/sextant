import * as path from "path";

export const getTargetDir = () => {
  if (process.env.TARGET_DIR) {
    return path.resolve(process.cwd(), process.env.TARGET_DIR as string);
  }
  return process.cwd();
};

export const getTargetDatabaseFile = () => {
  return path.resolve(getTargetDir(), "database.json");
};
