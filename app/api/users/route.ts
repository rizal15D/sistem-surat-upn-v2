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

  const { name, email, role_id, prodi_id, fakultas_id } = await req.json();

  if (session) {
    const { data } = await axios.post(
      `${process.env.API_URL}/auth/register`,
      {
        name,
        email,
        role_id,
        prodi_id,
        fakultas_id,
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

  if (session) {
    const { input } = await req.json();
    console.log(input);

    const { data } = await axios.put(
      `${process.env.API_URL}/user/password`,
      {
        password: input.password,
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
      `${process.env.API_URL}/user?id=${id}`,
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
