import { createSextantPlugin } from '@sextant-tools/core';
import { buildBaseTypeFiles } from '@sextant-tools/plugin-javascript-operations';
import * as fs from 'fs';
import * as path from 'path';

export interface PluginExpressConfig {
  typescriptFileName: string;
  expressFileName: string;
}

export const plugin = createSextantPlugin<PluginExpressConfig>(
  (
    context,
    { expressFileName = 'sextant-jest.generated', typescriptFileName },
  ) => {
    const files = buildBaseTypeFiles(context.database, typescriptFileName);

    files.forEach((file) => {
      context.writeFileSync(file.filename, file.content);
    });

    const jestDeclarationFile = fs
      .readFileSync(
        path.resolve(__dirname, '../templates/jest-plugin.d.ts.hbs'),
      )
      .toString();

    context.writeFileSync(expressFileName + '.d.ts', jestDeclarationFile);

    const jsFile = fs
      .readFileSync(path.resolve(__dirname, '../templates/jest-plugin.js'))
      .toString();

    context.writeFileSync(expressFileName + '.js', jsFile);
  },
);
