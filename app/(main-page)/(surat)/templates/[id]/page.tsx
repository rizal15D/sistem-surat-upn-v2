"use client";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Template } from "../columns";

export default function SuratSinglePage() {
  const queryClient = useQueryClient();
  const { id } = useParams();

  const allData = queryClient.getQueryData<Template[]>(["template"]);
  const singleData = allData
    ? allData.find((item) => item.id === Number(id))
    : null;

  return (
    <div className="grid sm:grid-cols-1 lg:grid-cols-5 gap-10 w-full">
      <div className="lg:col-span-2 sm:col-span-1 row-span-1 rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="container mx-auto py-10">asd</div>
      </div>
      <div className="lg:col-span-3 sm:col-span-1 row-span-2 rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="container mx-auto py-10">
          <h1 className="text-3xl pb-6 font-semibold text-black dark:text-white">
            Detail Template
          </h1>

          <div className="flex flex-col space-y-2 gap-2">
            <div className="flex flex-col space-y-1">
              <span className="text-title-sm font-medium text-black dark:text-white">
                Judul
              </span>
              <span className="text-body-sm text-black dark:text-white">
                {singleData?.judul}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-title-sm font-medium text-black dark:text-white">
                Deskripsi
              </span>
              <span className="text-body-sm text-black dark:text-white">
                {singleData?.deskripsi}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}