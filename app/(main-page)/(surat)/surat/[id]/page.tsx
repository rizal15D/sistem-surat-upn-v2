"use client";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Letter } from "../columns";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { CheckIcon, Cross2Icon, DownloadIcon } from "@radix-ui/react-icons";
import { User } from "@/app/api/auth/[...nextauth]/authOptions";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SuratSinglePage() {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const session = useSession();
  const user = session.data?.user as User;
  const router = useRouter();

  const allData = queryClient.getQueryData<Letter[]>(["surat"]);
  const singleData = allData
    ? allData.find((item) => item.id === Number(id))
    : null;

  const { mutate } = useMutation({
    mutationFn: async (input: { status: string; persetujuan: string }) => {
      const response = await axios.put(`/api/surat/persetujuan`, { id, input });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surat"] });
      router.push("/surat");
    },
  });

  const handleDownload = async () => {
    const response = await axios.get(`${singleData?.lokasi_surat}`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(
      new Blob([response.data], {
        type: "application/pdf",
      })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "file.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="grid sm:grid-cols-1 lg:grid-cols-5 gap-10 w-full">
      <div className="lg:col-span-2 sm:col-span-1 row-span-1 rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="container mx-auto py-10">
          {singleData && (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
              <div className="h-96 mb-4">
                <Viewer
                  fileUrl={singleData?.lokasi_surat}
                  defaultScale={SpecialZoomLevel.PageFit}
                />
              </div>
            </Worker>
          )}
        </div>
      </div>
      <div className="lg:col-span-3 sm:col-span-1 row-span-2 rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="container mx-auto py-10">
          <h1 className="text-3xl pb-6 font-semibold text-black dark:text-white">
            Detail Surat
          </h1>

          <div className="flex flex-col space-y-2 gap-2">
            <div className="flex flex-col space-y-1">
              <span className="text-title-sm font-medium text-black dark:text-white">
                Judul
              </span>
              <span className="text-body-sm text-black dark:text-white">
                {singleData?.judul.split(".")[0]}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-title-sm font-medium text-black dark:text-white">
                Status
              </span>
              <span className="text-body-sm text-black dark:text-white">
                {singleData?.status}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-title-sm font-medium text-black dark:text-white">
                Tanggal
              </span>
              <span className="text-body-sm text-black dark:text-white">
                {singleData &&
                  new Intl.DateTimeFormat("id-ID", {
                    weekday: "long" as "long",
                    day: "numeric" as "numeric",
                    month: "long" as "long",
                    year: "numeric" as "numeric",
                  }).format(new Date(singleData.tanggal.toString()))}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-title-sm font-medium text-black dark:text-white">
                Pembuat Surat
              </span>
              <span className="text-body-sm text-black dark:text-white">
                {singleData?.user_id}
              </span>
            </div>{" "}
            {singleData?.komentar && (
              <div className="flex flex-col space-y-1">
                <span className="text-title-sm font-medium text-black dark:text-white">
                  Komentar
                </span>
                <span className="text-body-sm text-black dark:text-white">
                  {singleData?.komentar}
                </span>
              </div>
            )}
            {(user?.user.role.name == "TU" ||
              user?.user.role.name == "Dekan") && (
              <div className="pt-12 flex gap-4 text-white">
                <Button
                  className="bg-success w-full"
                  // onClick={handleSetuju}
                >
                  <CheckIcon className="w-6 h-6" />
                </Button>
                <Button className="bg-danger w-full">
                  <Cross2Icon className="w-6 h-6" />
                </Button>
              </div>
            )}
            <div className="flex w-full text-white">
              <Button className="bg-primary w-full" onClick={handleDownload}>
                <DownloadIcon className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
