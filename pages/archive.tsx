import React, { useEffect, useState, VFC } from "react";
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

const Archive: VFC = () => {
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));
  const large = useMediaQuery(theme.breakpoints.up("md"));
  const [query, setQuery] = useState<{
    start: Date | null;
    end: Date | null;
    ready: boolean;
  }>({
    start: null,
    end: null,
    ready: false,
  });
  const fetcher = async (url: string) => fetch(url).then((res) => res.json());
  const [sensors, setSensors] = React.useState<Array<Sensor> | null>(null);
  const { data, error } = useSWR<{ vals: Array<Sensor> }>(
    () =>
      query.ready
        ? `/api/archive?start=${query.start?.getTime()}&end=${query.end?.getTime()}`
        : null,
    fetcher
  );
  useEffect(() => {
    if (data?.vals) {
      setSensors(data.vals);
    }
    setQuery({ ...query, ready: false });
  }, [data, query]);
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
                      label="start"
                      value={query.start}
                      onChange={(value) => {
                        setQuery({ ...query, start: value });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <DateTimePicker
                      label="end"
                      value={query.end}
                      onChange={(value) => {
                        setQuery({ ...query, end: value });
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
        <Box my={2}>
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
              Day 01
            </Button>
            <Button>Day 02</Button>
            <Button>Day 03</Button>
            <Button
              onClick={() => {
                setQuery({
                  start: null,
                  end: null,
                  ready: false,
                });
                setSensors(null);
              }}
            >
              Reset
            </Button>
          </ButtonGroup>
        </Box>
        {!sensors && !query.ready ? (
          <Grid container justifyContent="center">
            <Grid item>
              <h1>Query Something</h1>
            </Grid>
          </Grid>
        ) : !sensors ? (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
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
            sx={{ width: "100vw", height: "60vh" }}
            justifyContent="center"
          >
            <Grid item>
              <h1>Oops, Data Not Found</h1>
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
};

export default Archive;
