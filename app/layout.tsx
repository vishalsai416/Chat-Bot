import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RolePilot AI",
  description: "Role-based AI assistant for job preparation and interview readiness."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
