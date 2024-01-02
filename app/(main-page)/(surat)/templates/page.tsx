const temp = [
  {
    id: 1,
    judul: "Surat Keterangan",
    deskripsi: "Surat keterangan ini digunakan untuk keperluan tertentu",
    lokasi: "/surat/keterangan",
  },
  {
    id: 2,
    judul: "Surat Keterangan",
    deskripsi: "Surat keterangan ini digunakan untuk keperluan tertentu",
    lokasi: "/surat/keterangan",
  },
  {
    id: 3,
    judul: "Surat Keterangan",
    deskripsi: "Surat keterangan ini digunakan untuk keperluan tertentu",
    lokasi: "/surat/keterangan",
  },
  {
    id: 4,
    judul: "Surat Keterangan",
    deskripsi: "Surat keterangan ini digunakan untuk keperluan tertentu",
    lokasi: "/surat/keterangan",
  },
  {
    id: 5,
    judul: "Surat Keterangan",
    deskripsi: "Surat keterangan ini digunakan untuk keperluan tertentu",
    lokasi: "/surat/keterangan",
  },
  {
    id: 6,
    judul: "Surat Keterangan",
    deskripsi: "Surat keterangan ini digunakan untuk keperluan tertentu",
    lokasi: "/surat/keterangan",
  },
  {
    id: 7,
    judul: "Surat Keterangan",
    deskripsi: "Surat keterangan ini digunakan untuk keperluan tertentu",
    lokasi: "/surat/keterangan",
  },
  {
    id: 8,
    judul: "Surat Keterangan",
    deskripsi: "Surat keterangan ini digunakan untuk keperluan tertentu",
    lokasi: "/surat/keterangan",
  },
];

export default function TemplatePage() {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 container mx-auto py-10">
        {temp.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-center items-center"
          >
            <div className="w-20 h-20 rounded-full bg-primary flex justify-center items-center">
              <img src="/assets/img/surat.png" alt="surat" />
            </div>
            <div className="text-center mt-5">
              <h1 className="text-lg font-bold">{item.judul}</h1>
              <p className="text-sm text-gray-500">{item.deskripsi}</p>
            </div>
            <button className="bg-primary text-white rounded-lg px-5 py-2 mt-5">
              Download surat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
