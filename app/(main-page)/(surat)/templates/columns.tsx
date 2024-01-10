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
    filterFn: (row, id, value) => {
      return (row.getValue(id) as string).includes(value);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const template = row.original as Template;

      const handleDownload = async () => {
        const response = await axios.get("/api/template/download", {
          responseType: "blob",
          params: {
            id: template.id,
          },
        });

        const url = window.URL.createObjectURL(
          new Blob([response.data], {
            type: response.headers["content-type"],
          })
        );

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", template.judul + ".docx");
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
