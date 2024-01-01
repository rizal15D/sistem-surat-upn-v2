"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableComponents/DataTableColumnHeader";

export type Letter = {
  id: number;
  judul: string;
  pin: boolean;
  dibaca: boolean;
  user_id: number;
  tanggal: Date;
  status: string;
  lokasi_surat: string;
  komentar: string;
};

export const columns: ColumnDef<Letter>[] = [
  {
    accessorKey: "judul",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Judul" />
    ),
    filterFn: (row, id, value) => {
      return (row.getValue(id) as string).includes(value);
    },
  },
  {
    accessorKey: "user_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User ID" />
    ),
  },
  {
    accessorKey: "tanggal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tanggal Dibuat" />
    ),
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    filterFn: (row, id, value) => {
      const rowValue = (row.getValue(id) as string).split(" ");
      return value.some((val: string[]) =>
        val.some((v) => rowValue.includes(v))
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        // Edit and Delete buttons
        <div className="flex items-center space-x-2">
          <Link href={`/data-master/dosen/${payment.id}`}>
            <Button variant="default" size="sm">
              Edit
            </Button>
          </Link>
          <Button variant="destructive" size="sm">
            Delete
          </Button>
        </div>
      );
    },
  },
  // ...
];
