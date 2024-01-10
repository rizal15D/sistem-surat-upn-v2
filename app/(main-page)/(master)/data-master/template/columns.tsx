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

export type Template = {
  id: string;
  judul: string;
  jenis: string;
  deskripsi: string;
  surat: File;
  thumbnail: File;
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
      const rowValue = (row.getValue(id) as string).split(" ");
      return value.some((val: string[]) =>
        val.some((v) => rowValue.includes(v))
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const template = row.original;
      const queryClient = useQueryClient();
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
        },
      });

      const { mutate: mutatePut } = useMutation({
        mutationFn: async (input: {
          judul: any;
          surat: File;
          thumbnail: File;
          jenis: any;
          deskripsi: any;
        }) => {
          const response = await axios.put(
            `/api/template`,
            {
              id: template.id,
              judul: input.judul,
              surat: input.surat,
              thumbnail: input.thumbnail,
              jenis: input.jenis,
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
          setModalEditOpen(false);
        },
      });

      const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        mutatePut({
          judul: formData.get("judul"),
          surat: formData.get("file") as File,
          thumbnail: formData.get("file") as File,
          jenis: formData.get("jenis"),
          deskripsi: formData.get("deskripsi"),
        });
      };

      const handleDownload = async () => {
        const response = await axios.get("/api/template/download", {
          responseType: "blob",
          params: {
            id: template.id,
          },
        });

        const url = window.URL.createObjectURL(
          new Blob([response.data], {
            type: response.headers["content-type"],
          })
        );

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", template.judul + ".docx");
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
          </div>
          <div className="flex items-center space-x-2 text-white">
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
            />
          )}
          {modalEditOpen && (
            <Modal setModalOpen={setModalEditOpen}>
              <TemplateForm onSubmit={handleEdit} values={template} />
            </Modal>
          )}
        </>
      );
    },
  },
  // ...
];
