import { createSextantPlugin } from '@sextant-tools/core';
import { buildBaseTypeFiles } from '@sextant-tools/plugin-typescript';

export const plugin = createSextantPlugin((context) => {
  const file = buildBaseTypeFiles(context.database);

  context.writeFileSync(file.filename, file.content);
});
