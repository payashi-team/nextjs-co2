import moment from "moment";

export function formatNumber(num: number): string {
  return num.toFixed(2);
}

export function formatDate(date: number): string {
  moment.locale("ja");
  return moment(date).format("HH:mm:ss");
}
