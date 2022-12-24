import { useMemo } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useFilters,
  Row,
  useGlobalFilter,
  useBlockLayout,
  useResizeColumns,
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
import getTagColor from "../../utils/getTagColor";
import { useRouter } from "next/router";
import { matchSorter } from "match-sorter";
import { DefaultColumnFilter, GlobalFilter } from "../Filters";
import { TableOptions } from "../../utils/types";

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
  options,
}: {
  columns: Column<object>[];
  data: any;
  options?: TableOptions;
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
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state,
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
      defaultColumn,
      filterTypes,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <div className="h-full block max-w-full overflow-x-auto flex-grow">
        <table
          className="border-2 border-zinc-300 border-collapse mt-2 mb-4 w-full"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup, i) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                {headerGroup.headers.map((column: any, c) => (
                  <th
                    {...column.getHeaderProps()}
                    className={`border-2 w-[1%] border-zinc-300 text-left px-2 py-1 bg-zinc-200/70 font-display whitespace-nowrap select-none ${
                      column.collapse ? "w-[0.0000000001%]" : ""
                    }`}
                    key={c}
                  >
                    <div className="flex flex-col my-2 gap-2">
                      <div className="flex flex-row w-full justify-between items-center">
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
                      {!options?.hideFilters && (
                        <div className="font-medium">
                          {column.canFilter ? column.render("Filter") : null}
                        </div>
                      )}
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
                <tr {...row.getRowProps()} key={r} className="group">
                  {row.cells.map((cell, c) => {
                    return (
                      <td
                        className={`border-[1px] break-words w-[1%] border-zinc-300 px-2 py-2 text-sm ${
                          !options?.selection
                            ? cell.column.Header == "Status"
                              ? "text-center capitalize " +
                                getTagColor(cell.value)
                              : cell.column.Header == "Student" ||
                                cell.column.Header == "Name"
                              ? "cursor-pointer hover:bg-zinc-300/50 transition-all duration-200 hover:underline"
                              : cell.column.Header == "Topic"
                              ? "cursor-pointer hover:bg-zinc-300/50 transition-all duration-200 hover:underline"
                              : ""
                            : "cursor-pointer group-hover:bg-zinc-300/50 transition-all duration-200 group-hover:underline"
                        } ${
                          (cell.column as any).collapse
                            ? "w-[0.0000000001%]"
                            : ""
                        } ${(cell.column as any).primary && "font-semibold"}`}
                        {...cell.getCellProps()}
                        key={c}
                        onClick={() => {
                          if (!options?.selection) {
                            if (cell.column.Header == "Student") {
                              router.push(
                                `/students/${(row.original as any).user.id}`
                              );
                            } else if (cell.column.Header == "Topic") {
                              router.push(
                                `/appointments/${(row.original as any).id}`
                              );
                            } else if (cell.column.Header == "Name") {
                              router.push(`
                              /students/${(row.original as any).id}`);
                            }
                          } else {
                            options.setSelection(row.original as any);
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
        <div className="flex flex-row gap-1">
          <button
            className="bg-zinc-300 hover:bg-zinc-400 disabled:cursor-not-allowed disabled:opacity-20 transition-all duration-200 py-0.5 px-2 rounded-sm"
            onClick={() => {
              gotoPage(0);
            }}
            disabled={pageIndex === 0}
          >
            <ChevronsLeft />
          </button>
          <button
            className="bg-zinc-300 hover:bg-zinc-400 disabled:cursor-not-allowed disabled:opacity-20 transition-all duration-200 py-0.5 px-2 rounded-sm"
            onClick={() => {
              if (canPreviousPage) previousPage();
            }}
            disabled={!canPreviousPage}
          >
            <ChevronLeft />
          </button>
          <button
            className="bg-zinc-300 hover:bg-zinc-400 disabled:cursor-not-allowed disabled:opacity-20 transition-all duration-200 py-0.5 px-2 rounded-sm"
            onClick={() => {
              if (canNextPage) nextPage();
            }}
            disabled={!canNextPage}
          >
            <ChevronRight />
          </button>
          <button
            className="bg-zinc-300 hover:bg-zinc-400 disabled:cursor-not-allowed disabled:opacity-20 transition-all duration-200 py-0.5 px-2 rounded-sm"
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
            className="rounded-sm px-2 py-1 text-sm transition-all duration-200 bg-zinc-300/50 hover:bg-zinc-300 focus:bg-zinc-300 outline-red-700"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 30, 50, 100].map((pageSize) => (
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
