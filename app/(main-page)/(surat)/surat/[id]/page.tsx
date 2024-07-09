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
import { Progress } from "@/components/ui/progress";
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
import { Indikator } from "@/app/(main-page)/(master)/data-master/(sikoja)/indikator/columns";
import { SocketData } from "@/app/(auth)/login/SocketData";

export default function SuratSinglePage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user as User;
  const { toast } = useToast();
  const { id } = useParams();
  const [warningMessage, setWarningMessage] = useState("Input Surat");
  const [fileUrl, setFileUrl] = useState("");
  // const [strategi_id, setStrategi_id] = useState("");
  const [strategi_id, setStrategi_id] = useState<string | null>(null);

  const [isMenolakLoading, setIsMenolakLoading] = useState(false);
  const [isSetujuLoading, setIsSetujuLoading] = useState(false);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [isOCRLoading, setIsOCRLoading] = useState(false);
  const [isPerbaikanLoading, setIsPerbaikanLoading] = useState(false);
  const [isTaggingLoading, setIsTaggingLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isSuratLoading, setIsSuratLoading] = useState(false);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [modalMenolakOpen, setModalMenolakOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [modalPerbaikanOpen, setModalPerbaikanOpen] = useState(false);
  const [modalTaggingOpen, setModalTaggingOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  // const [isUpdatedStatus, setIsUpdatedStatus] = useState(false);

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
      const response = await axios.get(`/api/surat/${id}`);

      return response.data;
    },
    enabled: !!id,
  });

  const { mutate: mutateBaca } = useMutation({
    mutationFn: async () => {
      const input = {
        dibaca: true,
        pin: letterData.surat.tampilan[0]?.pin,
      };

      await axios.put(`/api/surat/tampilan`, {
        id: id,
        input,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repo"] });
    },
  });

  // useEffect(() => {
  //   let socket = SocketData();
  //   socket.on("message", (data) => {
  //     // const parts = data.split("/");
  //     console.log("posisi1");

  //     if (data == `private new mail/${user?.jabatan.id}`) {
  //       console.log("posisi2");
  //       queryClient.invalidateQueries({ queryKey: ["surat"] });
  //       queryClient.invalidateQueries({ queryKey: ["repo", id] });
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   if (isUpdatedStatus) {
  //     queryClient.invalidateQueries({ queryKey: ["surat"] });
  //   }
  // }, [isUpdatedStatus]);

  const getFileUrl = async () => {
    setIsSuratLoading(true);
    const response = await axios.get(
      `/api/surat/download?filepath=${letterData?.surat.path}`,
      {
        responseType: "arraybuffer",
      }
    );

    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    setIsSuratLoading(false);
    return fileURL;
  };

  useEffect(() => {
    if (letterData) {
      getFileUrl().then((url) => setFileUrl(url));
      queryClient.invalidateQueries({ queryKey: ["surat"] });
      queryClient.invalidateQueries({ queryKey: ["repo"] });
      setIsUpdated(false);
      if (letterData.surat.tampilan) {
        if (!letterData.surat.tampilan[0]?.dibaca) {
          mutateBaca();
        }
      }
    }
  }, [letterData, isUpdated]);

  // Get Komentar
  const getKomentar = async () => {
    const response = await axios.get(`/api/surat/komentar`, {
      params: { id },
    });
    return response.data;
  };

  // Get Strategi
  const canTagging = user?.jabatan.permision.tagging;

  const { data: strategiData, isLoading: isStrategiLoading } = useQuery({
    queryKey: ["strategi"],
    queryFn: async () => {
      const response = await axios.get(`/api/sikoja/strategi`, {
        params: {
          strategi_id: strategi_id,
        },
      });
      return response.data as { id: number; name: string }[];
    },
    enabled: canTagging,
  });

  // Get Indikator
  const { data: indikatorData, isLoading: isIndikatorLoading } = useQuery({
    queryKey: ["indikator"],
    queryFn: async () => {
      const response = await axios.get(`/api/sikoja/indikator`, {
        params: {
          strategi_id: strategi_id,
        },
      });

      return response.data.indikator;
    },
    enabled: canTagging,
  });

  const { data: komentar, isLoading: isKomentarLoading } = useQuery({
    queryKey: ["komentar", id],
    queryFn: getKomentar,
    enabled: !!letterData?.surat.status.status.includes("Ditolak"),
  });

  const handleDownload = async () => {
    let link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute(
      "download",
      `${
        letterData?.surat.nomor_surat[letterData?.surat.nomor_surat.length - 1]
          .nomor_surat
      } - ${letterData?.surat.judul.split(".")[0]}.pdf`
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

  // Upload Surat TTD (Admin Dekan)
  const { mutate: mutateUpload } = useMutation({
    mutationFn: async (input: { id: any; surat: File }) => {
      if (isUploadLoading) return;

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
      setIsUpdated(true);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surat"] });
      setUploadModalOpen(false);
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

  // Delete Surat
  const { mutate: mutateDelete } = useMutation({
    mutationFn: async () => {
      if (isDeleteLoading) return;

      setIsDeleteLoading(true);
      const response = await axios.delete(`/api/surat`, {
        params: { id },
      });
      setIsUpdated(true);
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
    onSettled: () => {
      setIsDeleteLoading(false);
      setModalDeleteOpen(false);
    },
  });

  const handleDelete = async () => {
    await mutateDelete();
  };

  // Persetujuan
  const { mutate: mutatePersetujuan } = useMutation({
    mutationFn: async (input: {
      persetujuan: string;
      indikator_id?: number;
      komentar?: string;
    }) => {
      if (isSetujuLoading || isMenolakLoading || isTaggingLoading) return;

      if (input.komentar) {
        setIsMenolakLoading(true);
        await axios.post(`/api/surat/komentar`, {
          id,
          input: { komentar: input.komentar },
        });
      } else {
        setIsTaggingLoading(true);
        setIsSetujuLoading(true);
      }
      const response = await axios.put(`/api/surat/persetujuan`, { id, input });
      setIsUpdated(true);
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
      setIsTaggingLoading(false);
      setModalMenolakOpen(false);
      setModalTaggingOpen(false);
    },
  });

  const handleSetuju = () => {
    if (user?.jabatan.permision.persetujuan) {
      if (canTagging) {
        setModalTaggingOpen(true);
        return;
      }

      mutatePersetujuan({
        persetujuan: `Disetujui ${user?.user.jabatan.name}`,
      });
    }
  };

  const handleMenolak = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user?.jabatan.permision.persetujuan) {
      mutatePersetujuan({
        persetujuan: `Ditolak ${user?.user.jabatan.name}`,
        komentar: e.currentTarget.komentar.value,
      });
    }
  };

  // OCR
  const { mutate: mutateOCR } = useMutation({
    mutationFn: async () => {
      if (isOCRLoading) return;

      setIsOCRLoading(true);
      const response = await axios.post(`/api/surat/ocr`, {
        surat_id: id,
        nomor_surat_id:
          letterData?.surat.nomor_surat[
            letterData?.surat.nomor_surat.length - 1
          ].id,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surat"] });
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
      setIsOCRLoading(false);
    },
  });

  // Perbaikan Surat
  const { mutate: mutatePerbaikan } = useMutation({
    mutationFn: async (input: {
      surat_id: any;
      surat: File;
      deskripsi: string;
    }) => {
      if (isPerbaikanLoading) return;

      setIsPerbaikanLoading(true);
      const response = await axios.post(
        `/api/surat/perbaikan`,
        {
          surat_id: input.surat_id,
          surat: input.surat,
          deskripsi: input.deskripsi,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setIsUpdated(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surat"] });
      setModalPerbaikanOpen(false);
      toast({
        title: "Berhasil",
        description: "Surat berhasil diperbaiki",
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
      setIsPerbaikanLoading(false);
    },
  });

  const handlePerbaikan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      surat_id: id,
      surat: formData.get("file") as File,
      deskripsi: formData.get("deskripsi") as string,
    };

    if (!data.surat || !data.deskripsi) {
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

    mutatePerbaikan(data);
  };

  const getBadgeColor = (data: String) => {
    if (data.includes("Admin Dekan")) {
      return `rgb(150, 123, 182)`; //ungu
    }
    if (data.includes("Daftar Tunggu") || data.includes("Diproses")) {
      return "rgb(250 204 21)"; // warna pengganti untuk bg-warning
    }

    if (data.includes("Ditolak")) {
      return "rgb(239 68 68)"; // warna pengganti untuk bg-danger
    }
    if (data.includes("Ditandatangani")) {
      return "rgb(34 197 94)"; // warna pengganti untuk bg-success
    }
    return "rgb(120 113 108)"; // default color
  };

  const canPersetujuan =
    user?.jabatan.permision.persetujuan &&
    // Surat di tangan user
    letterData?.surat.status.status.includes(user?.user.jabatan.name) &&
    !letterData?.surat.status.status.includes(
      user?.jabatan.jabatan_atas?.name
    ) &&
    (letterData?.surat.status.status.includes("Daftar Tunggu") ||
      letterData?.surat.status.status.includes("Diproses"));

  const canUpload = user?.jabatan.permision.upload_tandatangan;

  const canDownload =
    user?.jabatan.permision.download_surat &&
    // User tidak punya jabatan atas & surat belum ditandatangani
    !user?.jabatan.jabatan_atas &&
    !letterData?.surat.status.status.includes("Ditandatangani");

  const canDelete =
    // User yang mempunyai surat
    user?.jabatan.name === letterData?.surat.user?.jabatan.name &&
    user?.user.prodi?.name === letterData?.surat.user?.prodi?.name &&
    // Surat masih di tangan atasan
    letterData?.surat.status.status.includes(
      user?.jabatan.jabatan_atas?.name
    ) &&
    !letterData?.surat.status.persetujuan;

  const canOCR =
    user?.jabatan.permision.generate_nomor_surat &&
    // Surat punya nomor surat
    letterData?.surat.nomor_surat[letterData?.surat.nomor_surat.length - 1];

  const canPerbaikan =
    // User yang mempunyai surat
    user?.jabatan.name === letterData?.surat.user?.jabatan.name &&
    user?.user.prodi?.name === letterData?.surat.user?.prodi?.name &&
    // Surat ditolak
    letterData?.surat.status.status.includes("Ditolak");

  if (isKomentarLoading || isLetterLoading || isSuratLoading)
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
            <div className="flex py-6 items-center justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
          )}
        </div>
      </div>
      <div className="lg:w-2/5 sm:w-full h-fit rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="container mx-auto py-10 relative">
          <div className="absolute flex gap-2 top-10 right-0 z-99">
            {letterData?.revisi[letterData?.revisi.length - 1] && (
              <Link
                href={`/surat/${
                  letterData?.revisi[letterData?.revisi.length - 1]
                    ?.surat_id_old.id
                }`}
              >
                <Button className="bg-primary text-white font-medium">
                  Lihat Surat Lama
                </Button>
              </Link>
            )}
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
                  style={{
                    backgroundColor: getBadgeColor(
                      letterData?.surat.status.status
                    ),
                    color: "white", // mengatur warna teks menjadi putih
                    textAlign: "center",
                    width: "100%",
                    marginBottom: "0.5rem", // menggantikan mb-2
                  }}
                >
                  <p className="text-center w-full">
                    {letterData?.surat.status.status}
                  </p>
                </Badge>
                {letterData?.surat.status.status.includes("Daftar Tunggu") ||
                  (letterData?.surat.status.status.includes("Diproses") && (
                    <span className="flex gap-2">
                      <Progress
                        className="h-2"
                        value={letterData?.surat.progressBar}
                      />
                      <p className="text-xs">
                        {letterData?.surat.progressBar}%
                      </p>
                    </span>
                  ))}
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

            {komentar?.komentar && (
              <div className="flex flex-col space-y-1">
                <span className="text-title-xs font-medium text-black dark:text-white">
                  Alasan Penolakan
                </span>
                <span className="text-body-xs text-black dark:text-white">
                  {komentar.komentar.komentar}
                </span>
              </div>
            )}

            {canPersetujuan && (
              <div className="pt-12 flex gap-4 text-white">
                <Button
                  className="bg-success w-full"
                  onClick={handleSetuju}
                  disabled={isSetujuLoading || isMenolakLoading}
                >
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
                  disabled={isMenolakLoading || isSetujuLoading}
                >
                  <Cross2Icon className="w-6 h-6" />
                </Button>
              </div>
            )}
            <div className="flex gap-4 w-full text-white">
              {canUpload && fileUrl && (
                <Button
                  className="flex gap-2 bg-primary w-full"
                  onClick={() => {
                    setUploadModalOpen(true);
                  }}
                >
                  <UploadIcon className="w-6 h-6" />
                  Upload TTD
                </Button>
              )}
              {canDownload && fileUrl && (
                <Button
                  className="flex gap-2 bg-primary w-full"
                  onClick={handleDownload}
                >
                  <DownloadIcon className="w-6 h-6" />
                  Download
                </Button>
              )}
              {canDelete && (
                <Button
                  className="flex gap-2 bg-danger w-full"
                  onClick={() => setModalDeleteOpen(true)}
                >
                  <TrashIcon className="w-6 h-6" />
                  Hapus
                </Button>
              )}
              {/* {canOCR && (
                <Button
                  className="flex gap-2 bg-primary w-full"
                  onClick={() => mutateOCR()}
                >
                  {isOCRLoading ? (
                    <div className="h-6 w-6 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></div>
                  ) : (
                    <>
                      <Clipboard className="w-6 h-6" />
                      Tempel Nomor Surat
                    </>
                  )}
                </Button>
              )} */}
              {canPerbaikan && (
                <Button
                  className="bg-warning w-full"
                  onClick={() => setModalPerbaikanOpen(true)}
                >
                  <EditIcon className="w-6 h-6" />
                  Perbaiki Surat
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      {modalTaggingOpen && (
        <Modal setModalOpen={setModalTaggingOpen}>
          {isStrategiLoading || isIndikatorLoading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
          ) : (
            <form
              className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
              onSubmit={(e) => {
                e.preventDefault();
                mutatePersetujuan({
                  persetujuan: `Disetujui ${user?.user.jabatan.name}`,
                  indikator_id: parseInt(e.currentTarget.indikator_id.value),
                });
              }}
            >
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Tagging Surat
                </h3>
              </div>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <span className="text-title-xs font-medium text-black dark:text-white">
                    Pilih Strategi
                  </span>
                  <select
                    name="strategi_id"
                    onChange={(e) => setStrategi_id(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  >
                    <option value="">Pilih Strategi</option>
                    {strategiData &&
                      Array.isArray(strategiData) &&
                      strategiData.map((strategi: any) => (
                        <option key={strategi.id} value={strategi.id}>
                          {strategi.name}
                        </option>
                      ))}
                  </select>
                </div>

                {strategi_id && (
                  <div className="mb-4.5">
                    <span className="text-title-xs font-medium text-black dark:text-white">
                      Pilih Indikator
                    </span>
                    <select
                      name="indikator_id"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    >
                      {indikatorData &&
                        indikatorData.map(
                          (indikator: any) =>
                            indikator.strategi.id == indikator.strategi.id && (
                              <option key={indikator.id} value={indikator.id}>
                                {indikator.name}
                              </option>
                            )
                        )}
                    </select>
                  </div>
                )}

                <button
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray disabled:cursor-not-allowed disabled:bg-disabled disabled:text-black"
                  disabled={!strategi_id}
                >
                  {isTaggingLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></div>
                  ) : (
                    "Tagging Surat"
                  )}
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
      {uploadModalOpen && (
        <Modal setModalOpen={setUploadModalOpen}>
          <SuratForm
            onSubmit={handleUpload}
            warningMessage={warningMessage}
            setWarningMessage={setWarningMessage}
            isLoading={isUploadLoading}
            isModal={true}
            hasJenis={false}
            hasJudul={false}
            hasDeskripsi={false}
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
          isLoading={isDeleteLoading}
          title="Hapus Surat"
          message={`Apakah anda yakin ingin menghapus surat ${
            letterData?.surat.judul.split(".")[0]
          }?`}
          onClick={handleDelete}
        />
      )}
      {modalPerbaikanOpen && (
        <Modal setModalOpen={setModalPerbaikanOpen}>
          <SuratForm
            onSubmit={handlePerbaikan}
            warningMessage={warningMessage}
            setWarningMessage={setWarningMessage}
            isLoading={isPerbaikanLoading}
            isModal={true}
            hasJenis={false}
            hasJudul={false}
          />
        </Modal>
      )}
    </div>
  );
}
