import express from 'express';
import * as path from 'path';
import open from 'open';
import { ensureConfigFileExists } from '@sextant-tools/core';
import { setupServer } from '../server/setupServer';

/**
 * Runs the Sextant GUI
 */
export const run = (targetDir: string, port: number = 3000) => {
  const app = express();
  process.env.TARGET_DIR = targetDir;

  ensureConfigFileExists();

  setupServer(app);

  app.use('/', express.static(path.resolve(__dirname, '../../build')));

  app.listen(port, () => {
    open(`http://localhost:${port}`);
  });
};
