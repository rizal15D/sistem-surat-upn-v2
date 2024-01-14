"use client";

import React, { useState } from "react";
import SuratForm from "../surat-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function UploadSuratPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [warningMessage, setWarningMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { mutate } = useMutation({
    mutationFn: async (input: { judul: any; surat: File }) => {
      setIsLoading(true);
      const response = await axios.post(
        `/api/surat`,
        {
          judul: input.judul,
          surat: input.surat,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["template"] });
      router.push("/surat");
      toast({
        title: "Berhasil menambahkan data",
        className: "bg-success text-white",
      });
    },
    onError: (error) => {
      toast({
        title: "Gagal menambah data",
        description: error.message,
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const data = {
      judul: formData.get("judul"),
      surat: formData.get("file") as File,
    };

    if (!data.judul || !data.surat) {
      toast({
        title: "Gagal mengupload surat",
        description: "Data tidak boleh kosong",
        className: "bg-danger text-white",
      });
      return;
    }

    if (warningMessage) {
      toast({
        title: "Gagal mengupload surat",
        description: warningMessage,
        className: "bg-danger text-white",
      });
      return;
    }

    mutate(data);
  };

  return (
    <SuratForm
      onSubmit={handleSubmit}
      warningMessage={warningMessage}
      setWarningMessage={setWarningMessage}
      isLoading={isLoading}
    />
  );
}
