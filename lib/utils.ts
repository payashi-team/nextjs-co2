import moment from "moment";

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
