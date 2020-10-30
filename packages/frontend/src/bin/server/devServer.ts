/**
 * Runs a local server for the backend you
 * can use during development
 */
import express from "express";
import { setupServer } from "./setupServer";

const app = express();

setupServer(app);

app.listen(4000, () => {
  console.log("Listening on port 4000");
});
