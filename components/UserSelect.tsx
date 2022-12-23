import { Plus, Search, User, Users } from "lucide-react";
import Modal from "./base/Modal";
import { useMemo, useState } from "react";
import { Column } from "react-table";
import { SelectColumnFilter } from "./Filters";
import { User as UserType } from "../utils/types";
import Table from "./base/Table";

export default function UserSelect({
  selected,
  setSelected,
  students,
}: {
  selected: string;
  setSelected: (id: string) => void;
  students: UserType[];
}) {
  const [name, setName] = useState("");
  const columns = useMemo<Column[]>(
    () => [
      {
        Header: "Name",
        accessor: (row: any) => row.student_first + " " + row.student_last,
      },
      {
        Header: "Grade",
        accessor: "grade",
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

  return (
    <Modal
      target={(openModal: () => void) => (
        <button
          onClick={openModal}
          className="flex flex-row w-fit gap-2 text-text-300 border-2 border-zinc-300 font-display rounded-sm items-center hover:bg-zinc-200/30 px-2 py-1 transition-all duration-150"
        >
          {selected ? (
            <User className="w-5 h-5" />
          ) : (
            <Users className="w-5 h-5" />
          )}
          <span>{selected ? name : "Select Student"}</span>
        </button>
      )}
      header={
        <h1 className="text-2xl text-text-500 font-display font-bold">
          {selected ? "Change Student" : "Select Student"}
        </h1>
      }
    >
      {(closeModal) => (
        <div className="flex flex-col gap-4 max-h-[30rem] 2xl:max-h-[40rem]">
          <Table
            columns={columns}
            data={studentData}
            options={{
              hideFilters: true,
              selection: true,
              setSelection: (student) => {
                setSelected(student.id);
                setName(student.student_first + " " + student.student_last);
                closeModal();
              },
            }}
          />
        </div>
      )}
    </Modal>
  );
}
