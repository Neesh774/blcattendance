import dayjs from "dayjs";
import { Row } from "react-table";

export function dateFilterFn(rows: Row[], id: any, filterValue: string) {
  const type = filterValue[0];
  const date = filterValue.slice(1);
  if (type === "=") {
    return rows.filter((row) => {
      const rowDate = row.values[id];
      return dayjs(rowDate, "MMM D, 'YY").isSame(dayjs(date, "YYYY-MM-DD"));
    });
  } else if (type === "<") {
    return rows.filter((row) => {
      const rowDate = row.values[id];
      return dayjs(rowDate, "MMM D, 'YY").isBefore(dayjs(date, "YYYY-MM-DD"));
    });
  }
  return rows.filter((row) => {
    const rowDate = row.values[id];
    return dayjs(rowDate, "MMM D, 'YY").isAfter(dayjs(date, "YYYY-MM-DD"));
  });
}

dateFilterFn.autoRemove = (val: string) => !val;

export function timeFilterFn(rows: Row[], id: any, filterValue: string) {
  const type = filterValue[0];
  const time = filterValue.slice(1);
  if (type === "=") {
    return rows.filter((row) => {
      const rowTime = row.values[id];
      return dayjs(rowTime, "h:mm A").isSame(dayjs(time, "HH:mm"));
    });
  } else if (type === "<") {
    return rows.filter((row) => {
      const rowTime = row.values[id];
      return dayjs(rowTime, "h:mm A").isBefore(dayjs(time, "HH:mm"));
    });
  }
  return rows.filter((row) => {
    const rowTime = row.values[id];
    return dayjs(rowTime, "h:mm A").isAfter(dayjs(time, "HH:mm"));
  });
}