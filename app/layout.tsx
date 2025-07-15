import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";
import RouteGuard from "@/components/layout/RouteGuard";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Gemini Chat Clone",
  description: "A modern chat application built with Next.js and Zustand",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <Providers>
          <RouteGuard>{children}</RouteGuard>
        </Providers>
      </body>
    </html>
  );
}
