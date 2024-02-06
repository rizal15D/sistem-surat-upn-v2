import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function RoleForm({
  onSubmit,
  values,
  isLoading,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  values?: any;
  isLoading?: boolean;
}) {
  const { data: roleData } = useQuery({
    queryKey: ["role"],
    queryFn: async () => {
      const response = await axios.get("/api/role");
      return response.data;
    },
  });

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          {values ? "Edit Jabatan" : "Tambah Jabatan"}
        </h3>
      </div>
      <form onSubmit={onSubmit}>
        <div className="p-6.5">
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Nama
            </label>
            <input
              name="nama"
              type="text"
              defaultValue={values?.name}
              placeholder={values ? values.name : "Masukkan nama jabatan"}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div className="mb-4.5 flex gap-6">
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Perizinan
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="buat_surat"
                  defaultChecked={values?.permision?.buat_surat}
                  className="rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <label htmlFor="surat-masuk">Buat Surat</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="download_surat"
                  defaultChecked={values?.permision?.download_surat}
                  className="rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <label htmlFor="surat-masuk">Download Surat</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="generate_nomor_surat"
                  defaultChecked={values?.permision?.generate_nomor_surat}
                  className="rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <label htmlFor="surat-masuk">Generate Nomor Surat</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="upload_tandatangan"
                  defaultChecked={values?.permision?.upload_tandatangan}
                  className="rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <label htmlFor="surat-masuk">Upload Tanda Tangan</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="persetujuan"
                  defaultChecked={values?.permision?.persetujuan}
                  className="rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <label htmlFor="surat-masuk">Persetujuan</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="view_all_repo"
                  defaultChecked={values?.permision?.view_all_repo}
                  className="rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <label htmlFor="surat-masuk">Lihat Semua Repo</label>
              </div>
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Akses Master
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="prodi"
                  defaultChecked={values?.permision?.akses_master.prodi}
                  className="rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <label htmlFor="surat-masuk">Prodi</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="template"
                  defaultChecked={values?.permision?.akses_master.template}
                  className="rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <label htmlFor="surat-masuk">Template</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="periode"
                  defaultChecked={values?.permision?.akses_master.periode}
                  className="rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <label htmlFor="surat-masuk">Periode</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="fakultas"
                  defaultChecked={values?.permision?.akses_master.fakultas}
                  className="rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <label htmlFor="surat-masuk">Fakultas</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="jabatan"
                  disabled={values?.name === "Super Admin"}
                  defaultChecked={values?.permision?.akses_master.jabatan}
                  className="rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <label htmlFor="surat-masuk">Jabatan</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="jenis_surat"
                  defaultChecked={values?.permision?.akses_master.jenis_surat}
                  className="rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <label htmlFor="surat-masuk">Jenis Surat</label>
              </div>
            </div>
          </div>

          <div className="mb-4.5">
            <label className="mb-3 block text-black dark:text-white">
              Kirim Surat ke
            </label>
            <div className="relative z-20 bg-white dark:bg-form-input">
              <select
                name="jabatan_atas_id"
                defaultValue={
                  values?.jabatan_atas_id ? values.jabatan_atas_id : ""
                }
                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
              >
                <option value="">-</option>
                {roleData.map((jabatan: any) => (
                  <option key={jabatan.id} value={jabatan.id}>
                    {jabatan.name}
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
              <div className="h-5 w-5 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></div>
            ) : values ? (
              "Edit Jabatan"
            ) : (
              "Tambah Jabatan"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
