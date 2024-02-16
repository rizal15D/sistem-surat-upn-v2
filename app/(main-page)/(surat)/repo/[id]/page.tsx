"use client";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LetterRepo } from "../columns";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import type {
  ToolbarSlot,
  TransformToolbarSlot,
} from "@react-pdf-viewer/toolbar";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  CheckIcon,
  Cross2Icon,
  DownloadIcon,
  TrashIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
import { User } from "@/app/api/auth/[...nextauth]/authOptions";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { FormEvent, useEffect, useState } from "react";
import Modal from "@/components/Modal/Modal";
import SuratForm from "../surat-form";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { Badge } from "@/components/ui/badge";
import { Clipboard, EditIcon } from "lucide-react";
import Link from "next/link";

export default function SuratSinglePage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user as User;
  const { toast } = useToast();
  const { id } = useParams();
  const [warningMessage, setWarningMessage] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [modalRevisiOpen, setModalRevisiOpen] = useState(false);

  const toolbarPluginInstance = toolbarPlugin({});
  const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;
  const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
    ...slot,
    // These slots will be empty
    Download: () => <></>,
    Open: () => <></>,
    SwitchTheme: () => <></>,
  });

  // Get Data Surat
  const { data: letterData, isLoading: isLetterLoading } = useQuery({
    queryKey: ["repo", id],
    queryFn: async () => {
      const response = await axios.get(`/api/sikoja/repo/${id}`);

      return response.data as LetterRepo;
    },
    enabled: !!id,
  });

  const getFileUrl = async () => {
    const response = await axios.get(
      `/api/surat/download?filepath=${letterData?.surat.path}`,
      {
        responseType: "arraybuffer",
      }
    );

    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    return fileURL;
  };

  useEffect(() => {
    if (letterData) {
      getFileUrl().then((url) => setFileUrl(url));
    }
  }, [letterData]);

  const handleDownload = async () => {
    let link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute(
      "download",
      `${letterData?.surat.judul.split(".")[0]}.pdf`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Buka File
  const handleOpenFile = async () => {
    const pdfWindow = window.open();
    if (pdfWindow) {
      pdfWindow.location.href = fileUrl;
    } else {
      console.error("Failed to open a new window.");
    }
  };

  const { mutate: mutateRevisi } = useMutation({
    mutationFn: async (input: { id: any; surat: File }) => {
      setIsUploadLoading(true);
      const response = await axios.put(
        `/api/surat/revisi`,
        {
          surat_id: id,
          judul: letterData?.surat.judul,
          deskripsi: letterData?.surat.deskripsi,
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
      toast({
        title: "Berhasil",
        description: "Surat berhasil direvisi",
        className: "bg-success text-white",
      });
      router.push("/surat");
    },
    onError: (error: any) => {
      toast({
        title: "Gagal",
        description: error.response.data.message,
        className: "bg-danger text-white",
      });
    },
    onSettled: () => {
      setIsUploadLoading(false);
      setModalRevisiOpen(false);
    },
  });

  const handleRevisi = async (e: React.FormEvent<HTMLFormElement>) => {
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

    mutateRevisi(data);
  };

  const canRevisi =
    // User yang mempunyai surat
    user?.jabatan.name === letterData?.surat.user?.jabatan.name &&
    user?.user.prodi?.name === letterData?.surat.user?.prodi?.name &&
    // Surat punya nomor surat
    letterData?.surat.nomor_surat[letterData?.surat.nomor_surat.length - 1];

  if (isLetterLoading)
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );

  return (
    <div className="lg:flex gap-10 w-full">
      <div className="lg:w-3/5 sm:w-full h-fit rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="container mx-auto py-10">
          {letterData?.surat && fileUrl ? (
            <>
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
                <div className="mb-4 h-[100vh]">
                  <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>;
                  <Viewer
                    fileUrl={fileUrl}
                    defaultScale={SpecialZoomLevel.ActualSize}
                    plugins={[toolbarPluginInstance]}
                  />
                </div>
              </Worker>
            </>
          ) : (
            <div className="flex h-screen items-center justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
          )}
        </div>
      </div>
      <div className="lg:w-2/5 sm:w-full h-fit rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="container mx-auto py-10 relative">
          <div className="absolute flex gap-2 top-10 right-0 z-99">
            {/* {letterData?.revisi[letterData?.revisi.length - 1] && (
              <Link
                href={`/repo/${
                  letterData?.revisi[letterData?.revisi.length - 1]
                    ?.surat_id_old.id
                }`}
              >
                <Button className="bg-primary text-white font-medium">
                  Lihat Surat Lama
                </Button>
              </Link>
            )} */}
            {fileUrl && (
              <Button
                onClick={handleOpenFile}
                className="bg-primary text-white font-medium"
              >
                Buka File
              </Button>
            )}
          </div>

          <h1 className="text-3xl pb-6 font-semibold text-black dark:text-white">
            Detail Surat
          </h1>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col space-y-1">
              <span className="text-title-xs font-medium text-black dark:text-white">
                Judul
              </span>
              <span className="text-body-xs text-black dark:text-white">
                {letterData?.surat.judul.split(".")[0].split("-")[0]}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-title-xs font-medium text-black dark:text-white">
                Pembuat Surat
              </span>
              <span className="text-body-xs text-black dark:text-white">
                {letterData?.surat.user?.name}
                {letterData?.surat.user?.prodi
                  ? `, (${letterData?.surat.user?.prodi.name})`
                  : ""}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-title-xs font-medium text-black dark:text-white">
                Status
              </span>
              <span className="text-body-xs text-black dark:text-white">
                <Badge
                  className={`text-white text-center
            ${
              (letterData?.surat.status.status.includes("Daftar Tunggu") ||
                letterData?.surat.status.status.includes("Diproses")) &&
              "bg-warning"
            }
            ${
              letterData?.surat.status.status.includes("Ditolak") && "bg-danger"
            }
            ${
              letterData?.surat.status.status.includes("Ditandatangani") &&
              "bg-success"
            }
            `}
                >
                  {letterData?.surat.status.status}
                </Badge>
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-title-xs font-medium text-black dark:text-white">
                Nomor Surat
              </span>
              <span className="text-body-xs text-black dark:text-white">
                {letterData?.surat.nomor_surat[
                  letterData?.surat.nomor_surat.length - 1
                ]
                  ? letterData?.surat.nomor_surat[
                      letterData?.surat.nomor_surat.length - 1
                    ].nomor_surat
                  : "-"}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-title-xs font-medium text-black dark:text-white">
                Tanggal Dibuat
              </span>
              <span className="text-body-xs text-black dark:text-white">
                {letterData?.surat &&
                  new Intl.DateTimeFormat("id-ID", {
                    weekday: "long" as "long",
                    day: "numeric" as "numeric",
                    month: "long" as "long",
                    year: "numeric" as "numeric",
                  }).format(new Date(letterData?.surat.tanggal.toString()))}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-title-xs font-medium text-black dark:text-white">
                Jenis Surat
              </span>
              <span className="text-body-xs text-black dark:text-white">
                {letterData?.surat.jenis.jenis}
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-2 gap-2">
            <div className="flex flex-col space-y-1">
              <span className="text-title-xs font-medium text-black dark:text-white">
                Deskripsi
              </span>
              <span className="text-body-xs text-black dark:text-white">
                {letterData?.surat.deskripsi}
              </span>
            </div>

            <div className="flex gap-4 w-full text-white">
              {fileUrl && (
                <Button
                  className="flex gap-2 bg-primary w-full"
                  onClick={handleDownload}
                >
                  <DownloadIcon className="w-6 h-6" />
                  Download
                </Button>
              )}
              {canRevisi && (
                <Button
                  className="flex gap-2 bg-primary w-full"
                  onClick={() => setModalRevisiOpen(true)}
                >
                  <EditIcon className="w-6 h-6" />
                  Revisi
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      {modalRevisiOpen && (
        <Modal setModalOpen={setModalRevisiOpen}>
          <SuratForm
            onSubmit={handleRevisi}
            warningMessage={warningMessage}
            setWarningMessage={setWarningMessage}
            isLoading={isUploadLoading}
            isAdminDekan={true}
          />
        </Modal>
      )}
    </div>
  );
}
