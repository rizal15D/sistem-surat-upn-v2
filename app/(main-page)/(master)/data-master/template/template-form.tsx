import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";

export default function TemplateForm({
  onSubmit,
  values,
  warningMessage,
  setWarningMessage,
  isLoading,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  values?: any;
  warningMessage: string;
  setWarningMessage: (message: string) => void;
  isLoading?: boolean;
}) {
  const [selectedFile, setSelectedFile] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (!file.name.endsWith(".doc") && !file.name.endsWith(".docx")) {
        setWarningMessage("Tolong upload file .doc / .docx .");
      } else if (file.size > 1024 * 1024) {
        setWarningMessage("Ukuran file tidak boleh lebih dari 1MB.");
      } else {
        setWarningMessage("");
      }
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="container mx-auto py-10 rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5"
    >
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Data Template
          </h3>
        </div>

        <div className="p-6.5">
          <div className="mb-6">
            <div className="mb-2.5">
              <label className="mb-3 block text-black dark:text-white">
                Upload Template
              </label>
              <input
                name="file"
                type="file"
                defaultValue={values?.surat}
                placeholder={values ? values.surat : "Masukkan file surat"}
                accept=".doc,.docx"
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
              {warningMessage && (
                <p className="text-danger">{warningMessage}</p>
              )}
            </div>

            <label className="mb-2.5 block text-black dark:text-white">
              Judul
            </label>
            <input
              name="judul"
              type="text"
              defaultValue={values?.judul.split(".")[0]}
              placeholder={
                values ? values.judul.split(".")[0] : "Masukkan judul surat"
              }
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2.5 block text-black dark:text-white">
              Deskripsi
            </label>
            <textarea
              name="deskripsi"
              rows={6}
              defaultValue={values?.deskripsi}
              placeholder={
                values ? values.deskripsi : "Masukkan deskripsi surat"
              }
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2.5 block text-black dark:text-white">
              Jenis
            </label>
            <input
              name="jenis"
              type="text"
              defaultValue={values?.jenis}
              placeholder={values ? values.jenis : "Contoh: Surat Keputusan"}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
            {isLoading ? (
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></div>
            ) : values ? (
              "Simpan"
            ) : (
              "Tambah"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
