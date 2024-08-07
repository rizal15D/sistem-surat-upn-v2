import { getServerSession } from "next-auth";
import { authOptions, User } from "../../auth/[...nextauth]/authOptions";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: any) {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  const { id } = context.params;

  if (session) {
    const { data } = await axios.get(
      `${process.env.API_URL}/daftar-surat/multer/detail?surat_id=${id}`,
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

export async function DELETE(req: NextRequest, context: any) {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  const { id } = context.params;

  if (session) {
    const { data } = await axios.delete(
      `${process.env.API_URL}/daftar-surat/hide`,
      {
        headers: {
          Authorization: `Bearer ${session.user?.accessToken}`,
        },
        data: {
          surat_id: id,
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
