import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Workflows 3D",
  description: "Isometric 3D workflow animation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}