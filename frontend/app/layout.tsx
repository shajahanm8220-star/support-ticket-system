import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Support Ticket System",
  description: "Customer support ticket management system",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}