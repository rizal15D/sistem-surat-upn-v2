import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { TanstackQueryProvider } from "@/providers/TanstackQueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistem Surat UPNVJT",
  description:
    "Sistem Surat Universitas Pembangunan Nasional Veteran (UPN) Jawa Timur",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <TanstackQueryProvider>
        <body className={inter.className}>{children}</body>
        <ReactQueryDevtools initialIsOpen={false} />
      </TanstackQueryProvider>
    </html>
  );
}
