"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InfoCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableComponents/DataTableColumnHeader";
import { useState } from "react";
import Modal from "@/components/Modal/Modal";
import RoleForm from "./role-form";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";

export type Role = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<Role>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const role = row.original;
      const queryClient = useQueryClient();
      const [modalEditOpen, setModalEditOpen] = useState(false);
      const [modalDeleteOpen, setModalDeleteOpen] = useState(false);

      const { mutate: mutateDelete } = useMutation({
        mutationFn: async () => {
          const { data } = await axios.delete(`/api/role`, {
            data: { id: role.id },
          });
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["role"],
          });
        },
      });

      const { mutate: mutatePut } = useMutation({
        mutationFn: async (input: { id: number; name: any }) => {
          const { data } = await axios.put(`/api/role`, {
            id: role.id,
            input,
          });
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["role"],
          });
          setModalEditOpen(false);
        },
      });

      const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const input = {
          id: role.id,
          name: e.currentTarget.nama.value,
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
              <RoleForm onSubmit={handleEdit} values={role} />
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
