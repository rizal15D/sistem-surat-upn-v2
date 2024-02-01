"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {
  DownloadIcon,
  InfoCircledIcon,
  TrashIcon,
} from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableComponents/DataTableColumnHeader";
import axios from "axios";
import { User } from "@/app/api/auth/[...nextauth]/authOptions";
import { useSession } from "next-auth/react";

export type Template = {
  id: number;
  judul: string;
  deskripsi: string;
  url: string;
  jenis: {
    id: number;
    jenis: string;
  };
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
    cell: ({ row }) => {
      const template = row.original as Template;
      const judulWithoutExtension = template.judul.split(".")[0];

      return <div>{judulWithoutExtension}</div>;
    },
  },
  {
    accessorKey: "deskripsi",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Deskripsi" />
    ),
  },
  {
    accessorKey: "jenis",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jenis" />
    ),
    filterFn: (row, id, value) => {
      const rowValue = (row.getValue(id) as { jenis: string }).jenis;
      return value.some((val: string[]) =>
        val.some((v) => rowValue.includes(v))
      );
    },
    cell: ({ row }) => {
      const template = row.original as Template;
      return <div>{template.jenis.jenis}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const template = row.original as Template;
      const session = useSession();
      const user = session.data?.user as User;

      const handleDownload = async () => {
        const token = user.accessToken;
        const response = await axios.get(`${template.url}`, {
          responseType: "arraybuffer",
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": true,
          },
        });

        const file = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        const fileURL = URL.createObjectURL(file);

        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", template.judul);
        document.body.appendChild(link);
        link.click();
        link.remove();
      };

      return (
        <div className="flex items-center space-x-2 text-white">
          <Button
            variant="default"
            size="sm"
            className="bg-primary hover:bg-opacity-90"
            onClick={handleDownload}
          >
            <DownloadIcon className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
  // ...
];
