import React, { useState, VFC } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import useSWR from "swr";
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
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import DateTimePicker from "@mui/lab/DateTimePicker";
import Head from "next/head";
import Link from "next/link";
import { filterSensors } from "@lib/utils";

const getUrls = (start?: Date, end?: Date) => {
  if (!start || !end) {
    return [];
  }
  const s = start.getTime();
  const e = end.getTime();
  if (s > e) {
    console.error("start is after end");
    return [];
  }
  const urls = [];
  for (let i = s; i <= e; i += 1000 * 60 * 60 * 24) {
    const j = Math.min(i + 1000 * 60 * 60 * 24, e);
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
  const fetcher = async (urls: string) => {
    return Promise.all(
      urls
        .split(",")
        .map((url) =>
          fetch(url).then(
            (res) => res.json() as Promise<{ vals: Array<Sensor> }>
          )
        )
    ).then((res) => {
      return res.map((r) => r.vals).flat();
    });
  };
  const [sensors, setSensors] = useState<Array<Sensor> | null>(null);
  const { error } = useSWR<Array<Sensor>>(
    () => (query.ready ? getUrls(query.start, query.end).join(",") : null),
    fetcher,
    {
      onSuccess: (data) => {
        setSensors(filterSensors(data));
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
        <Box my={2}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setQuery({ ...query, ready: true });
            }}
          >
            <Card>
              <CardHeader title="Query Parameters" />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <DateTimePicker
                      mask="____/__/__ __:__"
                      label="start"
                      value={query.start}
                      onChange={(value) => {
                        setQuery({ ...query, start: value || undefined });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <DateTimePicker
                      mask="____/__/__ __:__"
                      label="end"
                      value={query.end}
                      onChange={(value) => {
                        setQuery({ ...query, end: value || undefined });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  p: 2,
                }}
              >
                <Button color="primary" type="submit" variant="contained">
                  Query
                </Button>
              </Box>
            </Card>
          </form>
        </Box>
        <Box
          sx={{
            my: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button
              onClick={() => {
                setQuery({
                  start: new Date(2021, 11, 7, 15),
                  end: new Date(2021, 11, 7, 18),
                  ready: true,
                });
              }}
            >
              12/07
            </Button>
            <Button
              onClick={() => {
                setQuery({
                  start: new Date(2021, 11, 14, 13),
                  end: new Date(2021, 11, 14, 17),
                  ready: true,
                });
              }}
            >
              12/14
            </Button>
            <Button>12/21</Button>
            <Button
              onClick={() => {
                setQuery({
                  start: undefined,
                  end: undefined,
                  ready: false,
                });
                setSensors(null);
              }}
            >
              Reset
            </Button>
          </ButtonGroup>
        </Box>
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
                  sensors.reduce((acc, t) => acc + t.co2, 0.0) / sensors.length
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <HumidityCard
                value={
                  sensors.reduce((acc, t) => acc + t.humid, 0.0) /
                  sensors.length
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TemperatureCard
                value={
                  sensors.reduce((acc, t) => acc + t.temp, 0.0) / sensors.length
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
