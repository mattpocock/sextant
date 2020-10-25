import { Database, DatabaseHandler } from "@sextant/core";
import { useEffect, useRef, useState } from "react";
import { getClient, getDatabase, saveDatabase } from "./client";

export const useDatabase = (): DatabaseHandler | undefined => {
  const [database, setDatabase] = useState<DatabaseHandler>();

  const onSave = (database: Database) => {
    setDatabase(new DatabaseHandler(database, onSave));
    return saveDatabase(database);
  };

  useEffect(() => {
    getDatabase().then((res) => {
      onSave(res.database);
    });
  }, []);

  return database;
};
