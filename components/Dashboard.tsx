import React, { useEffect, VFC } from "react";
import Chart from "react-google-charts";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Grid from "@mui/material/Grid";
import Head from "next/head";
import useSWR from "swr";
import { SensorsRes } from "pages/api/sensors";
import { Sensor } from "sensor";

const Dashboard: VFC = () => {
  const fetcher = async (url: string) => fetch(url).then((res) => res.json());
  const [sensors, setSensors] = React.useState<Array<Sensor> | null>(null);
  // const [error, setError] = React.useState<string | undefined>(undefined);
  const { data, error } = useSWR<SensorsRes>(`/api/sensors`, fetcher, {
    refreshInterval: 10000,
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
      <Head>
        <title>USAOMOCHI</title>
      </Head>
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
            height={"80vh"}
            chartType="LineChart"
            data={[
              ["x", "X", "Y", "Z"],
              ...sensors.map((sensor) => [
                new Date(sensor.sensor_timestamp),
                sensor.X,
                sensor.Y,
                sensor.Z,
              ]),
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
