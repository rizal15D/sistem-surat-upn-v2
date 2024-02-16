"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InfoCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableComponents/DataTableColumnHeader";
import { useState } from "react";
import Modal from "@/components/Modal/Modal";
import RoleForm from "./iku-form";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { useToast } from "@/components/ui/use-toast";
import IKUForm from "./iku-form";

export type IKU = {
  id: number;
  name: string;
};

export const columns: ColumnDef<IKU>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const iku = row.original;
      const queryClient = useQueryClient();
      const { toast } = useToast();
      const [isLoading, setIsLoading] = useState(false);

      const [modalEditOpen, setModalEditOpen] = useState(false);
      const [modalDeleteOpen, setModalDeleteOpen] = useState(false);

      const { mutate: mutateDelete } = useMutation({
        mutationFn: async () => {
          const { data } = await axios.delete(`/api/sikoja/iku`, {
            params: {
              iku_id: iku.id,
            },
          });
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["iku"],
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
        mutationFn: async (input: { id: number; name: string }) => {
          setIsLoading(true);
          const { data } = await axios.put(
            `/api/sikoja/iku`,
            {
              id: iku.id,
              input,
            },
            {
              params: {
                iku_id: iku.id,
              },
            }
          );
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["iku"],
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
          id: iku.id,
          name: e.currentTarget.nama.value,
        };

        if (!input.name) {
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
              <IKUForm
                onSubmit={handleEdit}
                values={iku}
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
              title="Hapus iku surat"
              message={`Apakah anda yakin ingin menghapus iku surat ${
                iku.name || "ini"
              }?`}
            />
          )}
        </>
      );
    },
  },
  // ...
];
