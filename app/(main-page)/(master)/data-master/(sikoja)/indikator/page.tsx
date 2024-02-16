"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "@radix-ui/react-icons";
import axios from "axios";

import { Indikator, columns } from "./columns";
import { DataTable } from "./data-table";
import Modal from "@/components/Modal/Modal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import IndikatorForm from "./indikator-form";
import { useToast } from "@/components/ui/use-toast";

async function getData(): Promise<Indikator[]> {
  // Fetch data from your API here.
  const response = await axios.get("/api/sikoja/indikator");
  return response.data;
}

export default function DataMasterRolePage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data = [], isLoading: isJenisLoading } = useQuery({
    queryKey: ["indikator"],
    queryFn: getData,
  });

  const { mutate } = useMutation({
    mutationFn: async (input: {
      name: string;
      strategi_id: number;
      iku_id: number;
    }) => {
      setIsLoading(true);
      const response = await axios.post(`/api/sikoja/indikator/`, { input });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["indikator"] });
      setModalCreateOpen(false);
      toast({
        title: "Berhasil menambahkan data",
        className: "bg-success text-white",
      });
    },
    onError: (error) => {
      toast({
        title: "Gagal menambah data",
        description: error.message,
        className: "bg-danger text-white",
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      name: e.currentTarget.nama.value,
      strategi_id: e.currentTarget.strategi_id.value,
      iku_id: e.currentTarget.iku_id.value,
    };

    if (!data.name || !data.strategi_id || !data.iku_id) {
      toast({
        title: "Gagal menambah data",
        description: "Data tidak boleh kosong",
        className: "bg-danger text-white",
      });
      return;
    }

    mutate(data);
  };

  if (isJenisLoading) {
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
          Data Master Indikator
        </h1>
        <Button
          onClick={() => setModalCreateOpen(true)}
          className="inline-flex items-center justify-center rounded-lg bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Tambah Indikator
        </Button>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
      {modalCreateOpen && (
        <Modal setModalOpen={setModalCreateOpen}>
          <IndikatorForm onSubmit={handleCreate} isLoading={isLoading} />
        </Modal>
      )}
    </>
  );
}
