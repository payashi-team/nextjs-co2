import moment from "moment";
import { Sensor, XSensor } from "sensor";

moment.locale("ja");
export function formatNumber(num: number): string {
  return num.toFixed(2);
}

export function formatDate(date: number): string {
  moment.locale("ja");
  return moment(date).format("HH:mm:ss");
}

export function formatDuration(date: number): string {
  return moment(0).to(moment(date), true);
}

export function filterSensors(sensors: Array<Sensor>): Array<XSensor> {
  let size = sensors.length;
  if (size == 0) return [];
  const duration =
    sensors[size - 1].sensor_timestamp - sensors[0].sensor_timestamp;
  const lapse = Math.max(duration / 100, 1000 * 10);

  sensors = sensors.filter((v, i) => {
    return (
      i % (((size / 1000) | 0) + 1) === 0 &&
      0 < v.co2 &&
      v.co2 < 3000 &&
      -100 < v.temp &&
      v.temp < 100 &&
      0 <= v.humid &&
      v.humid < 100
    );
  });
  size = sensors.length;

  let ret = [] as Array<XSensor>;
  for (let i = 1; i < size; i++) {
    const prev = sensors[i - 1];
    const cur = sensors[i];
    ret.push(prev);
    if (cur.sensor_timestamp - prev.sensor_timestamp > lapse) {
      ret.push({
        sensor_timestamp: prev.sensor_timestamp + lapse / 2,
      });
    }
  }
  ret.push(sensors[size - 1]);
  return ret;
}
