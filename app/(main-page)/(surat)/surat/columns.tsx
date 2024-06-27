"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {
  DownloadIcon,
  InfoCircledIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Users } from "../../(master)/manajemen-user/columns";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableComponents/DataTableColumnHeader";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User } from "@/app/api/auth/[...nextauth]/authOptions";

export type Letter = {
  id: number;
  judul: string;
  jenis_id: number;
  deskripsi: string;
  tanggal: Date;
  path: string;
  visible: boolean;
  status: {
    status: string;
    persetujuan: string;
  };
  tampilan: {
    pin: boolean;
    dibaca: boolean;
  }[];
  jenis: {
    id: number;
    jenis: string;
  };
  akses_surat: {
    id: number;
    jabatan_id: number;
  }[];
  komentar: any[];
  nomor_surat: {
    id: number;
    nomor_surat: string;
    periode: {
      id: number;
      tahun: string;
      status: string;
    };
  }[];
  user: Users;
  progressBar: number;
  repo: {
    id: number;
    unix_code: string;
    visible: boolean;
    indikator: {
      id: number;
      name: string;
      strategi: {
        id: number;
        name: string;
      };
    };
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
      return <div>{judul.split(".")[0].split("-")[0]}</div>;
    },
  },
  {
    accessorKey: "nomor_surat",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nomor Surat" />
    ),
    filterFn: (row, id, value) => {
      const rowValue = (row.getValue(id) as { nomor_surat: string })
        .nomor_surat;
      return value.some((val: string[]) =>
        val.some((v) => rowValue.includes(v))
      );
    },
    cell: ({ row }) => {
      const nomorSurat = row.original.nomor_surat;
      return <div>{nomorSurat[0] ? nomorSurat[0]?.nomor_surat : "-"}</div>;
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
          {user.name}, {user.prodi?.name}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowValue = (row.getValue(id) as Users).prodi?.name;
      return value.some((val: string[]) =>
        val.some((v) => rowValue.toLowerCase().includes(v.toLowerCase()))
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    filterFn: (row, id, value) => {
      const rowValue = (row.getValue(id) as { status: string }).status;
      return value.some((val: string[]) =>
        val.some((v) => rowValue.includes(v))
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      const statusSurat = status?.status;
      const progressBar = row.original.progressBar;
      const tampilan = row.original.tampilan;
      let i = 0;
      let color;

      let jabatanStatus = "";

      if (statusSurat?.includes("Daftar Tunggu")) {
        jabatanStatus = statusSurat.slice(14, statusSurat.length);
      } else if (statusSurat?.includes("Diproses")) {
        jabatanStatus = statusSurat.slice(9, statusSurat.length);
      }

      // Create a hexa color based on the jabatan
      function stringToHex(str: string): string {
        // Hash function to convert string to a numeric value
        const hash = str
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0);

        // Convert the numeric value to a hexadecimal string
        return (hash * 57423).toString(16).toUpperCase();
      }

      // Get the first 6 characters of the hexadecimal string
      if (i < 5) {
        switch (i) {
          case 0:
            color = `#FFFFFF`;
            break;
          case 1:
            color = `#FF0000`;
            break;
          case 2:
            color = `#00FF00`;
            break;
          case 3:
            color = `#0000FF`;
            break;
          case 4:
            color = `#FFFF00`;
            break;
        }
      } else {
        color = `#${stringToHex(jabatanStatus).slice(0, 6)}`;
      }
      i++;

      return (
        <>
          {color && (
            <Badge
              style={{
                backgroundColor:
                  statusSurat?.includes("Daftar Tunggu") ||
                  statusSurat?.includes("Diproses")
                    ? color
                    : undefined,
              }}
              className={`text-white text-center w-full mb-2
            ${statusSurat?.includes("Ditolak") && "bg-danger"}
            ${statusSurat?.includes("Ditandatangani") && "bg-success"}
            `}
            >
              <p className="text-center w-full">{statusSurat}</p>
            </Badge>
          )}
          {(statusSurat?.includes("Daftar Tunggu") ||
            statusSurat?.includes("Diproses")) && (
            <span className="flex gap-2 items-center">
              <Progress
                className={`h-2 ${
                  tampilan && tampilan[0]?.dibaca ? "bg-white" : "bg-disabled"
                }`}
                value={progressBar}
              />
              <p className="text-xs">{progressBar}%</p>
            </span>
          )}
        </>
      );
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
      const jenis = row.original.jenis;
      return <div>{jenis.jenis}</div>;
    },
  },
  {
    accessorKey: "indikator",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Indikator" />
    ),
    filterFn: (row, id, value) => {
      return (row.getValue(id) as string)
        .toLowerCase()
        .includes(value.toLowerCase());
    },
    cell: ({ row }) => {
      console.log(row.original.repo);
      const indikator = row.original.repo[0].indikator;
      console.log(
        "indikator.name:",
        indikator ? indikator.name : "indikator not found"
      );
      return <div>{indikator ? indikator.name : "-"}</div>;
    },
  },

  {
    accessorKey: "strategi",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Strategi" />
    ),
    filterFn: (row, id, value) => {
      return (row.getValue(id) as string)
        .toLowerCase()
        .includes(value.toLowerCase());
    },
    cell: ({ row }) => {
      const strategi = row.original.repo[0].indikator.strategi;
      return <div>{strategi ? strategi.name : "-"}</div>;
    },
  },
  // {
  //   accessorKey: "indikator",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Indikator" />
  //   ),
  //   cell: ({ row }) => {
  //     const indikator = row.original.repository.indikator;
  //     return <div>{indikator ? indikator.name : "-"}</div>;
  //   },
  // },
  // {
  //   accessorKey: "strategi",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Strategi" />
  //   ),
  //   cell: ({ row }) => {
  //     const strategi = row.original.repository.indikator?.strategi;
  //     return <div>{strategi ? strategi.name : "-"}</div>;
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => {
      const letter = row.original as Letter;
      const router = useRouter();

      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              router.push(`/surat/${letter.id}`);
            }}
            className="bg-primary hover:bg-opacity-90 text-white"
          >
            <InfoCircledIcon className="h-5 w-5" />
          </Button>
        </div>
      );
    },
  },
  // ...
];
