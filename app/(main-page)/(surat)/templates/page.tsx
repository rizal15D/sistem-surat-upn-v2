"use client";

import { useQuery } from "@tanstack/react-query";

import { Template, columns } from "./columns";
import { DataTable } from "./data-table";
import axios from "axios";
import { useMemo } from "react";
import { Jenis } from "../../(master)/data-master/jenis-surat/columns";

async function getData(): Promise<Template[]> {
  // Fetch data from your API here.
  const response = await axios.get("/api/template");
  return response.data;
}

export default function ListSuratPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["template"],
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

  if (isLoading) {
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
          Template Surat
        </h1>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={data} filterData={filterData} />
        </div>
      </div>
    </>
  );
}
