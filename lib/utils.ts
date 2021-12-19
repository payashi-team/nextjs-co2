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

export function serverFilter(sensors: Array<Sensor>): Array<Sensor> {
  let compact = [] as Array<Sensor>;
  for (let i = 1; i < sensors.length - 1; i++) {
    const prev = sensors[i - 1];
    const cur = sensors[i];
    const next = sensors[i + 1];
    if (next.sensor_timestamp - prev.sensor_timestamp < 1000 * 10) {
      if (
        Math.abs(cur.co2 - prev.co2) + Math.abs(cur.co2 - next.co2) > 200 ||
        Math.abs(cur.temp - prev.temp) + Math.abs(cur.temp - next.temp) > 5 ||
        Math.abs(cur.humid - prev.humid) + Math.abs(cur.humid - next.humid) > 5
      ) {
        continue;
      }
    }
    if (
      0 < cur.co2 &&
      cur.co2 <= 3000 &&
      -100 < cur.temp &&
      cur.temp < 50 &&
      0 < cur.humid &&
      cur.humid <= 100
    ) {
      compact.push(cur);
    }
  }
  const ret = compact.filter(
    (v, i) => i % (((compact.length / 1000) | 0) + 1) === 0
  );
  return ret;
}

export function clientFilter(sensors: Array<Sensor>): Array<XSensor> {
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
