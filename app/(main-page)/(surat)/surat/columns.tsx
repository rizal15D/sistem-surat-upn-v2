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
import { ExternalLink } from "lucide-react";
import { FilterFn } from "@tanstack/react-table";

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
    updatedAt: Date;
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
    catatan: string;
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

const multiColumnFilterFn: FilterFn<Letter> = (row, columnId, filterValue) => {
  // Concatenate the values from multiple columns into a single string
  const searchableRowContent = `${row.original.judul} 
  ${row.original.nomor_surat[0]?.nomor_surat} 
  ${row.original.user.name} 
  ${row.original.repo[0]?.indikator.name}
  ${row.original.repo[0]?.indikator.strategi.name}
  }`;

  // Perform a case-insensitive comparison
  return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
};

export const columns: ColumnDef<Letter>[] = [
  {
    accessorKey: "judul",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Judul" />
    ),
    filterFn: multiColumnFilterFn,
    cell: ({ row }) => {
      const judul = row.original.judul;
      return <div>{judul.split(".")[0].split("-")[0]}</div>;
    },
  },
  {
    accessorKey: "nomor surat",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nomor Surat" />
    ),
    filterFn: multiColumnFilterFn,
    cell: ({ row }) => {
      const nomorSurat = row.original.nomor_surat;
      return <div>{nomorSurat[0] ? nomorSurat[0]?.nomor_surat : "-"}</div>;
    },
  },
  {
    accessorKey: "pembuat",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pembuat" />
    ),
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div>
          {user.name}, {user.prodi?.name}
        </div>
      );
    },
    filterFn: multiColumnFilterFn,
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

      const getBadgeColor = (data: String) => {
        let color;
        if (data.includes("BSRE")) color = "rgb(30,144,255)"; // biru
        else if (data.includes("Admin Dekan"))
          color = `rgb(150, 123, 182)`; //ungu
        else if (data.includes("Daftar Tunggu") || data.includes("Diproses"))
          color = "rgb(250 204 21)"; // warna pengganti untuk bg-warning
        else if (data.includes("Ditolak"))
          color = "rgb(239 68 68)"; // warna pengganti untuk bg-danger
        else if (data.includes("Ditandatangani"))
          color = "rgb(34 197 94)"; // warna pengganti untuk bg-success
        else color = "rgb(120 113 108)"; // default color
        return color;
      };
      let color = getBadgeColor(statusSurat);

      return (
        <>
          {color && (
            <Badge
              style={{
                backgroundColor: color, // menggantikan "bg-warning" dengan warna yang sesuai
                color: "white",
              }}
            >
              <p className="text-center w-full rounded-md">{statusSurat}</p>
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
    accessorKey: "status.updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Diperbarui" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.status.updatedAt);

      const options = {
        weekday: "long" as "long",
        day: "numeric" as "numeric",
        month: "long" as "long",
        year: "numeric" as "numeric",
        hour: "2-digit" as "2-digit",
        minute: "2-digit" as "2-digit",
        second: "2-digit" as "2-digit",
        hour12: false, // Format 24 jam
      };
      const formattedDate = new Intl.DateTimeFormat("id-ID", options).format(
        date
      );

      return formattedDate;
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
    filterFn: multiColumnFilterFn,
    cell: ({ row }) => {
      const repo = row.original.repo;
      const indikator = repo && repo.length > 0 ? repo[0].indikator : null;
      return <div>{indikator ? indikator.name : "-"}</div>;
    },
  },

  {
    accessorKey: "strategi",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Strategi" />
    ),
    filterFn: multiColumnFilterFn,
    cell: ({ row }) => {
      const repo = row.original.repo;
      const strategi =
        repo && repo.length > 0 && repo[0].indikator
          ? repo[0].indikator.strategi
          : null;
      return <div>{strategi ? strategi.name : "-"}</div>;
    },
  },
  {
    accessorKey: "catatan IKU",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Catatan IKU" />
    ),
    filterFn: multiColumnFilterFn,
    cell: ({ row }) => {
      const repo = row.original.repo;
      const catatan =
        repo && repo.length > 0 && repo[0].indikator ? repo[0].catatan : null;
      return <div>{catatan ? catatan : "-"}</div>;
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
        !user?.jabatan.jabatan_atas &&
        !letter.status.status.includes("Ditandatangani");

      const getFileUrl = async () => {
        const response = await axios.get(
          `/api/surat/download?filepath=${letter.path}`,
          {
            responseType: "arraybuffer",
          }
        );

        const file = new Blob([response.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        return fileURL;
      };

      const handleDownload = async () => {
        let link = document.createElement("a");
        link.href = await getFileUrl();

        link.setAttribute(
          "download",
          `${
            letter.nomor_surat[letter.nomor_surat.length - 1]?.nomor_surat
          } - ${letter.judul.split(".")[0]}.pdf`
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
              event.preventDefault();
              event.stopPropagation();
              window.open(`/surat/${letter.id}`, "_blank");
            }}
            className="bg-primary hover:bg-opacity-90 text-white"
          >
            <ExternalLink className="h-5 w-5" />
          </Button>
          {canDownload && (
            <Button
              variant="default"
              size="sm"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleDownload();
              }}
              className="bg-primary hover:bg-opacity-90 text-white"
            >
              <DownloadIcon className="h-5 w-5" />
            </Button>
          )}
        </div>
      );
    },
  },
  // ...
];
