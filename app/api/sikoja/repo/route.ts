import { getServerSession } from "next-auth";
import { authOptions, User } from "@/app/api/auth/[...nextauth]/authOptions";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  const prodi_idJson = req.nextUrl.searchParams.get("prodi_id");
  const indikator_idJson = req.nextUrl.searchParams.get("indikator_id");
  const strategi_idJson = req.nextUrl.searchParams.get("strategi_id");
  const iku_idJson = req.nextUrl.searchParams.get("iku_id");

  const prodi_id = prodi_idJson ? JSON.parse(prodi_idJson) : [];
  const indikator_id = indikator_idJson ? JSON.parse(indikator_idJson) : [];
  const strategi_id = strategi_idJson ? JSON.parse(strategi_idJson) : [];
  const iku_id = iku_idJson ? JSON.parse(iku_idJson) : [];

  const startDateStr = req.nextUrl.searchParams.get("startDate");
  let startDate: Date | null = null;
  if (startDateStr) {
    startDate = new Date(startDateStr);
  }

  const endDateStr = req.nextUrl.searchParams.get("endDate");
  let endDate: Date | null = null;
  if (endDateStr) {
    endDate = new Date(endDateStr);
  }

  const formattedStartDate = startDate
    ? startDate.toISOString().split("T")[0]
    : null;
  const formattedEndDate = endDate ? endDate.toISOString().split("T")[0] : null;

  console.log("formattedStartDate", formattedStartDate);
  console.log("formattedEndDate", formattedEndDate);
  console.log("prodi_id", prodi_id);
  console.log("strategi_id", strategi_id);
  console.log("iku_id", iku_id);
  console.log("indikator_id", indikator_id);

  if (session) {
    const { data } = await axios.post(
      `${process.env.API_URL}/repo/filter`,
      {
        prodi_id: prodi_id,
        indikator_id: indikator_id,
        strategi_id: strategi_id,
        iku_id: iku_id,
      },
      {
        headers: {
          Authorization: `Bearer ${session.user?.accessToken}`,
        },
        params: {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
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
