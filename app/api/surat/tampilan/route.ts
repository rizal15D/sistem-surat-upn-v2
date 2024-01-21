import { getServerSession } from "next-auth";
import { authOptions, User } from "../../auth/[...nextauth]/authOptions";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  if (session) {
    const { id, input } = await req.json();

    const { data } = await axios.put(
      `${process.env.API_URL}/tampilan/update?surat_id=${id}`,
      {
        dibaca: input.dibaca,
        pin: input.pin,
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
