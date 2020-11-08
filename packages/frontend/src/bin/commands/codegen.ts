import { getDatabase } from '../utils/getDatabase';
import { saveDatabase } from '../utils/saveDatabase';

export const codegen = async (targetDir: string) => {
  process.env.TARGET_DIR = targetDir;
  const [, database] = await getDatabase();

  await saveDatabase(database);

  console.log(`Codegen complete!`);
};
