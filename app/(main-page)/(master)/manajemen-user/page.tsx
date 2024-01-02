"use client";
import { useQuery } from "@tanstack/react-query";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52g",
      amount: 200,
      status: "processing",
      email: "",
    },
    {
      id: "728ed52h",
      amount: 300,
      status: "success",
      email: "",
    },
    {
      id: "728ed52i",
      amount: 400,
      status: "failed",
      email: "",
    },
    {
      id: "728ed52j",
      amount: 500,
      status: "pending",
      email: "",
    },
    {
      id: "728ed52k",
      amount: 600,
      status: "processing",
      email: "",
    },
    {
      id: "728ed52l",
      amount: 700,
      status: "success",
      email: "",
    },
    {
      id: "728ed52m",
      amount: 800,
      status: "failed",
      email: "",
    },
    {
      id: "728ed52n",
      amount: 900,
      status: "pending",
      email: "",
    },
    {
      id: "728ed52o",
      amount: 1000,
      status: "processing",
      email: "",
    },
    {
      id: "728ed52p",
      amount: 1100,
      status: "success",
      email: "",
    },
    {
      id: "728ed52q",
      amount: 1200,
      status: "failed",
      email: "",
    },
    {
      id: "728ed52r",
      amount: 1300,
      status: "pending",
      email: "",
    },
    {
      id: "728ed52s",
      amount: 1400,
      status: "processing",
      email: "",
    },
    {
      id: "728ed52t",
      amount: 1500,
      status: "success",
      email: "",
    },
    {
      id: "728ed52u",
      amount: 1600,
      status: "failed",
      email: "",
    },
    {
      id: "728ed52v",
      amount: 1700,
      status: "pending",
      email: "",
    },
    {
      id: "728ed52w",
      amount: 1800,
      status: "processing",
      email: "",
    },
    {
      id: "728ed52x",
      amount: 1900,
      status: "success",
      email: "",
    },
    {
      id: "728ed52y",
      amount: 2000,
      status: "failed",
      email: "",
    },
    {
      id: "728ed52z",
      amount: 2100,
      status: "pending",
      email: "",
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
