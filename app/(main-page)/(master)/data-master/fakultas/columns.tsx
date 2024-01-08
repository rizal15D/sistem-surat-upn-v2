"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InfoCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

import { DataTableColumnHeader } from "@/components/DataTableComponents/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal/Modal";

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
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    Ubah Fakultas
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
                        placeholder="Masukkan nama fakultas"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>

                    <div className="mb-4.5">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Jenjang <span className="text-meta-1">*</span>
                      </label>
                      <input
                        name="jenjang"
                        type="text"
                        placeholder="Masukkan jenjang"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>

                    <div className="mb-4.5">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Kode Fakultas <span className="text-meta-1">*</span>
                      </label>
                      <input
                        name="kode_fakultas"
                        type="text"
                        placeholder="Masukkan kode fakultas"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>

                    <button className="mt-6 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
                      Ubah Fakultas
                    </button>
                  </div>
                </form>
              </div>
            </Modal>
          )}
          {modalDeleteOpen && (
            <Modal setModalOpen={setModalDeleteOpen}>
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    Hapus Fakultas
                  </h3>
                </div>
                <div className="p-6.5">
                  <p className="text-black dark:text-white">
                    Apakah anda yakin ingin menghapus fakultas ini?
                  </p>
                  <div className="flex justify-end space-x-2 mt-6 text-white">
                    <Button
                      variant="destructive"
                      className="bg-danger hover:bg-opacity-90"
                      onClick={() => mutateDelete()}
                    >
                      Ya
                    </Button>
                    <Button
                      variant="default"
                      className="bg-primary hover:bg-opacity-90"
                      onClick={() => setModalDeleteOpen(false)}
                    >
                      Tidak
                    </Button>
                  </div>
                </div>
              </div>
            </Modal>
          )}
        </>
      );
    },
  },
  // ...
];
