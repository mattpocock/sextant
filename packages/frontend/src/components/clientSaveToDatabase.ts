import { Database } from "@sextant-tools/core";

const LOCAL_STORAGE_KEY = "sextant-localstorage-save";

export const clientSaveToDatabase = (database: Database) => {
  switch (process.env.REACT_APP_DATABASE_SAVE_MODE) {
    case "localStorage":
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(database));
      break;
    default:
      return fetch(`/api/saveToDatabase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(database),
      });
  }
};

export const clientLoadDatabase = (): Promise<Database | undefined> => {
  switch (process.env.REACT_APP_DATABASE_SAVE_MODE) {
    case "localStorage":
      try {
        return Promise.resolve(
          JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "null"),
        );
      } catch (e) {
        return Promise.resolve(undefined);
      }
    default:
      return fetch("/api/getDatabase").then((res) => res.json());
  }
};
