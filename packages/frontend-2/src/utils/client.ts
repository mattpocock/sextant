import { Database } from "@sextant-tools/core";

export const saveDatabase = (database: Database) => {
  return fetch("http://localhost:4000/saveToDatabase", {
    method: "POST",
    body: JSON.stringify(database),
  }).then((res) => res.json());
};

export const getDatabase = (): Promise<{ database: Database }> =>
  fetch("http://localhost:4000/database").then((res) => res.json());
