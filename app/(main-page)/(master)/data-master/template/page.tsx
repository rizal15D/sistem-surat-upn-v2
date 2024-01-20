"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useState } from "react";

import { Template, columns } from "./columns";
import { DataTable } from "./data-table";
import TemplateForm from "./template-form";
import Modal from "@/components/Modal/Modal";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { User } from "@/app/api/auth/[...nextauth]/authOptions";
import { useRouter } from "next/navigation";

async function getData(): Promise<Template[]> {
  // Fetch data from your API here.
  const response = await axios.get("/api/template");
  return response.data;
}

export default function DataMasterTemplatePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const session = useSession();
  const user = session.data?.user as User;

  if (!user.jabatan.permision.akses_master.template) {
    const router = useRouter();
    router.push("/surat");
  }

  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data = [], isLoading: isTemplateLoading } = useQuery({
    queryKey: ["template"],
    queryFn: getData,
  });

  const { mutate } = useMutation({
    mutationFn: async (input: {
      judul: any;
      deskripsi: any;
      jenis_id: any;
      surat: File;
      thumbnail: File;
    }) => {
      setIsLoading(true);
      const response = await axios.post(
        `/api/template`,
        {
          judul: input.judul,
          deskripsi: input.deskripsi,
          jenis_id: input.jenis_id,
          surat: input.surat,
          thumbnail: input.thumbnail,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["template"] });
      setModalCreateOpen(false);
      toast({
        title: "Berhasil menambahkan data",
        className: "bg-success text-white",
      });
    },
    onError: (error) => {
      toast({
        title: "Gagal",
        description: error.message,
        className: "bg-danger text-white",
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      judul: formData.get("judul"),
      deskripsi: formData.get("deskripsi"),
      jenis_id: formData.get("jenis_id"),
      surat: formData.get("file") as File,
      thumbnail: formData.get("file") as File,
    };

    if (
      !data.judul ||
      !data.deskripsi ||
      !data.jenis_id ||
      !data.surat ||
      !data.thumbnail
    ) {
      toast({
        title: "Gagal menambahkan data",
        description: "Data tidak boleh kosong",
        className: "bg-danger text-white",
      });
      return;
    }

    if (warningMessage) {
      toast({
        title: "Gagal menambahkan data",
        description: warningMessage,
        className: "bg-danger text-white",
      });
      return;
    }

    mutate(data);
  };

  if (isTemplateLoading) {
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
          Data Master Template
        </h1>
        <button
          onClick={() => setModalCreateOpen(true)}
          className="inline-flex items-center justify-center rounded-lg bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Tambah Template
        </button>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
      {modalCreateOpen && (
        <Modal setModalOpen={setModalCreateOpen}>
          <TemplateForm
            onSubmit={handleCreate}
            warningMessage={warningMessage}
            setWarningMessage={setWarningMessage}
            isLoading={isLoading}
          />
        </Modal>
      )}
    </>
  );
}
