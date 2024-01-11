import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function PeriodeForm({
  onSubmit,
  values,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  values?: any;
}) {
  const { data: prodiData, isLoading } = useQuery({
    queryKey: ["prodi"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/prodi`);
      return data;
    },
  });

  if (isLoading) {
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
          {values ? "Edit Periode" : "Tambah Periode"}
        </h3>
      </div>
      <form onSubmit={onSubmit}>
        <div className="p-6.5">
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Tahun <span className="text-meta-1">*</span>
            </label>
            <input
              name="tahun"
              type="text"
              defaultValue={
                values
                  ? new Intl.DateTimeFormat("id-ID", {
                      year: "numeric",
                    }).format(new Date(values.tahun.toString()))
                  : ""
              }
              placeholder={
                values
                  ? new Intl.DateTimeFormat("id-ID", {
                      year: "numeric",
                    }).format(new Date(values.tahun.toString()))
                  : "Masukkan tahun periode"
              }
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Semester <span className="text-meta-1">*</span>
            </label>
            <input
              name="semester"
              type="text"
              defaultValue={values?.semester}
              placeholder={values ? values.semester : "Masukkan semester"}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-3 block text-black dark:text-white">
              Prodi
            </label>
            <div className="relative z-20 bg-white dark:bg-form-input">
              <select
                name="prodi_id"
                defaultValue={values?.prodi_id}
                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
              >
                {prodiData.map((fakultas: any) => (
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
            {values ? "Edit" : "Tambah"}
          </button>
        </div>
      </form>
    </div>
  );
}
