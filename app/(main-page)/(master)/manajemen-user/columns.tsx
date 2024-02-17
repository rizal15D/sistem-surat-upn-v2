"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InfoCircledIcon, SwitchIcon, TrashIcon } from "@radix-ui/react-icons";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableComponents/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import Modal from "@/components/Modal/Modal";
import { KeyIcon } from "lucide-react";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { useToast } from "@/components/ui/use-toast";

export type Users = {
  id: string;
  name: string;
  email: string;
  aktif: boolean;
  jabatan: { id: string; name: string; jabatan_atas_id: number };
  prodi: { id: string; name: string };
  fakultas: { id: string; name: string };
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
    accessorKey: "jabatan",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jabatan" />
    ),
    cell: ({ row }) => {
      const jabatan = row.getValue("jabatan") as { name: string };
      return (
        <div className="flex items-center space-x-2">
          <span>{jabatan.name}</span>
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
            <Badge className="bg-success sm:text-xs">Aktif</Badge>
          ) : (
            <Badge className="bg-danger">Nonaktif</Badge>
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
      const { toast } = useToast();

      const [isLoading, setIsLoading] = useState(false);
      const [isDeleteLoading, setIsDeleteLoading] = useState(false);
      const [isResetPasswordLoading, setIsResetPasswordLoading] =
        useState(false);

      const [password, setPassword] = useState("");
      const [modalResetPasswordOpen, setModalResetPasswordOpen] =
        useState(false);
      const [modalPasswordOpen, setModalPasswordOpen] = useState(false);
      const [modalDeleteOpen, setModalDeleteOpen] = useState(false);

      const { mutate: activation } = useMutation({
        mutationFn: async () => {
          setIsLoading(true);
          const { data } = await axios.put(`/api/users/aktivasi`, {
            id: users.id,
            input: {
              aktif: !users.aktif,
            },
          });
          return data;
        },
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ["users"],
          });
          toast({
            title: "Berhasil mengubah status",
            className: "bg-success text-white",
          });
        },
        onError: (error) => {
          toast({
            title: "Gagal mengubah status",
            description: error.message,
            className: "bg-danger text-white",
          });
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });

      const { mutate: mutateResetPassword } = useMutation({
        mutationFn: async () => {
          if (isResetPasswordLoading) return;

          setIsResetPasswordLoading(true);
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
          setPassword(data.user.password);
          setModalPasswordOpen(true);
          toast({
            title: "Berhasil mereset password",
            className: "bg-success text-white",
          });
        },
        onError: (error) => {
          toast({
            title: "Gagal mereset password",
            description: error.message,
            className: "bg-danger text-white",
          });
        },
        onSettled: () => {
          setIsResetPasswordLoading(false);
        },
      });

      const { mutate: mutateDelete } = useMutation({
        mutationFn: async () => {
          if (isDeleteLoading) return;

          setIsDeleteLoading(true);
          const { data } = await axios.delete(`/api/users`, {
            data: {
              id: users.id,
            },
          });
          return data;
        },
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ["users"],
          });
          setModalDeleteOpen(false);
          toast({
            title: "Berhasil menghapus user",
            className: "bg-success text-white",
          });
        },
        onError: (error) => {
          toast({
            title: "Gagal menghapus user",
            description: error.message,
            className: "bg-danger text-white",
          });
        },
        onSettled: () => {
          setIsDeleteLoading(false);
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
              size="sm"
              className={`{
                ${
                  users.aktif
                    ? "bg-danger hover:bg-opacity-90"
                    : "bg-success hover:bg-opacity-90"
                } hover:bg-opacity-90 text-white transition-colors duration-200
              }`}
              onClick={() => activation()}
            >
              {isLoading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></div>
              ) : (
                <SwitchIcon className="h-5 w-5" />
              )}
            </Button>
            <Button
              size="sm"
              className="bg-danger hover:bg-opacity-90"
              onClick={() => setModalDeleteOpen(true)}
            >
              <TrashIcon className="h-5 w-5" />
            </Button>
          </div>
          {modalResetPasswordOpen && (
            <ConfirmationModal
              setModalOpen={setModalResetPasswordOpen}
              isLoading={isResetPasswordLoading}
              onClick={mutateResetPassword}
              title="Reset Password"
              message={`Apakah anda yakin ingin mereset password user ${users.name} ?`}
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
          {modalDeleteOpen && (
            <ConfirmationModal
              isLoading={isDeleteLoading}
              setModalOpen={setModalDeleteOpen}
              onClick={() => mutateDelete()}
              title="Hapus User"
              message={`Apakah anda yakin ingin menghapus user ${
                users.name || "ini"
              }?`}
            />
          )}
        </>
      );
    },
  },
  // ...
];
