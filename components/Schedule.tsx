import { useEffect, useMemo } from "react";
import { Appointment } from "../utils/types";
import supabase from "../utils/client";
import { useTable, useSortBy, useFilters, Row } from "react-table";
import type { Column } from "react-table";
import dayjs from "dayjs";
import { ChevronDown, ChevronUp, ChevronsUpDown, Loader2 } from "lucide-react";
import getTagColor from "../utils/getTagColor";
import { useRouter } from "next/router";
import Table from "./Table";
import {
  DateColumnFilter,
  SelectColumnFilter,
  TimeColumnFilter,
} from "./Filters";
import { toast } from "react-hot-toast";

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

export default function Schedule({
  appointments,
  setAppointments,
}: {
  appointments: Appointment[] | undefined;
  setAppointments: (appointments: Appointment[]) => void;
}) {
  const router = useRouter();
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
        Header: "Student",
        accessor: (row: any) =>
          row.user.student_first + " " + row.user.student_last,
      },
      {
        Header: "Instructor",
        accessor: "instructor",
        Filter: SelectColumnFilter,
      },
      {
        Header: "Start",
        accessor: (row: any) => {
          return dayjs(row.start_time, "HH:mm:ss").format("h:mm A");
        },
        Filter: TimeColumnFilter,
        filter: timeFilterFn,
      },
      {
        Header: "End",
        accessor: (row: any) => {
          return dayjs(row.end_time, "HH:mm:ss").format("h:mm A");
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
      },
    ],
    []
  );
  const appointmentsData = useMemo(() => appointments ?? [], [appointments]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
        *,
        user (
          *
        )`
        )
        .not("user", "is", null);
      if (error) {
        toast.error("Error fetching appointments");
        console.error(error);
      }
      setAppointments(data ?? []);
    };
    if (appointments == undefined) {
      fetchAppointments();
    }
  }, [appointments, setAppointments]);
  return (
    <div className="flex flex-col w-full p-4 gap-4 flex-grow">
      <h1 className="font-display text-3xl font-bold">BLC Appointments</h1>
      {appointments ? (
        <Table columns={columns} data={appointmentsData} />
      ) : (
        <div className="flex w-full h-[30%] justify-center items-center">
          <Loader2 className="mx-auto w-8 h-8 text-red-700 animate-spin" />
        </div>
      )}
    </div>
  );
}
