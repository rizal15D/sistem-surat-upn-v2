import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

import { TanstackQueryProvider } from "@/providers/TanstackQueryProvider";
import ClientBody from "./ClientBody";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <TanstackQueryProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      <ClientBody>
        {session && (
          <>
            <div className="p-4">
              <span className="text-black">${JSON.stringify(session)}</span>
            </div>
          </>
        )}
        {!session && <>kys</>}
        {children}
      </ClientBody>
    </TanstackQueryProvider>
  );
}
