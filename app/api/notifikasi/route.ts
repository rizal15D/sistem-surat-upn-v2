import { getServerSession } from "next-auth";
import { authOptions, User } from "../auth/[...nextauth]/authOptions";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  if (session) {
    const { data } = await axios.get(`${process.env.API_URL}/notifikasi`, {
      headers: {
        Authorization: `Bearer ${session.user?.accessToken}`,
      },
    });

    return NextResponse.json(data.slice(0, 10));
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

    if (id) {
      const { data } = await axios.delete(
        `${process.env.API_URL}/notifikasi?notifikasi_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${session.user?.accessToken}`,
          },
        }
      );

      return NextResponse.json(data);
    }

    const { data } = await axios.delete(
      `${process.env.API_URL}/notifikasi/all`,
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
