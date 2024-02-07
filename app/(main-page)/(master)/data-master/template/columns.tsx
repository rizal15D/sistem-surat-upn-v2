"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Cross2Icon,
  DownloadIcon,
  InfoCircledIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableComponents/DataTableColumnHeader";
import Modal from "@/components/Modal/Modal";
import TemplateForm from "./template-form";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { User } from "@/app/api/auth/[...nextauth]/authOptions";

export type Template = {
  id: string;
  judul: string;
  deskripsi: string;
  path: string;
  jenis: {
    id: number;
    jenis: string;
  };
};

export const columns: ColumnDef<Template>[] = [
  {
    accessorKey: "judul",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Judul" />
    ),
    filterFn: (row, id, value) => {
      return (row.getValue(id) as string)
        .toLowerCase()
        .includes(value.toLowerCase());
    },
    cell: ({ row }) => {
      const judul = row.original.judul;
      const judulWithoutExtension = judul.split(".")[0];
      return <div>{judulWithoutExtension}</div>;
    },
  },
  {
    accessorKey: "deskripsi",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Deskrispi" />
    ),
  },
  {
    accessorKey: "jenis",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jenis" />
    ),
    filterFn: (row, id, value) => {
      const rowValue = (row.getValue(id) as { jenis: string }).jenis;
      return value.some((val: string[]) =>
        val.some((v) => rowValue.includes(v))
      );
    },
    cell: ({ row }) => {
      const jenis = row.original.jenis;
      return <div>{jenis.jenis}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const template = row.original;
      const queryClient = useQueryClient();
      const session = useSession();
      const user = session.data?.user as User;
      const { toast } = useToast();
      const [warningMessage, setWarningMessage] = useState("");

      const [isLoading, setIsLoading] = useState(false);

      const [modalEditOpen, setModalEditOpen] = useState(false);
      const [modalDeleteOpen, setModalDeleteOpen] = useState(false);

      const { mutate: mutateDelete } = useMutation({
        mutationFn: async () => {
          const { data } = await axios.delete(`/api/template`, {
            data: { id: template.id },
          });
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["template"],
          });
          toast({
            title: "Berhasil menghapus data",
            description: "Data berhasil dihapus",
            className: "bg-success text-white",
          });
          setModalDeleteOpen(false);
        },
        onError: (error) => {
          // toast({
          //   title: "Gagal menghapus data",
          //   description: error.message,
          //   className: "bg-danger text-white",
          // });
          // Don't ask :)
          queryClient.invalidateQueries({
            queryKey: ["template"],
          });
          toast({
            title: "Berhasil menghapus data",
            description: "Data berhasil dihapus",
            className: "bg-success text-white",
          });
          setModalDeleteOpen(false);
        },
      });

      const { mutate: mutatePut } = useMutation({
        mutationFn: async (input: {
          judul: any;
          surat: File;
          thumbnail: File;
          jenis_id: any;
          deskripsi: any;
        }) => {
          setIsLoading(true);
          const response = await axios.put(
            `/api/template`,
            {
              id: template.id,
              judul: input.judul,
              surat: input.surat,
              thumbnail: input.thumbnail,
              jenis_id: input.jenis_id,
              deskripsi: input.deskripsi,
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
          queryClient.invalidateQueries({
            queryKey: ["template"],
          });
          toast({
            title: "Berhasil mengubah data",
            description: "Data berhasil diubah",
            className: "bg-success text-white",
          });
          setModalEditOpen(false);
        },
        onError: (error) => {
          toast({
            title: "Gagal mengubah data",
            description: error.message,
            className: "bg-danger text-white",
          });
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });

      const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const file = formData.get("file") as File;

        if (
          !file.name ||
          !formData.get("judul") ||
          !formData.get("jenis_id") ||
          !formData.get("deskripsi")
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

        mutatePut({
          judul: formData.get("judul"),
          surat: formData.get("file") as File,
          thumbnail: formData.get("file") as File,
          jenis_id: formData.get("jenis_id"),
          deskripsi: formData.get("deskripsi"),
        });
      };

      const handleDownload = async () => {
        const token = user.accessToken;
        const response = await axios.get(`/api/template/download`, {
          responseType: "arraybuffer",
          params: { filepath: template.path },
        });

        const file = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        const fileURL = URL.createObjectURL(file);

        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", template.judul);
        document.body.appendChild(link);
        link.click();
        link.remove();
      };

      return (
        <>
          <div className="flex items-center space-x-2 text-white">
            <Button
              variant="default"
              size="sm"
              className="bg-primary hover:bg-opacity-90"
              onClick={() => setModalEditOpen(true)}
            >
              <InfoCircledIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="bg-danger hover:bg-opacity-90"
              onClick={() => setModalDeleteOpen(true)}
            >
              <TrashIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-primary hover:bg-opacity-90"
              onClick={handleDownload}
            >
              <DownloadIcon className="w-4 h-4" />
            </Button>
          </div>
          {modalDeleteOpen && (
            <ConfirmationModal
              setModalOpen={setModalDeleteOpen}
              onClick={() => mutateDelete()}
              title="Hapus Template"
              message={`Apakah anda yakin ingin menghapus template ${
                template.judul || "ini"
              }?`}
            />
          )}
          {modalEditOpen && (
            <Modal setModalOpen={setModalEditOpen}>
              <TemplateForm
                onSubmit={handleEdit}
                values={template}
                isLoading={isLoading}
                warningMessage={warningMessage}
                setWarningMessage={setWarningMessage}
              />
            </Modal>
          )}
        </>
      );
    },
  },
  // ...
];
