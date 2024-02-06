"use client";

import { PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { LetterRepo, columns } from "./columns";
import { DataTable } from "./data-table";
import axios from "axios";
import { useSession } from "next-auth/react";
import { User } from "@/app/api/auth/[...nextauth]/authOptions";
import { useMemo, useState } from "react";
import { Jenis } from "../../(master)/data-master/jenis-surat/columns";
import { useToast } from "@/components/ui/use-toast";

export default function ListSuratPage() {
  const session = useSession();
  const user = session.data?.user as User;
  const [prodiId, setProdiId] = useState<number>(
    user.user.prodi ? user.user.prodi.id : 1
  );
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [date, setDate] = useState({
    from: new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      new Date().getDate(),
      7,
      0,
      0
    ),
    to: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      7,
      0,
      0
    ),
  });

  const [tableDate, setTableDate] = useState({
    from: new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      new Date().getDate(),
      7,
      0,
      0
    ),
    to: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      7,
      0,
      0
    ),
  });

  const { data = [], isLoading } = useQuery({
    queryKey: ["repo", prodiId, tableDate],
    queryFn: async () => {
      const response = await axios.get(
        `/api/surat?startDate=${new Date(
          tableDate.from.getFullYear(),
          tableDate.from.getMonth(),
          tableDate.from.getDate(),
          0,
          0,
          0
        )}&endDate=${new Date(
          tableDate.to.getFullYear(),
          tableDate.to.getMonth(),
          tableDate.to.getDate(),
          0,
          0,
          0
        )}&prodi_id=${prodiId}&repo=true`
      );

      const sortedData = response.data.sort(
        (a: LetterRepo, b: LetterRepo) =>
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

  const allowedProdiData = useMemo(() => {
    if (prodiData) {
      const prodiData2 = prodiData.map((prodi: any) => {
        if (prodi.name === "-") {
          return { id: prodi.id, name: "TU" };
        }
        return prodi;
      }, []);

      if (user.jabatan.permision.view_all_repo) return prodiData2;
      return prodiData2.filter((prodi: any) => prodi.id === user.user.prodi.id);
    }
    return [];
  }, [prodiData]);

  const filterData = useMemo(() => {
    if (prodiData && jenisData) {
      return {
        jenis: jenisData.map((jenis: Jenis) => ({
          value: [jenis.jenis],
          label: jenis.jenis,
        })),
      };
    }
    return {};
  }, [jenisData]);

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

      // if (date.to === date.from) {
      //   date.to = new Date(
      //     date.to.getFullYear(),
      //     date.to.getMonth(),
      //     date.to.getDate() + 1,
      //     0,
      //     0,
      //     0
      //   );
      // }

      setTableDate({
        from: new Date(
          date.from.getFullYear(),
          date.from.getMonth(),
          date.from.getDate(),
          7,
          0,
          0
        ),
        to: new Date(
          date.to.getFullYear(),
          date.to.getMonth(),
          date.to.getDate(),
          7,
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
      <div className="w-full flex justify-between items-center pb-4">
        <h1 className="text-title-md2 font-semibold text-black dark:text-white">
          Repositori
        </h1>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="container mx-auto py-10">
          <DataTable
            columns={columns}
            data={data}
            filterData={filterData}
            prodiData={allowedProdiData}
            prodiId={prodiId}
            setProdiId={setProdiId}
            onDateRangeApply={handleOnDateRangeApply}
            date={date}
            setDate={setDate}
          />
        </div>
      </div>
    </>
  );
}
