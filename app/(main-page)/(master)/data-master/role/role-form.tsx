import { User } from "@/app/api/auth/[...nextauth]/authOptions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";

export default function RoleForm({
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
                  disabled={values?.name === "Super Admin"}
                  defaultChecked={values?.permision?.akses_master.jenis_surat}
                  className="rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <label htmlFor="surat-masuk">Jenis Surat</label>
              </div>
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
