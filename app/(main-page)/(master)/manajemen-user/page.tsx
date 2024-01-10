"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons";

import { Users, columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal/Modal";
import UserForm from "./user-form";

async function getData(): Promise<Users[]> {
  const { data } = await axios.get("/api/users");
  return data;
}

export default function ManajemenUserPage() {
  const queryClient = useQueryClient();
  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [modalPasswordOpen, setModalPasswordOpen] = useState(false);
  const [password, setPassword] = useState("");

  const { data = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getData,
  });

  const { mutate } = useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await axios.post(`/api/users/`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setModalCreateOpen(false);
      setPassword(data.password);
      setModalPasswordOpen(true);
    },
  });

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      name: e.currentTarget.nama.value,
      email: e.currentTarget.email.value,
      role_id: e.currentTarget.role_id.value,
      prodi_id: e.currentTarget.prodi_id.value,
      fakultas_id: e.currentTarget.fakultas_id.value,
    };

    console.log(data);

    mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex justify-between items-center pb-4">
        <h1 className="text-title-md2 font-semibold text-black dark:text-white">
          Manajemen User
        </h1>
        <Button
          onClick={() => setModalCreateOpen(true)}
          className="inline-flex items-center justify-center rounded-lg bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Tambah User
        </Button>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
      {modalCreateOpen && (
        <Modal setModalOpen={setModalCreateOpen}>
          <UserForm onSubmit={handleCreate} />
        </Modal>
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
}
