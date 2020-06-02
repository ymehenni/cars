import { NextApiRequest, NextApiResponse } from "next";
import { getModels } from "../../database/getModels";
import { getAsString } from "../../getAsString";

export default async function Models(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const make = getAsString(req.query.make);
  const models = await getModels(make);
  res.json(models);
}
