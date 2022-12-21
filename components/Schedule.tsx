import { useEffect, useMemo } from "react";
import { Appointment } from "../utils/types";
import supabase from "../utils/client";
import { useTable, useSortBy, useFilters } from "react-table";
import type { Column } from "react-table";
import dayjs from "dayjs";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import getTagColor from "../utils/getTagColor";
import { useRouter } from "next/router";
import Table from "./Table";
import { SelectColumnFilter } from "./Filters";

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
      },
      {
        Header: "End",
        accessor: (row: any) => {
          return dayjs(row.end_time, "HH:mm:ss").format("h:mm A");
        },
      },
      {
        Header: "Date",
        accessor: (row: any) => {
          return dayjs(row.date).format("MMM D, 'YY");
        },
      },
    ],
    []
  );
  const appointmentsData = useMemo(() => appointments ?? [], [appointments]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: appointmentsData as any }, useSortBy);

  useEffect(() => {
    const fetchAppointments = async () => {
      const appointments = await supabase.from("appointments").select(`
        *,
        user (
          *
        )`);
      setAppointments(appointments.data ?? []);
    };
    if (appointments == undefined) {
      fetchAppointments();
    }
  }, [appointments, setAppointments]);
  return (
    <div className="flex flex-col w-full p-4 gap-4">
      <h1 className="font-display text-3xl font-bold">BLC Appointments</h1>
      <Table columns={columns} data={appointmentsData} />
    </div>
  );
}
