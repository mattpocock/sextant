#!/usr/bin/env node

import express from 'express';
import * as path from 'path';
import { setupServer } from './server/setupServer';
import open from 'open';
import { program } from 'commander';
import { ensureConfigFileExists } from '@sextant-tools/core';

program
  .description('Start the sextant server pointing at a target directory.')
  .option(
    '-p --port',
    'Your chosen port to run the app. Defaults to 3000',
    '3000',
  )
  .action((event, [targetDir, port]) => {
    const app = express();
    process.env.TARGET_DIR = targetDir;

    ensureConfigFileExists();

    setupServer(app);

    app.use('/', express.static(path.resolve(__dirname, '../build')));

    app.listen(port || 3000, () => {
      open(`http://localhost:${port || 3000}`);
    });
  });

program.parse(process.argv);
