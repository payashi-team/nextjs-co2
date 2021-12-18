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
  if (sensors.length == 0) return [];
  const duration =
    sensors[sensors.length - 1].sensor_timestamp - sensors[0].sensor_timestamp;
  const lapse = Math.max(duration / 100, 1000 * 10);
  sensors = sensors.filter(
    (v, i) => i % (((sensors.length / 1000) | 0) + 1) === 0
  );

  let ret: Array<XSensor> = [];

  for (let i = 1; i < sensors.length; i++) {
    const prev = sensors[i - 1];
    const cur = sensors[i];
    ret.push(prev);
    if (cur.sensor_timestamp - prev.sensor_timestamp > lapse) {
      ret.push({
        sensor_timestamp: prev.sensor_timestamp + lapse / 2,
      });
    }
  }
  ret.push(sensors[sensors.length - 1]);
  return ret;
}
