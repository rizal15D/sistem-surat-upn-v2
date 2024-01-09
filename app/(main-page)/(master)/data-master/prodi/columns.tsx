"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InfoCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableComponents/DataTableColumnHeader";
import Modal from "@/components/Modal/Modal";
import ProdiForm from "./prodi-form";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";

export type Prodi = {
  id: string;
  name: string;
  kode_prodi: string;
  fakultas_id: string;
};

export const columns: ColumnDef<Prodi>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
  },
  {
    accessorKey: "kode_prodi",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kode Prodi" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const prodi = row.original;
      const queryClient = useQueryClient();
      const [modalEditOpen, setModalEditOpen] = useState(false);
      const [modalDeleteOpen, setModalDeleteOpen] = useState(false);

      const { mutate: mutateDelete } = useMutation({
        mutationFn: async () => {
          const { data } = await axios.delete(`/api/prodi`, {
            data: { id: prodi.id },
          });
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["prodi"],
          });
          setModalDeleteOpen(false);
        },
      });

      const { mutate: mutatePut } = useMutation({
        mutationFn: async (input: {
          name: any;
          kode_prodi: string;
          fakultas_id: string;
        }) => {
          const { data } = await axios.put(`/api/prodi`, {
            id: prodi.id,
            input,
          });
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["prodi"],
          });
          setModalEditOpen(false);
        },
      });

      const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const input = {
          name: e.currentTarget.nama.value,
          kode_prodi: e.currentTarget.kode_prodi.value,
          fakultas_id: e.currentTarget.fakultas_id.value,
        };

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
          {modalDeleteOpen && (
            <ConfirmationModal
              setModalOpen={setModalDeleteOpen}
              onClick={() => {
                mutateDelete();
              }}
            />
          )}
          {modalEditOpen && (
            <Modal setModalOpen={setModalEditOpen}>
              <ProdiForm onSubmit={handleEdit} values={prodi} />
            </Modal>
          )}
        </>
      );
    },
  },
  // ...
];
