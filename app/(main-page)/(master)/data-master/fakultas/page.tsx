"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Fakultas, columns } from "./columns";
import { DataTable } from "./data-table";
import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useState } from "react";
import Modal from "@/components/Modal/Modal";

async function getData(): Promise<Fakultas[]> {
  // Fetch data from your API here.
  const response = await axios.get("/api/fakultas");
  return response.data;
}

export default function DataMasterFakultasPage() {
  const queryClient = useQueryClient();
  const [modalCreateOpen, setModalCreateOpen] = useState(false);

  const { data = [], isLoading } = useQuery({
    queryKey: ["fakultas"],
    queryFn: getData,
  });

  const { mutate } = useMutation({
    mutationFn: async (input: {
      name: any;
      jenjang: string;
      kode_fakultas: string;
    }) => {
      const response = await axios.post(`/api/fakultas/`, { input });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fakultas"] });
      setModalCreateOpen(false);
    },
  });

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      name: e.currentTarget.nama.value,
      jenjang: e.currentTarget.jenjang.value,
      kode_fakultas: e.currentTarget.kode_fakultas.value,
    };

    mutate(data);
  };

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
          Data Master Fakultas
        </h1>
        <button
          onClick={() => setModalCreateOpen(true)}
          className="inline-flex items-center justify-center rounded-lg bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Tambah Fakultas
        </button>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
      {modalCreateOpen && (
        <Modal setModalOpen={setModalCreateOpen}>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Tambah Fakultas
              </h3>
            </div>
            <form onSubmit={handleCreate}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Nama <span className="text-meta-1">*</span>
                  </label>
                  <input
                    name="nama"
                    type="text"
                    placeholder="Masukkan nama fakultas"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Jenjang <span className="text-meta-1">*</span>
                  </label>
                  <input
                    name="jenjang"
                    type="text"
                    placeholder="Masukkan jenjang"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Kode Fakultas <span className="text-meta-1">*</span>
                  </label>
                  <input
                    name="kode_fakultas"
                    type="text"
                    placeholder="Masukkan kode fakultas"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <button className="mt-6 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
                  Buat Fakultas
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
}
