"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { InfoCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableComponents/DataTableColumnHeader";
import { useState } from "react";
import Modal from "@/components/Modal/Modal";

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
              onClick={() => mutateDelete()}
            >
              <TrashIcon className="h-5 w-5" />
            </Button>
          </div>
          {modalEditOpen && (
            <Modal setModalOpen={setModalEditOpen}>
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    Tambah Role
                  </h3>
                </div>
                <form onSubmit={handleEdit}>
                  <div className="p-6.5">
                    <div className="mb-4.5">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Nama <span className="text-meta-1">*</span>
                      </label>
                      <input
                        name="nama"
                        type="text"
                        placeholder={role.name}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>

                    <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
                      Ubah Role
                    </button>
                  </div>
                </form>
              </div>
            </Modal>
          )}
        </>
      );
    },
  },
  // ...
];
