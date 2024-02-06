import { getServerSession } from "next-auth";
import { authOptions, User } from "../auth/[...nextauth]/authOptions";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  if (session) {
    const { data } = await axios.get(`${process.env.API_URL}/jabatan`, {
      headers: {
        Authorization: `Bearer ${session.user?.accessToken}`,
      },
    });

    return NextResponse.json(data);
  } else {
    return NextResponse.json({
      error: "Unauthorized",
    });
  }
}

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  const { input } = await req.json();

  if (session) {
    const { data } = await axios.post(
      `${process.env.API_URL}/jabatan/postAll`,
      {
        name: input.name,
        jabatan_atas_id: input.jabatan_atas_id,
        buat_surat: input.buat_surat,
        download_surat: input.download_surat,
        generate_nomor_surat: input.generate_nomor_surat,
        upload_tandatangan: input.upload_tandatangan,
        persetujuan: input.persetujuan,
        view_all_repo: input.view_all_repo,
        prodi: input.prodi,
        template: input.template,
        periode: input.periode,
        fakultas: input.fakultas,
        jabatan: input.jabatan,
        jenis_surat: input.jenis_surat,
      },
      {
        headers: {
          Authorization: `Bearer ${session.user?.accessToken}`,
        },
      }
    );

    return NextResponse.json(data);
  } else {
    return NextResponse.json({
      error: "Unauthorized",
    });
  }
}

export async function PUT(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  if (session) {
    const { id, input } = await req.json();

    console.log(input.jabatan_atas_id);

    const { data: data1 } = await axios.put(
      `${process.env.API_URL}/jabatan?jabatan_id=${id}`,
      {
        name: input.name,
        jabatan_atas_id: input.jabatan_atas_id,
      },
      {
        headers: {
          Authorization: `Bearer ${session.user?.accessToken}`,
        },
      }
    );

    const { data: data2 } = await axios.put(
      `${process.env.API_URL}/permision?jabatan_id=${id}`,
      {
        buat_surat: input.buat_surat,
        download_surat: input.download_surat,
        generate_nomor_surat: input.generate_nomor_surat,
        upload_tandatangan: input.upload_tandatangan,
        persetujuan: input.persetujuan,
      },
      {
        headers: {
          Authorization: `Bearer ${session.user?.accessToken}`,
        },
      }
    );

    const { data: data3 } = await axios.put(
      `${process.env.API_URL}/akses-master?jabatan_id=${id}`,
      {
        prodi: input.prodi,
        template: input.template,
        periode: input.periode,
        fakultas: input.fakultas,
        jabatan: input.jabatan,
        jenis_surat: input.jenis_surat,
      },
      {
        headers: {
          Authorization: `Bearer ${session.user?.accessToken}`,
        },
      }
    );

    return NextResponse.json([data1, data2, data3]);
  } else {
    return NextResponse.json({
      error: "Unauthorized",
    });
  }
}

export async function DELETE(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  if (session) {
    const { id } = await req.json();

    const { data } = await axios.delete(
      `${process.env.API_URL}/jabatan?jabatan_id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${session.user?.accessToken}`,
        },
      }
    );

    return NextResponse.json(data);
  } else {
    return NextResponse.json({
      error: "Unauthorized",
    });
  }
}
