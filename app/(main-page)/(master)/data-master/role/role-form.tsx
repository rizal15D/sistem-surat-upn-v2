export default function RoleForm({
  onSubmit,
  values,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  values?: any;
}) {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          {values ? "Edit Role" : "Tambah Role"}
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
              placeholder={values ? values.name : "Masukkan nama role"}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
            {values ? "Edit" : "Tambah"}
          </button>
        </div>
      </form>
    </div>
  );
}
