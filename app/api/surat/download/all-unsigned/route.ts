import { getServerSession } from "next-auth";
import { authOptions, User } from "@/app/api/auth/[...nextauth]/authOptions";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // try {
  console.log("download all unsigned API");
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
    // return new NextResponse(data, {
    //   headers: {
    //     "Content-Type": "application/octet-stream",
    //     "Content-Disposition": "attachment; filename=surat.zip",
    //   },
    // });
    if (data) {
      const pdfBuffer = Buffer.from(data, "binary");
      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
        },
      });
    }
  }
  // } catch (err) {
  //   return NextResponse.json({
  //     error: "Unauthorized",
  //   });
  // }
}
