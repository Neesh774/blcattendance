import { useEffect, useMemo } from "react";
import { Appointment } from "../utils/types";
import supabase from "../utils/client";
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
import { toast } from "react-hot-toast";
import { dateFilterFn, timeFilterFn } from "../utils/filters";

export default function Schedule({
  appointments,
}: {
  appointments: Appointment[] | undefined;
}) {
  const columns = useMemo<Column[]>(
    () => [
      {
        Header: "Student",
        accessor: (row: any) =>
          row.user.student_first + " " + row.user.student_last,
      },
      {
        Header: "Topic",
        accessor: "topic",
        primary: true,
      },
      {
        Header: "Status",
        accessor: "status",
        Filter: SelectColumnFilter,
        width: 100,
      },
      {
        Header: "Instructor",
        accessor: "instructor",
        Filter: SelectColumnFilter,
        width: 100,
      },
      {
        Header: "Start Time",
        accessor: (row: any) => {
          return dayjs(row.start_time, "HH:mm:ss").format("h:mm A");
        },
        Filter: TimeColumnFilter,
        filter: timeFilterFn,
        width: 60,
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
        width: 60,
      },
      {
        Header: "Hourly",
        accessor: (row: any) => {
          return `$${(row.cost_per_hour as number).toFixed(2)}`;
        },
        width: 60,
      },
    ],
    []
  );
  const appointmentsData = useMemo(() => appointments ?? [], [appointments]);

  return (
    <div className="flex flex-col w-full p-4 gap-4 flex-grow">
      <h1 className="font-display text-3xl font-bold">BLC Appointments</h1>
      {appointments ? (
        <Table
          columns={columns}
          data={appointmentsData}
          defaultFilters={[{ id: "status", value: "scheduled" }]}
          options={{
            link: (header, row) => {
              if (header === "Topic") {
                return `/appointments/${row.original.id}`;
              } else if (header === "Student") {
                return `/students/${row.original.user.id}`;
              }
              return "";
            },
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
