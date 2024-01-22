"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InfoCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableComponents/DataTableColumnHeader";
import { useState } from "react";
import Modal from "@/components/Modal/Modal";
import RoleForm from "./jenis-surat-form";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { useToast } from "@/components/ui/use-toast";

export type Jenis = {
  id: number;
  jenis: string;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<Jenis>[] = [
  {
    accessorKey: "jenis",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const jenis = row.original;
      const queryClient = useQueryClient();
      const { toast } = useToast();
      const [isLoading, setIsLoading] = useState(false);

      const [modalEditOpen, setModalEditOpen] = useState(false);
      const [modalDeleteOpen, setModalDeleteOpen] = useState(false);

      const { mutate: mutateDelete } = useMutation({
        mutationFn: async () => {
          const { data } = await axios.delete(`/api/jenis-surat`, {
            data: { id: jenis.id },
          });
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["jenis-surat"],
          });
          setModalDeleteOpen(false);
          toast({
            title: "Berhasil menghapus data",
            className: "bg-success text-white",
          });
        },
        onError: (error) => {
          toast({
            title: "Gagal menghapus data",
            description: error.message,
            className: "bg-danger text-white",
          });
        },
      });

      const { mutate: mutatePut } = useMutation({
        mutationFn: async (input: { id: number; jenis: any }) => {
          setIsLoading(true);
          const { data } = await axios.put(`/api/jenis-surat`, {
            id: jenis.id,
            input,
          });
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["jenis-surat"],
          });
          setModalEditOpen(false);
          toast({
            title: "Berhasil mengubah data",
            className: "bg-success text-white",
          });
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
        const input = {
          id: jenis.id,
          jenis: e.currentTarget.jenis.value,
        };

        if (!input.jenis) {
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
              <RoleForm
                onSubmit={handleEdit}
                values={jenis}
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
              title="Hapus jenis surat"
              message={`Apakah anda yakin ingin menghapus jenis surat ${
                jenis.jenis || "ini"
              }?`}
            />
          )}
        </>
      );
    },
  },
  // ...
];
