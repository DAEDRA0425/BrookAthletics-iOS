export function dateFormatter(date) {
  return date.toISOString().split("T")[0];
}
