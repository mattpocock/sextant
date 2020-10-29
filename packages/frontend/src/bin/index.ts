#!/usr/bin/env node

import express from "express";
import * as path from "path";
import { setupServer } from "./server/setupServer";
import open from "open";

const app = express();

const [, , targetDir] = process.argv;

if (!targetDir) {
  console.log("You must pass a target directory. For instance: sextant ./");
  process.exit(1);
}

process.env.TARGET_DIR = targetDir;

setupServer(app);

app.use("/", express.static(path.resolve(__dirname, "../build")));

app.listen(3000, () => {
  open(`http://localhost:3000`);
});
