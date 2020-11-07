import { createSextantPlugin } from '@sextant-tools/core';
import { buildBaseTypeFiles } from '@sextant-tools/plugin-typescript';
import Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

export const plugin = createSextantPlugin((context) => {
  const typeFile = buildBaseTypeFiles(context.database);

  const template = Handlebars.compile(
    fs
      .readFileSync(
        path.resolve(__dirname, '../templates/express-plugin.ts.hbs'),
      )
      .toString(),
  );

  context.writeFileSync('sextant-express.generated.ts', template({}));

  context.writeFileSync(typeFile.filename, typeFile.content);
});
