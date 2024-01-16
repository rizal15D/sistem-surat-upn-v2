"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { InfoCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import { Users } from "../../(master)/manajemen-user/columns";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableComponents/DataTableColumnHeader";

export type Letter = {
  id: number;
  judul: string;
  jenis_id: number;
  user_id: number;
  tanggal: Date;
  url: string;
  tampilan: {
    pin: boolean;
    dibaca: boolean;
  }[];
  user: Users;
  status: {
    status: string;
    persetujuan: string;
  }[];
};

export const columns: ColumnDef<Letter>[] = [
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
    cell: ({ row }) => {
      const judul = row.original.judul;
      const judulWithoutExtension = judul.split(".")[0];
      return <div>{judulWithoutExtension}</div>;
    },
  },
  {
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pembuat Surat" />
    ),
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div>
          {user.name}, {user.prodi.name}
        </div>
      );
    },
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
    cell: ({ row }) => {
      const status = row.original.status;
      const statusSurat = status[0]?.status;
      return <div className="flex items-center space-x-2">{statusSurat}</div>;
    },
  },
  {
    accessorKey: "tanggal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tanggal Dibuat" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.tanggal);
      const options = {
        weekday: "long" as "long",
        day: "numeric" as "numeric",
        month: "long" as "long",
        year: "numeric" as "numeric",
      };
      const formattedDate = new Intl.DateTimeFormat("id-ID", options).format(
        date
      );
      return formattedDate;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const letter = row.original as Letter;

      return (
        <div className="flex items-center space-x-2">
          <Link href={`/surat/${letter.id}`}>
            <Button
              variant="default"
              size="sm"
              className="bg-primary hover:bg-opacity-90 text-white"
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
