"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InfoCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableComponents/DataTableColumnHeader";
import Modal from "@/components/Modal/Modal";

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
          {modalEditOpen && (
            <Modal setModalOpen={setModalEditOpen}>
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    Tambah Prodi
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
                        placeholder="Masukkan nama prodi"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>

                    <div className="mb-4.5">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Kode <span className="text-meta-1">*</span>
                      </label>
                      <input
                        name="kode_prodi"
                        type="text"
                        placeholder="Masukkan kode prodi"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="mb-3 block text-black dark:text-white">
                        Fakultas
                      </label>
                      <div className="relative z-20 bg-white dark:bg-form-input">
                        <select
                          name="fakultas_id"
                          className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                        >
                          <option value="2">Teknik Informatika</option>
                          <option value="3">Teknik Komputer</option>
                        </select>
                        <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.8">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                fill="#637381"
                              ></path>
                            </g>
                          </svg>
                        </span>
                      </div>
                    </div>

                    <button className="mt-6 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
                      Buat Prodi
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
                    Hapus Prodi
                  </h3>
                </div>
                <div className="p-6.5">
                  <p className="text-black dark:text-white">
                    Apakah anda yakin ingin menghapus prodi ini?
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
