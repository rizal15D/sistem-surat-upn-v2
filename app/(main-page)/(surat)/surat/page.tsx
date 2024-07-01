"use client";

import { PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Letter, columns } from "./columns";
import { DataTable } from "./data-table";
import axios from "axios";
import { useSession } from "next-auth/react";
import { User } from "@/app/api/auth/[...nextauth]/authOptions";
import { useEffect, useMemo, useState } from "react";
import { Jenis } from "../../(master)/data-master/jenis-surat/columns";
import { useToast } from "@/components/ui/use-toast";
import { SocketData } from "@/app/(auth)/login/SocketData";

export default function ListSuratPage() {
  const session = useSession();
  const user = session.data?.user as User;
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [date, setDate] = useState({
    from: new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      new Date().getDate(),
      0,
      0,
      0
    ),
    to: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      0,
      0,
      0
    ),
  });

  const [tableDate, setTableDate] = useState({
    from: new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      new Date().getDate(),
      0,
      0,
      0
    ),
    to: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      0,
      0,
      0
    ),
  });

  const { data = [], isLoading } = useQuery({
    queryKey: ["surat", tableDate],
    queryFn: async () => {
      const response = await axios.get(
        `/api/surat?startDate=${tableDate.from}&endDate=${new Date(
          tableDate.to.getFullYear(),
          tableDate.to.getMonth(),
          tableDate.to.getDate(),
          0,
          0,
          0
        )}`
      );

      const sortedData = response.data.sort(
        (a: Letter, b: Letter) =>
          new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
      );

      return sortedData;
    },
  });

  const { data: jenisData, isLoading: isJenisLoading } = useQuery({
    queryKey: ["jenis-surat"],
    queryFn: async () => {
      const response = await axios.get("/api/jenis-surat");
      return response.data;
    },
  });

  const { data: prodiData, isLoading: isProdiLoading } = useQuery({
    queryKey: ["prodi"],
    queryFn: async () => {
      const response = await axios.get("/api/prodi");
      return response.data;
    },
  });

  const filterData = useMemo(() => {
    if (prodiData && jenisData) {
      return {
        jenis: jenisData.map((jenis: Jenis) => ({
          value: [jenis.jenis],
          label: jenis.jenis,
        })),
        status: [
          {
            value: ["Daftar Tunggu", "Diproses", "Disetujui"],
            label: "Diproses",
          },
          { value: ["Ditandatangani"], label: "Diterima" },
          { value: ["Ditolak"], label: "Ditolak" },
        ],
      };
    }
    return {};
  }, [jenisData]);

  useEffect(() => {
    let socket = SocketData();
    socket.on("message", (data) => {
      const parts = data.split("/");

      if (data == `private new mail/${user?.jabatan.id}`) {
        queryClient.invalidateQueries({ queryKey: ["surat"] });
      }
    });
  }, []);

  const handleOnDateRangeApply = useMemo(
    () => (date: { from: Date; to: Date }) => {
      if (!date.from && !date.to) {
        toast({
          title: "Gagal",
          description: "Inputkan tanggal dengan benar",
          className: "bg-danger text-white",
        });
        return;
      }

      if (!date.from) {
        date.from = date.to;
      }

      if (!date.to) {
        date.to = date.from;
      }

      setTableDate({
        from: new Date(
          date.from.getFullYear(),
          date.from.getMonth(),
          date.from.getDate(),
          0,
          0,
          0
        ),
        to: new Date(
          date.to.getFullYear(),
          date.to.getMonth(),
          date.to.getDate(),
          0,
          0,
          0
        ),
      });
      queryClient.invalidateQueries({ queryKey: ["surat"] });
    },
    []
  );

  if (isLoading || isJenisLoading || isProdiLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      {/* <Socket /> */}
      <div className="w-full flex justify-between items-center pb-4">
        <h1 className="text-title-md2 font-semibold text-black dark:text-white">
          Daftar Surat
        </h1>
        {user?.jabatan.permision.buat_surat && (
          <Link
            href="/surat/upload"
            className="inline-flex items-center justify-center rounded-lg bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Upload Surat
          </Link>
        )}
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="container mx-auto py-10">
          <DataTable
            columns={columns}
            data={data}
            filterData={filterData}
            onDateRangeApply={handleOnDateRangeApply}
            date={date}
            setDate={setDate}
          />
        </div>
      </div>
    </>
  );
}
