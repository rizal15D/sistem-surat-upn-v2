"use client";
import { useQuery } from "@tanstack/react-query";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Users, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Users[]> {
  // Fetch data from your API here.
  return [
    {
      id: "1",
      name: "Ardi",
      email: "ardi@gmail.com",
      role: "Admin",
      aktif: true,
    },
    {
      id: "2",
      name: "Bayu",
      email: "bayu@gmail.com",
      role: "TU",
      aktif: true,
    },
    {
      id: "3",
      name: "Candra",
      email: "candra@gmail.com",
      role: "Dekan",
      aktif: false,
    },
    {
      id: "4",
      name: "Dian",
      email: "dian@gmail.com",
      role: "Dosen",
      aktif: true,
    },
    {
      id: "5",
      name: "Eka",
      email: "eka@gmail.com",
      role: "Mahasiswa",
      aktif: false,
    },
    {
      id: "6",
      name: "Fajar",
      email: "fajar@gmail.com",
      role: "Mahasiswa",
      aktif: true,
    },
    {
      id: "7",
      name: "Gita",
      email: "gita@gmail.com",
      role: "Admin",
      aktif: false,
    },
  ];
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
