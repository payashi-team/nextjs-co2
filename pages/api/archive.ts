import { db } from "@lib/server-app";

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
  let end = parseInt(req.query.end as string);

  const snap = await db
    .ref("/SCD30")
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
  let compact = [] as Array<Sensor>;
  for (let i = 1; i < sensors.length - 1; i++) {
    const prev = sensors[i - 1];
    const cur = sensors[i];
    const next = sensors[i + 1];
    if (next.sensor_timestamp - prev.sensor_timestamp < 1000 * 10) {
      if (
        Math.abs(cur.co2 - prev.co2) + Math.abs(cur.co2 - next.co2) > 200 ||
        Math.abs(cur.temp - prev.temp) + Math.abs(cur.temp - next.temp) > 5 ||
        Math.abs(cur.humid - prev.humid) + Math.abs(cur.humid - next.humid) > 5
      ) {
        continue;
      }
    }
    if (
      0 < cur.co2 &&
      cur.co2 <= 3000 &&
      -100 < cur.temp &&
      cur.temp < 50 &&
      0 < cur.humid &&
      cur.humid <= 100
    ) {
      compact.push(cur);
    }
  }
  const vals = compact.filter(
    (v, i) => i % (((compact.length / 1000) | 0) + 1) === 0
  );

  res.status(200).json({ vals });
}
