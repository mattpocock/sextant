import { Database } from "@sextant-tools/core";

export const saveDatabase = (database: Database) => {
  return fetch("/api/saveToDatabase", {
    method: "POST",
    body: JSON.stringify(database),
  }).then((res) => res.json());
};

export const getDatabase = (): Promise<{ database: Database }> =>
  fetch("/api/database").then((res) => res.json());
