import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gemini Chat Clone - Auth",
  description: "Authentication for the Gemini Chat Clone application",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
