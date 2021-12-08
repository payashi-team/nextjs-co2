import { VFC } from "react";
import Chart from "react-google-charts";
import { Sensor } from "sensor";

type Props = {
  data: Array<Sensor>;
  small: boolean;
  large: boolean;
};

const AccChart: VFC<Props> = ({ data, large, small }) => {
  return (
    <Chart
      width={"100%"}
      height={large ? "30vw" : "60vw"}
      chartType="LineChart"
      data={[
        ["Time", "x", "y", "z"],
        ...data.map((sensor) => [
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
      loader={<div>Loading Acceleration</div>}
      options={{
        title: "Acceleration",
        hAxis: {
          title: "Time",
        },
        chartArea: small
          ? { width: "100%", height: "80%" }
          : { width: "85%", height: "80%" },
        legend: { position: "none" },
        series: {
          0: { axis: "Acceleration", color: "green" },
        },
      }}
    />
  );
};

export default AccChart;
