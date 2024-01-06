"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { InfoCircledIcon, TrashIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableComponents/DataTableColumnHeader";

export type Template = {
  id: number;
  judul: string;
  deskripsi: string;
  lokasi: string;
};

export const columns: ColumnDef<Template>[] = [
  {
    accessorKey: "judul",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Judul" />
    ),
    filterFn: (row, id, value) => {
      return (row.getValue(id) as string)
        .toLowerCase()
        .includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "deskripsi",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Deskripsi" />
    ),
    filterFn: (row, id, value) => {
      return (row.getValue(id) as string).includes(value);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const template = row.original as Template;

      return (
        // Edit and Delete buttons
        <div className="flex items-center space-x-2 text-white">
          <Link href={`/templates/${template.id}`}>
            <Button
              variant="default"
              size="sm"
              className="bg-primary hover:bg-opacity-90"
            >
              <InfoCircledIcon className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      );
    },
  },
  // ...
];
