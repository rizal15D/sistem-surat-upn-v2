import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions, User } from "../../auth/[...nextauth]/authOptions";

export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  if (session) {
    const id = req.nextUrl.searchParams.get("id");

    const { data } = await axios.get(
      `${process.env.API_URL}//template-surat/download/cloudinary?id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${session.user?.accessToken}`,
          responseType: "blob",
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
