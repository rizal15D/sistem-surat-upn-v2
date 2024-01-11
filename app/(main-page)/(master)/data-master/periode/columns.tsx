"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableComponents/DataTableColumnHeader";
import { InfoCircledIcon, TrashIcon } from "@radix-ui/react-icons";
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
  semester: string;
  prodi_id: string;
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
    accessorKey: "semester",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Semester" />
    ),
  },
  {
    accessorKey: "prodi_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID Prodi (Sementara)" />
    ),
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
            <Badge className="bg-danger">Tidak Aktif</Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const queryClient = useQueryClient();
      const { toast } = useToast();

      const periode = row.original;
      const [modalEditOpen, setModalEditOpen] = useState(false);
      const [modalDeleteOpen, setModalDeleteOpen] = useState(false);

      const { mutate: mutateDelete } = useMutation({
        mutationFn: async () => {
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
            title: "Gagal",
            description: error.message,
          });
        },
      });

      const { mutate: mutatePut } = useMutation({
        mutationFn: async (input: {
          tahun: string;
          semester: string;
          prodi_id: string;
          status: boolean;
        }) => {
          const { data } = await axios.put(`/api/periode`, {
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
      });

      const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const input = {
          tahun: e.currentTarget.tahun.value,
          semester: e.currentTarget.semester.value,
          prodi_id: e.currentTarget.prodi_id.value,
          status: periode.status,
        };

        if (!input.tahun || !input.semester || !input.prodi_id) {
          toast({
            title: "Gagal mengubah data",
            description: "Data tidak boleh kosong",
            className: "bg-danger text-white",
          });
          return;
        }

        mutatePut(input);
      };

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
          </div>
          {modalDeleteOpen && (
            <ConfirmationModal
              setModalOpen={setModalDeleteOpen}
              onClick={() => {
                mutateDelete();
              }}
            />
          )}
          {modalEditOpen && (
            <Modal setModalOpen={setModalEditOpen}>
              <PeriodeForm onSubmit={handleEdit} values={periode} />
            </Modal>
          )}
        </>
      );
    },
  },
  // ...
];
