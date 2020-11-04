import { createSextantPlugin } from '@sextant-tools/core';
import { buildBaseTypeFiles } from './buildBaseTypeFiles';

export const plugin = createSextantPlugin((context) => {
  const files = buildBaseTypeFiles(context.database);

  files.forEach((file) => {
    context.writeFileSync(file.filename, file.content);
  });
});
