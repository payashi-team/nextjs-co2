import { ref } from "@firebase/database";
import { onValue } from "firebase/database";
import { useEffect, useState, VFC } from "react";
import Chart from "react-google-charts";
import { db } from "../lib/firebase";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Grid from "@mui/material/Grid";

type SENSOR = {
  X: number;
  Y: number;
  Z: number;
  sensor_timestamp: number;
};

const Dashboard: VFC = () => {
  const [data, setData] = useState<Array<Array<number | Date>> | null>(null);
  const [duration, setDuration] = useState<number>(60); // in minutes
  const [filtered, setFiltered] = useState<Array<Array<number | Date>>>([]);
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
        setData(arr);
      }
    });
  }, []);

  useEffect(() => {
    if (data == null) {
      setFiltered([]);
    } else {
      const flt = data.filter((item) => {
        if (item[0] instanceof Date) {
          const t = new Date().getTime() - item[0].getTime();
          return t < duration * 1000 * 60;
        } else {
          return true;
        }
      });
      setFiltered(flt);
    }
  }, [data, duration]);

  return (
    <>
      <ButtonGroup
        variant="contained"
        aria-label="outlined primary button group"
      >
        <Button onClick={() => setDuration(60 * 24 * 365 * 100)}>all</Button>
        <Button onClick={() => setDuration(60 * 24)}>1 day</Button>
        <Button onClick={() => setDuration(60)}>1 hour</Button>
        <Button onClick={() => setDuration(1)}>1 min</Button>
      </ButtonGroup>
      {data == null ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : filtered.length > 0 ? (
        <Chart
          width={"100vw"}
          height={"80vh"}
          chartType="LineChart"
          data={[["x", "X", "Y", "Z"], ...filtered]}
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
        <Grid
          container
          sx={{ width: "100vw", height: "80vh" }}
          justifyContent="center"
        >
          <Grid item>
            <h1>Oops, Data Not Found</h1>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Dashboard;
