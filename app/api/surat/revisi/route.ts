import { getServerSession } from "next-auth";
import { authOptions, User } from "../../auth/[...nextauth]/authOptions";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  if (session) {
    const formData = await req.formData();
    const id = formData.get("id");
    formData.delete("id");

    const { data } = await axios.put(
      `${process.env.API_URL}/daftar-surat/multer/revisi?surat_id=${id}`,
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