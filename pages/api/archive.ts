import { db } from "@lib/server-app";
import { serverFilter } from "@lib/utils";

import type { NextApiRequest, NextApiResponse } from "next";
import { Sensor } from "sensor";

export type SensorsRes = {
  vals: Array<Sensor>;
};

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SensorsRes | ErrorResponse>
) {
  // const limit = 3000;
  const start = parseInt(req.query.start as string);
  const end = parseInt(req.query.end as string);

  const snap = await db
    .child("SCD30")
    .orderByChild("sensor_timestamp")
    .startAt(start)
    .endAt(end)
    .get()
    .catch((e) => {
      console.error(e);
      res.status(500).json({ error: "Server error" });
      return;
    });

  if (!snap || !snap.exists()) {
    res.status(200).json({
      vals: [],
    });
    return;
  }

  const sensors = Object.values(snap.val()) as Array<Sensor>;
  const vals = serverFilter(sensors);

  res.status(200).json({ vals });
}
