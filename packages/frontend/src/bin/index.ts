#!/usr/bin/env node

import { program } from 'commander';
import { codegen } from './commands/codegen';
import { run } from './commands/run';

program
  .description('Start the sextant server pointing at a target directory.')
  .option(
    '-p --port',
    'Your chosen port to run the app. Defaults to 3000',
    '3000',
  )
  .action((event, [targetDir, port]) => {
    run(targetDir, port);
  });

program
  .command('codegen <target-dir>')
  .description(
    'Generate code from your plugins without opening the Sextant GUI',
  )
  .action((event, { args }) => {
    codegen(args[0]);
  });

program.parse(process.argv);
