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
      return (
        <Badge
          className={`text-white text-center
            ${
              (statusSurat?.includes("Daftar Tunggu") ||
                statusSurat?.includes("Diproses")) &&
              "bg-warning"
            }
            ${statusSurat?.includes("Ditolak") && "bg-danger"}
            ${statusSurat?.includes("Ditandatangani") && "bg-success"}
            `}
        >
          {statusSurat}
        </Badge>
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
    id: "actions",
    cell: ({ row }) => {
      const letter = row.original as Letter;
      const router = useRouter();
      const session = useSession();
      const user = session.data?.user as User;

      const canDownload =
        user?.jabatan.permision.download_surat &&
        // User tidak punya jabatan atas & surat belum ditandatangani
        ((!user?.jabatan.jabatan_atas &&
          !letter?.status.status.includes("Ditandatangani")) ||
          // User adalah pembuat surat
          user?.jabatan.name === letter?.user.jabatan.name);

      const handleDownload = async () => {
        const token = user.accessToken;
        const response = await axios.get(`${row.original?.path}`, {
          responseType: "arraybuffer",
          headers: {
            // "Content-Type": "application/pdf",
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": true,
          },
        });
        const file = new Blob([response.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);

        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute(
          "download",
          `${row.original.judul.split(".")[0]}.pdf`
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
            onClick={() => {
              router.push(`/surat/${letter.id}`);
            }}
            className="bg-primary hover:bg-opacity-90 text-white"
          >
            <InfoCircledIcon className="h-5 w-5" />
          </Button>
          {canDownload && (
            <Button
              className="bg-primary hover:bg-opacity-90 text-white"
              size="sm"
              onClick={handleDownload}
            >
              <DownloadIcon className="w-5 h-5" />
            </Button>
          )}
        </div>
      );
    },
  },
  // ...
];
