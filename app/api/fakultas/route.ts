import { getServerSession } from "next-auth";
import { authOptions, User } from "../auth/[...nextauth]/authOptions";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  if (session) {
    const { data } = await axios.get(`${process.env.API_URL}/fakultas`, {
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
