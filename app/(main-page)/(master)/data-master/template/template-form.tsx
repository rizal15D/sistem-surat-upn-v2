import { Cross2Icon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";

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

  const { data: jenis, isLoading: isJenisLoading } = useQuery({
    queryKey: ["jenis-surat"],
    queryFn: async () => {
      const response = await axios.get("/api/jenis-surat");
      return response.data;
    },
  });

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

  if (isJenisLoading)
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );

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

          <div className="mb-4.5">
            <label className="mb-3 block text-black dark:text-white">
              Jenis
            </label>
            <div className="relative z-20 bg-white dark:bg-form-input">
              <select
                name="jenis_id"
                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
              >
                {jenis.map((jenis: any) => (
                  <option key={jenis.id} value={jenis.id}>
                    {jenis.jenis}
                  </option>
                ))}
              </select>
              <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.8">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                      fill="#637381"
                    ></path>
                  </g>
                </svg>
              </span>
            </div>
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
