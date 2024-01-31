"use client";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Letter } from "../columns";
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
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { FormEvent, useState } from "react";
import Modal from "@/components/Modal/Modal";
import SuratForm from "../surat-form";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { Badge } from "@/components/ui/badge";
import { EditIcon } from "lucide-react";

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
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
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

  const { data: letterData } = useQuery({
    queryKey: ["surat"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/surat?startDate=${new Date(
          2000,
          1,
          1
        ).toISOString()}&endDate=${new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate() + 3
        ).toISOString()}`
      );

      return response.data;
    },
    enabled: !!id,
  });

  const singleData = letterData
    ? (letterData.find((item: Letter) => item.id === Number(id)) as Letter)
    : null;

  const getKomentar = async () => {
    const response = await axios.get(`/api/surat/komentar`, {
      params: { id },
    });
    return response.data;
  };

  const { data: komentar, isLoading: isKomentarLoading } = useQuery({
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
      setModalMenolakOpen(false);
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

  const handleOpenFile = async () => {
    const response = await axios.get(`${singleData?.url}`, {
      responseType: "blob",
    });
    const file = new Blob([response.data], { type: "application/pdf" });
    //Build a URL from the file
    const fileURL = URL.createObjectURL(file);
    //Open the URL on new Window
    const pdfWindow = window.open() as Window;
    pdfWindow.location.href = fileURL;
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
        description: "Surat berhasil diupload",
        className: "bg-success text-white",
      });
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

  const { mutate: mutateDelete } = useMutation({
    mutationFn: async () => {
      const response = await axios.delete(`/api/surat`, {
        params: { id },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surat"] });
      router.push("/surat");
      toast({
        title: "Berhasil menghapus surat",
        className: "bg-success text-white",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal menghapus surat",
        className: "bg-danger text-white",
      });
    },
  });

  const handleDelete = async () => {
    await mutateDelete();
  };

  const handleSetuju = () => {
    if (user?.jabatan.permision.persetujuan) {
      mutate({ persetujuan: `Disetujui ${user?.user.jabatan.name}` });
    }
  };

  const handleMenolak = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user?.jabatan.permision.persetujuan) {
      mutate({
        persetujuan: `Ditolak ${user?.user.jabatan.name}`,
        komentar: e.currentTarget.komentar.value,
      });
    }
  };

  const { mutate: mutateRevisi } = useMutation({
    mutationFn: async (input: { id: any; surat: File }) => {
      setIsUploadLoading(true);
      const response = await axios.put(
        `/api/surat/revisi`,
        {
          id,
          judul: singleData?.judul,
          deskripsi: singleData?.deskripsi,
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

  const canPersetujuan =
    user?.jabatan.permision.persetujuan &&
    // Surat di tangan user
    singleData?.status.status.includes(user?.user.jabatan.name) &&
    !singleData?.status.status.includes(user?.jabatan.jabatan_atas?.name) &&
    (singleData?.status.status.includes("Daftar Tunggu") ||
      singleData?.status.status.includes("Diproses"));

  const canUpload = user?.jabatan.permision.upload_tandatangan;

  const canDownload =
    user?.jabatan.permision.download_surat &&
    // User tidak punya jabatan atas & surat belum ditandatangani
    ((!user?.jabatan.jabatan_atas &&
      !singleData?.status.status.includes("Ditandatangani")) ||
      // User adalah pembuat surat
      user?.jabatan.name === singleData?.user.jabatan.name);

  const canDelete =
    // User yang mempunyai surat
    user?.jabatan.name === singleData?.user.jabatan.name &&
    user?.user.prodi?.name === singleData?.user.prodi?.name &&
    // Surat masih di tangan atasan
    singleData?.status.status.includes(user.jabatan.jabatan_atas.name) &&
    !singleData?.status.status.includes("Ditolak");

  const canRevisi =
    // User yang mempunyai surat
    user?.jabatan.name === singleData?.user.jabatan.name &&
    user?.user.prodi?.name === singleData?.user.prodi?.name &&
    // Surat punya nomor surat
    singleData?.nomor_surat[singleData.nomor_surat.length - 1];

  if (isKomentarLoading)
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );

  return (
    <div className="lg:flex gap-10 w-full">
      <div className="lg:w-3/5 sm:w-full h-fit rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="container mx-auto py-10">
          {/* Tombol buka file, absolute di atas worker */}
          {singleData && (
            <>
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
                <div className="mb-4 h-[100vh]">
                  <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>;
                  <Viewer
                    fileUrl={singleData?.url}
                    defaultScale={SpecialZoomLevel.ActualSize}
                    plugins={[toolbarPluginInstance]}
                  />
                </div>
              </Worker>
            </>
          )}
        </div>
      </div>
      <div className="lg:w-2/5 sm:w-full h-fit rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="container mx-auto py-10 relative">
          <div className="absolute top-10 right-0 z-99">
            <Button
              onClick={handleOpenFile}
              className="bg-primary text-white font-medium"
            >
              Buka File
            </Button>
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
                {singleData?.judul.split(".")[0].split("-")[0]}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-title-xs font-medium text-black dark:text-white">
                Pembuat Surat
              </span>
              <span className="text-body-xs text-black dark:text-white">
                {singleData?.user.name}
                {singleData?.user.prodi
                  ? `, (${singleData?.user.prodi.name})`
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
              (singleData?.status.status.includes("Daftar Tunggu") ||
                singleData?.status.status.includes("Diproses")) &&
              "bg-warning"
            }
            ${singleData?.status.status.includes("Ditolak") && "bg-danger"}
            ${
              singleData?.status.status.includes("Ditandatangani") &&
              "bg-success"
            }
            `}
                >
                  {singleData?.status.status}
                </Badge>
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-title-xs font-medium text-black dark:text-white">
                Nomor Surat
              </span>
              <span className="text-body-xs text-black dark:text-white">
                {singleData?.nomor_surat[singleData.nomor_surat.length - 1]
                  ? singleData?.nomor_surat[singleData.nomor_surat.length - 1]
                      .nomor_surat
                  : "-"}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-title-xs font-medium text-black dark:text-white">
                Tanggal Dibuat
              </span>
              <span className="text-body-xs text-black dark:text-white">
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
              <span className="text-title-xs font-medium text-black dark:text-white">
                Jenis Surat
              </span>
              <span className="text-body-xs text-black dark:text-white">
                {singleData?.jenis.jenis}
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-2 gap-2">
            <div className="flex flex-col space-y-1">
              <span className="text-title-xs font-medium text-black dark:text-white">
                Deskripsi
              </span>
              <span className="text-body-xs text-black dark:text-white">
                {singleData?.deskripsi}
              </span>
            </div>

            {komentar[komentar.length - 1] && (
              <div className="flex flex-col space-y-1">
                <span className="text-title-xs font-medium text-black dark:text-white">
                  Alasan Penolakan
                </span>
                <span className="text-body-xs text-black dark:text-white">
                  {komentar[komentar.length - 1]?.komentar}
                </span>
              </div>
            )}

            {canPersetujuan && (
              <div className="pt-12 flex gap-4 text-white">
                <Button className="bg-success w-full" onClick={handleSetuju}>
                  {isSetujuLoading ? (
                    <div className="h-6 w-6 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></div>
                  ) : (
                    <CheckIcon className="w-6 h-6" />
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setModalMenolakOpen(true);
                  }}
                  className="bg-danger w-full"
                >
                  <Cross2Icon className="w-6 h-6" />
                </Button>
              </div>
            )}
            <div className="flex gap-4 w-full text-white">
              {canUpload && (
                <Button
                  className="bg-primary w-full"
                  onClick={() => {
                    setUploadModalOpen(true);
                  }}
                >
                  <UploadIcon className="w-6 h-6" />
                </Button>
              )}
              {canDownload && (
                <Button className="bg-primary w-full" onClick={handleDownload}>
                  <DownloadIcon className="w-6 h-6" />
                </Button>
              )}
              {canDelete && (
                <Button
                  className="bg-danger w-full"
                  onClick={() => setModalDeleteOpen(true)}
                >
                  <TrashIcon className="w-6 h-6" />
                </Button>
              )}
              {canRevisi && (
                <Button
                  className="bg-primary w-full"
                  onClick={() => setModalRevisiOpen(true)}
                >
                  <EditIcon className="w-6 h-6" />
                </Button>
              )}
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
      {modalMenolakOpen && (
        <Modal setModalOpen={setModalMenolakOpen}>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Masukkan Alasan Penolakan
              </h3>
            </div>
            <form onSubmit={handleMenolak}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <input
                    name="komentar"
                    type="text"
                    placeholder="Masukkan alasan penolakan"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
                  {isMenolakLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></div>
                  ) : (
                    "Kirim alasan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
      {modalDeleteOpen && (
        <ConfirmationModal
          setModalOpen={setModalDeleteOpen}
          title="Hapus Surat"
          message={`Apakah anda yakin ingin menghapus surat ${
            singleData?.judul.split(".")[0]
          }?`}
          onClick={handleDelete}
        />
      )}
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
