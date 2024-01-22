"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InfoCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

import { DataTableColumnHeader } from "@/components/DataTableComponents/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal/Modal";
import FakultasForm from "./fakultas-form";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { useToast } from "@/components/ui/use-toast";

export type Fakultas = {
  id: string;
  name: string;
  jenjang: string;
  kode_fakultas: string;
};

export const columns: ColumnDef<Fakultas>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
  },
  {
    accessorKey: "jenjang",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jenjang" />
    ),
  },
  {
    accessorKey: "kode_fakultas",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kode Fakultas" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const queryClient = useQueryClient();
      const { toast } = useToast();
      const fakultas = row.original;
      const [isLoading, setIsLoading] = useState(false);

      const [modalEditOpen, setModalEditOpen] = useState(false);
      const [modalDeleteOpen, setModalDeleteOpen] = useState(false);

      const { mutate: mutateDelete } = useMutation({
        mutationFn: async () => {
          const { data } = await axios.delete(`/api/fakultas`, {
            data: { id: fakultas.id },
          });
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["fakultas"],
          });
          setModalDeleteOpen(false);
          toast({
            title: "Berhasil menghapus data",
            description: "Data berhasil dihapus",
            className: "bg-success text-white",
          });
        },
        onError: (error) => {
          toast({
            title: "Gagal menghapus data",
            description: error.message,
            className: "bg-error text-white",
          });
        },
      });

      const { mutate: mutatePut } = useMutation({
        mutationFn: async (input: {
          nama: any;
          jenjang: string;
          kode_fakultas: string;
        }) => {
          setIsLoading(true);
          const { data } = await axios.put(`/api/fakultas`, {
            id: fakultas.id,
            input,
          });
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["fakultas"],
          });
          setModalEditOpen(false);
          toast({
            title: "Berhasil mengubah data",
            description: "Data berhasil diubah",
            className: "bg-success text-white",
          });
        },
        onError: (error) => {
          toast({
            title: "Gagal mengubah data",
            description: error.message,
            className: "bg-error text-white",
          });
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });

      const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const input = {
          nama: e.currentTarget.nama.value,
          jenjang: e.currentTarget.jenjang.value,
          kode_fakultas: e.currentTarget.kode_fakultas.value,
        };

        if (!input.nama || !input.jenjang || !input.kode_fakultas) {
          toast({
            title: "Gagal mengubah data",
            description: "Data tidak boleh kosong",
          });
          return;
        }

        mutatePut(input);
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
          {modalEditOpen && (
            <Modal setModalOpen={setModalEditOpen}>
              <FakultasForm
                onSubmit={handleEdit}
                values={fakultas}
                isLoading={isLoading}
              />
            </Modal>
          )}
          {modalDeleteOpen && (
            <ConfirmationModal
              setModalOpen={setModalDeleteOpen}
              onClick={() => {
                mutateDelete();
              }}
              title="Hapus Fakultas"
              message={`Apakah anda yakin ingin menghapus fakultas ${
                fakultas.name || "ini"
              }?`}
            />
          )}
        </>
      );
    },
  },
  // ...
];
