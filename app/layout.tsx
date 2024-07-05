import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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
      <body suppressHydrationWarning={true}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
