import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../utils/getDatabase";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.statusCode = 200;

  const [foundData, database] = await getDatabase();

  res.json(database);
};
