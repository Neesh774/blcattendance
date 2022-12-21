import { useMemo } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useFilters,
  Row,
} from "react-table";
import type { Column } from "react-table";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
} from "lucide-react";
import getTagColor from "../utils/getTagColor";
import { useRouter } from "next/router";
import { matchSorter } from "match-sorter";
import { DefaultColumnFilter } from "./Filters";

function fuzzyTextFilterFn(rows: Row[], id: any, filterValue: string) {
  return matchSorter(rows, filterValue, {
    keys: [(row: Row) => row.values[id]],
  });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val: string) => !val;

export default function Table({
  columns,
  data,
}: {
  columns: Column<object>[];
  data: any;
}) {
  const filterTypes = useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
    }),
    []
  );
  const defaultColumn = useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );
  const router = useRouter();
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    visibleColumns,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      defaultColumn,
      filterTypes,
    },
    useFilters,
    useSortBy,
    usePagination
  );

  return (
    <>
      <div className="h-full block max-w-full overflow-x-scroll">
        <table
          className="border-2 border-zinc-300 border-collapse"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup, i) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                {headerGroup.headers.map((column: any, c) => (
                  <th
                    {...column.getHeaderProps()}
                    className="border-2 border-zinc-300 text-left px-2 py-1 bg-zinc-200/70 font-display whitespace-nowrap select-none"
                    key={c}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-row w-full justify-between my-2 items-center">
                        <span>{column.render("Header")}</span>
                        <span
                          className="w-8 h-8 flex justify-center items-center cursor-pointer hover:bg-zinc-300/50 transition-all duration-200 rounded-lg"
                          onClick={() => {
                            column.toggleSortBy();
                          }}
                        >
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <ChevronDown />
                            ) : (
                              <ChevronUp />
                            )
                          ) : (
                            <ChevronsUpDown />
                          )}
                        </span>
                      </div>
                      <div className="font-medium">
                        {column.canFilter ? column.render("Filter") : null}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, r) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={r}>
                  {row.cells.map((cell, c) => {
                    return (
                      <td
                        className={`border-[1px] border-zinc-300 px-2 py-2 ${
                          cell.column.Header == "Status"
                            ? "text-center capitalize " +
                              getTagColor(cell.value)
                            : cell.column.Header == "Student"
                            ? "cursor-pointer hover:bg-zinc-300/50 transition-all duration-200"
                            : cell.column.Header == "Topic"
                            ? "cursor-pointer hover:bg-zinc-300/50 transition-all duration-200 font-semibold"
                            : ""
                        }`}
                        {...cell.getCellProps()}
                        key={c}
                        onClick={() => {
                          if (cell.column.Header == "Student") {
                            router.push(
                              `/students/${(row.original as any).user.id}`
                            );
                          }
                          if (cell.column.Header == "Topic") {
                            router.push(
                              `/appointments/${(row.original as any).id}`
                            );
                          }
                        }}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-row">
          <button
            className="bg-zinc-200 hover:bg-zinc-300 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50 transition-all duration-200 py-1 px-2 border-[1px] border-zinc-400"
            onClick={() => {
              gotoPage(0);
            }}
            disabled={pageIndex === 0}
          >
            <ChevronsLeft />
          </button>
          <button
            className="bg-zinc-200 hover:bg-zinc-300 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50 transition-all duration-200 py-1 px-2 border-[1px] border-zinc-400"
            onClick={() => {
              if (canPreviousPage) previousPage();
            }}
            disabled={!canPreviousPage}
          >
            <ChevronLeft />
          </button>
          <button
            className="bg-zinc-200 hover:bg-zinc-300 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50 transition-all duration-200 py-1 px-2 border-[1px] border-zinc-400"
            onClick={() => {
              if (canNextPage) nextPage();
            }}
            disabled={!canNextPage}
          >
            <ChevronRight />
          </button>
          <button
            className="bg-zinc-200 hover:bg-zinc-300 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50 transition-all duration-200 py-1 px-2 border-[1px] border-zinc-400"
            onClick={() => {
              gotoPage(pageCount - 1);
            }}
            disabled={pageIndex === pageCount - 1}
          >
            <ChevronsRight />
          </button>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <span className="text-sm font-display">
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
          <select
            className="bg-zinc-200 hover:bg-zinc-300 transition-all duration-200 py-0.5 px-1 text-sm border-[1px] border-zinc-400"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
