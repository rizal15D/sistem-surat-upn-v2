import { getServerSession } from "next-auth";
import { authOptions, User } from "@/app/api/auth/[...nextauth]/authOptions";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as {
      user: User;
    } | null;
    console.log("posisi1");
    if (session) {
      console.log("posisi2");

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
      console.log("posisi3");

      const pdfBuffer = Buffer.from(data, "binary");
      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
        },
      });
      //   return NextResponse.json(data);
    }
  } catch (err) {
    return NextResponse.json({
      error: "Unauthorized",
    });
  }
}