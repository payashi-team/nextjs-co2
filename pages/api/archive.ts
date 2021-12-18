import { db } from "@lib/server-app";

import type { NextApiRequest, NextApiResponse } from "next";
import { Sensor } from "sensor";

export type SensorsRes = {
  vals: Array<Sensor>;
  nextCursor?: number;
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
  let nextCursor: number | undefined;
  if (end - start > 1000 * 60 * 60 * 24) {
    end = start + 1000 * 60 * 60 * 24;
    nextCursor = end;
  } else {
    nextCursor = undefined;
  }

  const snap = await db
    .ref("/SCD30")
    .orderByChild("sensor_timestamp")
    .startAt(start)
    .endAt(end)
    .get()
    .catch((e) => {
      console.error(e);
      res.status(500).json({ error: "Server error" });
    });

  console.log(snap?.exists());

  if (!snap || !snap.exists()) {
    res.status(200).json({
      vals: [],
    });
    return;
  }

  const data = snap.val() as { [key: string]: Sensor };

  const vals: Array<Sensor> = [];
  let i = 0;
  const len = Object.keys(data).length;
  for (const key in data) {
    i++;
    if (i >= len / 1000) {
      vals.push(data[key]);
      i = 0;
    }
  }

  res.status(200).json({ vals, nextCursor });
}
