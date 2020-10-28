import express, { Express } from "express";
import bodyParser from "body-parser";
import { getDatabase } from "../utils/getDatabase";
import { saveDatabase } from "../utils/saveDatabase";

export const setupServer = (app: Express) => {
  app.use(bodyParser.json());

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
  });

  app.get("/api/getDatabase", async (req, res) => {
    const [, database] = await getDatabase();

    res.status(200);
    res.json(database);
  });

  app.post("/api/saveToDatabase", async (req, res) => {
    try {
      await saveDatabase(req.body);
      res.status(200);
      res.json({
        success: true,
      });
    } catch (e) {
      console.log(e);
      res.status(500);
      res.json({
        success: false,
      });
    }
  });
};
