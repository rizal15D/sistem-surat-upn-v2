"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableComponents/DataTableColumnHeader";
import { InfoCircledIcon, SwitchIcon, TrashIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import Modal from "@/components/Modal/Modal";
import PeriodeForm from "./periode-form";
import { useToast } from "@/components/ui/use-toast";

export type Periode = {
  id: string;
  tahun: string;
  status: boolean;
};

export const columns: ColumnDef<Periode>[] = [
  {
    accessorKey: "tahun",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tahun" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.tahun);
      const options = {
        year: "numeric" as "numeric",
      };
      const formattedDate = new Intl.DateTimeFormat("id-ID", options).format(
        date
      );
      return formattedDate;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Aktif" />
    ),
    cell: ({ row }) => {
      const periode = row.original;
      const isAktif = periode.status;

      return (
        <div className="flex items-center space-x-2 text-white">
          {isAktif ? (
            <Badge className="bg-success">Aktif</Badge>
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
      const periode = row.original;
      const queryClient = useQueryClient();
      const { toast } = useToast();
      const [isLoading, setIsLoading] = useState(false);
      const [isDeleteLoading, setIsDeleteLoading] = useState(false);

      const [modalEditOpen, setModalEditOpen] = useState(false);
      const [modalDeleteOpen, setModalDeleteOpen] = useState(false);

      const { mutate: mutateDelete } = useMutation({
        mutationFn: async () => {
          if (isDeleteLoading) return;

          setIsDeleteLoading(true);
          if (periode.status) {
            throw new Error("Periode aktif");
          }

          const { data } = await axios.delete(`/api/periode`, {
            data: { id: periode.id },
          });
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["periode"],
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
        onSettled: () => {
          setIsDeleteLoading(false);
        },
      });

      const { mutate: mutatePut } = useMutation({
        mutationFn: async (input: { tahun: string }) => {
          setIsLoading(true);
          const { data } = await axios.put(`/api/periode/tahun`, {
            id: periode.id,
            input,
          });
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["periode"],
          });
          setModalEditOpen(false);
          toast({
            title: "Berhasil mengubah data",
            className: "bg-success text-white",
          });
        },
        onError: (error) => {
          toast({
            title: "Gagal",
            description: error.message,
          });
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });

      const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const input = {
          tahun: e.currentTarget.tahun.value,
        };

        if (!input.tahun) {
          toast({
            title: "Gagal mengubah data",
            description: "Data tidak boleh kosong",
            className: "bg-danger text-white",
          });
          return;
        }

        mutatePut(input);
      };

      const { mutate: activation } = useMutation({
        mutationFn: async () => {
          if (periode.status) {
            toast({
              title: "Gagal mengubah status",
              description: "Periode sudah aktif",
              className: "bg-danger text-white",
            });
            return;
          }

          setIsLoading(true);
          const { data } = await axios.put(`/api/periode/status`, {
            id: periode.id,
          });
          return data;
        },
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ["periode"],
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
            className: "bg-error text-white",
          });
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });

      return (
        // Edit and Delete buttons
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
            <Button
              size="sm"
              className={`{
                ${
                  periode.status
                    ? "bg-danger hover:bg-opacity-90"
                    : "bg-success hover:bg-opacity-90"
                } hover:bg-opacity-90 text-white transition-colors duration-200
              }`}
              onClick={() => activation()}
            >
              <SwitchIcon className="h-5 w-5" />
            </Button>
          </div>
          {modalEditOpen && (
            <Modal setModalOpen={setModalEditOpen}>
              <PeriodeForm
                onSubmit={handleEdit}
                values={periode}
                isLoading={isLoading}
              />
            </Modal>
          )}
          {modalDeleteOpen && (
            <ConfirmationModal
              setModalOpen={setModalDeleteOpen}
              isLoading={isDeleteLoading}
              onClick={() => {
                mutateDelete();
              }}
              title="Hapus Periode"
              message={`Apakah Anda yakin ingin menghapus periode ${
                periode.tahun || "ini"
              }?`}
            />
          )}
        </>
      );
    },
  },
  // ...
];
