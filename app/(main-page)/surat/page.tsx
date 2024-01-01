import { PlusIcon } from "@radix-ui/react-icons";
import { Letter, columns } from "./columns";
import { DataTable } from "./data-table";
import Link from "next/link";

async function getData(): Promise<Letter[]> {
  // Fetch data from your API here.
  return [
    {
      id: 1,
      judul: "Surat 1",
      pin: true,
      dibaca: true,
      user_id: 1,
      tanggal: new Date("2021-08-01"),
      status: "Diterima",
      lokasi_surat: "Surat 1",
      komentar: "Komentar 1",
    },
    {
      id: 2,
      judul: "Surat 2",
      pin: false,
      dibaca: false,
      user_id: 2,
      tanggal: new Date("2021-08-02"),
      status: "Diproses Dekan",
      lokasi_surat: "Surat 2",
      komentar: "Komentar 2",
    },
    {
      id: 3,
      judul: "Surat 3",
      pin: true,
      dibaca: false,
      user_id: 3,
      tanggal: new Date("2021-08-03"),
      status: "Ditolak",
      lokasi_surat: "Surat 3",
      komentar: "Komentar 3",
    },
    {
      id: 4,
      judul: "Surat 4",
      pin: false,
      dibaca: true,
      user_id: 4,
      tanggal: new Date("2021-08-04"),
      status: "Diterima",
      lokasi_surat: "Surat 4",
      komentar: "Komentar 4",
    },
    {
      id: 5,
      judul: "Surat 5",
      pin: true,
      dibaca: false,
      user_id: 5,
      tanggal: new Date("2021-08-05"),
      status: "Dibaca",
      lokasi_surat: "Surat 5",
      komentar: "Komentar 5",
    },
    {
      id: 6,
      judul: "Surat 6",
      pin: false,
      dibaca: true,
      user_id: 6,
      tanggal: new Date("2021-08-06"),
      status: "Ditolak",
      lokasi_surat: "Surat 6",
      komentar: "Komentar 6",
    },
    {
      id: 7,
      judul: "Surat 7",
      pin: true,
      dibaca: false,
      user_id: 7,
      tanggal: new Date("2021-08-07"),
      status: "Diterima",
      lokasi_surat: "Surat 7",
      komentar: "Komentar 7",
    },
    {
      id: 8,
      judul: "Surat 8",
      pin: false,
      dibaca: true,
      user_id: 8,
      tanggal: new Date("2021-08-08"),
      status: "Dibaca Dekan",
      lokasi_surat: "Surat 8",
      komentar: "Komentar 8",
    },
    {
      id: 9,
      judul: "Surat 9",
      pin: true,
      dibaca: false,
      user_id: 9,
      tanggal: new Date("2021-08-09"),
      status: "Ditolak",
      lokasi_surat: "Surat 9",
      komentar: "Komentar 9",
    },
    {
      id: 10,
      judul: "Surat 10",
      pin: false,
      dibaca: true,
      user_id: 10,
      tanggal: new Date("2021-08-10"),
      status: "Diterima",
      lokasi_surat: "Surat 10",
      komentar: "Komentar 10",
    },
    {
      id: 11,
      judul: "Surat 11",
      pin: true,
      dibaca: false,
      user_id: 11,
      tanggal: new Date("2021-08-11"),
      status: "Diproses",
      lokasi_surat: "Surat 11",
      komentar: "Komentar 11",
    },
    {
      id: 12,
      judul: "Surat 12",
      pin: false,
      dibaca: true,
      user_id: 12,
      tanggal: new Date("2021-08-12"),
      status: "Ditolak",
      lokasi_surat: "Surat 12",
      komentar: "Komentar 12",
    },
    {
      id: 13,
      judul: "Surat 13",
      pin: true,
      dibaca: false,
      user_id: 13,
      tanggal: new Date("2021-08-13"),
      status: "Diterima",
      lokasi_surat: "Surat 13",
      komentar: "Komentar 13",
    },
    {
      id: 14,
      judul: "Surat 14",
      pin: false,
      dibaca: true,
      user_id: 14,
      tanggal: new Date("2021-08-14"),
      status: "Diproses",
      lokasi_surat: "Surat 14",
      komentar: "Komentar 14",
    },
    {
      id: 15,
      judul: "Surat 15",
      pin: true,
      dibaca: false,
      user_id: 15,
      tanggal: new Date("2021-08-15"),
      status: "Ditolak",
      lokasi_surat: "Surat 15",
      komentar: "Komentar 15",
    },
  ];
}

export default async function ListSuratPage() {
  const data = await getData();

  return (
    <>
      <div className="w-full flex justify-between items-center pb-4">
        <h1 className="text-title-md2 font-semibold text-black dark:text-white">
          Daftar Surat
        </h1>
        <Link
          href="#"
          className="inline-flex items-center justify-center rounded-lg bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Upload Surat
        </Link>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
}
