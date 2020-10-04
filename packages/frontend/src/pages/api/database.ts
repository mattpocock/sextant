import { getDatabase } from "../../utils/getDatabase";
export default async (req, res) => {
  res.statusCode = 200;

  const [foundData, database] = await getDatabase();

  res.json({ database, foundData });
};
