import { Database, DatabaseHandler } from "@service-gui/core";

export const saveDatabase = (database: Database) => {
  return fetch("/api/saveToDatabase", {
    method: "POST",
    body: JSON.stringify(database),
  }).then((res) => res.json());
};

export const getDatabase = (): Promise<{ database: Database }> =>
  fetch("/api/database").then((res) => res.json());

export class Client {
  database: DatabaseHandler;
  constructor(database: Database) {
    this.database = new DatabaseHandler(database, saveDatabase);
  }
}

export const getClient = async () => {
  const database = (await getDatabase()).database;
  const client = DatabaseHandler();

  return client.database;
};
