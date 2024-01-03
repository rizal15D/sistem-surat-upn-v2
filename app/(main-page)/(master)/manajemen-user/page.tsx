"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Users, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Users[]> {
  // Fetch data from your API here.
  const url = "https://backend-surat-upn-v2.vercel.app";
  const { data } = await axios.get(`${url}/user`);
  return data;
}

export default function ManajemenUserPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getData,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb title="Manajemen User" />

      <div className="rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
}
