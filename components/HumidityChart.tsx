import { VFC } from "react";
import Chart from "react-google-charts";
import { Sensor } from "sensor";

type Props = {
  data: Array<Sensor>;
  small: boolean;
  large: boolean;
};

const HumidityChart: VFC<Props> = ({ data, small, large }) => {
  return (
    <Chart
      width={"100%"}
      height={large ? "30vw" : "60vw"}
      chartType="LineChart"
      data={[
        ["Time", "Humidity"],
        ...data.map((sensor) => [
          new Date(sensor.sensor_timestamp),
          sensor.humid,
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
      loader={<div>Loading Humidity</div>}
      options={{
        title: "Humidity",
        hAxis: {
          title: "Time",
        },
        chartArea: small
          ? { width: "100%", height: "80%" }
          : { width: "85%", height: "80%" },
        legend: { position: "none" },
        series: {
          0: { axis: "Humidity", color: "blue" },
        },
      }}
    />
  );
};

export default HumidityChart;
