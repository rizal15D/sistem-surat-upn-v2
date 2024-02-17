import { getServerSession } from "next-auth";
import { authOptions, User } from "@/app/api/auth/[...nextauth]/authOptions";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  const repo_idJSON = req.nextUrl.searchParams.get("repo_id");

  const repo_id = repo_idJSON ? JSON.parse(repo_idJSON) : [];

  if (session) {
    const { data } = await axios.post(
      `${process.env.API_URL}/excel`,
      {
        repo_id: repo_id,
      },
      {
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${session.user?.accessToken}`,
          "ngrok-skip-browser-warning": true,
        },
      }
    );

    const pdfBuffer = Buffer.from(data, "binary");
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } else {
    return NextResponse.json({
      error: "Unauthorized",
    });
  }
}
