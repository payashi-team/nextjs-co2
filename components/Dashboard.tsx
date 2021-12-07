import React, { useEffect, VFC } from "react";
import Chart from "react-google-charts";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Grid from "@mui/material/Grid";
import useSWR from "swr";
import { SensorsRes } from "pages/api/sensors";
import { Sensor } from "sensor";

const Dashboard: VFC = () => {
  const fetcher = async (url: string) => fetch(url).then((res) => res.json());
  const [sensors, setSensors] = React.useState<Array<Sensor> | null>(null);
  // const [error, setError] = React.useState<string | undefined>(undefined);
  const { data, error } = useSWR<SensorsRes>(`/api/sensors`, fetcher, {
    refreshInterval: 2000,
  });
  useEffect(() => {
    if (data?.acc) {
      setSensors(data.acc);
    } else {
      setSensors(null);
    }
  }, [data]);
  if (error) return <div>failed to load</div>;

  return (
    <>
      {!sensors ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : sensors.length > 0 ? (
        <>
          {/* <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button>all</Button>
          </ButtonGroup> */}
          <Chart
            width={"100vw"}
            height={"60vw"}
            chartType="Line"
            data={[
              ["Time", "Tempreture", "CO2"],
              ...sensors.map((sensor) => {
                return [
                  new Date(sensor.sensor_timestamp),
                  // sensor.X,
                  // sensor.Y,
                  // sensor.Z,
                  sensor.temp,
                  sensor.co2,
                ];
              }),
            ]}
            formatters={[
              {
                type: "DateFormat",
                column: 0,
                options: {
                  formatType: "short",
                },
              },
            ]}
            loader={<div>Loading Chart</div>}
            options={{
              chart: {
                title: "CO2, Temperature",
              },
              series: {
                0: { axis: "Temps" },
                1: { axis: "CO2" },
              },
              // hAxis: {
              //   title: "Time",
              // },
              // vAxis: {
              //   title: "co2",
              // },
              axes: {
                y: {
                  Temps: { label: "Temps (Celsius)" },
                  Daylight: { label: "CO2 (ppm)" },
                },
              },
            }}
          />
        </>
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
