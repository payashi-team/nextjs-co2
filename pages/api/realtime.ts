import { db } from "@lib/server-app";
import { serverFilter } from "@lib/utils";

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
    .ref("SCD30")
    .orderByChild("sensor_timestamp")
    .startAfter(Date.now() - 1000 * limit * 2 * 2)
    .limitToLast(limit)
    .get();

  const sensors = Object.values(snap.val()) as Array<Sensor>;
  const vals = serverFilter(sensors);

  res.status(200).json({ vals });
}
