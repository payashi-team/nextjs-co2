import { VFC } from "react";
import Chart from "react-google-charts";
import { Sensor } from "sensor";

type Props = {
  data: Array<Sensor>;
  small: boolean;
  large: boolean;
};

const TemperatureChart: VFC<Props> = ({ data, large, small }) => {
  return (
    <Chart
      width={"100%"}
      height={large ? "30vw" : "60vw"}
      chartType="LineChart"
      data={[
        ["Time", "Temperature"],
        ...data.map((sensor) => [
          new Date(sensor.sensor_timestamp),
          sensor.temp,
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
      loader={<div>Loading Temperature</div>}
      options={{
        title: "Temperature",
        hAxis: {
          title: "Time",
        },
        chartArea: small
          ? { width: "100%", height: "80%" }
          : { width: "85%", height: "80%" },
        legend: { position: "none" },
        series: {
          0: { axis: "Temperature", color: "orange" },
        },
      }}
    />
  );
};

export default TemperatureChart;
