"use client";

import * as React from "react";
import { useToast } from "@/components/ui/use-toast";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import Modal from "@/components/Modal/Modal";

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
import { LetterRepo } from "./columns";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { useSession } from "next-auth/react";
import { User } from "@/app/api/auth/[...nextauth]/authOptions";
import axios from "axios";
import { Button } from "@/components/ui/button";
import FilterForm from "./filter-form";
import { Letter } from "../surat/columns";
import { useRouter } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterData?: any;
  onDateRangeApply?: (date: any) => void;
  date?: any;
  setDate?: any;
  prodiData?: any;
  handleFilter?: any;
  // prodiId?: number;
  // setProdiId?: any;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterData,
  onDateRangeApply,
  date,
  setDate,
  handleFilter,
}: // prodiData,
// prodiId,
// setProdiId,
DataTableProps<TData, TValue>) {
  const session = useSession();
  const user = session.data?.user as User;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false);
  const { toast } = useToast();
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
  });

  const router = useRouter();

  const handleDownloadBatch = async () => {
    const paths = table.getSelectedRowModel().rows.map((row) => {
      const repo = row.original as LetterRepo;
      return repo.surat.path;
    });

    if (paths.length === 0) {
      toast({
        title: "Gagal",
        description: "Tidak ada file",
        className: "bg-danger text-white",
      });
      return;
    }

    const { data } = await axios.get(`/api/surat/download`, {
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
      params: {
        paths: JSON.stringify(paths),
      },
    });

    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "download.zip");
    document.body.appendChild(link);
    link.click();
  };

  const handleDownloadExcel = async () => {
    const repo_id = table.getSelectedRowModel().rows.map((row) => {
      const repo = row.original as LetterRepo;
      return repo.id;
    });

    if (repo_id.length === 0) {
      toast({
        title: "Gagal",
        description: "Tidak ada file",
        className: "bg-danger text-white",
      });
      return;
    }

    const { data } = await axios.get(`/api/surat/download/excel`, {
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
      params: {
        repo_id: JSON.stringify(repo_id),
      },
    });

    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "download.xlsx");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      <DataTableToolbar table={table} filterInput="judul" />
      <div className="flex justify-between">
        <DatePickerWithRange
          onDateRangeApply={onDateRangeApply}
          date={date}
          setDate={setDate}
        />
        <div className="flex justify-end gap-4 text-center font-semibold text-white">
          <Button
            onClick={handleDownloadBatch}
            className="flex gap-2 bg-primary"
          >
            <span>Download Zip</span>
            <p>( {table.getSelectedRowModel().rows.length} )</p>
          </Button>
          <Button
            onClick={handleDownloadExcel}
            className="flex gap-2 bg-primary"
          >
            <p>Download Excel</p>
            <p>( {table.getSelectedRowModel().rows.length} )</p>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto h-8 text-body lg:flex bg-transparent font-medium focus:outline-none"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <MixerHorizontalIcon className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>
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
                  className={`hover:-translate-y-2 hover:shadow-xl transition-all cursor-pointer pointer-event-auto`}
                  onClick={() => {
                    router.push(`/repo/${(row.original as Letter).id}`);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
      {isFilterModalOpen && (
        <Modal setModalOpen={setIsFilterModalOpen} className="lg:w-[65%]">
          <FilterForm onSubmit={handleFilter} />
        </Modal>
      )}
    </div>
  );
}
