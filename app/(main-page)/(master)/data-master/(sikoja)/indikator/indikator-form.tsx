import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function IndikatorForm({
  onSubmit,
  values,
  isLoading,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  values?: any;
  isLoading?: boolean;
}) {
  const { data: ikuData, isLoading: isIkuLoading } = useQuery({
    queryKey: ["iku"],
    queryFn: async () => {
      const response = await axios.get("/api/sikoja/iku");
      return response.data;
    },
  });

  const { data: strategiData, isLoading: isStrategiLoading } = useQuery({
    queryKey: ["strategi"],
    queryFn: async () => {
      const response = await axios.get("/api/sikoja/strategi");
      return response.data;
    },
  });

  if (isIkuLoading || isStrategiLoading) {
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
          {values ? "Edit Indikator" : "Tambah Indikator"}
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
              placeholder={values ? values.name : "Masukkan nama"}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              IKU
            </label>
            <select
              name="iku_id"
              defaultValue={values?.iku_id}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            >
              {ikuData.map((iku: any) => (
                <option key={iku.id} value={iku.id}>
                  {iku.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Strategi
            </label>
            <select
              name="strategi_id"
              defaultValue={values?.strategi_id}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            >
              {strategiData.map((strategi: any) => (
                <option key={strategi.id} value={strategi.id}>
                  {strategi.name}
                </option>
              ))}
            </select>
          </div>

          <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></div>
            ) : values ? (
              "Edit Indikator"
            ) : (
              "Tambah Indikator"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
