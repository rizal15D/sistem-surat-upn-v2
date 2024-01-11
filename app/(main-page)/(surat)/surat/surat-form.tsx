import "@react-pdf-viewer/core/lib/styles/index.css";
import { useState } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";

export default function SuratForm({
  onSubmit,
  warningMessage,
  setWarningMessage,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  warningMessage: string;
  setWarningMessage: (message: string) => void;
}) {
  const [selectedFile, setSelectedFile] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (!file.name.endsWith(".doc") && !file.name.endsWith(".pdf")) {
        setWarningMessage("Tolong upload file .pdf .");
      } else if (file.size > 1024 * 1024) {
        setWarningMessage("Ukuran file tidak boleh lebih dari 1MB.");
      } else {
        setSelectedFile(URL.createObjectURL(file));
        setWarningMessage("");
      }
    }
  };

  return (
    <form
      className="grid sm:grid-cols-1 lg:grid-cols-5 gap-10 w-full"
      onSubmit={onSubmit}
    >
      <div className="lg:col-span-2 sm:col-span-1 row-span-1">
        <div className="container mx-auto py-10 rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <div>
            <label className="mb-3 block text-black dark:text-white">
              Upload PDF Surat
            </label>
            {selectedFile && (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
                <div className="h-96 mb-4">
                  <Viewer
                    fileUrl={selectedFile}
                    defaultScale={SpecialZoomLevel.PageFit}
                  />
                </div>
              </Worker>
            )}
            <input
              type="file"
              name="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm file:font-medium focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
            />
            {selectedFile && (
              <button
                className="border-dashed bg-transparent font-medium focus:outline-none flex items-center"
                onClick={() => {
                  setSelectedFile("");
                  const input = document.querySelector(
                    "input[type=file]"
                  ) as HTMLInputElement;
                  input.value = "";
                }}
              >
                Reset
                <Cross2Icon className="h-4 w-4 ml-1" />
              </button>
            )}
            {warningMessage && <p className="text-danger">{warningMessage}</p>}
          </div>
        </div>
      </div>
      <div className="lg:col-span-3 sm:col-span-1">
        <div className="container mx-auto py-10 rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Form Surat
              </h3>
            </div>

            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Judul Surat<span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="judul"
                  placeholder="Masukkan judul surat"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>

              {/* <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Jenis Surat<span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="jenis"
                  placeholder="Masukkan jenis surat"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div> */}

              <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
                Kirim Surat
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
