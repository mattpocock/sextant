import express from "express";
import { setupServer } from "./setupServer";

const app = express();

setupServer(app);

app.listen(4000, () => {
  console.log("Listening on port 4000");
});
