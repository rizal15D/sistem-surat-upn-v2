"use client";

import * as React from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/DataTableComponents/DataTablePagination";
import { DataTableToolbar } from "@/components/DataTableComponents/DataTableToolbar";
import { Letter } from "./columns";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { useRouter } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterData: any;
  onDateRangeApply?: (date: any) => void;
  date?: any;
  setDate?: any;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterData,
  onDateRangeApply,
  date,
  setDate,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    autoResetPageIndex: false,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 50,
      },
    },
  });

  React.useEffect(() => {
    if (localStorage.getItem("visibleColumnIds") === null) {
      const columIds = table.getAllColumns().map((column) => column.id);
      localStorage.setItem("visibleColumnIds", JSON.stringify(columIds));
    }
    const allHideableColumnIds = table
      .getAllColumns()
      .filter((column) => column.getCanHide())
      .map((column) => column.id);
    const savedColumnIds: string[] = JSON.parse(
      localStorage.getItem("visibleColumnIds") || "[]"
    ) as string[];
    const initialColumnVisibility: VisibilityState =
      allHideableColumnIds.reduce((visibilityState, columnId) => {
        visibilityState[columnId] = savedColumnIds.includes(columnId);
        return visibilityState;
      }, {} as VisibilityState);

    setColumnVisibility(initialColumnVisibility);
  }, []);

  const router = useRouter();

  return (
    <div>
      <DataTableToolbar table={table} filterInput="judul" data={filterData} />
      <DatePickerWithRange
        onDateRangeApply={onDateRangeApply}
        date={date}
        setDate={setDate}
      />
      <div className="rounded-md border mt-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`${
                    (row.original as Letter).tampilan &&
                    !(row.original as Letter).tampilan[0].dibaca
                      ? "font-bold bg-whit"
                      : "bg-disabled"
                  } h-full w-full hover:-translate-y-1 hover:shadow-xl transition-all cursor-pointer pointer-event-auto`}
                  onClick={() => {
                    router.push(`/surat/${(row.original as Letter).id}`);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="h-full w-full">
                      <a
                        href={`/surat/${(row.original as Letter).id}`}
                        className="h-full w-full"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </a>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
