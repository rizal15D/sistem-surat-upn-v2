import { getServerSession } from "next-auth";
import { authOptions, User } from "@/app/api/auth/[...nextauth]/authOptions";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  if (session) {
    const { data } = await axios.get(`${process.env.API_URL}/sikoja/iku`, {
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

  const { input } = await req.json();

  if (session) {
    const { data } = await axios.post(
      `${process.env.API_URL}/sikoja/iku`,
      {
        name: input.name,
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

export async function PUT(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  const { input } = await req.json();

  if (session) {
    const { data } = await axios.put(
      `${process.env.API_URL}/sikoja/iku`,
      {
        name: input.name,
      },
      {
        headers: {
          Authorization: `Bearer ${session.user?.accessToken}`,
        },
        params: {
          iku_id: req.nextUrl.searchParams.get("iku_id"),
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

export async function DELETE(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  if (session) {
    const { data } = await axios.delete(`${process.env.API_URL}/sikoja/iku`, {
      headers: {
        Authorization: `Bearer ${session.user?.accessToken}`,
      },
      params: {
        iku_id: req.nextUrl.searchParams.get("iku_id"),
      },
    });

    return NextResponse.json(data);
  } else {
    return NextResponse.json({
      error: "Unauthorized",
    });
  }
}
