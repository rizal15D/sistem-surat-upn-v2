import { NextRequest, NextResponse } from "next/server";
import { User, authOptions } from "../../auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import axios from "axios";

export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  if (session) {
    const id = req.nextUrl.searchParams.get("id");

    const { data } = await axios.get(
      `${process.env.API_URL}/komentar?id=${id}`,
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

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  if (session) {
    const { id, input } = await req.json();

    const { data } = await axios.post(
      `${process.env.API_URL}/komentar`,
      {
        surat_id: id,
        komentar: input.komentar,
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
