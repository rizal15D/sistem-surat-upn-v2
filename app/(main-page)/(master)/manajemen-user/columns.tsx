"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InfoCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableComponents/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import Modal from "@/components/Modal/Modal";
import { KeyIcon } from "lucide-react";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";

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
      const [password, setPassword] = useState("");
      const [modalResetPasswordOpen, setModalResetPasswordOpen] =
        useState(false);
      const [modalPasswordOpen, setModalPasswordOpen] = useState(false);

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

      const { mutate: mutateChangePassword } = useMutation({
        mutationFn: async () => {
          const { data } = await axios.put(`/api/users/reset-password`, {
            id: users.id,
          });
          return data;
        },
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ["users"],
          });
          setModalResetPasswordOpen(false);
          setPassword(data.password);
          setModalPasswordOpen(true);
        },
      });

      return (
        <>
          <div className="flex items-center space-x-2 text-white">
            <Button
              size="sm"
              className="bg-warning hover:bg-opacity-90"
              onClick={() => setModalResetPasswordOpen(true)}
            >
              <KeyIcon className="h-5 w-5" />
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
              onClick={mutateDelete}
            />
          )}
          {modalResetPasswordOpen && (
            <ConfirmationModal
              setModalOpen={setModalResetPasswordOpen}
              onClick={mutateChangePassword}
            />
          )}
          {modalPasswordOpen && (
            <Modal setModalOpen={setModalPasswordOpen}>
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    Password User (Harap disimpan)
                  </h3>
                </div>
                <div className="p-6.5">
                  <div className="mb-4.5">
                    <input
                      readOnly
                      name="nama"
                      type="text"
                      value={password}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <button
                    onClick={() => setModalPasswordOpen(false)}
                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
                  >
                    Tutup
                  </button>
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
