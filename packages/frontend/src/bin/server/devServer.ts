/**
 * Runs a local server for the backend you
 * can use during development
 */
import { ensureConfigFileExists } from '@sextant-tools/core';
import express from 'express';
import { setupServer } from './setupServer';

const app = express();

setupServer(app);

ensureConfigFileExists();

app.listen(4000, () => {
  console.log('Listening on port 4000');
});
