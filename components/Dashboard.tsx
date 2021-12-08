import React, { useEffect, VFC } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import useSWR from "swr";
import { SensorsRes } from "pages/api/sensors";
import { Sensor } from "sensor";
import Container from "@mui/material/Container";
import Co2Card from "@components/Co2Card";
import HumidityCard from "@components/HumiditiyCard";
import TemperatureCard from "@components/TemperatureCard";
import TimeCard from "@components/TimeCard";
import Co2Chart from "@components/Co2Chart";
import HumidityChart from "@components/HumidityChart";
import TemperatureChart from "@components/TemperatureChart";
import AccChart from "@components/AccChart";
import { useMediaQuery, useTheme } from "@mui/material";

const Dashboard: VFC = () => {
  const fetcher = async (url: string) => fetch(url).then((res) => res.json());
  const [sensors, setSensors] = React.useState<Array<Sensor> | null>(null);
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
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));
  const large = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Container maxWidth="lg">
      {!sensors ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : sensors.length > 0 ? (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Co2Card value={sensors[sensors.length - 1].co2} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <HumidityCard value={sensors[sensors.length - 1].humid} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TemperatureCard value={sensors[sensors.length - 1].temp} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TimeCard value={sensors[sensors.length - 1].sensor_timestamp} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Co2Chart data={sensors} large={large} small={small} />
          </Grid>
          <Grid item xs={12} md={6}>
            <HumidityChart data={sensors} large={large} small={small} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TemperatureChart data={sensors} large={large} small={small} />
          </Grid>
          <Grid item xs={12} md={6}>
            <AccChart data={sensors} large={large} small={small} />
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          sx={{ width: "100vw", height: "60vh" }}
          justifyContent="center"
        >
          <Grid item>
            <h1>Oops, Data Not Found</h1>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;
