"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Role } from "../columns";

export default function RoleSinglePage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { id } = useParams();

  const allData = queryClient.getQueryData<Role[]>(["role"]);
  const singleData = allData
    ? allData.find((item) => item.id === Number(id))
    : null;

  const [input, setInput] = useState({
    name: singleData?.name,
  });

  const { mutate } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.put(`/api/role`, { id, input });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["role"],
      });
      router.push("/data-master/role");
    },
  });

  return (
    <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-10 w-full">
      <div className="lg:col-span-1 sm:col-span-1 row-span-2 rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="container mx-auto py-10">
          <h1 className="text-3xl pb-6 font-semibold text-black dark:text-white">
            Detail Role
          </h1>

          <div className="flex flex-col space-y-2 gap-2">
            <div className="flex flex-col space-y-1">
              <span className="text-title-sm font-medium text-black dark:text-white">
                Nama
              </span>
              <span className="text-body-sm text-black dark:text-white">
                {singleData?.name}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-title-sm font-medium text-black dark:text-white">
                Dibuat Tanggal
              </span>
              <span className="text-body-sm text-black dark:text-white">
                {singleData?.createdAt}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-title-sm font-medium text-black dark:text-white">
                Dirubah Tanggal
              </span>
              <span className="text-body-sm text-black dark:text-white">
                {singleData?.updatedAt}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-1 sm:col-span-1 row-span-1 rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="container mx-auto py-10">
          <h1 className="text-3xl pb-6 font-semibold text-black dark:text-white">
            Edit Role
          </h1>

          <div className="flex flex-col space-y-2 gap-2">
            <div className="flex flex-col space-y-1">
              <span className="text-title-sm font-medium text-black dark:text-white">
                Nama
              </span>
              <input
                type="text"
                className="text-body-sm text-black dark:text-white border border-stroke rounded-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={input.name}
                onChange={(e) => setInput({ ...input, name: e.target.value })}
              />
              <button onClick={() => mutate()}>Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
