import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function ProdiForm({
  onSubmit,
  values,
  isLoading,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  values?: any;
  isLoading?: boolean;
}) {
  const { data: fakultasData, isLoading: isFakultasLoading } = useQuery({
    queryKey: ["fakultas"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/fakultas`);
      return data;
    },
  });

  if (isFakultasLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          {values ? "Edit Prodi" : "Tambah Prodi"}
        </h3>
      </div>
      <form onSubmit={onSubmit}>
        <div className="p-6.5">
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Nama <span className="text-meta-1">*</span>
            </label>
            <input
              name="nama"
              type="text"
              defaultValue={values?.name}
              placeholder={values ? values.name : "Masukkan nama prodi"}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Kode <span className="text-meta-1">*</span>
            </label>
            <input
              name="kode_prodi"
              type="text"
              defaultValue={values?.kode_prodi}
              placeholder={values ? values.kode_prodi : "Masukkan kode prodi"}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-3 block text-black dark:text-white">
              Fakultas
            </label>
            <div className="relative z-20 bg-white dark:bg-form-input">
              <select
                name="fakultas_id"
                defaultValue={values?.fakultas_id}
                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
              >
                {fakultasData.map((fakultas: any) => (
                  <option key={fakultas.id} value={fakultas.id}>
                    {fakultas.name}
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

          <button className="mt-6 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
            {isLoading ? (
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></div>
            ) : values ? (
              "Edit Prodi"
            ) : (
              "Tambah Prodi"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
