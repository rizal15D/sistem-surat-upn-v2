import { getServerSession } from "next-auth";
import { authOptions, User } from "../../auth/[...nextauth]/authOptions";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(context: any) {
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