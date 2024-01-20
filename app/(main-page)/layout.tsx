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
      <ClientBody session={session}>
        {JSON.stringify(session, null, 2)}
        {children}
      </ClientBody>
    </TanstackQueryProvider>
  );
}
