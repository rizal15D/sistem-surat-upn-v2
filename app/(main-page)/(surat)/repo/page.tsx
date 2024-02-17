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

export default function ListRepoPage() {
  const session = useSession();
  const user = session.data?.user as User;
  const [prodi_id, setProdi_id] = useState<number[]>(
    user.user.prodi ? [user.user.prodi.id] : []
  );
  const [indikator_id, setIndikatorId] = useState<number[]>([]);
  const [strategi_id, setStrategiId] = useState<number[]>([]);
  const [iku_id, setIkuId] = useState<number[]>([]);
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
    queryKey: [
      "repo",
      { prodi_id, strategi_id, iku_id, indikator_id },
      tableDate,
    ],
    queryFn: async () => {
      const response = await axios.get("/api/sikoja/repo", {
        params: {
          startDate: tableDate.from.toISOString().split("T")[0],
          endDate: tableDate.to.toISOString().split("T")[0],
          prodi_id: JSON.stringify(prodi_id),
          indikator_id: JSON.stringify(indikator_id),
          strategi_id: JSON.stringify(strategi_id),
          iku_id: JSON.stringify(iku_id),
        },
      });

      // const sortedData = response.data.repo.sort(
      //   (a: LetterRepo, b: LetterRepo) =>
      //     new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
      // );

      return response.data.repo;
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

  const { mutate: mutateFilter } = useMutation({
    mutationFn: async (input: {
      selectedProdi: number[];
      selectedIku: number[];
      selectedStrategi: number[];
      selectedIndikator: number[];
    }) => {
      console.log("input", input);
      const response = await axios.get("/api/sikoja/repo", {
        params: {
          prodi_id: JSON.stringify(input.selectedProdi),
          iku_id: JSON.stringify(input.selectedIku),
          strategi_id: JSON.stringify(input.selectedStrategi),
          indikator_id: JSON.stringify(
            input.selectedIndikator.map((indikator: any) => indikator.value.id)
          ),
        },
      });
      return response.data.repo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["repo"],
      });
      toast({
        title: "Berhasil menghapus data",
        className: "bg-success text-white",
      });
    },
    onError: (error) => {
      toast({
        title: "Gagal menghapus data",
        description: error.message,
        className: "bg-danger text-white",
      });
    },
  });

  const handleFilter = async ({
    prodi_id,
    iku_id,
    strategi_id,
    indikator_id,
  }: {
    prodi_id: number[];
    iku_id: number[];
    strategi_id: number[];
    indikator_id: number[];
  }) => {
    setProdi_id(prodi_id);
    setIkuId(iku_id);
    setStrategiId(strategi_id);
    setIndikatorId(indikator_id);
  };

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
            prodiData={prodiData}
            handleFilter={handleFilter}
            onDateRangeApply={handleOnDateRangeApply}
            date={date}
            setDate={setDate}
          />
        </div>
      </div>
    </>
  );
}
