import { getServerSession } from "next-auth";
import { authOptions, User } from "../../auth/[...nextauth]/authOptions";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as {
    user: User;
  } | null;

  const filepath = req.nextUrl.searchParams.get("filepath");
  const pathsJSON = req.nextUrl.searchParams.get("paths");
  let data;

  const paths = pathsJSON ? JSON.parse(pathsJSON) : [];
  const accessToken = session ? session.user?.accessToken : null;
  if (!accessToken) {
    return NextResponse.json(
      {
        error: "Access Denied: No Token Provided!",
      },
      { status: 403 }
    );
  }

  if (session) {
    if (filepath) {
      data = await handleFilepath(filepath, accessToken);
    } else if (paths) {
      data = await handlePaths(paths, accessToken);
    }

    const pdfBuffer = Buffer.from(data, "binary");
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    });
  } else {
    return NextResponse.json({
      error: "Unauthorized",
    });
  }
}

async function handleFilepath(filepath: string, accessToken: string) {
  try {
    const { data } = await axios.post(
      `${process.env.API_URL}/download/file`,
      {},
      {
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "ngrok-skip-browser-warning": true,
        },
        params: {
          filepath: filepath,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error in handleFilepath:", error);
    throw new Error("Error fetching file");
  }
}

async function handlePaths(paths: string[], accessToken: string) {
  try {
    const { data } = await axios.post(
      `${process.env.API_URL}/download/zip`,
      { paths: paths },
      {
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "ngrok-skip-browser-warning": true,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error in handlePaths:", error);
    throw new Error("Error fetching zip");
  }
}

//============================================================

// import { getServerSession } from "next-auth";
// import { authOptions, User } from "../../auth/[...nextauth]/authOptions";
// import axios from "axios";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   const session = (await getServerSession(authOptions)) as {
//     user: User;
//   } | null;

//   const filepath = req.nextUrl.searchParams.get("filepath");
//   const pathsJSON = req.nextUrl.searchParams.get("paths");

//   const paths = pathsJSON ? JSON.parse(pathsJSON) : [];
//   if (!filepath) {
//     return NextResponse.json({
//       error: "Filepath is required",
//     });
//   }

//   if (session) {
//     const { data } = await axios.post(
//       // `${process.env.API_URL}/download?filepath=${filepath}`,
//       `${process.env.API_URL}/download`,
//       {
//         paths: paths,
//       },
//       {
//         responseType: "arraybuffer",
//         headers: {
//           Authorization: `Bearer ${session.user?.accessToken}`,
//           "ngrok-skip-browser-warning": true,
//         },
//         params: {
//           filepath: filepath,
//         },
//       }
//     );

//     const pdfBuffer = Buffer.from(data, "binary");
//     return new NextResponse(pdfBuffer, {
//       headers: {
//         "Content-Type":
//           "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       },
//     });
//   } else {
//     return NextResponse.json({
//       error: "Unauthorized",
//     });
//   }
// }
