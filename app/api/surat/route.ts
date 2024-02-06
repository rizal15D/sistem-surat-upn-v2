import { getServerSession } from "next-auth";
import { authOptions, User } from "../auth/[...nextauth]/authOptions";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  const prodi_id = req.nextUrl.searchParams.get("prodi_id");
  const repo = req.nextUrl.searchParams.get("repo")?.toString();

  const startDateStr = req.nextUrl.searchParams.get("startDate");
  let startDate: Date | null = null;
  if (startDateStr) {
    startDate = new Date(startDateStr);
  }

  const endDateStr = req.nextUrl.searchParams.get("endDate");
  let endDate: Date | null = null;
  if (endDateStr) {
    endDate = new Date(endDateStr);
  }

  const formattedStartDate = startDate
    ? startDate.toISOString().split("T")[0]
    : null;
  const formattedEndDate = endDate ? endDate.toISOString().split("T")[0] : null;

  if (session) {
    const { data } = await axios.get(`${process.env.API_URL}/daftar-surat`, {
      headers: {
        Authorization: `Bearer ${session.user?.accessToken}`,
      },
      params: {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        ...(prodi_id && { prodi_id }),
        ...(repo && { repo }),
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

  if (session) {
    const formData = await req.formData();

    const { data } = await axios.post(
      `${process.env.API_URL}/daftar-surat/multer/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${session.user?.accessToken}`,
          "Content-Type": "multipart/form-data",
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

// Upload TTD
export async function PUT(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  if (session) {
    const formData = await req.formData();
    const id = formData.get("id");
    formData.delete("id");

    const { data } = await axios.put(
      `${process.env.API_URL}/daftar-surat/multer/ttd?surat_id=${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${session.user?.accessToken}`,
          "Content-Type": "multipart/form-data",
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

export async function DELETE(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  if (session) {
    const id = req.nextUrl.searchParams.get("id");

    const { data } = await axios.delete(
      `${process.env.API_URL}/daftar-surat/delete?surat_id=${id}`,
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
