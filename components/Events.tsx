import { useEffect, useMemo } from "react";
import { Event, User } from "../utils/types";
import { Column } from "react-table";
import {
  DateColumnFilter,
  SelectColumnFilter,
  TimeColumnFilter,
} from "./Filters";
import supabase from "../utils/client";
import { Loader2 } from "lucide-react";
import Table from "./base/Table";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import getStudentGrade from "../utils/getStudentGrade";
import { dateFilterFn, timeFilterFn } from "../utils/filters";

export default function Events({ events }: { events: Event[] | undefined }) {
  const columns = useMemo<Column[]>(
    () => [
      {
        Header: "Topic",
        accessor: "topic",
        primary: true,
      },
      {
        Header: "Instructor",
        accessor: "instructor",
      },
      {
        Header: "# Students",
        accessor: (row: any) => row.event_student.length,
        width: 30,
      },
      {
        Header: "Start Time",
        accessor: (row: any) => {
          return dayjs(row.time, "HH:mm:ss").format("h:mm A");
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
    ],
    []
  );
  const eventData = useMemo(() => events ?? [], [events]);

  return (
    <div className="flex flex-col w-full p-4 gap-4 flex-grow">
      <h1 className="font-display text-3xl font-bold">Events</h1>
      {events ? (
        <Table
          columns={columns}
          data={eventData}
          options={{
            link: (header, row) =>
              header == "Topic" ? `/events/${row.original.id}` : null,
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
