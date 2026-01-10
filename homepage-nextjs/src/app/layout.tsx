import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wasted Talent United",
  description: "E-commerce site powered by WordPress and Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
