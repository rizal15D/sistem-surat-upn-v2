"use client";

import { PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Letter, columns } from "./columns";
import { DataTable } from "./data-table";
import axios from "axios";
import { useSession } from "next-auth/react";
import { User } from "@/app/api/auth/[...nextauth]/authOptions";
import { useMemo } from "react";
import { Jenis } from "../../(master)/data-master/jenis-surat/columns";

async function getData(): Promise<Letter[]> {
  // Fetch data from your API here.
  const { data } = await axios.get("/api/surat");
  // sort data based on creationDate (descending)
  data.sort((a: any, b: any) => {
    return new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime();
  });
  return data;
}

export default function ListSuratPage() {
  const session = useSession();
  const user = session.data?.user as User;

  const { data = [], isLoading } = useQuery({
    queryKey: ["surat"],
    queryFn: getData,
  });

  const { data: jenisData, isLoading: isJenisLoading } = useQuery({
    queryKey: ["jenis-surat"],
    queryFn: async () => {
      const response = await axios.get("/api/jenis-surat");
      return response.data;
    },
  });

  const filterData = useMemo(() => {
    if (jenisData) {
      return {
        jenis: jenisData.map((jenis: Jenis) => ({
          value: [jenis.jenis],
          label: jenis.jenis,
        })),
      };
    }
    return {};
  }, [jenisData]);

  if (isLoading || isJenisLoading) {
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
          Daftar Surat
        </h1>
        {user.jabatan.permision.buat_surat && (
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
          <DataTable columns={columns} data={data} filterData={filterData} />
        </div>
      </div>
    </>
  );
}
