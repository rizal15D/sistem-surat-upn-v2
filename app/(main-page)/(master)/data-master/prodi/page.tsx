"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useState } from "react";

import { Prodi, columns } from "./columns";
import { DataTable } from "./data-table";
import Modal from "@/components/Modal/Modal";
import ProdiForm from "./prodi-form";
import { useToast } from "@/components/ui/use-toast";

async function getData(): Promise<Prodi[]> {
  // Fetch data from your API here.
  const response = await axios.get("/api/prodi");
  return response.data;
}

export default function DataMasterProdiPage() {
  const queryClient = useQueryClient();
  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const { toast } = useToast();

  const { data = [], isLoading } = useQuery({
    queryKey: ["prodi"],
    queryFn: getData,
  });

  const { mutate } = useMutation({
    mutationFn: async (input: {
      name: any;
      kode_prodi: string;
      fakultas_id: string;
    }) => {
      const response = await axios.post(`/api/prodi/`, { input });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prodi"] });
      setModalCreateOpen(false);
      toast({
        title: "Berhasil menambahkan data",
        className: "bg-success text-white",
      });
    },
  });

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      name: e.currentTarget.nama.value,
      kode_prodi: e.currentTarget.kode_prodi.value,
      fakultas_id: e.currentTarget.fakultas_id.value,
    };

    if (!data.name || !data.kode_prodi || !data.fakultas_id) {
      toast({
        title: "Gagal menambahkan data",
        description: "Data tidak boleh kosong",
        className: "bg-danger text-white",
      });
      return;
    }

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
          Data Master Prodi
        </h1>
        <button
          className="inline-flex items-center justify-center rounded-lg bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          onClick={() => setModalCreateOpen(true)}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Tambah Prodi
        </button>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={data} />
        </div>
      </div>

      {modalCreateOpen && (
        <Modal setModalOpen={setModalCreateOpen}>
          <ProdiForm onSubmit={handleCreate} />
        </Modal>
      )}
    </>
  );
}
