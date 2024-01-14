import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

export default function UserForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}) {
  const [isProdi, setIsProdi] = useState(false);

  const { data: prodi = [], isLoading: isLoadingProdi } = useQuery({
    queryKey: ["prodi"],
    queryFn: async () => {
      const { data } = await axios.get("/api/prodi");
      return data;
    },
  });

  const { data: fakultas = [], isLoading: isLoadingFakultas } = useQuery({
    queryKey: ["fakultas"],
    queryFn: async () => {
      const { data } = await axios.get("/api/fakultas");
      return data;
    },
  });

  const { data: role = [], isLoading: isLoadingRole } = useQuery({
    queryKey: ["role"],
    queryFn: async () => {
      const { data } = await axios.get("/api/role");
      return data;
    },
  });

  if (isLoadingProdi || isLoadingFakultas || isLoadingRole) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">Tambah User</h3>
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
              placeholder="Masukkan nama user"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="Masukkan email user"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div className="mb-4.5">
            <label className="mb-3 block text-black dark:text-white">
              Role
            </label>
            <div className="relative z-20 bg-white dark:bg-form-input">
              <select
                name="role_id"
                onChange={(e) => {
                  e.target.value ==
                  role.find((role: any) => role.name == "Prodi").id
                    ? setIsProdi(true)
                    : setIsProdi(false);
                }}
                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
              >
                {role.map((role: any) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
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

          {isProdi ? (
            <div className="mb-4.5">
              <label className="mb-3 block text-black dark:text-white">
                Prodi
              </label>
              <div className="relative z-20 bg-white dark:bg-form-input">
                <select
                  name="prodi_id"
                  disabled={!isProdi}
                  className="relative z-20 disabled:cursor-not-allowed disabled:bg-disabled w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                >
                  {prodi.map((prodi: any) => (
                    <option key={prodi.id} value={prodi.id}>
                      {prodi.name}
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
          ) : (
            <input type="hidden" name="prodi_id" value="1" />
          )}

          <div className="mb-4.5">
            <label className="mb-3 block text-black dark:text-white">
              Fakultas
            </label>
            <div className="relative z-20 bg-white dark:bg-form-input">
              <select
                name="fakultas_id"
                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
              >
                {fakultas.map((fakultas: any) => (
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

          <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
            {isLoading ? (
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></div>
            ) : (
              "Tambah"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
