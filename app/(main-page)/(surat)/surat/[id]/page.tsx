"use client";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Letter } from "../columns";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  CheckIcon,
  Cross2Icon,
  DownloadIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
import { User } from "@/app/api/auth/[...nextauth]/authOptions";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import Modal from "@/components/Modal/Modal";
import SuratForm from "../surat-form";

export default function SuratSinglePage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { id } = useParams();
  const session = useSession();
  const user = session.data?.user as User;
  const router = useRouter();
  const [isMenolakLoading, setIsMenolakLoading] = useState(false);
  const [isSetujuLoading, setIsSetujuLoading] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [modalMenolakOpen, setModalMenolakOpen] = useState(false);

  const allData = queryClient.getQueryData<Letter[]>(["surat"]);
  const singleData = allData
    ? allData.find((item) => item.id === Number(id))
    : null;

  const getKomentar = async () => {
    const response = await axios.get(`/api/surat/komentar`, {
      params: { id },
    });
    return response.data;
  };

  const { data: komentar } = useQuery({
    queryKey: ["komentar", id],
    queryFn: getKomentar,
    enabled: !!id,
  });

  const { mutate } = useMutation({
    mutationFn: async (input: { persetujuan: string; komentar?: string }) => {
      if (input.komentar) {
        setIsMenolakLoading(true);
        await axios.post(`/api/surat/komentar`, {
          id,
          input: { komentar: input.komentar },
        });
      } else {
        setIsSetujuLoading(true);
      }
      const response = await axios.put(`/api/surat/persetujuan`, { id, input });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surat"] });
      router.push("/surat");
      toast({
        title: "Berhasil",
        className: "bg-success text-white",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal",
        className: "bg-danger text-white",
      });
    },
    onSettled: () => {
      setIsMenolakLoading(false);
      setIsSetujuLoading(false);
    },
  });

  const handleDownload = async () => {
    const response = await axios.get(`${singleData?.url}`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(
      new Blob([response.data], {
        type: "application/pdf",
      })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${singleData?.judul.split(".")[0]}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const { mutate: mutateUpload } = useMutation({
    mutationFn: async (input: { id: any; surat: File }) => {
      setIsUploadLoading(true);
      const response = await axios.put(
        `/api/surat/`,
        {
          id,
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
      queryClient.invalidateQueries({ queryKey: ["surat"] });
      router.push("/surat");
      toast({
        title: "Berhasil",
        className: "bg-success text-white",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal",
        className: "bg-danger text-white",
      });
    },
    onSettled: () => {
      setIsUploadLoading(false);
    },
  });

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      id,
      surat: formData.get("file") as File,
    };

    if (!data.surat) {
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

    mutateUpload(data);
  };

  const handleSetuju = () => {
    if (user?.user.role.name == "TU") {
      mutate({ persetujuan: "Disetujui TU" });
    } else if (user?.user.role.name == "Dekan") {
      mutate({ persetujuan: "Disetujui Dekan" });
    }
  };

  const handleMenolak = () => {
    if (user?.user.role.name == "TU") {
      mutate({
        persetujuan: "Ditolak TU",
        komentar: "Tidak Sesuai",
      });
    } else if (user?.user.role.name == "Dekan") {
      mutate({
        persetujuan: "Ditolak Dekan",
        komentar: "Tidak Sesuai",
      });
    }
  };

  return (
    <div className="grid sm:grid-cols-1 lg:grid-cols-5 gap-10 w-full">
      <div className="lg:col-span-3 sm:col-span-1 row-span-1 rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="container mx-auto py-10">
          {singleData && (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
              <div className="h-[100vh] mb-4">
                <Viewer
                  fileUrl={singleData?.url}
                  defaultScale={SpecialZoomLevel.PageFit}
                />
              </div>
            </Worker>
          )}
        </div>
      </div>
      <div className="lg:col-span-2 sm:col-span-1 row-span-2 rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
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
                {singleData?.status[0].status}
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
                {singleData?.user.name}, {singleData?.user.role.name}
              </span>
            </div>{" "}
            {/* {
              <div className="flex flex-col space-y-1">
                <span className="text-title-sm font-medium text-black dark:text-white">
                  Komentar
                </span>
                {komentar?.map((item) => (
                  <span className="text-body-sm text-black dark:text-white">
                    
                  </span>
                ))}
              </div>
            } */}
            {((user?.user.role.name == "TU" &&
              singleData?.status[0].status == "Di Daftar Tunggu TU") ||
              (user?.user.role.name == "Dekan" &&
                singleData?.status[0].status == "Di Daftar Tunggu Dekan")) && (
              <div className="pt-12 flex gap-4 text-white">
                <Button className="bg-success w-full" onClick={handleSetuju}>
                  {isSetujuLoading ? (
                    <div className="h-6 w-6 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></div>
                  ) : (
                    <CheckIcon className="w-6 h-6" />
                  )}
                </Button>
                <Button onClick={handleMenolak} className="bg-danger w-full">
                  <Cross2Icon className="w-6 h-6" />
                </Button>
              </div>
            )}
            <div className="flex gap-4 w-full text-white">
              {user?.user.role.name == "Admin Dekan" &&
                singleData?.status[0].status == "Diproses Admin Dekan" && (
                  <Button
                    className="bg-primary w-full"
                    onClick={() => {
                      setUploadModalOpen(true);
                    }}
                  >
                    <UploadIcon className="w-6 h-6" />
                  </Button>
                )}
              <Button className="bg-primary w-full" onClick={handleDownload}>
                <DownloadIcon className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {uploadModalOpen && (
        <Modal setModalOpen={setUploadModalOpen}>
          <SuratForm
            onSubmit={handleUpload}
            warningMessage={warningMessage}
            setWarningMessage={setWarningMessage}
            isLoading={isUploadLoading}
            isAdminDekan={true}
          />
        </Modal>
      )}
      {/* {modalMenolakOpen && (
        <Modal setModalOpen={setModalMenolakOpen}>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Masukkan Komentar
              </h3>
            </div>
            <form onSubmit={handleMenolak}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <input
                    name="komentar"
                    type="text"
                    placeholder="Masukkan komentar"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
                  {isMenolakLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></div>
                  ) : (
                    "Kirim Komentar"
                  )}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )} */}
    </div>
  );
}
