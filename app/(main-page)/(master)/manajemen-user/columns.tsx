"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableComponents/DataTableColumnHeader";
import Link from "next/link";
import { InfoCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";

export type Users = {
  id: string;
  name: string;
  email: string;
  role: { id: string; name: string };
  prodi: { id: string; name: string };
  fakultas: { id: string; name: string };
  aktif: boolean;
};

export const columns: ColumnDef<Users>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
    filterFn: (row, id, value) => {
      return (row.getValue(id) as string)
        .toLowerCase()
        .includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as { name: string };
      return (
        <div className="flex items-center space-x-2">
          <span>{role.name}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowValue = (row.getValue(id) as { name: string }).name;
      return value.some((val: string[]) =>
        val.some((v) => rowValue.includes(v))
      );
    },
  },
  {
    accessorKey: "prodi",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prodi" />
    ),
    cell: ({ row }) => {
      const prodi = row.getValue("prodi") as { name: string };
      return (
        <div className="flex items-center space-x-2">
          <span>{prodi.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "fakultas",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fakultas" />
    ),
    cell: ({ row }) => {
      const fakultas = row.getValue("fakultas") as { name: string };
      return (
        <div className="flex items-center space-x-2">
          <span>{fakultas.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "aktif",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const aktif = row.getValue("aktif");
      return (
        <div className="flex items-center space-x-2 text-white">
          {aktif ? (
            <Badge className="bg-success">Aktif</Badge>
          ) : (
            <Badge className="bg-danger">Tidak Aktif</Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original as Users;

      return (
        // Edit and Delete buttons
        <div className="flex items-center space-x-2 text-white">
          <Link href={`/manajemen-user/${user.id}`}>
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
