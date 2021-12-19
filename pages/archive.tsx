import React, { useState, VFC } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import useSWR from "swr";
import { Sensor, XSensor } from "sensor";
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
import Typography from "@mui/material/Typography";
import Head from "next/head";
import Link from "next/link";
import { clientFilter} from "@lib/utils";
import QueryBox from "@components/QueryBox";

const getUrls = (start?: Date, end?: Date) => {
  if (!start || !end) {
    return [];
  }
  const s = start.getTime();
  const e = end.getTime();
  const urls = [];
  const duration = 1000 * 60 * 60 * 24;
  for (let i = s; i <= e; i += duration) {
    const j = Math.min(i + duration, e);
    urls.push(`/api/archive?start=${i}&end=${j}`);
  }
  return urls;
};

const Archive: VFC = () => {
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));
  const large = useMediaQuery(theme.breakpoints.up("md"));
  const [query, setQuery] = useState<{
    start?: Date;
    end?: Date;
    ready: boolean;
  }>({
    start: undefined,
    end: undefined,
    ready: false,
  });
  // Promise.all is better, but it doesn't work due to a Firebase's Bug
  // https://groups.google.com/g/firebase-talk/c/VpQms_TnBOw?pli=1
  const fetcher = async (urls: string) => {
    const ret = await urls.split(",").reduce(async (acc, url) => {
      return acc.then((prev) =>
        fetch(url)
          .then((res) => res.json())
          .then((json: { vals: Array<Sensor> }) => [...prev, ...json.vals])
      );
    }, Promise.resolve([] as Array<Sensor>));
    return ret;
  };
  const [sensors, setSensors] = useState<Array<XSensor> | null>(null);
  const { error } = useSWR<Array<Sensor>>(
    () => {
      if (!query.ready) return null;
      const urls = getUrls(query.start, query.end).join(",");
      if (!urls) {
        setQuery({ ...query, ready: false });
        return null;
      }
      return urls;
    },
    fetcher,
    {
      onSuccess: (data) => {
        setSensors(clientFilter(data));
        setQuery({ ...query, ready: false });
      },
      onError: (err) => {
        console.error(err);
        setQuery({ ...query, ready: false });
      },
    }
  );
  if (error) return <div>failed to load</div>;

  return (
    <>
      <Head>
        <title>Archive | USAOMOCHI</title>
      </Head>
      <Container maxWidth="lg">
        <QueryBox
          onSubmit={(start, end) => setQuery({ start, end, ready: true })}
          onReset={() => setSensors(null)}
        />
        {query.ready ? (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : !query.start || !query.end || !sensors ? (
          <Grid container justifyContent="center">
            <Grid item>
              <h1>Query Something</h1>
            </Grid>
          </Grid>
        ) : sensors.length > 0 ? (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Co2Card
                value={
                  sensors.reduce((acc, t) => acc + (t.co2 || 0), 0.0) /
                  sensors.filter((s) => !!s.temp).length
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <HumidityCard
                value={
                  sensors.reduce((acc, t) => acc + (t.humid || 0), 0.0) /
                  sensors.filter((s) => !!s.temp).length
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TemperatureCard
                value={
                  sensors.reduce((acc, t) => acc + (t.temp || 0), 0.0) /
                  sensors.filter((s) => !!s.temp).length
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TimeCard
                value={
                  !query.end || !query.start
                    ? 0
                    : query.end.getTime() - query.start.getTime()
                }
                duration={true}
              />
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
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            justifyContent="center"
          >
            <Grid item>
              <h1>Oops, Data Not Found</h1>
            </Grid>
          </Grid>
        )}
        <Link href="/">
          <a>
            <Typography
              variant="h5"
              component="h5"
              textAlign="end"
              gutterBottom
            >
              → Back to Home
            </Typography>
          </a>
        </Link>
      </Container>
    </>
  );
};

export default Archive;
