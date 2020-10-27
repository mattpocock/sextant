#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");

const [, , targetDir] = process.argv;

if (!targetDir) {
  console.log(`You must pass a target directory`);
  process.exit(1);
}

execSync(
  `TARGET_DIR=${path.resolve(process.cwd(), targetDir)} npx next start`,
  {
    cwd: path.resolve(__dirname, "../"),
    stdio: "inherit",
  },
);
