import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RootProvider from "@/provider/RootProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mina token drop oracle",
  description:
    "Allocates tokens to users who have contributed to whitelisted repos on github",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + "  bg-gray-900"}>
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-white">
          <RootProvider> {children}</RootProvider>
        </main>
      </body>
    </html>
  );
}
