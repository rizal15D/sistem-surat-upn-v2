import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, User } from "../auth/[...nextauth]/authOptions";
import axios from "axios";

export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  if (session) {
    const { data } = await axios.get(`${process.env.API_URL}/jenis`, {
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
      `${process.env.API_URL}/jenis`,
      {
        jenis: input.jenis,
        kode_jenis: input.kode_jenis,
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

  const { id, input } = await req.json();

  if (session) {
    const { data } = await axios.put(
      `${process.env.API_URL}/jenis?jenis_id=${id}`,
      {
        jenis: input.jenis,
        kode_jenis: input.kode_jenis,
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

export async function DELETE(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  const { id } = await req.json();

  if (session) {
    const { data } = await axios.delete(
      `${process.env.API_URL}/jenis?jenis_id=${id}`,
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
