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
      const fakultas = row.original;
      const queryClient = useQueryClient();
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
        },
      });

      const { mutate: mutatePut } = useMutation({
        mutationFn: async (input: {
          nama: any;
          jenjang: string;
          kode_fakultas: string;
        }) => {
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
        },
      });

      const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const input = {
          nama: e.currentTarget.nama.value,
          jenjang: e.currentTarget.jenjang.value,
          kode_fakultas: e.currentTarget.kode_fakultas.value,
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
          {modalEditOpen && (
            <Modal setModalOpen={setModalEditOpen}>
              <FakultasForm onSubmit={handleEdit} values={fakultas} />
            </Modal>
          )}
          {modalDeleteOpen && (
            <ConfirmationModal
              setModalOpen={setModalDeleteOpen}
              onClick={() => {
                mutateDelete();
              }}
            />
          )}
        </>
      );
    },
  },
  // ...
];
