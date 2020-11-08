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
    { expressFileName = 'sextant-express.generated.ts', typescriptFileName },
  ) => {
    const typeFile = buildBaseTypeFiles(context.database);

    const template = Handlebars.compile(
      fs
        .readFileSync(
          path.resolve(__dirname, '../templates/express-plugin.ts.hbs'),
        )
        .toString(),
    );

    context.writeFileSync(expressFileName, template({}));

    context.writeFileSync(
      typescriptFileName || typeFile.filename,
      typeFile.content,
    );
  },
);
