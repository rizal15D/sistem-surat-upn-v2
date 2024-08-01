"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DownloadIcon,
  InfoCircledIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Users } from "../../(master)/manajemen-user/columns";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableComponents/DataTableColumnHeader";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User } from "@/app/api/auth/[...nextauth]/authOptions";
import { Checkbox } from "@/components/ui/checkbox";
import { Letter } from "../surat/columns";
import { ExternalLink } from "lucide-react";
import { FilterFn } from "@tanstack/react-table";

export type LetterRepo = {
  id: number;
  unix_code: string;
  visible: boolean;
  catatan: string;
  indikator: {
    id: number;
    name: string;
    strategi: {
      id: number;
      name: string;
    };
    iku: {
      id: number;
      name: string;
    };
  };
  surat: Letter;
};

const multiColumnFilterFn: FilterFn<LetterRepo> = (
  row,
  columnId,
  filterValue
) => {
  // Concatenate the values from multiple columns into a single string
  const searchableRowContent = `${row.original.surat.judul} 
  ${row.original.surat.nomor_surat[0]?.nomor_surat} 
  ${row.original.surat.user.name} 
  ${row.original.indikator.name}
  ${row.original.indikator.strategi.name}
  }`;

  // Perform a case-insensitive comparison
  return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
};

export const columns: ColumnDef<LetterRepo>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "judul",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Judul" />
    ),
    filterFn: multiColumnFilterFn,
    cell: ({ row }) => {
      const judul = row.original.surat.judul;
      return <div>{judul.split(".")[0].split("-")[0]}</div>;
    },
  },
  {
    accessorKey: "nomor_surat",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nomor Surat" />
    ),
    filterFn: multiColumnFilterFn,
    cell: ({ row }) => {
      const nomorSurat = row.original.surat.nomor_surat;
      return <div>{nomorSurat[0] ? nomorSurat[0]?.nomor_surat : "-"}</div>;
    },
  },
  {
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pembuat Surat" />
    ),
    cell: ({ row }) => {
      const user = row.original.surat.user;
      return (
        <div>
          {user.name}, {user.prodi?.name}
        </div>
      );
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "tanggal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tanggal Dibuat" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.surat.tanggal);
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
    accessorKey: "jenis",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jenis Surat" />
    ),
    filterFn: (row, id, value) => {
      const rowValue = (row.getValue(id) as { jenis: string }).jenis;
      return value.some((val: string[]) =>
        val.some((v) => rowValue.includes(v))
      );
    },
    cell: ({ row }) => {
      const jenis = row.original.surat.jenis;
      return <div>{jenis.jenis}</div>;
    },
  },
  {
    accessorKey: "indikator",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Indikator" />
    ),
    filterFn: multiColumnFilterFn,
    cell: ({ row }) => {
      const indikator = row.original.indikator.name;
      return <div>{indikator}</div>;
    },
  },
  {
    accessorKey: "strategi",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Strategi" />
    ),
    filterFn: multiColumnFilterFn,
    cell: ({ row }) => {
      const strategi = row.original.indikator.strategi.name;
      return <div>{strategi}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const letter = row.original as LetterRepo;
      const router = useRouter();

      const handleDownload = async () => {
        const response = await axios.get(
          `/api/surat/download?filepath=${letter?.surat.path}`,
          {
            responseType: "arraybuffer",
          }
        );
        const file = new Blob([response.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);

        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute(
          "download",
          `${row.original.surat.judul.split(".")[0]}.pdf`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
      };

      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="default"
            size="sm"
            onClick={(event) => {
              event.stopPropagation();
              router.push(`/repo/${letter.id}`);
            }}
            className="bg-primary hover:bg-opacity-90 text-white"
          >
            <ExternalLink className="h-5 w-5" />
          </Button>
          <Button
            className="bg-primary hover:bg-opacity-90 text-white"
            size="sm"
            onClick={(event) => {
              event.stopPropagation();
              handleDownload();
            }}
          >
            <DownloadIcon className="w-5 h-5" />
          </Button>
        </div>
      );
    },
  },

  // ...
];
