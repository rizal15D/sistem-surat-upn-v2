"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useState } from "react";

import { Fakultas, columns } from "./columns";
import { DataTable } from "./data-table";
import Modal from "@/components/Modal/Modal";
import FakultasForm from "./fakultas-form";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { User } from "@/app/api/auth/[...nextauth]/authOptions";
import { useSession } from "next-auth/react";

async function getData(): Promise<Fakultas[]> {
  // Fetch data from your API here.
  const response = await axios.get("/api/fakultas");
  return response.data;
}

export default function DataMasterFakultasPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const session = useSession();
  const user = session.data?.user as User;

  if (!user.jabatan.permision.akses_master.fakultas) {
    const router = useRouter();
    router.push("/surat");
  }

  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data = [], isLoading: isFakultasLoading } = useQuery({
    queryKey: ["fakultas"],
    queryFn: getData,
  });

  const { mutate } = useMutation({
    mutationFn: async (input: {
      name: any;
      jenjang: string;
      kode_fakultas: string;
    }) => {
      setIsLoading(true);
      const response = await axios.post(`/api/fakultas/`, { input });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fakultas"] });
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
      jenjang: e.currentTarget.jenjang.value,
      kode_fakultas: e.currentTarget.kode_fakultas.value,
    };

    if (!data.name || !data.jenjang || !data.kode_fakultas) {
      toast({
        title: "Gagal menambah data",
        description: "Data tidak boleh kosong",
      });
      return;
    }

    mutate(data);
  };

  if (isFakultasLoading) {
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
          <FakultasForm onSubmit={handleCreate} isLoading={isLoading} />
        </Modal>
      )}
    </>
  );
}
