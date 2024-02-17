import { NextRequest, NextResponse } from "next/server";
import { User, authOptions } from "../../auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import axios from "axios";

export async function PUT(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  if (session) {
    const { id, input } = await req.json();

    const { data } = await axios.put(
      `${process.env.API_URL}/status?surat_id=${id}`,
      input,
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
