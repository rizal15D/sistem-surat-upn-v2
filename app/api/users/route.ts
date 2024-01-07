import { getServerSession } from "next-auth";
import { authOptions, User } from "../auth/[...nextauth]/authOptions";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  if (session) {
    const { data } = await axios.get(`${process.env.API_URL}/user`, {
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
    const { data } = await axios.post(
      `${process.env.API_URL}/auth/register`,
      req.body,
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
