import { NextApiRequest, NextApiResponse } from "next";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getTargetDir } from "../../utils/getTargetDir";

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.statusCode = 200;

  res.json({ dir: getTargetDir() });
};
