import { Loader2, Plus, Search, User, Users } from "lucide-react";
import Modal from "./base/Modal";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { Column } from "react-table";
import { SelectColumnFilter } from "./Filters";
import { User as UserType } from "../utils/types";
import Table from "./base/Table";
import dayjs from "dayjs";
import useStudents from "../utils/useStudents";

export default function UserSelect({
  selected,
  setSelected,
  target,
  fullObj,
  className,
  blacklisted,
  initial,
}: {
  selected: string;
  setSelected: ((id: string) => void) | ((id: UserType) => void);
  target?: ReactElement;
  fullObj?: boolean;
  className?: string;
  blacklisted?: string[];
  initial?: UserType;
}) {
  const [name, setName] = useState(
    initial ? initial?.student_first + " " + initial?.student_last : ""
  );
  const students = useStudents();
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
    ],
    []
  );
  const studentData = useMemo(() => students ?? [], [students]);

  useEffect(() => {
    if (!selected) {
      setName("");
    }
  }, [selected]);

  useEffect(() => {
    if (initial) {
      setName(initial.student_first + " " + initial.student_last);
    }
  }, [initial]);
  return (
    <Modal
      target={(openModal: () => void) => (
        <button
          onClick={openModal}
          className={`flex flex-row w-fit gap-2 text-text-300 border-2 border-zinc-300 font-display rounded-sm items-center hover:bg-zinc-200/30 px-2 py-1 transition-all duration-150 ${className}`}
        >
          {target ? (
            <>{target}</>
          ) : (
            <>
              {selected ? (
                <User className="w-5 h-5" />
              ) : (
                <Users className="w-5 h-5" />
              )}
              <span>{selected ? name : "Select Student"}</span>
            </>
          )}
        </button>
      )}
      header={
        <div className="flex flex-row w-full justify-between">
          <h1 className="text-2xl text-text-500 font-display font-bold">
            {selected ? "Change Student" : "Select Student"}
          </h1>
        </div>
      }
    >
      {(closeModal) => (
        <div className="flex flex-col gap-4 max-h-[30rem] 2xl:max-h-[40rem]">
          {students ? (
            <Table
              columns={columns}
              data={studentData.filter((s) => {
                if (s.id.toString() === selected) return false;
                if (blacklisted?.includes(s.id.toString())) return false;
                return true;
              })}
              options={{
                hideFilters: true,
                selection: true,
                setSelection: (student) => {
                  setSelected(fullObj ? student : student.id);
                  console.log(student);
                  setName(student.student_first + " " + student.student_last);
                  closeModal();
                },
              }}
            />
          ) : (
            <div className="flex w-full h-[30%] justify-center items-center">
              <Loader2 className="mx-auto w-8 h-8 text-red-700 animate-spin" />
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
