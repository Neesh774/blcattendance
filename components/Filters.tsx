import dayjs from "dayjs";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Row, useAsyncDebounce } from "react-table";
import capitalize from "../utils/capitalize";

export function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter, Header },
}: {
  column: {
    filterValue: any;
    preFilteredRows: any;
    setFilter: any;
    Header?: any;
  };
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${Header.toLowerCase()}s...`}
      className={`rounded-sm outline-none px-2 w-full py-1 text-sm transition-all duration-200 ${
        filterValue
          ? "bg-zinc-100"
          : "bg-zinc-300/50 hover:bg-zinc-100 focus:bg-zinc-100"
      }`}
    />
  );
}

// This is a custom filter UI for selecting
// a unique option from a list
export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}: {
  column: {
    filterValue: any;
    setFilter: any;
    preFilteredRows: any;
    id: any;
  };
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = useMemo(() => {
    const options = new Set<string>();
    preFilteredRows.forEach((row: Row) => {
      options.add(row.values[id] as string);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      className={`rounded-sm px-2 py-1 text-sm w-full transition-all duration-200 ${
        filterValue
          ? "bg-zinc-100"
          : "bg-zinc-300/50 hover:bg-zinc-100 focus:bg-zinc-100"
      }`}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {capitalize(option)}
        </option>
      ))}
    </select>
  );
}

export function DateColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}: {
  column: {
    filterValue: any;
    setFilter: any;
    preFilteredRows: any;
    id: any;
  };
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <select
        value={filterValue ? filterValue[0] : "all"}
        onChange={(e) => {
          const val = e.target.value;
          setFilter(
            val == "all" ? undefined : `${val}${dayjs().format("MM-DD-YYYY")}`
          );
        }}
        className={`rounded-sm px-2 py-1 text-sm transition-all duration-200 ${
          filterValue
            ? "bg-zinc-100"
            : "bg-zinc-300/50 hover:bg-zinc-100 focus:bg-zinc-100"
        }`}
      >
        <option value="all">All</option>
        <option value="=">During</option>
        <option value="<">Before</option>
        <option value=">">After</option>
      </select>
      {filterValue && (
        <input
          type="date"
          className={`rounded-sm text-sm px-2 py-1 transition-all duration-200 ${
            filterValue
              ? "bg-zinc-100 hover:bg-zinc-100 focus:bg-zinc-100"
              : "bg-zinc-300/50 cursor-not-allowed opacity-20"
          }`}
          value={filterValue ? filterValue.slice(1) : ""}
          onChange={(e) => {
            const val = e.target.value;
            setFilter(val == "all" ? undefined : `${filterValue[0]}${val}`);
          }}
        />
      )}
    </div>
  );
}

// Define a default UI for filtering
export function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: {
  preGlobalFilteredRows: any;
  globalFilter: any;
  setGlobalFilter: any;
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <div className="relative w-full">
      <Search className="absolute left-1 h-full py-2" />
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`Search ${count} records...`}
        className={`rounded-sm outline-none border-none w-full pl-9 px-2 py-1 hover:bg-zinc-300 focus:bg-zinc-300 transition-all duration-200 ${
          value ? "bg-zinc-300" : "bg-zinc-300/50"
        }`}
      />
    </div>
  );
}

export function TimeColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}: {
  column: {
    filterValue: any;
    setFilter: any;
    preFilteredRows: any;
    id: any;
  };
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <select
        value={filterValue ? filterValue[0] : "all"}
        onChange={(e) => {
          const val = e.target.value;
          setFilter(
            val == "all" ? undefined : `${val}${dayjs().format("HH:mm")}`
          );
          console.log(dayjs().format("HH:mm"));
        }}
        className={`rounded-sm px-2 py-1 text-sm transition-all duration-200 ${
          filterValue
            ? "bg-zinc-100"
            : "bg-zinc-300/50 hover:bg-zinc-100 focus:bg-zinc-100"
        }`}
      >
        <option value="all">All</option>
        <option value="=">During</option>
        <option value="<">Before</option>
        <option value=">">After</option>
      </select>
      {filterValue && (
        <input
          type="time"
          className={`rounded-sm text-sm px-2 py-1 transition-all duration-200 ${
            filterValue
              ? "bg-zinc-100 hover:bg-zinc-100 focus:bg-zinc-100"
              : "bg-zinc-300/50 cursor-not-allowed opacity-20"
          }`}
          value={filterValue ? filterValue.slice(1) : ""}
          onChange={(e) => {
            const val = e.target.value;
            setFilter(val == "all" ? undefined : `${filterValue[0]}${val}`);
          }}
        />
      )}
    </div>
  );
}
