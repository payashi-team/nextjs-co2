import moment from "moment";
import { Sensor } from "sensor";

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

export function filterSensors(sensors: Array<Sensor>): Array<Sensor> {
  return sensors.filter((s) => {
    let ok = true;
    if (s.co2 > 3000 || s.humid > 100 || s.temp > 100) ok = false;
    if (s.co2 <= 0 || s.humid <= 0 || s.temp <= 0) ok = false;
    return ok;
  });
}
