import { db } from "@lib/server-app";

import type { NextApiRequest, NextApiResponse } from "next";
import { Sensor } from "sensor";

export type SensorsRes = {
  acc: Array<Sensor>;
};

// TODO: add DELETE method

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SensorsRes>
) {
  // const start = req.query.start ? parseInt(req.query.start as string) : 0;
  const snap = await db
    .ref("/SCD30")
    .orderByChild("sensor_timestamp")
    .limitToLast(1000)
    .get();
  // .orderByChild("sensor_timestamp")
  // .startAt(start)
  console.log(snap.exists());

  const data = snap.val() as { [key: string]: Sensor };

  const acc: Array<Sensor> = [];
  for (const key in data) {
    acc.push(data[key]);
  }
  res.status(200).json({ acc });
}
