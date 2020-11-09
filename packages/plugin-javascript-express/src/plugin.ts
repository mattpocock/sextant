import { createSextantPlugin } from '@sextant-tools/core';
import { buildBaseTypeFiles } from '@sextant-tools/plugin-javascript-operations';
import Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

export interface PluginExpressConfig {
  typescriptFileName: string;
  expressFileName: string;
}

export const plugin = createSextantPlugin<PluginExpressConfig>(
  (
    context,
    { expressFileName = 'sextant-express.generated', typescriptFileName },
  ) => {
    const files = buildBaseTypeFiles(context.database, typescriptFileName);

    files.forEach((file) => {
      context.writeFileSync(file.filename, file.content);
    });

    const declarationFileTemplate = Handlebars.compile(
      fs
        .readFileSync(
          path.resolve(__dirname, '../templates/express-plugin.d.ts.hbs'),
        )
        .toString(),
    );

    context.writeFileSync(
      expressFileName + '.d.ts',
      declarationFileTemplate({}),
    );

    const jsFileTemplate = fs
      .readFileSync(path.resolve(__dirname, '../templates/express-plugin.js'))
      .toString();

    context.writeFileSync(expressFileName + '.js', jsFileTemplate);
  },
);
