"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Periode, columns } from "./columns";
import { DataTable } from "./data-table";
import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useState } from "react";
import Modal from "@/components/Modal/Modal";
import PeriodeForm from "./periode-form";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { User } from "@/app/api/auth/[...nextauth]/authOptions";
import { useRouter } from "next/navigation";

async function getData(): Promise<Periode[]> {
  // Fetch data from your API here.
  const response = await axios.get("/api/periode");
  return response.data;
}

export default function DataMasterPeriodePage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const session = useSession();
  const user = session.data?.user as User;

  if (!user.jabatan.permision.akses_master.periode) {
    const router = useRouter();
    router.push("/surat");
  }

  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data = [], isLoading: isPeriodeLoading } = useQuery({
    queryKey: ["periode"],
    queryFn: getData,
  });

  const { mutate } = useMutation({
    mutationFn: async (input: { tahun: string }) => {
      setIsLoading(true);
      const response = await axios.post(`/api/periode/`, { input });
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
    onError: (error) => {
      toast({
        title: "Gagal menambahkan data",
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
      tahun: e.currentTarget.tahun.value,
    };

    if (!data.tahun) {
      toast({
        title: "Gagal menambahkan data",
        description: "Data tidak boleh kosong",
        className: "bg-danger text-white",
      });
      return;
    }

    mutate(data);
  };

  if (isPeriodeLoading) {
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
          Data Master Periode
        </h1>
        <button
          onClick={() => setModalCreateOpen(true)}
          className="inline-flex items-center justify-center rounded-lg bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Tambah Periode
        </button>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
      {modalCreateOpen && (
        <Modal setModalOpen={setModalCreateOpen}>
          <PeriodeForm onSubmit={handleCreate} isLoading={isLoading} />
        </Modal>
      )}
    </>
  );
}
