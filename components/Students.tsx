import { useEffect, useMemo } from "react";
import { User } from "../utils/types";
import { Column } from "react-table";
import { SelectColumnFilter } from "./Filters";
import supabase from "../utils/client";
import { Loader2 } from "lucide-react";
import Table from "./base/Table";
import toast from "react-hot-toast";
import dayjs from "dayjs";

export default function Students({
  students,
}: {
  students: User[] | undefined;
}) {
  const columns = useMemo<Column[]>(
    () => [
      {
        Header: "Name",
        accessor: (row: any) => row.student_first + " " + row.student_last,
      },
      {
        Header: "Grade",
        accessor: (row: any) =>
          dayjs().year() >= row.classOf
            ? "Graduated"
            : 13 - (row.classOf - dayjs().year()),
        Filter: SelectColumnFilter,
      },
      {
        Header: "School",
        accessor: "school",
      },
      {
        Header: "Parent",
        accessor: (row: any) => row.parent_first + " " + row.parent_last,
      },
      {
        Header: "Email",
        accessor: "parent_email",
      },
      {
        Header: "Phone",
        accessor: "phone_number",
      },
    ],
    []
  );
  const studentData = useMemo(() => students ?? [], [students]);

  return (
    <div className="flex flex-col w-full p-4 gap-4 flex-grow">
      <h1 className="font-display text-3xl font-bold">Students</h1>
      {students ? (
        <Table columns={columns} data={studentData} />
      ) : (
        <div className="flex w-full h-[30%] justify-center items-center">
          <Loader2 className="mx-auto w-8 h-8 text-red-700 animate-spin" />
        </div>
      )}
    </div>
  );
}
