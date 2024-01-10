"use client";

import React, { useState } from "react";
import SuratForm from "../surat-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function UploadSuratPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: async (input: { judul: any; surat: File }) => {
      console.log(input);
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
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    console.log(formData);

    mutate({
      judul: formData.get("judul"),
      surat: formData.get("file") as File,
    });
  };

  return <SuratForm onSubmit={handleSubmit} />;
}
