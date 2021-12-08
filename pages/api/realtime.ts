import { db } from "@lib/server-app";

import type { NextApiRequest, NextApiResponse } from "next";
import { Sensor } from "sensor";

type SensorsRes = {
  vals: Array<Sensor>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SensorsRes>
) {
  const limit = 100;
  const snap = await db
    .ref("/SCD30")
    .orderByChild("sensor_timestamp")
    .limitToLast(limit)
    .get();
  // .startAfter(Date.now() - 1000 * limit * 2 * 2)

  const data = snap.val() as { [key: string]: Sensor };

  const vals: Array<Sensor> = [];
  for (const key in data) {
    vals.push(data[key]);
  }
  res.status(200).json({ vals });
}
