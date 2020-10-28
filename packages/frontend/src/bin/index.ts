import express from "express";
import * as path from "path";
import { setupServer } from "bin/server/setupServer";

const app = express();

setupServer(app);

app.use("/", express.static(path.resolve(__dirname, "../build")));

app.listen(3000);
