import { ref } from "@firebase/database";
import { onValue } from "firebase/database";
import { useEffect, useState, VFC } from "react";
import Chart from "react-google-charts";
import { db } from "../lib/firebase";

type SENSOR = {
  X: number;
  Y: number;
  Z: number;
  sensor_timestamp: number;
};

const MAX_SENSOR_DATA = 50;

const Dashboard: VFC = () => {
  const [data, setData] = useState<Array<Array<number | Date>>>([]);
  const accRef = ref(db, "/IMU_LSM6DS3");
  useEffect(() => {
    onValue(accRef, (snapshot) => {
      const obj = snapshot.val() as Record<string, SENSOR>;
      if (obj) {
        let arr = [] as Array<Array<number | Date>>;
        for (const itr in obj) {
          arr.push([
            new Date(obj[itr].sensor_timestamp),
            obj[itr].X,
            obj[itr].Y,
            obj[itr].Z,
          ]);
        }
        const len = arr.length;
        if (len > MAX_SENSOR_DATA) {
          arr = arr.slice(len - MAX_SENSOR_DATA);
        }
        setData(arr);
      }
    });
  }, []);

  return (
    <>
      {data.length > 0 ? (
        <Chart
          width={"100vw"}
          height={"80vh"}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={[["x", "X", "Y", "Z"], ...data]}
          formatters={[
            {
              type: "DateFormat",
              column: 0,
              options: {
                formatType: "short",
              },
            },
          ]}
          options={{
            hAxis: {
              title: "Time",
            },
            vAxis: {
              title: "Acceleration",
            },
            series: {
              0: { curveType: "function" },
              1: { curveType: "function" },
              2: { curveType: "function" },
            },
          }}
        />
      ) : (
        <>data not found</>
      )}
    </>
  );
};

export default Dashboard;
