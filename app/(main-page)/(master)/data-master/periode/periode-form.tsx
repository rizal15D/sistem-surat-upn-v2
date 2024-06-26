export default function PeriodeForm({
  onSubmit,
  values,
  isLoading,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  values?: any;
  isLoading?: boolean;
}) {
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

          <button className="mt-6 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
            {isLoading ? (
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></div>
            ) : values ? (
              "Edit Periode"
            ) : (
              "Tambah Periode"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
