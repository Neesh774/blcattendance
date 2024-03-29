import { useMemo } from "react";
import { Appointment } from "../utils/types";
import { Row } from "react-table";
import type { Column } from "react-table";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";
import Table from "./base/Table";
import {
  DateColumnFilter,
  SelectColumnFilter,
  TimeColumnFilter,
} from "./Filters";

function dateFilterFn(rows: Row[], id: any, filterValue: string) {
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

function timeFilterFn(rows: Row[], id: any, filterValue: string) {
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

dateFilterFn.autoRemove = (val: string) => !val;

export default function UserAppointments({
  appointments,
}: {
  appointments: Appointment[] | undefined;
}) {
  const columns = useMemo<Column[]>(
    () => [
      {
        Header: "Topic",
        accessor: "topic",
      },
      {
        Header: "Status",
        accessor: "status",
        Filter: SelectColumnFilter,
      },
      {
        Header: "Instructor",
        accessor: "instructor",
        Filter: SelectColumnFilter,
      },
      {
        Header: "Start Time",
        accessor: (row: any) => {
          return dayjs(row.start_time, "HH:mm:ss").format("h:mm A");
        },
        Filter: TimeColumnFilter,
        filter: timeFilterFn,
      },
      {
        Header: "Date",
        accessor: (row: any) => {
          return dayjs(row.date).format("MMM D, 'YY");
        },
        Filter: DateColumnFilter,
        filter: dateFilterFn,
        sortType: (rowA, rowB, columnId) => {
          const a = rowA.values[columnId];
          const b = rowB.values[columnId];
          return dayjs(a, "MMM D, 'YY").isBefore(dayjs(b, "MMM D, 'YY"))
            ? 1
            : -1;
        },
      },
    ],
    []
  );
  const appointmentsData = useMemo(() => appointments ?? [], [appointments]);

  return (
    <div className="flex flex-col w-full p-4 gap-4 flex-grow">
      {appointments ? (
        <Table
          columns={columns}
          data={appointmentsData}
          options={{
            link: (header, row) => `/appointments/${row.original.id}`,
          }}
        />
      ) : (
        <div className="flex w-full h-[30%] justify-center items-center">
          <Loader2 className="mx-auto w-8 h-8 text-red-700 animate-spin" />
        </div>
      )}
    </div>
  );
}
