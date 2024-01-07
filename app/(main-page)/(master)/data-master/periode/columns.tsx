"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableComponents/DataTableColumnHeader";
import Link from "next/link";
import { InfoCircledIcon, TrashIcon } from "@radix-ui/react-icons";

export type Periode = {
  id: string;
  name: string;
  jenjang: string;
  kode_fakultas: string;
};

export const columns: ColumnDef<Periode>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
  },
  {
    accessorKey: "jenjang",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jenjang" />
    ),
  },
  {
    accessorKey: "kode_fakultas",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kode Fakultas" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const fakultas = row.original;

      return (
        // Edit and Delete buttons
        <div className="flex items-center space-x-2 text-white">
          <Link href={`/data-master/${fakultas.id}`}>
            <Button
              variant="default"
              size="sm"
              className="bg-primary hover:bg-opacity-90"
            >
              <InfoCircledIcon className="h-5 w-5" />
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            className="bg-danger hover:bg-opacity-90"
          >
            <TrashIcon className="h-5 w-5" />
          </Button>
        </div>
      );
    },
  },
  // ...
];
