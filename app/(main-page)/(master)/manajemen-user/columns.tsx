"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InfoCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableComponents/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import Modal from "@/components/Modal/Modal";

export type Users = {
  id: string;
  name: string;
  email: string;
  role: { id: string; name: string };
  prodi: { id: string; name: string };
  fakultas: { id: string; name: string };
  aktif: boolean;
};

export const columns: ColumnDef<Users>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
    filterFn: (row, id, value) => {
      return (row.getValue(id) as string)
        .toLowerCase()
        .includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as { name: string };
      return (
        <div className="flex items-center space-x-2">
          <span>{role.name}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowValue = (row.getValue(id) as { name: string }).name;
      return value.some((val: string[]) =>
        val.some((v) => rowValue.includes(v))
      );
    },
  },
  {
    accessorKey: "prodi",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prodi" />
    ),
    cell: ({ row }) => {
      const prodi = row.getValue("prodi") as { name: string };
      return (
        <div className="flex items-center space-x-2">
          <span>{prodi.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "fakultas",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fakultas" />
    ),
    cell: ({ row }) => {
      const fakultas = row.getValue("fakultas") as { name: string };
      return (
        <div className="flex items-center space-x-2">
          <span>{fakultas.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "aktif",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const aktif = row.getValue("aktif");
      return (
        <div className="flex items-center space-x-2 text-white">
          {aktif ? (
            <Badge className="bg-success">Aktif</Badge>
          ) : (
            <Badge className="bg-danger">Tidak Aktif</Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const users = row.original;
      const queryClient = useQueryClient();
      const [modalDeleteOpen, setModalDeleteOpen] = useState(false);

      const { mutate: mutateDelete } = useMutation({
        mutationFn: async () => {
          const { data } = await axios.delete(`/api/users`, {
            data: { id: users.id },
          });
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["users"],
          });
          setModalDeleteOpen(false);
        },
      });

      return (
        <>
          <div className="flex items-center space-x-2 text-white">
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
            <Modal setModalOpen={setModalDeleteOpen}>
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    Hapus User
                  </h3>
                </div>
                <div className="p-6.5">
                  <p className="text-black dark:text-white">
                    Apakah anda yakin ingin menghapus user ini?
                  </p>
                  <div className="flex justify-end space-x-2 mt-6">
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
