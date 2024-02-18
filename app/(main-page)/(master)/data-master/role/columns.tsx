"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  CheckIcon,
  Cross2Icon,
  InfoCircledIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableComponents/DataTableColumnHeader";
import { useState } from "react";
import Modal from "@/components/Modal/Modal";
import RoleForm from "./role-form";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { useToast } from "@/components/ui/use-toast";

export type Role = {
  id: number;
  name: string;
  permision: {
    id: number;
    buat_surat: boolean;
    download_surat: boolean;
    generate_nomor_surat: boolean;
    upload_tandatangan: boolean;
    tagging: boolean;
    persetujuan: boolean;
    akses_master: {
      id: number;
      prodi: boolean;
      template: boolean;
      periode: boolean;
      fakultas: boolean;
      jabatan: boolean;
      jenis_surat: boolean;
      sikoja: boolean;
    };
  };
  jabatan_atas_id: number;
  jabatan_atas: {
    id: number;
    name: string;
    jabatan_atas_id: number;
  };
};

export const columns: ColumnDef<Role>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
  },
  {
    accessorKey: "permision",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Perizinan" />
    ),
    cell: ({ row }) => {
      const role = row.original;
      return (
        <div className="flex flex-col">
          <div className="flex gap-2">
            <span>
              {role.permision.buat_surat ? (
                <CheckIcon className="h-5 w-5 text-success" />
              ) : (
                <Cross2Icon className="h-5 w-5 text-danger" />
              )}
            </span>
            <span className="font-bold">Buat Surat</span>
          </div>
          <div className="flex gap-2">
            <span>
              {role.permision.download_surat ? (
                <CheckIcon className="h-5 w-5 text-success" />
              ) : (
                <Cross2Icon className="h-5 w-5 text-danger" />
              )}
            </span>
            <span className="font-bold">Download Surat</span>
          </div>
          <div className="flex gap-2">
            <span>
              {role.permision.generate_nomor_surat ? (
                <CheckIcon className="h-5 w-5 text-success" />
              ) : (
                <Cross2Icon className="h-5 w-5 text-danger" />
              )}
            </span>
            <span className="font-bold">Generate Nomor Surat</span>
          </div>
          <div className="flex gap-2">
            <span>
              {role.permision.upload_tandatangan ? (
                <CheckIcon className="h-5 w-5 text-success" />
              ) : (
                <Cross2Icon className="h-5 w-5 text-danger" />
              )}
            </span>
            <span className="font-bold">Upload Tanda Tangan</span>
          </div>
          <div className="flex gap-2">
            <span>
              {role.permision.persetujuan ? (
                <CheckIcon className="h-5 w-5 text-success" />
              ) : (
                <Cross2Icon className="h-5 w-5 text-danger" />
              )}
            </span>
            <span className="font-bold">Persetujuan</span>
          </div>
          <div className="flex gap-2">
            <span>
              {role.permision.tagging ? (
                <CheckIcon className="h-5 w-5 text-success" />
              ) : (
                <Cross2Icon className="h-5 w-5 text-danger" />
              )}
            </span>
            <span className="font-bold">Tagging Surat</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "permision2",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Akses Master" />
    ),
    cell: ({ row }) => {
      const role = row.original;

      if (
        !role.permision.akses_master.prodi &&
        !role.permision.akses_master.template &&
        !role.permision.akses_master.periode &&
        !role.permision.akses_master.fakultas &&
        !role.permision.akses_master.jabatan &&
        !role.permision.akses_master.jenis_surat
      ) {
        return (
          <div className="flex flex-col">
            <div className="flex gap-2">
              <span>
                <Cross2Icon className="h-5 w-5 text-danger" />
              </span>
              <span className="font-bold">Tidak ada akses</span>
            </div>
          </div>
        );
      }

      return (
        <div className="flex flex-col">
          <div className="flex gap-2">
            <span>
              {role.permision.akses_master.prodi ? (
                <CheckIcon className="h-5 w-5 text-success" />
              ) : (
                <Cross2Icon className="h-5 w-5 text-danger" />
              )}
            </span>
            <span className="font-bold">Prodi</span>
          </div>
          <div className="flex gap-2">
            <span>
              {role.permision.akses_master.template ? (
                <CheckIcon className="h-5 w-5 text-success" />
              ) : (
                <Cross2Icon className="h-5 w-5 text-danger" />
              )}
            </span>
            <span className="font-bold">Template</span>
          </div>
          <div className="flex gap-2">
            <span>
              {role.permision.akses_master.periode ? (
                <CheckIcon className="h-5 w-5 text-success" />
              ) : (
                <Cross2Icon className="h-5 w-5 text-danger" />
              )}
            </span>
            <span className="font-bold">Periode</span>
          </div>
          <div className="flex gap-2">
            <span>
              {role.permision.akses_master.fakultas ? (
                <CheckIcon className="h-5 w-5 text-success" />
              ) : (
                <Cross2Icon className="h-5 w-5 text-danger" />
              )}
            </span>
            <span className="font-bold">Fakultas</span>
          </div>
          <div className="flex gap-2">
            <span>
              {role.permision.akses_master.jabatan ? (
                <CheckIcon className="h-5 w-5 text-success" />
              ) : (
                <Cross2Icon className="h-5 w-5 text-danger" />
              )}
            </span>
            <span className="font-bold">Jabatan</span>
          </div>
          <div className="flex gap-2">
            <span>
              {role.permision.akses_master.jenis_surat ? (
                <CheckIcon className="h-5 w-5 text-success" />
              ) : (
                <Cross2Icon className="h-5 w-5 text-danger" />
              )}
            </span>
            <span className="font-bold">Jenis Surat</span>
          </div>
          <div className="flex gap-2">
            <span>
              {role.permision.akses_master.sikoja ? (
                <CheckIcon className="h-5 w-5 text-success" />
              ) : (
                <Cross2Icon className="h-5 w-5 text-danger" />
              )}
            </span>
            <span className="font-bold">Sikoja</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "jabatan_atas",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jabatan Atas" />
    ),
    cell: ({ row }) => {
      const role = row.original;
      return <span>{role.jabatan_atas ? role.jabatan_atas.name : "-"}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const role = row.original;
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
          const { data } = await axios.delete(`/api/role`, {
            data: { id: role.id },
          });
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["role"],
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
        mutationFn: async (input: { id: number; name: any }) => {
          setIsLoading(true);
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
          id: role.id,
          // edit role
          name: e.currentTarget.nama.value,
          jabatan_atas_id: e.currentTarget.jabatan_atas_id.value,
          // edit permision
          buat_surat: e.currentTarget.buat_surat.checked,
          download_surat: e.currentTarget.download_surat.checked,
          generate_nomor_surat: e.currentTarget.generate_nomor_surat.checked,
          upload_tandatangan: e.currentTarget.upload_tandatangan.checked,
          persetujuan: e.currentTarget.persetujuan.checked,
          tagging: e.currentTarget.tagging.checked,
          // edit akses master
          prodi: e.currentTarget.prodi.checked,
          template: e.currentTarget.template.checked,
          periode: e.currentTarget.periode.checked,
          fakultas: e.currentTarget.fakultas.checked,
          jabatan: e.currentTarget.jabatan.checked,
          jenis_surat: e.currentTarget.jenis_surat.checked,
          sikoja: e.currentTarget.sikoja.checked,
        };

        if (!input.name) {
          toast({
            title: "Gagal mengubah data",
            description: "Nama tidak boleh kosong",
            className: "bg-danger text-white",
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
              <RoleForm
                onSubmit={handleEdit}
                values={role}
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
              title="Hapus role"
              message={`Apakah anda yakin ingin menghapus role ${
                role.name || "ini"
              }?`}
            />
          )}
        </>
      );
    },
  },
  // ...
];
