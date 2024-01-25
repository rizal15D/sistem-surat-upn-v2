import { getServerSession } from "next-auth";
import { authOptions, User } from "../auth/[...nextauth]/authOptions";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  if (session) {
    const { data } = await axios.get(`${process.env.API_URL}/daftar-surat`, {
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

  if (session) {
    const formData = await req.formData();

    const { data } = await axios.post(
      `${process.env.API_URL}/daftar-surat/cloudinary/upload`,
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

export async function PUT(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  if (session) {
    const formData = await req.formData();
    const id = formData.get("id");
    formData.delete("id");

    const { data } = await axios.put(
      `${process.env.API_URL}/daftar-surat/cloudinary/update?surat_id=${id}`,
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
