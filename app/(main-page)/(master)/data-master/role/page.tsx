"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "@radix-ui/react-icons";
import axios from "axios";

import { Role, columns } from "./columns";
import { DataTable } from "./data-table";
import Modal from "@/components/Modal/Modal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import RoleForm from "./role-form";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { User } from "@/app/api/auth/[...nextauth]/authOptions";
import { useRouter } from "next/navigation";

async function getData(): Promise<Role[]> {
  // Fetch data from your API here.
  const response = await axios.get("/api/role");
  return response.data;
}

export default function DataMasterRolePage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const session = useSession();
  const user = session.data?.user as User;

  if (!user.jabatan.permision.akses_master.jabatan) {
    const router = useRouter();
    router.push("/surat");
  }

  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data = [], isLoading: isRoleLoading } = useQuery({
    queryKey: ["role"],
    queryFn: getData,
  });

  const { mutate } = useMutation({
    mutationFn: async (input: { name: string }) => {
      setIsLoading(true);
      const response = await axios.post(`/api/role/`, { input });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role"] });
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
      jabatan_atas_id: e.currentTarget.jabatan_atas_id.value,
      // edit permision
      buat_surat: e.currentTarget.buat_surat.checked,
      download_surat: e.currentTarget.download_surat.checked,
      generate_nomor_surat: e.currentTarget.generate_nomor_surat.checked,
      upload_tandatangan: e.currentTarget.upload_tandatangan.checked,
      persetujuan: e.currentTarget.persetujuan.checked,
      // edit akses master
      prodi: e.currentTarget.prodi.checked,
      template: e.currentTarget.template.checked,
      periode: e.currentTarget.periode.checked,
      fakultas: e.currentTarget.fakultas.checked,
      jabatan: e.currentTarget.jabatan.checked,
      jenis_surat: e.currentTarget.jenis_surat.checked,
    };

    if (!data.name) {
      toast({
        title: "Gagal menambah data",
        description: "Nama tidak boleh kosong",
      });
      return;
    }

    mutate(data);
  };

  if (isRoleLoading) {
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
          Data Master Jabatan
        </h1>
        <Button
          onClick={() => setModalCreateOpen(true)}
          className="inline-flex items-center justify-center rounded-lg bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Tambah Jabatan
        </Button>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
      {modalCreateOpen && (
        <Modal setModalOpen={setModalCreateOpen}>
          <RoleForm onSubmit={handleCreate} isLoading={isLoading} />
        </Modal>
      )}
    </>
  );
}
