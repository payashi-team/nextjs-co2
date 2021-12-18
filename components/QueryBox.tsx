import React, { useState, VFC } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import DateTimePicker from "@mui/lab/DateTimePicker";

type Props = {
  onSubmit: (start?: Date, end?: Date) => void;
  onReset: () => void;
};

const QueryBox: VFC<Props> = ({ onSubmit, onReset }) => {
  const [query, setQuery] = useState<{
    start?: Date;
    end?: Date;
  }>({});
  return (
    <React.Fragment>
      <Box my={2}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(query.start, query.end);
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
                    value={query.start || null}
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
                    value={query.end || null}
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
              const start = new Date(2021, 11, 7, 15);
              const end = new Date(2021, 11, 7, 18);
              setQuery({ start, end });
              onSubmit(start, end);
            }}
          >
            12/07
          </Button>
          <Button
            onClick={() => {
              const start = new Date(2021, 11, 14, 13);
              const end = new Date(2021, 11, 14, 17);
              setQuery({ start, end });
              onSubmit(start, end);
            }}
          >
            12/14
          </Button>
          <Button>12/21</Button>
          <Button
            onClick={() => {
              setQuery({});
              onReset();
            }}
          >
            Reset
          </Button>
        </ButtonGroup>
      </Box>
    </React.Fragment>
  );
};

export default QueryBox;
