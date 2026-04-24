import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Distração Digital",
  description:
    "Diagnóstico premium para entender o impacto da distração digital na sua rotina.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
