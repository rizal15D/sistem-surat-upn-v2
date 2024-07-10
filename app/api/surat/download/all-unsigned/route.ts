import { getServerSession } from "next-auth";
import { authOptions, User } from "@/app/api/auth/[...nextauth]/authOptions";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;
  if (session) {
    const { data } = await axios.post(
      `${process.env.API_URL}/download/unsigned`,
      {},
      {
        responseType: "arraybuffer",

        headers: {
          Authorization: `Bearer ${session.user?.accessToken}`,
          "ngrok-skip-browser-warning": true,
        },
      }
    );
    return new NextResponse(data, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": "attachment; filename=surat.zip",
      },
    });
  }
}
