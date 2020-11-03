import { createSextantPlugin } from '@sextant-tools/core';
import { buildCodeForCreateService } from './buildCreateServiceFunc';

export const plugin = createSextantPlugin((context) => {
  const files = buildCodeForCreateService(context.database);

  files.forEach((file) => {
    context.writeFileSync(file.filename, file.content);
  });
});

export default typescriptPlugin;
