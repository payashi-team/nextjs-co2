import { VFC } from "react";
import Chart from "react-google-charts";
import { XSensor } from "sensor";

type Props = {
  data: Array<XSensor>;
  small: boolean;
  large: boolean;
};

const Co2Chart: VFC<Props> = ({ data, large, small }) => {
  return (
    <Chart
      width={"100%"}
      height={large ? "30vw" : "60vw"}
      chartType="LineChart"
      data={[
        ["Time", "CO2"],
        ...data.map((sensor) => [
          new Date(sensor.sensor_timestamp),
          sensor.co2,
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
      loader={<div>Loading CO2 Concentration</div>}
      options={{
        title: "CO2 Concentration",
        hAxis: {
          title: "Time",
        },
        chartArea: small
          ? { width: "100%", height: "80%" }
          : { width: "85%", height: "80%" },
        legend: { position: "none" },
        series: {
          0: { axis: "CO2", color: "red" },
        },
      }}
    />
  );
};

export default Co2Chart;
